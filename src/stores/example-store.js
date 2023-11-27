import { defineStore } from "pinia";
import { api } from "boot/axios";

/* const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  // andra konfigurationer här...
}); */

export const useMyStore = defineStore("myStore", {
  state: () => ({
    data: null,
    partyOptions: [],
    partySelected: [],
  }),
  getters: {},
  actions: {
    async fetchData(path) {
      try {
        const response = await api.get(path);
        this.data = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    getpartyOptions() {
      this.partyOptions = this.data.map((speakers) => speakers.party);
      //get rid of duplicates
      this.partyOptions = [...new Set(this.partyOptions)];
    },
  },
});
