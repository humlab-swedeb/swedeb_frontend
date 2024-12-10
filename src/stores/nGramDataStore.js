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

    getSpeechIdsForRow(row_nr, page, rows_per_page) {
      console.log("reqeueste page and rows per page")
      console.log(page, rows_per_page)
      if (row_nr >= 0 && row_nr < this.nGrams.length) {
        const documents = this.nGrams[row_nr].documents;
        const start = (page - 1) * rows_per_page;
        const end = start + rows_per_page;
        return documents.slice(start, end);
      } else {
        return [];
      }
    },

    async getNGramSpeeches(row_nr, ngram, page, rows_per_page) {
      console.log('asking')
      const speech_ids = this.getSpeechIdsForRow(row_nr, page, rows_per_page);
      const queryString = speech_ids.map(id => `speech_id=${id}`).join('&');


      const path = `/tools/speeches?${queryString}`;

      try{
        const response = await api.get(path);
        this.nGramSpeeches = response.data.speech_list;
          this.nGramSpeeches.forEach((speech) => {
            speech.node_word = ngram;
        });

      } catch (error){
        console.log("Error fetching n-gram speeches")
        this.nGramSpeeches = []
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
