import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";
import JSZip from 'jszip';


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

    downloadNGramTableCSV(selectedMetadata) {
      if (this.nGrams.length > 0) {
        const columnNames = ["ngram", "count", "number_speeches"];
        const headerRow = columnNames.join(",");
        console.log(headerRow);

        // Map each object in nGramData to a CSV row, only including keys from columnNames
        const dataRows = this.nGrams
          .map((obj) =>
            columnNames
              .map((key) => {
                if (key === "number_speeches") {
                  return `"${obj.documents.length}"`;
                }
                return `"${obj[key]}"`;
              })
              .join(",")
          )
          .join("\n");

        const csvContent = headerRow + "\n" + dataRows;

        const zip = new JSZip();
        zip.file("nGramData.csv", csvContent);
        zip.file("metadata.txt", selectedMetadata);

        zip.generateAsync({ type: "blob" }).then((content) => {
          // Create a temporary URL for the Blob
          const url = window.URL.createObjectURL(content);
          // Create an anchor element for initiating the download
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.setAttribute("download", "nGram.zip");
          anchor.click(); // Trigger the download
          // Revoke the temporary URL after a short delay
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        });
      }
    },

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

      const speech_ids = this.getSpeechIdsForRow(row_nr, page, rows_per_page);

      if (speech_ids.length > 0) {
        const queryString = speech_ids.map((id) => `speech_id=${id}`).join("&");

        const path = `/tools/speeches?${queryString}`;


        try {
          const response = await api.get(path);
          this.nGramSpeeches = response.data.speech_list;
          this.nGramSpeeches.forEach((speech) => {
            speech.node_word = ngram;
          });
        } catch (error) {
          console.log("Error fetching n-gram speeches");
          this.nGramSpeeches = [];
        }
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
