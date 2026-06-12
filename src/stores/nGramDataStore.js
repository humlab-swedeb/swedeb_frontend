import { defineStore } from "pinia";
import { Notify, copyToClipboard } from "quasar";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";
import { downloadDataStore } from "./downloadDataStore";
import { i18n } from "boot/i18n";
import {
  getTicketPollDelayMs,
  pollArchiveTicket,
  TICKET_POLL_MAX_ATTEMPTS,
} from "./ticketPolling";

const DEFAULT_ROWS_PER_PAGE = 50;

// Maps q-table column field names to backend sort_by values
const SORT_FIELD_MAP = {
  ngram: "ngram",
  count: "window_count",
};

export const nGramDataStore = defineStore("nGramDataStore", {
  state: () => ({
    searchText: "",
    nGrams: [],
    nGramSpeeches: [],
    width: 3,
    placingOptions: ["Ej specificerat", "Vänster", "Höger"],
    placingSelected: "Ej specificerat",
    searchString: "",
    columnNames: ["ngram", "count", "number_speeches"],

    // Ticket flow state
    ticketId: null,
    ticketStatus: null,
    aggregateVersion: 0,
    totalHits: 0,
    totalPages: 0,
    expiresAt: null,
    archiveTicketId: null,
    archiveTicketStatus: null,
    archiveRetrievalUrl: null,
    isLoading: false,
    isPageLoading: false,
    errorMessage: "",
    hasSubmittedQuery: false,
    requestSequence: 0,
    pageRequestSequence: 0,
    shardsComplete: 0,
    shardsTotal: 0,

    // Estimate state
    estimatedHits: null,
    inVocabulary: null,
    estimateRequestSequence: 0,

    // Pagination (synced with q-table)
    pagination: {
      sortBy: "count",
      descending: true,
      page: 1,
      rowsPerPage: DEFAULT_ROWS_PER_PAGE,
      rowsNumber: 0,
    },
  }),

  actions: {
    _normalizeSearch(search) {
      if (search.endsWith("*") && !search.endsWith(".*")) {
        return search.slice(0, -1) + ".*";
      }
      return search;
    },

    _isPhraseSearch(search) {
      return search.trim().split(/\s+/).length > 1;
    },

    canEstimateSearch(search) {
      return Boolean(search && search.trim() && !this._isPhraseSearch(search));
    },

    clearEstimate() {
      this.estimateRequestSequence += 1;
      this.estimatedHits = null;
      this.inVocabulary = null;
    },

    resetTicketState() {
      this.nGrams = [];
      this.ticketId = null;
      this.ticketStatus = null;
      this.aggregateVersion = 0;
      this.totalHits = 0;
      this.totalPages = 0;
      this.expiresAt = null;
      this.resetArchiveTicketState();
      this.shardsComplete = 0;
      this.shardsTotal = 0;
      this.pagination = {
        ...this.pagination,
        page: 1,
        rowsNumber: 0,
      };
    },

    resetArchiveTicketState() {
      this.archiveTicketId = null;
      this.archiveTicketStatus = null;
      this.archiveRetrievalUrl = null;
    },

    async retainCopiedArchiveRetrievalLink(archiveTicketId) {
      try {
        const response = await api.post(
          `/downloads/${encodeURIComponent(archiveTicketId)}/copy-link`,
        );
        this.archiveTicketStatus = response.data.status;
        return response.data;
      } catch (error) {
        console.error("Error retaining copied archive retrieval link:", error);
        return null;
      }
    },

    _buildTicketPayload(normalizedSearch) {
      return {
        search: normalizedSearch,
        width: this.width,
        target: "word",
        mode: this.getPosition(),
        filters: metaDataStore().getSelectedKwicTicketFilters(),
      };
    },

    _getErrorMessage(error) {
      return error?.response?.data?.detail || error?.message || "Unknown error";
    },

    async fetchEstimate(word) {
      if (!this.canEstimateSearch(word)) {
        this.clearEstimate();
        return;
      }

      const requestId = ++this.estimateRequestSequence;
      const filters = metaDataStore().getSelectedKwicTicketFilters();
      const params = { word: word.trim() };
      if (filters.from_year != null) params.from_year = filters.from_year;
      if (filters.to_year != null) params.to_year = filters.to_year;
      if (filters.party_id?.length) params.party_id = filters.party_id;
      if (filters.who?.length) params.who = filters.who;
      if (filters.gender_id?.length) params.gender_id = filters.gender_id;
      if (filters.chamber_abbrev?.length)
        params.chamber_abbrev = filters.chamber_abbrev;

      try {
        const response = await api.get("/tools/ngrams/estimate", { params });
        if (requestId !== this.estimateRequestSequence) return;
        this.estimatedHits = response.data.estimated_hits;
        this.inVocabulary = response.data.in_vocabulary;
      } catch {
        if (requestId !== this.estimateRequestSequence) return;
        this.estimatedHits = null;
        this.inVocabulary = null;
      }
    },

    getPosition() {
      const placement = this.placingSelected;
      if (placement === "Vänster") {
        return "left-aligned";
      } else if (placement === "Höger") {
        return "right-aligned";
      } else {
        return "sliding";
      }
    },

    async _waitForTicketReady(requestId) {
      for (let attempt = 0; attempt < TICKET_POLL_MAX_ATTEMPTS; attempt += 1) {
        if (requestId !== this.requestSequence || !this.ticketId) {
          return false;
        }

        const response = await api.get(`/tools/ngrams/status/${this.ticketId}`);

        if (requestId !== this.requestSequence) {
          return false;
        }

        const data = response.data;
        this.expiresAt = data.expires_at;

        if (data.status === "ready") {
          this.ticketStatus = "ready";
          return true;
        }

        if (data.status === "partial") {
          this.ticketStatus = "partial";
          this.aggregateVersion = data.aggregate_version ?? 0;
          this.shardsComplete = data.shards_complete ?? this.shardsComplete;
          this.shardsTotal = data.shards_total ?? this.shardsTotal;
          return true;
        }

        if (data.status === "error") {
          throw new Error(
            data.error ||
              i18n.global.t("accessibility.ngramQueryFailed") ||
              "N-gram query failed",
          );
        }

        this.ticketStatus = data.status ?? "pending";
        const delayMs = getTicketPollDelayMs(
          attempt,
          response.headers?.["retry-after"],
        );
        await new Promise((resolve) => {
          window.setTimeout(resolve, delayMs);
        });
      }

      throw new Error(
        i18n.global.t("accessibility.ngramTicketTimeout") ||
          "N-gram search timed out",
      );
    },

    async fetchNgramPage({
      page = this.pagination.page,
      rowsPerPage = this.pagination.rowsPerPage,
      sortBy = this.pagination.sortBy,
      descending = this.pagination.descending,
      silent = false,
      startPoller = true,
    } = {}) {
      if (!this.ticketId) return null;

      const requestId = this.requestSequence;
      const pageRequestId = ++this.pageRequestSequence;

      if (!silent) {
        this.isPageLoading = true;
      }

      try {
        const params = {
          page,
          page_size: rowsPerPage,
          sort_order: descending ? "desc" : "asc",
        };

        const sortField = SORT_FIELD_MAP[sortBy];
        if (sortField) {
          params.sort_by = sortField;
        }

        const response = await api.get(`/tools/ngrams/page/${this.ticketId}`, {
          params,
        });

        // Ticket still computing — wait for it then retry
        if (response.status === 202 && response.data?.status === "pending") {
          const ready = await this._waitForTicketReady(requestId);
          if (!ready) return null;
          return this.fetchNgramPage({
            page,
            rowsPerPage,
            sortBy,
            descending,
            silent,
            startPoller,
          });
        }

        if (
          requestId !== this.requestSequence ||
          pageRequestId !== this.pageRequestSequence
        ) {
          return null;
        }

        const pageData = response.data;
        this.nGrams = pageData.items;
        this.totalHits = pageData.total_hits;
        this.totalPages = pageData.total_pages;
        this.expiresAt = pageData.expires_at;
        this.ticketStatus = pageData.status ?? this.ticketStatus;
        this.aggregateVersion =
          pageData.aggregate_version ?? this.aggregateVersion;
        this.shardsComplete = pageData.shards_complete ?? this.shardsComplete;
        this.shardsTotal = pageData.shards_total ?? this.shardsTotal;
        this.pagination = {
          ...this.pagination,
          page,
          rowsPerPage,
          sortBy,
          descending,
          rowsNumber: pageData.total_hits,
        };

        if (pageData.status === "partial" && startPoller) {
          this._startPartialPoller(requestId);
        }

        return pageData;
      } catch (error) {
        if (error.response?.status === 429) {
          this.errorMessage = i18n.global.t("accessibility.tooManyRequests");
          this.resetTicketState();
        } else if (error.response?.status === 404) {
          this.errorMessage =
            i18n.global.t("accessibility.ticketExpired") || "Results expired";
          this.resetTicketState();
        } else {
          this.errorMessage = this._getErrorMessage(error);
        }
        console.error("Error fetching ngram page:", error);
        return null;
      } finally {
        if (!silent && pageRequestId === this.pageRequestSequence) {
          this.isPageLoading = false;
        }
      }
    },

    async _startPartialPoller(requestId) {
      const ticketId = this.ticketId;

      for (let attempt = 0; attempt < TICKET_POLL_MAX_ATTEMPTS; attempt += 1) {
        if (requestId !== this.requestSequence || this.ticketId !== ticketId) {
          return;
        }
        if (this.ticketStatus !== "partial") {
          return;
        }

        const delayMs = getTicketPollDelayMs(attempt);
        await new Promise((resolve) => window.setTimeout(resolve, delayMs));

        if (requestId !== this.requestSequence || this.ticketId !== ticketId) {
          return;
        }

        try {
          const response = await api.get(`/tools/ngrams/status/${ticketId}`);
          const data = response.data;

          this.shardsComplete = data.shards_complete ?? this.shardsComplete;
          this.shardsTotal = data.shards_total ?? this.shardsTotal;

          if (data.aggregate_version > this.aggregateVersion) {
            this.aggregateVersion = data.aggregate_version;
            await this.fetchNgramPage({
              page: this.pagination.page,
              rowsPerPage: this.pagination.rowsPerPage,
              sortBy: this.pagination.sortBy,
              descending: this.pagination.descending,
              silent: true,
              startPoller: false,
            });
          }

          if (data.status !== "partial") {
            this.ticketStatus = data.status;
            if (data.status === "ready") {
              await this.fetchNgramPage({
                page: this.pagination.page,
                rowsPerPage: this.pagination.rowsPerPage,
                sortBy: this.pagination.sortBy,
                descending: this.pagination.descending,
                silent: true,
                startPoller: false,
              });
            }
            return;
          }
        } catch (error) {
          console.error("Partial poller error:", error);
          return;
        }
      }
    },

    async getNGramsResult(search) {
      const normalizedSearch = this._normalizeSearch(search);
      const requestId = ++this.requestSequence;
      this.pageRequestSequence = 0;
      this.hasSubmittedQuery = true;
      this.isLoading = true;
      this.errorMessage = "";
      this.resetTicketState();

      try {
        const response = await api.post(
          "/tools/ngrams/query",
          this._buildTicketPayload(normalizedSearch),
        );

        if (requestId !== this.requestSequence) return;

        this.ticketId = response.data.ticket_id;
        this.expiresAt = response.data.expires_at;

        const ready = await this._waitForTicketReady(requestId);
        if (!ready || requestId !== this.requestSequence) return;

        await this.fetchNgramPage({
          page: 1,
          rowsPerPage: this.pagination.rowsPerPage,
          sortBy: this.pagination.sortBy,
          descending: this.pagination.descending,
        });

        this.searchString = normalizedSearch;
      } catch (error) {
        this.nGrams = [];
        this.totalHits = 0;
        this.totalPages = 0;
        this.errorMessage = this._getErrorMessage(error);
        console.error("Error fetching ticketed n-gram data:", error);
      } finally {
        if (requestId === this.requestSequence) {
          this.isLoading = false;
        }
      }
    },

    getSpeechIdsForRow(row_nr, page, rows_per_page) {
      if (row_nr >= 0 && row_nr < this.nGrams.length) {
        const documents = this.nGrams[row_nr].documents;
        const start = (page - 1) * rows_per_page;
        const end = start + rows_per_page;
        return documents.slice(start, end);
      } else {
        return [];
      }
    },

    async getNGramSpeeches(row_nr, ngram, page, rows_per_page) {
      const documents =
        row_nr >= 0 && row_nr < this.nGrams.length
          ? this.nGrams[row_nr].documents
          : [];
      const total = documents.length;

      const start = (page - 1) * rows_per_page;
      const end = start + rows_per_page;
      const speech_ids = documents.slice(start, end);

      if (speech_ids.length === 0) {
        this.nGramSpeeches = [];
        return { items: [], total };
      }

      const queryString = speech_ids.map((id) => `speech_id=${id}`).join("&");
      const path = `/tools/speeches?${queryString}`;

      try {
        const response = await api.get(path);
        const items = response.data.speech_list.map((s) => ({
          ...s,
          node_word: ngram,
        }));
        this.nGramSpeeches = items;
        return { items, total };
      } catch (error) {
        console.log("Error fetching n-gram speeches", error);
        this.nGramSpeeches = [];
        return { items: [], total };
      }
    },

    async downloadNgramArchive(format = "csv_gz") {
      if (!this.ticketId) {
        this.errorMessage =
          i18n.global.t("accessibility.ticketExpired") || "Results expired";
        return false;
      }

      this.errorMessage = "";
      this.archiveRetrievalUrl = null;

      try {
        const prepareResponse = await api.post(
          `/tools/ngrams/archive/${encodeURIComponent(this.ticketId)}?archive_format=${encodeURIComponent(format)}`,
        );

        const archiveTicketId = prepareResponse.data.archive_ticket_id;
        this.archiveRetrievalUrl = prepareResponse.data.retrieval_url || null;

        await pollArchiveTicket(api, {
          statusUrl: `/downloads/${archiveTicketId}`,
        });

        const downloadResponse = await api.get(
          `/downloads/${archiveTicketId}/download`,
          { responseType: "blob" },
        );

        const archiveExtensions = {
          csv_gz: "csv.gz",
          jsonl_gz: "jsonl.gz",
          xlsx: "xlsx",
        };
        const fileExtension = archiveExtensions[format] ?? format;
        const dlStore = downloadDataStore();
        dlStore.setupDownload(
          dlStore.getFilenameFromDisposition(
            downloadResponse.headers,
            `ngram_archive_${this.ticketId}.${fileExtension}`,
          ),
          downloadResponse.data,
        );
        return true;
      } catch (error) {
        if (error.response?.status === 429) {
          this.errorMessage = i18n.global.t("accessibility.tooManyRequests");
          this.resetTicketState();
        } else if (error.response?.status === 404) {
          this.errorMessage = i18n.global.t(
            'accessibility.ticketExpired || "Results expired"',
          );
          this.resetTicketState();
        } else {
          this.errorMessage = this._getErrorMessage(error);
        }
        console.error("Error downloading n-gram archive:", error);
        return false;
      }
    },

    async downloadNGramTableCSV() {
      return this.downloadNgramArchive("csv_gz");
    },

    async downloadNGramTableExcel() {
      return this.downloadNgramArchive("xlsx");
    },

    async _downloadNgramSpeechesArchive(
      archiveFormat,
      fallbackFilename,
      downloadKey,
    ) {
      if (!this.ticketId) {
        this.resetArchiveTicketState();
        this.errorMessage = i18n.global.t(
          'accessibility.ticketExpired || "Results expired"',
        );
        return false;
      }
      if (downloadKey && downloadDataStore().isDownloadActive(downloadKey)) {
        return false;
      }

      this.errorMessage = "";
      this.resetArchiveTicketState();
      downloadDataStore().setDownloadActive(downloadKey, true);

      let dismissLinkNotify = null;
      let abortedByUser = false;

      try {
        const prepareResponse = await api.post(
          `/tools/ngrams/speeches/archive/${encodeURIComponent(this.ticketId)}?archive_format=${encodeURIComponent(archiveFormat)}`,
        );
        const archiveTicketId = prepareResponse.data.archive_ticket_id;
        this.archiveTicketId = archiveTicketId;
        this.archiveTicketStatus = "pending";
        this.archiveRetrievalUrl = prepareResponse.data.retrieval_url || null;

        const retrievalUrl =
          window.location.origin + "/download/" + archiveTicketId;
        const buildingHint =
          i18n.global.t("downloadFeedback.archiveBuildingHint") ||
          "Behåll denna ruta öppen om du vill vänta, eller kopiera länken och stäng för att hämta senare.";
        dismissLinkNotify = Notify.create({
          message:
            (i18n.global.t("downloadFeedback.archiveBuilding") ||
              "Arkivet byggs...") +
            " " +
            buildingHint,
          color: "blue-8",
          icon: "hourglass_top",
          timeout: 0,
          position: "top",
          multiLine: true,
          actions: [
            {
              label:
                i18n.global.t("downloadRetrievalPage.copyLink") ||
                "Kopiera hämtningslänk",
              color: "yellow",
              handler: () => {
                const prevDismiss = dismissLinkNotify;
                copyToClipboard(retrievalUrl)
                  .then(() =>
                    this.retainCopiedArchiveRetrievalLink(archiveTicketId),
                  )
                  .catch((error) => {
                    console.error(
                      "Error copying archive retrieval link:",
                      error,
                    );
                  });
                const copiedHint =
                  i18n.global.t("downloadFeedback.archiveLinkCopiedClose") ||
                  "Länk kopierad - stäng för att hämta senare, eller vänta här.";
                dismissLinkNotify = Notify.create({
                  message: copiedHint,
                  color: "blue-8",
                  icon: "check",
                  timeout: 0,
                  position: "top",
                  multiLine: true,
                  actions: [
                    {
                      icon: "close",
                      color: "white",
                      round: true,
                      handler: () => {
                        abortedByUser = true;
                        if (typeof dismissLinkNotify === "function") {
                          dismissLinkNotify();
                          dismissLinkNotify = null;
                        }
                      },
                    },
                  ],
                });
                if (typeof prevDismiss === "function") prevDismiss();
              },
            },
          ],
        });

        await pollArchiveTicket(api, {
          statusUrl: `/downloads/${archiveTicketId}`,
          onStatus: (status) => {
            this.archiveTicketStatus = status;
          },
        });

        if (abortedByUser) {
          Notify.create({
            message:
              i18n.global.t("downloadFeedback.archiveAborted") ||
              "Länken är sparad - öppna den för att hämta arkivet när det är klart.",
            color: "info",
            icon: "link",
            timeout: 6000,
            position: "top",
          });
          return true;
        }

        const downloadResponse = await api.get(
          `/downloads/${archiveTicketId}/download`,
          { responseType: "blob" },
        );
        const dlStore = downloadDataStore();
        dlStore.setupDownload(
          dlStore.getFilenameFromDisposition(
            downloadResponse.headers,
            fallbackFilename,
          ),
          downloadResponse.data,
        );
        return true;
      } catch (error) {
        if (error.response?.status === 429) {
          this.errorMessage = i18n.global.t("accessibility.tooManyRequests");
          this.resetTicketState();
        } else if (error.response?.status === 404) {
          this.errorMessage =
            i18n.global.t("accessibility.ticketExpired") || "Results expired";
          this.resetTicketState();
        } else {
          this.errorMessage = this._getErrorMessage(error);
        }
        Notify.create({
          type: "negative",
          message: this.errorMessage,
          timeout: 4000,
          position: "top",
        });
        console.error(
          `Error downloading n-gram speeches archive (${archiveFormat}):`,
          error,
        );
        return false;
      } finally {
        if (typeof dismissLinkNotify === "function") {
          dismissLinkNotify();
          dismissLinkNotify = null;
        }
        downloadDataStore().setDownloadActive(downloadKey, false);
      }
    },

    async downloadNGramSpeechesZip(downloadKey) {
      return this._downloadNgramSpeechesArchive(
        "zip",
        `ngram_speeches_archive_${this.ticketId}.zip`,
        downloadKey,
      );
    },

    async downloadNGramSpeechesJsonlGz(downloadKey) {
      return this._downloadNgramSpeechesArchive(
        "jsonl_gz",
        `ngram_speeches_archive_${this.ticketId}.jsonl.gz`,
        downloadKey,
      );
    },

    async downloadNGramSpeechesCsvGz(downloadKey) {
      return this._downloadNgramSpeechesArchive(
        "csv_gz",
        `ngram_speeches_archive_${this.ticketId}.csv.gz`,
        downloadKey,
      );
    },
  },
});
