import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";
import JSZip from "jszip";
import ExcelJS from "exceljs";
import { downloadDataStore } from "./downloadDataStore";

const DEFAULT_PAGE_SIZE = 50;
const TICKET_POLL_INTERVAL_MS = 1000;
const TICKET_POLL_MAX_ATTEMPTS = 120;

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
      this.speechesErrorMessage = "";
      this.speechesPagination = {
        ...this.speechesPagination,
        page: 1,
        rowsNumber: 0,
      };
    },

    async waitForSpeechesTicketReady(requestId) {
      for (let attempt = 0; attempt < TICKET_POLL_MAX_ATTEMPTS; attempt++) {
        if (requestId !== this.requestSequence) {
          return false;
        }
        await new Promise((resolve) =>
          setTimeout(resolve, TICKET_POLL_INTERVAL_MS),
        );
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
          this.speechesErrorMessage =
            "Resultaten har gått ut. Vänligen gör en ny sökning.";
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
      if (!this.ticketId) return;
      const response = await api.get(
        `/tools/word_trend_speeches/download/${this.ticketId}`,
        { params: { format: "csv" }, responseType: "blob" },
      );
      downloadDataStore().setupDownload(
        "word_trend_speeches.csv",
        response.data,
      );
    },

    async downloadSpeechesExcel() {
      if (!this.ticketId) return;
      const response = await api.get(
        `/tools/word_trend_speeches/download/${this.ticketId}`,
        { params: { format: "json" } },
      );
      const speechList = response.data.speech_list || [];
      if (speechList.length === 0) return;
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
      zip.generateAsync({ type: "blob" }).then((content) => {
        downloadDataStore().setupDownload("word_trend_speeches.zip", content);
      });
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
      this.searchString = [...this.wordHitsSelected];
      this.searchString = this.searchString.join(",");
      return this.searchString;
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
