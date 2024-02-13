import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";

export const speechesDataStore = defineStore("speechesData", {
  state: () => ({
    /* selected: metaDataStore().selected, */
    speechesData: [],
  }),

  actions: {
    async getSpeechesResult() {
      try {
        const path = "/tools/speeches";
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(`${path}?${queryString}`);
        this.speechesData = response.data;
      } catch (error) {
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
  },
});
