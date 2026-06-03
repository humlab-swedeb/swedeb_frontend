import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";
import { downloadDataStore } from "./downloadDataStore";
import axios from "axios";
import { Notify, copyToClipboard } from "quasar";
import i18n from "src/i18n/sv/index.js";
import {
  getTicketPollDelayMs,
  pollArchiveTicket,
  TICKET_POLL_MAX_ATTEMPTS,
} from "./ticketPolling";

const DEFAULT_PAGE_SIZE = 50;

const SORT_FIELD_MAP = {
  speaker: "name",
  party: "party_abbrev",
  year: "year",
  protocol: "document_name",
};

export const speechesDataStore = defineStore("speechesData", {
  state: () => ({
    speechesData: [],
    // Ticket-based pagination state
    ticketId: null,
    ticketStatus: null,
    totalHits: 0,
    totalPages: 0,
    errorMessage: "",
    isLoading: false,
    isPageLoading: false,
    requestSequence: 0,
    pageRequestSequence: 0,
    archiveTicketId: null,
    archiveTicketStatus: null,
    archiveRetrievalUrl: null,
    pagination: {
      sortBy: "year",
      descending: true,
      page: 1,
      rowsPerPage: DEFAULT_PAGE_SIZE,
      rowsNumber: 0,
    },
  }),

  actions: {
    // Legacy method - kept for backward compatibility
    async getSpeechesResult() {
      try {
        const path = "/tools/speeches";
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(`${path}?${queryString}`);
        this.speechesData = response.data.speech_list;
      } catch (error) {
        this.speechesData = [];
        console.error("Error fetching data:", error);
      }
    },

    async getSpeech(id) {
      try {
        const path = `/tools/speeches/${id}`;
        const response = await api.get(path);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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

    resetTicketState() {
      this.ticketId = null;
      this.ticketStatus = null;
      this.speechesData = [];
      this.totalHits = 0;
      this.totalPages = 0;
      this.pagination = {
        ...this.pagination,
        page: 1,
        rowsNumber: 0,
      };
    },

    async waitForTicketReady(requestId) {
      for (let attempt = 0; attempt < TICKET_POLL_MAX_ATTEMPTS; attempt++) {
        if (requestId !== this.requestSequence) {
          return false;
        }
        try {
          const response = await api.get(
            `/tools/speeches/status/${this.ticketId}`,
          );
          const status = response.data.status;
          this.ticketStatus = status;
          if (response.data.total_hits != null) {
            this.totalHits = response.data.total_hits;
          }
          if (status === "ready") {
            return true;
          }
          if (status === "error") {
            this.errorMessage =
              response.data.error || "Okänt fel vid hämtning av anföranden.";
            return false;
          }

          const delayMs = getTicketPollDelayMs(
            attempt,
            response.headers?.["retry-after"],
          );
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } catch (error) {
          console.error("Error polling speeches ticket status:", error);
          return false;
        }
      }
      this.errorMessage = "Tidsgränsen för sökningen uppnåddes.";
      return false;
    },

    async fetchSpeechesPage({ page, rowsPerPage, sortBy, descending }) {
      if (!this.ticketId) return;
      const pageRequestId = ++this.pageRequestSequence;
      this.isPageLoading = true;
      const apiSortBy = SORT_FIELD_MAP[sortBy] || sortBy || "year";
      const sortOrder = descending ? "desc" : "asc";
      try {
        const response = await api.get(
          `/tools/speeches/page/${this.ticketId}`,
          {
            params: {
              page,
              page_size: rowsPerPage,
              sort_by: apiSortBy,
              sort_order: sortOrder,
            },
          },
        );
        if (pageRequestId !== this.pageRequestSequence) {
          return;
        }
        this.speechesData = response.data.speech_list;
        this.totalHits = response.data.total_hits;
        this.totalPages = response.data.total_pages;
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
        if (error.response?.status === 429) {
          this.errorMessage = i18n.accessibility.tooManyRequests;
          this.resetTicketState();
        } else if (error.response?.status === 404) {
          this.errorMessage = i18n.accessibility.ticketExpired;
          this.resetTicketState();
        } else if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          this.errorMessage =
            error?.response?.data?.detail ||
            error?.message ||
            "Kunde inte hämta anföranden";
        }
        console.error("Error fetching speeches page:", error);
        return null;
      } finally {
        if (pageRequestId === this.pageRequestSequence) {
          this.isPageLoading = false;
        }
      }
    },

    async getSpeechesTicketResult() {
      const requestId = ++this.requestSequence;
      this.pageRequestSequence = 0;
      this.isLoading = true;
      this.errorMessage = "";
      this.resetTicketState();

      try {
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.post(`/tools/speeches/query?${queryString}`);

        if (requestId !== this.requestSequence) {
          return;
        }

        this.ticketId = response.data.ticket_id;
        this.ticketStatus = response.data.status;

        const ready = await this.waitForTicketReady(requestId);
        if (!ready || requestId !== this.requestSequence) {
          return;
        }

        await this.fetchSpeechesPage({
          page: 1,
          rowsPerPage: this.pagination.rowsPerPage,
          sortBy: this.pagination.sortBy,
          descending: this.pagination.descending,
        });
      } catch (error) {
        this.speechesData = [];
        this.totalHits = 0;
        this.totalPages = 0;
        this.errorMessage = "Kunde inte hämta anföranden.";
        console.error("Error fetching speeches (ticket):", error);
      } finally {
        if (requestId === this.requestSequence) {
          this.isLoading = false;
        }
      }
    },
    async _downloadSpeechesArchive(
      archiveFormat,
      fallbackFilename,
      downloadKey,
    ) {
      if (!this.ticketId) return false;
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
        if (error.response?.status === 429) {
          this.errorMessage = i18n.accessibility.tooManyRequests;
          this.resetTicketState();
        } else if (error.response?.status === 404) {
          this.errorMessage = i18n.accessibility.ticketExpired;
          this.resetTicketState();
        } else {
          this.errorMessage =
            error?.response?.data?.detail ||
            error?.message ||
            "Kunde inte hämta anföranden.";
        }
        Notify.create({
          type: "negative",
          message: this.errorMessage,
          timeout: 4000,
          position: "top",
        });
        console.error(
          `Error downloading speeches archive (${archiveFormat}):`,
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

    async downloadSpeechesZip(downloadKey) {
      return this._downloadSpeechesArchive(
        "zip",
        `speeches_${this.ticketId}.zip`,
        downloadKey,
      );
    },

    async downloadSpeechesCsvGz(downloadKey) {
      return this._downloadSpeechesArchive(
        "csv_gz",
        `speeches_${this.ticketId}.csv.gz`,
        downloadKey,
      );
    },

    async downloadSpeechesJsonlGz(downloadKey) {
      return this._downloadSpeechesArchive(
        "jsonl_gz",
        `speeches_${this.ticketId}.jsonl.gz`,
        downloadKey,
      );
    },
  },
});
