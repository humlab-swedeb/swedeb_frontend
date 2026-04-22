import { defineStore } from "pinia";
import { api } from "boot/axios";
import axios from "axios";
import { metaDataStore } from "./metaDataStore";
import { downloadDataStore } from "./downloadDataStore";
import JSZip from "jszip";
import ExcelJS from "exceljs";
import i18n from "src/i18n/sv/index.js";

const DEFAULT_ROWS_PER_PAGE = 10;
const DEFAULT_SORT_BY = "protocol";
const TICKET_POLL_INTERVAL_MS = 1000;
const TICKET_POLL_MAX_ATTEMPTS = 120;

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

    resetTicketState() {
      this.kwicData = [];
      this.ticketId = null;
      this.totalHits = 0;
      this.totalPages = 0;
      this.expiresAt = null;
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
        cut_off: 100000,
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

        await new Promise((resolve) => {
          window.setTimeout(resolve, TICKET_POLL_INTERVAL_MS);
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
          cut_off: 100000,
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

    async fetchKwicExportData() {
      const normalizedSearch = this.normalizeSearch(this.searchText);

      if (!normalizedSearch) {
        return [];
      }

      const path = this.getKwicResultsPath(normalizedSearch);
      const additionalParams = {
        words_before: this.wordsLeft,
        words_after: this.wordsRight,
        lemmatized: this.lemmatizeSearch,
        cut_off: 100000,
      };
      const queryString = metaDataStore().getSelectedParamsAtSearch(
        "kwic",
        additionalParams,
      );
      const response = await api.get(`${path}?${queryString}`);

      return response.data.kwic_list || [];
    },

    async getExportRows() {
      if (this.useTicketFlow && this.ticketId) {
        return this.fetchKwicExportData();
      }

      return this.kwicData;
    },

    async downloadKWICTableExcel(selectedMetadata) {
      const exportRows = await this.getExportRows();

      if (exportRows.length > 0) {
        const data = exportRows.map((obj) => {
          let newObj = {};
          Object.keys(this.columnNames).forEach((key) => {
            newObj[this.columnNames[key]] = obj[key] ?? "";
          });
          return newObj;
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        worksheet.columns = Object.values(this.columnNames).map((header) => ({
          header,
          key: header,
        }));

        data.forEach((row) => worksheet.addRow(row));

        const buffer = await workbook.xlsx.writeBuffer();

        const zip = new JSZip();
        zip.file("kwicData.xlsx", buffer);
        zip.file("metadata.txt", selectedMetadata);

        zip.generateAsync({ type: "blob" }).then((content) => {
          downloadDataStore().setupDownload("kwicExcel.zip", content);
        });
      }
    },

    async downloadKWICTableCSV(selectedMetadata) {
      const exportRows = await this.getExportRows();

      if (exportRows.length > 0) {
        const headerRow = Object.values(this.columnNames).join(",");

        const dataRows = exportRows
          .map((obj) =>
            Object.keys(this.columnNames)
              .map(
                (key) => `"${(obj[key] ?? "").toString().replace(/"/g, '""')}"`,
              )
              .join(","),
          )
          .join("\n");

        const csvContent = headerRow + "\n" + dataRows;

        const zip = new JSZip();
        zip.file("kwicData.csv", csvContent);
        zip.file("metadata.txt", selectedMetadata);

        zip.generateAsync({ type: "blob" }).then((content) => {
          downloadDataStore().setupDownload("kwicCSV.zip", content);
        });
      }
    },
  },
});
