import { defineStore } from "pinia";
import { Notify, copyToClipboard } from "quasar";
import { api } from "boot/axios";
import axios from "axios";
import { metaDataStore } from "./metaDataStore";
import { downloadDataStore } from "./downloadDataStore";
import i18n from "src/i18n/sv/index.js";
import {
  getTicketPollDelayMs,
  pollArchiveTicket,
  TICKET_POLL_MAX_ATTEMPTS,
} from "./ticketPolling";

const DEFAULT_ROWS_PER_PAGE = 10;
const DEFAULT_SORT_BY = "protocol";

const SORT_FIELD_MAP = {
  left_word: "left_word",
  node_word: "node_word",
  right_word: "right_word",
  speaker: "name",
  party: "party_abbrev",
  gender: "gender",
  year: "year",
  protocol: "speech_name",
};

export const kwicDataStore = defineStore("kwicData", {
  state: () => ({
    wordsLeft: 5,
    wordsRight: 5,
    cutOff: null,
    kwicData: [],
    searchText: "",
    columnNames: {
      left_word: "Vänster",
      node_word: "Sökord",
      right_word: "Höger",
      year: "År",
      party_abbrev: "Parti",
      name: "Talare",
      gender: "Kön",
      speech_name: "Anförande",
      link: "Länk talare",
    },
    lemmatizeSearch: false,
    cancelTokenSource: null,
    ticketId: null,
    totalHits: 0,
    totalPages: 0,
    expiresAt: null,
    errorMessage: "",
    hasSubmittedQuery: false,
    archiveTicketId: null,
    archiveTicketStatus: null,
    archiveRetrievalUrl: null,
    isLoading: false,
    isPageLoading: false,
    shardsComplete: 0,
    shardsTotal: 0,
    isPartial: false,
    estimatedHits: null,
    inVocabulary: null,
    estimateRequestSequence: 0,
    requestSequence: 0,
    pageRequestSequence: 0,
    pagination: {
      sortBy: DEFAULT_SORT_BY,
      descending: false,
      page: 1,
      rowsPerPage: DEFAULT_ROWS_PER_PAGE,
      rowsNumber: 0,
    },
  }),

  actions: {

    normalizeSearch(search) {
      if (search.endsWith("*") && !search.endsWith(".*")) {
        return search.slice(0, -1) + ".*";
      }

      return search;
    },

    resetTicketState() {
      this.kwicData = [];
      this.ticketId = null;
      this.totalHits = 0;
      this.totalPages = 0;
      this.expiresAt = null;
      this.archiveRetrievalUrl = null;
      this.shardsComplete = 0;
      this.shardsTotal = 0;
      this.isPartial = false;
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

    buildKwicTicketPayload(search) {
      return {
        search,
        lemmatized: this.lemmatizeSearch,
        words_before: this.wordsLeft,
        words_after: this.wordsRight,
        ...(this.cutOff !== null && { cut_off: this.cutOff }),
        filters: metaDataStore().getSelectedKwicTicketFilters(),
      };
    },

    async fetchEstimate(word) {
      if (!word || !word.trim()) {
        this.estimatedHits = null;
        this.inVocabulary = null;
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
        const response = await api.get("/tools/kwic/estimate", { params });
        if (requestId !== this.estimateRequestSequence) return;
        this.estimatedHits = response.data.estimated_hits;
        this.inVocabulary = response.data.in_vocabulary;
      } catch {
        if (requestId !== this.estimateRequestSequence) return;
        this.estimatedHits = null;
        this.inVocabulary = null;
      }
    },

    getErrorMessage(error) {
      return error?.response?.data?.detail || error?.message || "Unknown error";
    },

    async waitForTicketReady(requestId) {
      for (let attempt = 0; attempt < TICKET_POLL_MAX_ATTEMPTS; attempt += 1) {
        if (requestId !== this.requestSequence || !this.ticketId) {
          return false;
        }

        const response = await api.get(`/tools/kwic/status/${this.ticketId}`, {
          cancelToken: this.cancelTokenSource?.token,
        });

        if (requestId !== this.requestSequence) {
          return false;
        }

        const data = response.data;
        this.expiresAt = data.expires_at;

        if (data.status === "ready") {
          this.isPartial = false;
          this.shardsComplete = data.shards_complete ?? this.shardsTotal;
          this.shardsTotal = data.shards_total ?? this.shardsTotal;
          return true;
        }

        if (data.status === "error") {
          throw new Error(data.error || i18n.accessibility.kwicQueryFailed);
        }

        if (data.status === "partial") {
          this.isPartial = true;
          this.shardsComplete = data.shards_complete ?? this.shardsComplete;
          this.shardsTotal = data.shards_total ?? this.shardsTotal;
          if (data.total_hits != null) {
            this.totalHits = data.total_hits;
          }
          // Show available rows for the user's current view; ignore failures
          // because more shards may still be in flight.
          this.fetchKwicPage({
            page: this.pagination.page,
            rowsPerPage: this.pagination.rowsPerPage,
            sortBy: this.pagination.sortBy,
            descending: this.pagination.descending,
            silent: true,
          }).catch(() => {});
        }

        const delayMs = getTicketPollDelayMs(
          attempt,
          response.headers?.["retry-after"],
        );
        await new Promise((resolve) => {
          window.setTimeout(resolve, delayMs);
        });
      }

      throw new Error(i18n.accessibility.kwicTicketTimeout);
    },

    async fetchKwicPage({
      page = this.pagination.page,
      rowsPerPage = this.pagination.rowsPerPage,
      sortBy = this.pagination.sortBy,
      descending = this.pagination.descending,
      silent = false,
    } = {}) {
      if (!this.ticketId) {
        return null;
      }

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

        const response = await api.get(`/tools/kwic/results/${this.ticketId}`, {
          params,
          cancelToken: this.cancelTokenSource?.token,
        });

        if (response.status === 202 && response.data.status === "pending") {
          const ready = await this.waitForTicketReady(requestId);
          if (!ready) {
            return null;
          }

          return this.fetchKwicPage({
            page,
            rowsPerPage,
            sortBy,
            descending,
            silent,
          });
        }

        if (
          requestId !== this.requestSequence ||
          pageRequestId !== this.pageRequestSequence
        ) {
          return null;
        }

        const pageData = response.data;
        this.kwicData = pageData.kwic_list;
        this.totalHits = pageData.total_hits;
        this.totalPages = pageData.total_pages;
        this.expiresAt = pageData.expires_at;
        this.isPartial = pageData.status === "partial";
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

        return pageData;
      } catch (error) {
        if (error.response?.status === 429) {
          this.errorMessage = i18n.accessibility.tooManyRequests;
          this.resetTicketState();
        } else if (error.response?.status === 404) {
          this.errorMessage = i18n.accessibility.ticketExpired;
          this.resetTicketState();
        } else if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          this.errorMessage = this.getErrorMessage(error);
        }
        console.error("Error fetching KWIC page:", error);
        return null;
      } finally {
        if (!silent && pageRequestId === this.pageRequestSequence) {
          this.isPageLoading = false;
        }
      }
    },

    async getKwicResult(search) {
      const normalizedSearch = this.normalizeSearch(search);
      const requestId = ++this.requestSequence;
      this.pageRequestSequence = 0;
      this.hasSubmittedQuery = true;
      this.isLoading = true;
      this.errorMessage = "";
      this.resetTicketState();

      if (this.cancelTokenSource) {
        this.cancelTokenSource.cancel("Sökning avbruten");
      }
      this.cancelTokenSource = axios.CancelToken.source();

      try {
        const response = await api.post(
          "/tools/kwic/query",
          this.buildKwicTicketPayload(normalizedSearch),
          { cancelToken: this.cancelTokenSource.token },
        );

        if (requestId !== this.requestSequence) {
          return;
        }

        this.ticketId = response.data.ticket_id;
        this.expiresAt = response.data.expires_at;

        const ready = await this.waitForTicketReady(requestId);
        if (!ready || requestId !== this.requestSequence) {
          return;
        }

        await this.fetchKwicPage({
          page: 1,
          rowsPerPage: this.pagination.rowsPerPage,
          sortBy: this.pagination.sortBy,
          descending: this.pagination.descending,
        });
      } catch (error) {
        this.kwicData = [];
        this.totalHits = 0;
        this.totalPages = 0;
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
          return;
        }

        this.errorMessage = this.getErrorMessage(error);
        console.error("Error fetching ticketed KWIC data:", error);
      } finally {
        if (requestId === this.requestSequence) {
          this.isLoading = false;
        }
      }
    },

    async downloadKwicArchive(format = "jsonl_gz") {
      if (!this.ticketId) {
        this.resetArchiveTicketState();
        this.errorMessage = i18n.accessibility.ticketExpired;
        return false;
      }
      this.errorMessage = "";
      this.resetArchiveTicketState();

      try {
        // 1. Request archive ticket
        const prepareResponse = await api.post(
          `/tools/kwic/archive/${encodeURIComponent(this.ticketId)}?archive_format=${encodeURIComponent(format)}`,
        );
        const archiveTicketId = prepareResponse.data.archive_ticket_id;
        this.archiveTicketId = archiveTicketId;
        this.archiveTicketStatus = "pending";
        this.archiveRetrievalUrl = prepareResponse.data.retrieval_url || null;

        // 2. Poll until ready via generic downloads endpoint
        await pollArchiveTicket(api, {
          statusUrl: `/downloads/${archiveTicketId}`,
          onStatus: (status) => {
            this.archiveTicketStatus = status;
          },
        });

        // 3. Download the artifact
        const downloadResponse = await api.get(
          `/downloads/${archiveTicketId}/download`,
          { responseType: "blob" },
        );
        const archiveExtensions = { csv_gz: "csv.gz", jsonl_gz: "jsonl.gz" };
        const fileExtension = archiveExtensions[format] ?? format;
        downloadDataStore().setupDownload(
          downloadDataStore().getFilenameFromDisposition(
            downloadResponse.headers,
            `kwic_archive_${this.ticketId}.${fileExtension}`,
          ),
          downloadResponse.data,
        );
        return true;
      } catch (error) {
        if (error.response?.status === 429) {
          this.errorMessage = i18n.accessibility.tooManyRequests;
          this.resetTicketState();
        } else if (error.response?.status === 404) {
          this.errorMessage = i18n.accessibility.ticketExpired;
          this.resetTicketState();
        } else {
          this.errorMessage = this.getErrorMessage(error);
        }
        console.error("Error downloading KWIC archive:", error);
        return false;
      }
    },

    async downloadKwicSpeechArchive(
      downloadKey,
      archiveFormat = "zip",
      fallbackFilename = `speeches_archive_${this.ticketId}.zip`,
    ) {
      if (!this.ticketId) {
        this.resetArchiveTicketState();
        this.errorMessage = i18n.accessibility.ticketExpired;
        return false;
      }
      if (downloadKey && downloadDataStore().isDownloadActive(downloadKey))
        return false;

      this.errorMessage = "";
      this.resetArchiveTicketState();
      downloadDataStore().setDownloadActive(downloadKey, true);

      let dismissLinkNotify = null;
      let abortedByUser = false;

      try {
        const prepareResponse = await api.post(
          `/tools/speeches/archive/${encodeURIComponent(this.ticketId)}?archive_format=${encodeURIComponent(archiveFormat)}`,
        );
        const archiveTicketId = prepareResponse.data.archive_ticket_id;
        this.archiveTicketId = archiveTicketId;
        this.archiveTicketStatus = "pending";
        this.archiveRetrievalUrl = prepareResponse.data.retrieval_url || null;

        const retrievalUrl =
          window.location.origin + "/download/" + archiveTicketId;
        const buildingHint =
          i18n.downloadFeedback?.archiveBuildingHint ||
          "Behåll denna ruta öppen om du vill vänta, eller kopiera länken och stäng för att hämta senare.";
        dismissLinkNotify = Notify.create({
          message:
            (i18n.downloadFeedback?.archiveBuilding || "Arkivet byggs…") +
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
                i18n.downloadRetrievalPage?.copyLink || "Kopiera hämtningslänk",
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
                  i18n.downloadFeedback?.archiveLinkCopiedClose ||
                  "Länk kopierad — stäng för att hämta senare, eller vänta här.";
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
              i18n.downloadFeedback?.archiveAborted ||
              "Nedladdning avbruten — använd länken för att hämta filen när den är klar.",
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
        downloadDataStore().setupDownload(
          downloadDataStore().getFilenameFromDisposition(
            downloadResponse.headers,
            fallbackFilename,
          ),
          downloadResponse.data,
        );
        return true;
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorMessage = i18n.accessibility.ticketExpired;
          this.resetTicketState();
        } else if (error.response?.status === 429) {
          this.errorMessage = i18n.accessibility.tooManyRequests  ;
          this.resetTicketState();
        } else {
          this.errorMessage = this.getErrorMessage(error);
        }
        Notify.create({
          type: "negative",
          message: this.errorMessage,
          timeout: 4000,
          position: "top",
        });
        console.error("Error downloading KWIC speech archive:", error);
        return false;
      } finally {
        if (typeof dismissLinkNotify === "function") {
          dismissLinkNotify();
          dismissLinkNotify = null;
        }
        downloadDataStore().setDownloadActive(downloadKey, false);
      }
    },

    async downloadKWICTableExcel() {
      return this.downloadKwicArchive("xlsx");
    },

    async downloadKWICTableCSV() {
      return this.downloadKwicArchive("csv_gz");
    },

    async downloadKwicExcel(_downloadKey) {
      return this.downloadKwicArchive("xlsx");
    },

    async downloadKwicCsvGz(_downloadKey) {
      return this.downloadKwicArchive("csv_gz");
    },

    async downloadKwicJsonlGz(_downloadKey) {
      return this.downloadKwicArchive("jsonl_gz");
    },

    async downloadKwicSpeechesZip(_downloadKey) {
      return this.downloadKwicSpeechArchive(_downloadKey);
    },

    async downloadKwicSpeechesJsonlGz(_downloadKey) {
      return this.downloadKwicSpeechArchive(
        _downloadKey,
        "jsonl_gz",
        `speeches_archive_${this.ticketId}.jsonl.gz`,
      );
    },

    async downloadKwicSpeechesCsvGz(_downloadKey) {
      return this.downloadKwicSpeechArchive(
        _downloadKey,
        "csv_gz",
        `speeches_archive_${this.ticketId}.csv.gz`,
      );
    },
  },
});
