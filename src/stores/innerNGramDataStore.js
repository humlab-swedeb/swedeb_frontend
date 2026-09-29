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

const DEFAULT_ROWS_PER_PAGE = 10;

// Maps q-table column field names to backend sort_by values
const DEFAULT_SORT_BY_INNER = "protocol";

const SORT_FIELD_MAP_INNER = {
  left_word: "left_word",
  node_word: "node_word",
  right_word: "right_word",
  speaker: "name",
  party: "party_abbrev",
  gender: "gender",
  year: "year",
  protocol: "speech_name",
};

export const innerNGramDataStore = defineStore("innerNGramDataStore", {
  state: () => ({
    // State inner table
    innerSpeeches: [],

    // Ticket flow state for inner speech table
    ticketIdInner: null,
    ticketStatusInner: null,
    totalHitsInner: 0,
    totalPagesInner: 0,
    expiresAtInner: null,
    archiveTicketIdInner: null,
    archiveTicketStatusInner: null,
    archiveRetrievalUrlInner: null,
    isLoadingInner: false,
    isPageLoadingInner: false,
    errorMessageInner: "",
    hasSubmittedQueryInner: false,
    requestSequenceInner: 0,
    pageRequestSequenceInner: 0,
    shardsCompleteInner: 0,
    shardsTotalInner: 0,

    // Pagination for inner table
    innerPagination: {
      sortBy: DEFAULT_SORT_BY_INNER,
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

    resetInnerTicketState() {
      this.innerSpeeches = [];
      this.ticketIdInner = null;
      this.ticketStatusInner = null;
      this.totalHitsInner = 0;
      this.totalPagesInner = 0;
      this.expiresAtInner = null;
      this.resetArchiveTicketStateInner();
      this.shardsCompleteInner = 0;
      this.shardsTotalInner = 0;
      this.innerPagination = {
        ...this.innerPagination,
        page: 1,
        rowsNumber: 0,
      };
    },

    resetArchiveTicketStateInner() {
      this.archiveTicketIdInner = null;
      this.archiveTicketStatusInner = null;
      this.archiveRetrievalUrlInner = null;
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

    _buildInnerTicketPayload(normalizedSearch) {
      // ticket payload for using kwic endpoint to access ngram speeches

      const params = {
        search: normalizedSearch,
        lemmatized: false,
        words_before: 0,
        words_after: 0,
        merge_speeches: true,
        ...(this.cutOff !== null && { cut_off: this.cutOff }),
        filters: metaDataStore().getSelectedFilters(),
      };
      return params;
    },

    async fetchInnerPage({
      page = this.innerPagination.page,
      rowsPerPage = this.innerPagination.rowsPerPage,
      sortBy = this.innerPagination.sortBy,
      descending = this.innerPagination.descending,
      silent = false,
    } = {}) {
      if (!this.ticketIdInner) {
        return null;
      }

      const requestId = this.requestSequenceInner;
      const pageRequestId = ++this.pageRequestSequenceInner;
      if (!silent) {
        this.isPageLoadingInner = true;
      }
      try {
        const params = {
          page,
          page_size: rowsPerPage,
          sort_order: descending ? "desc" : "asc",
        };
        const sortField = SORT_FIELD_MAP_INNER[sortBy];

        this.innerPagination.page = page;

        if (sortField) {
          params.sort_by = sortField;
        }

        const response = await api.get(
          `/tools/kwic/results/${this.ticketIdInner}`,
          {
            params,
          },
        );

        if (response.status === 202 && response.data.status === "pending") {
          const ready = await this._waitForTicketReadyInner(requestIdInner);
          if (!ready) {
            return null;
          }

          return this.fetchInnerPage({
            page,
            rowsPerPage,
            sortBy,
            descending,
            silent,
          });
        }

        if (
          requestId !== this.requestSequenceInner ||
          pageRequestId !== this.pageRequestSequenceInner
        ) {
          return null;
        }

        const pageData = response.data;

        this.innerSpeeches = pageData.kwic_list;
        this.totalHitsInner = pageData.total_hits;
        this.totalPagesInner = pageData.total_pages;
        this.expiresAtInner = pageData.expires_at;
        this.isPartialInner = pageData.status === "partial";
        this.shardsCompleteInner =
          pageData.shards_complete ?? this.shardsCompleteInner;
        this.shardsTotalInner = pageData.shards_total ?? this.shardsTotalInner;
        this.innerPagination = {
          ...this.innerPagination,
          page,
          rowsPerPage,
          sortBy,
          descending,
          rowsNumber: pageData.total_hits,
        };

        return pageData;
      } catch (error) {
        if (error.response?.status === 429) {
          this.errorMessage = i18n.global.t("accessibility.tooManyRequests");
          this.resetInnerTicketState();
        } else if (error.response?.status === 404) {
          this.errorMessage = i18n.global.t("accessibility.ticketExpired");
          this.resetInnerTicketState();
        } else {
          this.errorMessage = this._getErrorMessage(error);
        }
        console.error("Error fetching inner ngram page:", error);
        return null;
      } finally {
        if (!silent && pageRequestId === this.pageRequestSequenceInner) {
          this.isPageLoadingInner = false;
        }
      }
    },

    async getInnerResult(currentNgram) {
  
      const normalizedSearch = this._normalizeSearch(currentNgram);
      const requestIdInner = ++this.requestSequenceInner;
      this.pageRequestSequenceInner = 0;
      this.hasSubmittedQueryInner = true;
      this.isLoadingInner = true;
      this.errorMessage = "";
      this.resetInnerTicketState();

      try {
        const response = await api.post(
          "/tools/kwic/query",
          this._buildInnerTicketPayload(normalizedSearch),
        );

        if (requestIdInner !== this.requestSequenceInner) {
          return;
        }

        this.ticketIdInner = response.data.ticket_id;
        this.expiresAtInner = response.data.expires_at;

        const ready = await this.waitForTicketReadyInner(requestIdInner);
        if (!ready || requestIdInner !== this.requestSequenceInner) {
          return;
        }

        await this.fetchInnerPage({
          page: 1,
          rowsPerPage: this.innerPagination.rowsPerPage,
          sortBy: this.innerPagination.sortBy,
          descending: this.innerPagination.descending,
        });
      } catch (error) {
        this.innerSpeeches = [];
        this.totalHitsInner = 0;
        this.totalPagesInner = 0;

        this.errorMessage = this._getErrorMessage(error);
        console.error("Error fetching ticketed inner ngram data:", error);
      } finally {
        if (requestIdInner === this.requestSequence) {
          this.isLoadingInner = false;
        }
      }
    },

    _getErrorMessage(error) {
      return error?.response?.data?.detail || error?.message || "Unknown error";
    },

    async waitForTicketReadyInner(requestId) {
      for (let attempt = 0; attempt < TICKET_POLL_MAX_ATTEMPTS; attempt += 1) {
        if (requestId !== this.requestSequenceInner || !this.ticketIdInner) {
          return false;
        }

        const response = await api.get(
          `/tools/kwic/status/${this.ticketIdInner}`,
        );

        if (requestId !== this.requestSequenceInner) {
          return false;
        }

        const data = response.data;
        this.expiresAtInner = data.expires_at;

        if (data.status === "ready") {
          this.isPartialInner = false;
          this.shardsCompleteInner =
            data.shards_complete ?? this.shardsTotalInner;
          this.shardsTotalInner = data.shards_total ?? this.shardsTotalInner;
          return true;
        }

        if (data.status === "error") {
          throw new Error(
            data.error || i18n.global.t("accessibility.innerQueryFailed"),
          );
        }

        if (data.status === "partial") {
          this.isPartialInner = true;
          this.shardsCompleteInner =
            data.shards_complete ?? this.shardsCompleteInner;
          this.shardsTotalInner = data.shards_total ?? this.shardsTotalInner;
          if (data.total_hits != null) {
            this.totalHitsInner = data.total_hits;
          }
          // Show available rows for the user's current view; ignore failures
          // because more shards may still be in flight.
          this.fetchInnerPage({
            page: this.innerPagination.page,
            rowsPerPage: this.innerPagination.rowsPerPage,
            sortBy: this.innerPagination.sortBy,
            descending: this.innerPagination.descending,
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

      throw new Error(i18n.global.t("accessibility.queryTicketTimeout"));
    },

    async _downloadNgramSpeechesArchiveInner(
      archiveFormat,
      fallbackFilename,
      downloadKey,
    ) {
      if (!this.ticketIdInner) {
        this.resetArchiveTicketStateInner();
        this.errorMessage =
          i18n.global.t("accessibility.ticketExpired") || "Results expired!";
        return false;
      }
      if (downloadKey && downloadDataStore().isDownloadActive(downloadKey)) {
        return false;
      }

      this.errorMessage = "";
      this.resetArchiveTicketStateInner();
      downloadDataStore().setDownloadActive(downloadKey, true);

      let dismissLinkNotify = null;
      let abortedByUser = false;

      try {
        const prepareResponse = await api.post(
          `/tools/speeches/archive/${encodeURIComponent(this.ticketIdInner)}?archive_format=${encodeURIComponent(archiveFormat)}`,
        );
        const archiveTicketId = prepareResponse.data.archive_ticket_id;
        this.archiveTicketIdInner = archiveTicketId;
        this.archiveTicketStatusInner = "pending";
        this.archiveRetrievalUrlInner =
          prepareResponse.data.retrieval_url || null;

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
            this.archiveTicketStatusInner = status;
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

    async downloadNGramSpeechesZipInner(downloadKey) {
      return this._downloadNgramSpeechesArchiveInner(
        "zip",
        `ngram_speeches_archive_${this.ticketIdInner}.zip`,
        downloadKey,
      );
    },

    async downloadNGramSpeechesJsonlGzInner(downloadKey) {
      return this._downloadNgramSpeechesArchiveInner(
        "jsonl_gz",
        `ngram_speeches_archive_${this.ticketId}.jsonl.gz`,
        downloadKey,
      );
    },

    async downloadNGramSpeechesCsvGzInner(downloadKey) {
      return this._downloadNgramSpeechesArchiveInner(
        "csv_gz",
        `ngram_speeches_archive_${this.ticketId}.csv.gz`,
        downloadKey,
      );
    },
  },
});
