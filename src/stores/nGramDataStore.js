import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";

export const nGramDataStore = defineStore("nGramDataStore", {
  state: () => ({
    searchText: "",
    nGrams: [],
    nGramSpeeches: [],
    width: 3,
    placingOptions: ["Ej specificerat", "Vänster", "Höger"],

    placingSelected: "Ej specificerat",
    searchString: "",
  }),

  actions: {
    getPosition() {
      const placement = this.placingSelected;
      if (placement === "Vänster") {
        return "left-aligned";
      } else if (placement === "Höger") {
        return "right-aligned";
      } else {
        return "sliding";
      }
    },

    getSpeechIdsForRow(row_nr) {
      if (row_nr >= 0 && row_nr < this.nGrams.length) {
        const documents = this.nGrams[row_nr].documents;
        return documents.slice(0, 10);
      } else {
        return [];
      }
    },

    async getNGramSpeeches(row_nr, ngram) {
      const speech_ids = this.getSpeechIdsForRow(row_nr);
      const path = "/tools/ngram_speeches"; // Full URL
      const json_payload = JSON.stringify(speech_ids);

      try {
        const response = await api.post(path, json_payload, {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          responseType: "json",
        });

        this.nGramSpeeches = response.data.speech_list;
        this.nGramSpeeches.forEach((speech) => {
          speech.node_word = ngram;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async getNGramsResult(search) {
      try {
        const path = `/tools/ngrams/${search}`;
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(
          `${path}?${queryString}&width=${
            this.width
          }&mode=${this.getPosition()}`
        );
        this.nGrams = response.data.ngram_list.sort(
          (a, b) => b.count - a.count
        );
        this.searchString = this.searchText;
      } catch (error) {
        this.nGrams = [];
        console.error("Error fetching data:", error);
      }
    },
  },
});
