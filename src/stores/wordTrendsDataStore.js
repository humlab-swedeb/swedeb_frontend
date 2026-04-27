import { defineStore } from "pinia";
import { Notify, copyToClipboard } from "quasar";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";
import axios from "axios";
import JSZip from "jszip";
import ExcelJS from "exceljs";
import { downloadDataStore } from "./downloadDataStore";
import i18n from "src/i18n/sv/index.js";
import {
  getTicketPollDelayMs,
  TICKET_POLL_MAX_ATTEMPTS,
  pollArchiveTicket,
} from "./ticketPolling";

const DEFAULT_PAGE_SIZE = 50;

const SORT_FIELD_MAP = {
  speaker: "name",
  party: "party_abbrev",
  year: "year",
  protocol: "document_name",
};

export const wordTrendsDataStore = defineStore("wordTrendsData", {
  state: () => ({
    wordTrends: [],
    wordTrendsSummed: [],
    speechesData: [],
    searchText: "",
    wordHits: [],
    wordHitsSelected: [],
    searchString: [],
    ifAsterisk: false,
    normalizeResults: false,
    singleLine: false,
    // Ticket-based speeches state
    ticketId: null,
    ticketStatus: null,
    // Archive ticket state
    archiveTicketId: null,
    archiveTicketStatus: null,
    archiveRetrievalUrl: null,
    speechesTotalHits: 0,
    speechesTotalPages: 0,
    speechesErrorMessage: "",
    speechesIsLoading: false,
    speechesIsPageLoading: false,
    requestSequence: 0,
    pageRequestSequence: 0,
    speechesPagination: {
      sortBy: "year",
      descending: true,
      page: 1,
      rowsPerPage: DEFAULT_PAGE_SIZE,
      rowsNumber: 0,
    },
  }),

  actions: {
    sumWordTrendsPerWord() {
      this.wordTrendsSummed = this.wordTrends.map((item) => {
        const summedCounts = {};
        for (const [key, value] of Object.entries(item.count)) {
          const word = key.split(" ")[0];
          if (!summedCounts[word]) {
            summedCounts[word] = 0;
          }
          summedCounts[word] += value;
        }
        return {
          year: item.year,
          count: summedCounts,
        };
      });
    },

    async getWordTrendsResult(search) {
      try {
        const path = `/tools/word_trends/${search}`;
        const additional_params = { normalize: this.normalizeResults };
        const queryString =
          metaDataStore().getSelectedParams(additional_params);
        const response = await api.get(`${path}?${queryString}`);
        this.wordTrends = response.data.wt_list;
        this.sumWordTrendsPerWord();
      } catch (error) {
        this.wordTrends = [];
        console.error("Error fetching data:", error);
      }
    },

    /**
     * @deprecated Use getWordTrendsSpeechesTicket() instead for server-side pagination
     * Legacy method that fetches all speeches in a single request
     */
    async getWordTrendsSpeeches(search) {
      try {
        const path = `/tools/word_trend_speeches/${search}`;
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(`${path}?${queryString}`);
        this.speechesData = response.data.speech_list;
      } catch (error) {
        this.speechesData = [];
        console.error("Error fetching data:", error);
      }
    },

    resetSpeechesTicketState() {
      this.ticketId = null;
      this.ticketStatus = null;
      this.speechesData = [];
      this.speechesTotalHits = 0;
      this.speechesTotalPages = 0;
      this.speechesPagination = {
        ...this.speechesPagination,
        page: 1,
        rowsNumber: 0,
      };
    },

    resetArchiveTicketState() {
      this.archiveTicketId = null;
      this.archiveTicketStatus = null;
      this.archiveRetrievalUrl = null;
    },

    async waitForSpeechesTicketReady(requestId) {
      for (let attempt = 0; attempt < TICKET_POLL_MAX_ATTEMPTS; attempt++) {
        if (requestId !== this.requestSequence) {
          return false;
        }
        try {
          const response = await api.get(
            `/tools/word_trend_speeches/status/${this.ticketId}`,
          );
          const status = response.data.status;
          this.ticketStatus = status;
          if (response.data.total_hits != null) {
            this.speechesTotalHits = response.data.total_hits;
          }
          if (status === "ready") {
            return true;
          }
          if (status === "error") {
            this.speechesErrorMessage =
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
      this.speechesErrorMessage = "Tidsgränsen för sökningen uppnåddes.";
      return false;
    },

    async fetchSpeechesPage({ page, rowsPerPage, sortBy, descending }) {
      if (!this.ticketId) return;
      const pageRequestId = ++this.pageRequestSequence;
      this.speechesIsPageLoading = true;
      const apiSortBy = SORT_FIELD_MAP[sortBy] || sortBy || "year";
      const sortOrder = descending ? "desc" : "asc";
      try {
        const response = await api.get(
          `/tools/word_trend_speeches/page/${this.ticketId}`,
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
        this.speechesTotalHits = response.data.total_hits;
        this.speechesTotalPages = response.data.total_pages;
        this.speechesPagination = {
          ...this.speechesPagination,
          page,
          rowsPerPage,
          sortBy,
          descending,
          rowsNumber: response.data.total_hits,
        };
        return response.data;
      } catch (error) {
        if (error.response?.status === 404) {
          this.speechesErrorMessage = i18n.accessibility.ticketExpired;
          this.resetSpeechesTicketState();
        } else if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          this.speechesErrorMessage =
            error?.response?.data?.detail ||
            error?.message ||
            "Kunde inte hämta anföranden";
        }
        console.error("Error fetching speeches page:", error);
        return null;
      } finally {
        if (pageRequestId === this.pageRequestSequence) {
          this.speechesIsPageLoading = false;
        }
      }
    },

    async getWordTrendsSpeechesTicket(search) {
      const requestId = ++this.requestSequence;
      this.pageRequestSequence = 0;
      this.speechesIsLoading = true;
      this.speechesErrorMessage = "";
      this.resetSpeechesTicketState();

      try {
        const words = search
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean);
        const filters = metaDataStore().getSelectedKwicTicketFilters();
        const response = await api.post("/tools/word_trend_speeches/query", {
          search: words,
          filters,
        });

        if (requestId !== this.requestSequence) {
          return;
        }

        this.ticketId = response.data.ticket_id;
        this.ticketStatus = response.data.status;

        const ready = await this.waitForSpeechesTicketReady(requestId);
        if (!ready || requestId !== this.requestSequence) {
          return;
        }

        await this.fetchSpeechesPage({
          page: 1,
          rowsPerPage: this.speechesPagination.rowsPerPage,
          sortBy: this.speechesPagination.sortBy,
          descending: this.speechesPagination.descending,
        });
      } catch (error) {
        this.speechesData = [];
        this.speechesTotalHits = 0;
        this.speechesTotalPages = 0;
        this.speechesErrorMessage = "Kunde inte hämta anföranden.";
        console.error("Error fetching word trend speeches (ticket):", error);
      } finally {
        if (requestId === this.requestSequence) {
          this.speechesIsLoading = false;
        }
      }
    },

    async downloadSpeechesCSV() {
      if (!this.ticketId) return false;
      this.speechesErrorMessage = "";

      try {
        const response = await api.get(
          `/tools/word_trend_speeches/download/${this.ticketId}`,
          { params: { format: "csv" }, responseType: "blob" },
        );
        downloadDataStore().setupDownload(
          downloadDataStore().getFilenameFromDisposition(
            response.headers,
            `word_trend_speeches_${this.ticketId}.zip`,
          ),
          response.data,
        );
        return true;
      } catch (error) {
        if (error.response?.status === 404) {
          this.speechesErrorMessage = i18n.accessibility.ticketExpired;
          this.resetSpeechesTicketState();
        } else {
          this.speechesErrorMessage =
            error?.response?.data?.detail ||
            error?.message ||
            "Kunde inte hämta anföranden.";
        }
        console.error("Error downloading word trend speeches CSV:", error);
        return false;
      }
    },

    async downloadSpeechesExcel() {
      if (!this.ticketId) return false;
      this.speechesErrorMessage = "";

      try {
        const response = await api.get(
          `/tools/word_trend_speeches/download/${this.ticketId}`,
          { params: { format: "json" }, responseType: "blob" },
        );
        const speechList = await downloadDataStore().extractJsonPayloadFromZip(
          response.data,
        );
        if (speechList.length === 0) {
          this.speechesErrorMessage =
            i18n.downloadFeedback?.error || "Kunde inte starta nedladdningen.";
          return false;
        }
        const headers = [
          "year",
          "name",
          "party_abbrev",
          "document_name",
          "node_word",
        ];
        const data = speechList.map((row) => {
          const newObj = {};
          headers.forEach((key) => {
            newObj[key] = row[key] ?? "";
          });
          return newObj;
        });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");
        worksheet.columns = headers.map((h) => ({ header: h, key: h }));
        data.forEach((row) => worksheet.addRow(row));
        const buffer = await workbook.xlsx.writeBuffer();
        const zip = new JSZip();
        zip.file("word_trend_speeches.xlsx", buffer);
        const content = await zip.generateAsync({ type: "blob" });
        downloadDataStore().setupDownload("word_trend_speeches.zip", content);
        return true;
      } catch (error) {
        if (error.response?.status === 404) {
          this.speechesErrorMessage = i18n.accessibility.ticketExpired;
          this.resetSpeechesTicketState();
        } else {
          this.speechesErrorMessage =
            error?.response?.data?.detail ||
            error?.message ||
            "Kunde inte hämta anföranden.";
        }
        console.error("Error downloading word trend speeches Excel:", error);
        return false;
      }
    },

    async _downloadSpeechesArchive(archiveFormat, fallbackFilename, downloadKey) {
      if (!this.ticketId) return false;
      if (downloadKey && downloadDataStore().isDownloadActive(downloadKey)) return false;

      this.speechesErrorMessage = "";
      this.resetArchiveTicketState();
      downloadDataStore().setDownloadActive(downloadKey, true);

      let dismissLinkNotify = null;
      let abortedByUser = false;

      try {
        // 1. Request archive ticket (~200ms round-trip)
        const prepareResponse = await api.post(
          `/tools/word_trend_speeches/archive/${encodeURIComponent(this.ticketId)}?archive_format=${encodeURIComponent(archiveFormat)}`,
        );
        const archiveTicketId = prepareResponse.data.archive_ticket_id;
        this.archiveTicketId = archiveTicketId;
        this.archiveTicketStatus = "pending";
        this.archiveRetrievalUrl = prepareResponse.data.retrieval_url || null;

        // 2. Immediately show a persistent notification with the retrieval link
        const retrievalUrl = window.location.origin + "/download/" + archiveTicketId;
        const buildingHint = i18n.downloadFeedback?.archiveBuildingHint || "Behåll denna ruta öppen om du vill vänta, eller kopiera länken och stäng för att hämta senare.";
        dismissLinkNotify = Notify.create({
          message: (i18n.downloadFeedback?.archiveBuilding || "Arkivet byggs…") + " " + buildingHint,
          color: "primary",
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
                // Replace notification: now shows copied message + X to abort
                const copiedHint = i18n.downloadFeedback?.archiveLinkCopiedClose || "Länk kopierad — stäng för att hämta senare, eller vänta här.";
                dismissLinkNotify = Notify.create({
                  message: copiedHint,
                  color: "primary",
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

        // 3. Poll until ready (continues even if user closed the notification)
        await pollArchiveTicket(api, {
          statusUrl: `/tools/word_trend_speeches/archive/status/${archiveTicketId}`,
          onStatus: (status) => {
            this.archiveTicketStatus = status;
          },
        });

        // 4. Download the artifact — skip if user said "I'll fetch it later"
        if (abortedByUser) {
          Notify.create({
            message: i18n.downloadFeedback?.archiveAborted || "Nedladdning avbruten — använd länken för att hämta filen när den är klar.",
            color: "info",
            icon: "link",
            timeout: 6000,
            position: "top",
          });
          return true;
        }

        const downloadResponse = await api.get(
          `/tools/word_trend_speeches/archive/download/${archiveTicketId}`,
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
          this.speechesErrorMessage = i18n.accessibility.ticketExpired;
          this.resetSpeechesTicketState();
        } else {
          this.speechesErrorMessage =
            error?.response?.data?.detail ||
            error?.message ||
            "Kunde inte hämta anföranden.";
        }
        Notify.create({
          type: "negative",
          message: this.speechesErrorMessage,
          timeout: 4000,
          position: "top",
        });
        console.error(`Error downloading word trend speeches archive (${archiveFormat}):`, error);
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
      return this._downloadSpeechesArchive("zip", `word_trend_speeches_archive_${this.ticketId}.zip`, downloadKey);
    },

    async downloadSpeechesJsonlGz(downloadKey) {
      return this._downloadSpeechesArchive("jsonl_gz", `word_trend_speeches_archive_${this.ticketId}.jsonl.gz`, downloadKey);
    },

    async downloadSpeechesCsvGz(downloadKey) {
      return this._downloadSpeechesArchive("csv_gz", `word_trend_speeches_archive_${this.ticketId}.csv.gz`, downloadKey);
    },

    async getWordHits(search) {
      const terms = search.split(",");

      let searchTerm = null;

      for (let term of terms) {
        if (term.includes("*")) {
          searchTerm = term.trim();
          break;
        }
      }
      try {
        const n_hits = -1;

        const path = `/tools/word_trend_hits/${searchTerm}`;
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(
          `${path}?${queryString}&n_hits=${n_hits}`,
        );
        const newHits = response.data.hit_list.filter(
          (hit) => !this.wordHits.includes(hit),
        );
        this.wordHits = [...this.wordHits, ...newHits].sort();
        this.wordHitsSelected = [
          ...this.wordHitsSelected,
          ...newHits.slice(0, 5),
        ].sort();
        this.searchText = "";
        this.ifAsterisk = true;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    addChip() {
      let text = this.searchText.trim();
      if (text !== "") {
        text = text.split(",").map((word) => word.trim());
        text.forEach((word) => {
          if (!this.wordHitsSelected.includes(word) && !word.includes("*")) {
            this.wordHitsSelected.push(word);
            this.wordHits.push(word);
          }
        });

        this.wordHitsSelected.sort();
        this.wordHits.sort();

        this.searchText = ""; // Reset the search field
      }
    },

    addKWICChip() {
      let text = this.searchText.trim();
      if (text.endsWith("*") && !text.endsWith(".*")) {
        text = `${text.slice(0, -1)}.*`;
      }

      if (text !== "") {
        this.wordHitsSelected.push(text);
        this.wordHits.push(text);

        this.searchText = ""; // Reset the search field
      }
    },

    generateStringOfSelected() {
      return this.wordHitsSelected.join(",");
    },

    getUniqueWords() {
      return Array.from(
        new Set(this.wordTrends.flatMap((item) => Object.keys(item.count))),
      );
    },

    downloadCSVcountsWT(selected_metadata) {
      const uniqueWords = this.getUniqueWords();
      let csvContent = `year,${uniqueWords.join(",")}\n`;
      this.wordTrends.forEach((item) => {
        const counts = uniqueWords
          .map((word) => item.count[word] || 0)
          .join(",");
        csvContent += `${item.year},${counts}\n`;
      });

      const zip = new JSZip();

      zip.file("ordtrender.csv", csvContent);
      zip.file("metadata.txt", selected_metadata);

      zip.generateAsync({ type: "blob" }).then((content) => {
        downloadDataStore().setupDownload("wordtrendsCSV.zip", content);
      });
    },

    async downloadExcelCountsWT(selected_metadata) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      const uniqueWords = this.getUniqueWords();
      worksheet.addRow(["year", ...uniqueWords]);

      this.wordTrends.forEach((item) => {
        const counts = uniqueWords.map((word) => item.count[word] || 0);
        worksheet.addRow([item.year, ...counts]);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const zip = new JSZip();

      zip.file("data.xlsx", buffer);
      zip.file("metadata.txt", selected_metadata);

      zip.generateAsync({ type: "blob" }).then((content) => {
        downloadDataStore().setupDownload("wordtrendsExcel.zip", content);
      });
    },
  },
});
