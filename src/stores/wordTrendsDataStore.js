import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";

export const wordTrendsDataStore = defineStore("wordTrendsData", {
  state: () => ({
    wordTrends: [],
    wordTrendsSpeeches: [],
    searchText: "",
    wordHits: [],
    wordHitsSelected: [],
    searchWords: [],
    searchString: [],
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

    async getWordTrendsSpeeches(search) {
      try {
        const path = `/tools/word_trend_speeches/${search}`;
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(`${path}?${queryString}`);
        this.wordTrendsSpeeches = response.data.speech_list;
        //return this.wordTrendsSpeeches;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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
        const n_hits = 5;
        const path = `/tools/word_trend_hits/${searchTerm}`;
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(
          `${path}?${queryString}&n_hits=${n_hits}`
        );
        this.wordHits = response.data.hit_list;
        this.wordHitsSelected = this.wordHits;
        this.searchText = "";
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    addChip() {
      let text = this.searchText.trim();
      if (text !== "") {
        text = text.split(",");
        text.forEach((word) => {
          if (!this.searchWords.includes(word) && !word.includes("*")) {
            this.searchWords.push(word);
          }
        });

        this.searchText = ""; // Reset the search field
      }
    },

    removeChip(index) {
      this.searchWords.splice(index, 1); // Remove the chip at the specified index
    },

    generateStringOfSelected() {
      this.searchString = [...this.wordHitsSelected, ...this.searchWords];
      this.searchString = this.searchString.join(",");
      return this.searchString;
    },
  },
});
