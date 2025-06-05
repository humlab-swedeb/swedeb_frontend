import { defineStore } from "pinia";

export const pdfDataStore = defineStore("pdfStore", {
  state: () => ({
    speechData: null,
  }),
  actions: {
    setRowData(data) {
      this.speechData = data;
    },
  },
});
