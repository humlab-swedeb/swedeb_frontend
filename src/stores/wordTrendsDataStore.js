import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";

export const wordTrendsDataStore = defineStore("wordTrendsData", {
  state: () => ({
    wordTrends: [],
    searchText: "",
  }),

  actions: {
    async getWordTrendsResult(search) {
      try {
        const path = `/tools/word_trends/${search}`;
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(`${path}?${queryString}`);
        this.wordTrends = response.data.wt_list;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
});
