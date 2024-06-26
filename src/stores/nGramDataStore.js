import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";

export const nGramDataStore = defineStore("nGramDataStore", {
  state: () => ({
    nGrams: [],
    nGramSpeeches: [],
    width: 3,
    placingOptions: ["Ej specificerat", "Vänster", "Höger"],

    placingSelected: "Ej specificerat",
  }),

  actions: {
    async getNGramsResult(search) {
      try {
        const path = `/tools/ngrams/${search}`;
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(
          `${path}?${queryString}&width=${this.width}`
        );
        this.nGrams = response.data.ngram_list.sort(
          (a, b) => b.count - a.count
        );
      } catch (error) {
        this.nGrams = [];
        console.error("Error fetching data:", error);
      }
    },
  },
});
