import { defineStore } from "pinia";
import { api } from "boot/axios";

export const pdfDataStore = defineStore("pdfStore", {
  state: () => ({
    speechData: null,
  }),
  actions: {
    setRowData(data) {
      this.speechData = data;
    },

    async loadPageRange(protocolName) {
      try {
        const response = await api.get("/tools/protocol/page_range", {
          params: { protocol_name: protocolName },
        });

        if (Array.isArray(response.data) && response.data.length === 2) {
          return Number(response.data[1]);
        }
      } catch (error) {
        console.error("Error fetching protocol page range:", error);
        return null;
      }
    },
  },
});
