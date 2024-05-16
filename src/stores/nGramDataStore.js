import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";

export const nGramDataStore = defineStore("nGramDataStore", {
  state: () => ({
    nGrams: [],
    nGramSpeeches: [],
  }),

  actions: {
    async getNGramsResult(search) {
      try {
        const path = `/tools/ngrams/${search}`;
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(`${path}?${queryString}`);
        this.nGrams = response.data.ngram_list;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
});
