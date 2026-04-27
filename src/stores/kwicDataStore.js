import { defineStore } from "pinia";
import { api } from "boot/axios";
import axios from "axios";
import { Notify, copyToClipboard } from "quasar";
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
    cutOff: 100000,
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
    useTicketFlow: true,
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
    cancelFetch() {
      if (this.cancelTokenSource) {
        this.cancelTokenSource.cancel("Sökning avbruten");
        this.cancelTokenSource = null;
      }

      this.requestSequence += 1;
      this.pageRequestSequence += 1;
      this.isLoading = false;
      this.isPageLoading = false;
    },

    normalizeSearch(search) {
      if (search.endsWith("*") && !search.endsWith(".*")) {
        return search.slice(0, -1) + ".*";
      }

      return search;
    },

    resetArchiveTicketState() {
      this.archiveTicketId = null;
      this.archiveTicketStatus = null;
      this.archiveRetrievalUrl = null;
    },

    resetTicketState() {
      this.kwicData = [];
      this.ticketId = null;
      this.totalHits = 0;
      this.totalPages = 0;
      this.expiresAt = null;
      this.archiveTicketId = null;
      this.archiveTicketStatus = null;
      this.archiveRetrievalUrl = null;
      this.pagination = {
        ...this.pagination,
        page: 1,
        rowsNumber: 0,
      };
    },

    buildKwicTicketPayload(search) {
      return {
        search,
        lemmatized: this.lemmatizeSearch,
        words_before: this.wordsLeft,
        words_after: this.wordsRight,
        cut_off: this.cutOff,
        filters: metaDataStore().getSelectedKwicTicketFilters(),
      };
    },

    getKwicResultsPath(search) {
      return `/tools/kwic/${search}`;
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

        this.expiresAt = response.data.expires_at;

        if (response.data.status === "ready") {
          return true;
        }

        if (response.data.status === "error") {
          throw new Error(response.data.error || "KWIC query failed");
        }

        const delayMs = getTicketPollDelayMs(
          attempt,
          response.headers?.["retry-after"],
        );
        await new Promise((resolve) => {
          window.setTimeout(resolve, delayMs);
        });
      }

      throw new Error("KWIC ticket timed out");
    },

    async fetchKwicPage({
      page = this.pagination.page,
      rowsPerPage = this.pagination.rowsPerPage,
      sortBy = this.pagination.sortBy,
      descending = this.pagination.descending,
    } = {}) {
      if (!this.ticketId) {
        return null;
      }

      const requestId = this.requestSequence;
      const pageRequestId = ++this.pageRequestSequence;
      this.isPageLoading = true;

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

          return this.fetchKwicPage({ page, rowsPerPage, sortBy, descending });
        }

        if (
          requestId !== this.requestSequence ||
          pageRequestId !== this.pageRequestSequence
        ) {
          return null;
        }

        this.kwicData = response.data.kwic_list;
        this.totalHits = response.data.total_hits;
        this.totalPages = response.data.total_pages;
        this.expiresAt = response.data.expires_at;
        this.pagination = {
          ...this.pagination,
          page,
          rowsPerPage,
          sortBy,
          descending,
          rowsNumber: response.data.total_hits,
        };

        return response.data;
      } catch (error) {
        if (error.response?.status === 404) {
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
        if (pageRequestId === this.pageRequestSequence) {
          this.isPageLoading = false;
        }
      }
    },

    async getKwicResultLegacy(search) {
      const normalizedSearch = this.normalizeSearch(search);
      this.cancelTokenSource = axios.CancelToken.source();

      try {
        const path = this.getKwicResultsPath(normalizedSearch);
        const additionalParams = {
          words_before: this.wordsLeft,
          words_after: this.wordsRight,
          lemmatized: this.lemmatizeSearch,
          ...(this.cutOff !== null && { cut_off: this.cutOff }),
        };

        const queryString = metaDataStore().getSelectedParams(additionalParams);
        const response = await api.get(`${path}?${queryString}`, {
          cancelToken: this.cancelTokenSource.token,
        });
        this.kwicData = response.data.kwic_list;
        this.totalHits = response.data.kwic_list.length;
        this.totalPages = 1;
        this.pagination = {
          ...this.pagination,
          page: 1,
          sortBy: DEFAULT_SORT_BY,
          descending: false,
          rowsNumber: response.data.kwic_list.length,
        };
      } catch (error) {
        this.kwicData = [];
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else console.error("Error fetching data:", error);
      }
    },

    async getKwicResult(search) {
      if (!this.useTicketFlow) {
        return this.getKwicResultLegacy(search);
      }

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

    async _downloadKwicArchive(archiveFormat, fallbackFilename, downloadKey) {
      if (!this.ticketId) return false;
      if (downloadKey && downloadDataStore().isDownloadActive(downloadKey)) return false;

      this.errorMessage = "";
      this.resetArchiveTicketState();
      downloadDataStore().setDownloadActive(downloadKey, true);

      let dismissLinkNotify = null;
      let abortedByUser = false;

      try {
        // 1. Request archive ticket (~200ms round-trip)
        const prepareResponse = await api.post(
          `/tools/kwic/archive/${encodeURIComponent(this.ticketId)}?archive_format=${encodeURIComponent(archiveFormat)}`,
        );
        const archiveTicketId = prepareResponse.data.archive_ticket_id;
        this.archiveTicketId = archiveTicketId;
        this.archiveTicketStatus = "pending";
        this.archiveRetrievalUrl = prepareResponse.data.retrieval_url || null;

        // 2. Immediately show a persistent notification with the retrieval link
        const retrievalUrl = window.location.origin + "/download/" + archiveTicketId;
        const buildingHint =
          i18n.downloadFeedback?.archiveBuildingHint ||
          "Behåll denna ruta öppen om du vill vänta, eller kopiera länken och stäng för att hämta senare.";
        dismissLinkNotify = Notify.create({
          message:
            (i18n.downloadFeedback?.archiveBuilding || "Arkivet byggs…") + " " + buildingHint,
          color: "blue-8",
          icon: "hourglass_top",
          timeout: 0,
          position: "top",
          multiLine: true,
          actions: [
            {
              label: i18n.downloadRetrievalPage?.copyLink || "Kopiera hämtningslänk",
              color: "yellow",
              handler: () => {
                const prevDismiss = dismissLinkNotify;
                copyToClipboard(retrievalUrl);
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

        // 3. Poll until ready via generic downloads endpoint
        await pollArchiveTicket(api, {
          statusUrl: `/downloads/${archiveTicketId}`,
          onStatus: (status) => {
            this.archiveTicketStatus = status;
          },
        });

        // 4. Download the artifact — skip if user said "I'll fetch it later"
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
        } else {
          this.errorMessage = this.getErrorMessage(error);
        }
        Notify.create({
          type: "negative",
          message: this.errorMessage,
          timeout: 4000,
          position: "top",
        });
        console.error(`Error downloading KWIC archive (${archiveFormat}):`, error);
        return false;
      } finally {
        if (typeof dismissLinkNotify === "function") {
          dismissLinkNotify();
          dismissLinkNotify = null;
        }
        downloadDataStore().setDownloadActive(downloadKey, false);
      }
    },

    async _downloadKwicSpeechesArchive(archiveFormat, fallbackFilename, downloadKey) {
      if (!this.ticketId) return false;
      if (downloadKey && downloadDataStore().isDownloadActive(downloadKey)) return false;

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

        const retrievalUrl = window.location.origin + "/download/" + archiveTicketId;
        const buildingHint =
          i18n.downloadFeedback?.archiveBuildingHint ||
          "Behåll denna ruta öppen om du vill vänta, eller kopiera länken och stäng för att hämta senare.";
        dismissLinkNotify = Notify.create({
          message:
            (i18n.downloadFeedback?.archiveBuilding || "Arkivet byggs…") + " " + buildingHint,
          color: "blue-8",
          icon: "hourglass_top",
          timeout: 0,
          position: "top",
          multiLine: true,
          actions: [
            {
              label: i18n.downloadRetrievalPage?.copyLink || "Kopiera hämtningslänk",
              color: "yellow",
              handler: () => {
                const prevDismiss = dismissLinkNotify;
                copyToClipboard(retrievalUrl);
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
          statusUrl: `/tools/speeches/archive/status/${archiveTicketId}`,
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
          `/tools/speeches/archive/download/${archiveTicketId}`,
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
        } else {
          this.errorMessage = this.getErrorMessage(error);
        }
        Notify.create({
          type: "negative",
          message: this.errorMessage,
          timeout: 4000,
          position: "top",
        });
        console.error(`Error downloading KWIC speeches archive (${archiveFormat}):`, error);
        return false;
      } finally {
        if (typeof dismissLinkNotify === "function") {
          dismissLinkNotify();
          dismissLinkNotify = null;
        }
        downloadDataStore().setDownloadActive(downloadKey, false);
      }
    },

    async downloadKwicExcel(downloadKey) {
      return this._downloadKwicArchive(
        "xlsx",
        `kwic_archive_${this.ticketId}.xlsx`,
        downloadKey,
      );
    },

    async downloadKwicCsvGz(downloadKey) {
      return this._downloadKwicArchive(
        "csv_gz",
        `kwic_archive_${this.ticketId}.csv.gz`,
        downloadKey,
      );
    },

    async downloadKwicJsonlGz(downloadKey) {
      return this._downloadKwicArchive(
        "jsonl_gz",
        `kwic_archive_${this.ticketId}.jsonl.gz`,
        downloadKey,
      );
    },

    async downloadKwicSpeechesZip(downloadKey) {
      return this._downloadKwicSpeechesArchive(
        "zip",
        `kwic_speeches_${this.ticketId}.zip`,
        downloadKey,
      );
    },
  },
});
