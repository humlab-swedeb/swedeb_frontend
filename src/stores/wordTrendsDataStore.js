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
        this.wordHitsSelected = [...new Set([...this.wordHitsSelected, ...this.wordHits])];
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
          if (!this.wordHitsSelected.includes(word) && !word.includes("*")) {
            this.wordHitsSelected.push(word);
          }
        });

        this.searchText = ""; // Reset the search field
      }
    },



    generateStringOfSelected() {
      this.searchString = [...this.wordHitsSelected];
      this.searchString = this.searchString.join(",");
      return this.searchString;
    },
    downloadCSV() {
      // Convert the array of objects into a CSV string
      const uniqueWords = Array.from(
        new Set(this.wordTrends.flatMap((item) => Object.keys(item.count)))
      );

      // Create CSV content
      let csvContent = `year,${uniqueWords.join(",")}\n`;
      this.wordTrends.forEach((item) => {
        const counts = uniqueWords
          .map((word) => item.count[word] || 0)
          .join(",");
        csvContent += `${item.year},${counts}\n`;
      });

      // Create a Blob containing the CSV content
      const blob = new Blob([csvContent], { type: "text/csv" });

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element for initiating the download
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.setAttribute("download", "data.csv");
      anchor.click(); // Trigger the download

      // Revoke the temporary URL after a short delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    },
  },
});
