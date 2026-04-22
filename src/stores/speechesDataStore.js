import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";
import axios from "axios";
import i18n from "src/i18n/sv/index.js";

const DEFAULT_PAGE_SIZE = 50;
const TICKET_POLL_INTERVAL_MS = 1000;
const TICKET_POLL_MAX_ATTEMPTS = 120;

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
        await new Promise((resolve) =>
          setTimeout(resolve, TICKET_POLL_INTERVAL_MS),
        );
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
        if (error.response?.status === 404) {
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
  },
});
