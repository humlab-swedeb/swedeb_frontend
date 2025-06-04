import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";
import JSZip from "jszip";
import ExcelJS from "exceljs";
import { downloadDataStore } from "./downloadDataStore";

export const wordTrendsDataStore = defineStore("wordTrendsData", {
  state: () => ({
    wordTrends: [],
    wordTrendsSummed: [],
    speechesData: [],
    searchText: "",
    wordHits: [],
    wordHitsSelected: [],
    searchString: [],
    ifAsterisk: false,
    normalizeResults: false,
    singleLine: false,
  }),

  actions: {



  sumWordTrendsPerWord() {

    this.wordTrendsSummed = this.wordTrends.map((item) => {
      const summedCounts = {};
      for (const [key, value] of Object.entries(item.count)) {
        const word = key.split(" ")[0];
        if (!summedCounts[word]) {
          summedCounts[word] = 0;
        }
        summedCounts[word] += value;
      }
      return {
        year: item.year,
        count: summedCounts,
      };
    });
  },


    async getWordTrendsResult(search) {
      try {
        const path = `/tools/word_trends/${search}`;
        const additional_params = { normalize: this.normalizeResults };
        const queryString =
          metaDataStore().getSelectedParams(additional_params);
        const response = await api.get(`${path}?${queryString}`);
        this.wordTrends = response.data.wt_list;
        this.sumWordTrendsPerWord();
      } catch (error) {
        this.wordTrends = [];
        console.error("Error fetching data:", error);
      }
    },

    async getWordTrendsSpeeches(search) {
      try {
        const path = `/tools/word_trend_speeches/${search}`;
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(`${path}?${queryString}`);
        this.speechesData = response.data.speech_list;
      } catch (error) {
        this.speechesData = [];
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
        const n_hits = -1;

        const path = `/tools/word_trend_hits/${searchTerm}`;
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(
          `${path}?${queryString}&n_hits=${n_hits}`
        );
        const newHits = response.data.hit_list.filter(
          (hit) => !this.wordHits.includes(hit)
        );
        this.wordHits = [...this.wordHits, ...newHits].sort();
        this.wordHitsSelected = [
          ...this.wordHitsSelected,
          ...newHits.slice(0, 5),
        ].sort();
        this.searchText = "";
        this.ifAsterisk = true;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    addChip() {
      let text = this.searchText.trim();
      if (text !== "") {
        text = text.split(",").map((word) => word.trim());
        text.forEach((word) => {
          if (!this.wordHitsSelected.includes(word) && !word.includes("*")) {
            this.wordHitsSelected.push(word);
            this.wordHits.push(word);
          }
        });

        this.wordHitsSelected.sort();
        this.wordHits.sort();

        this.searchText = ""; // Reset the search field
      }
    },

    addKWICChip() {
      let text = this.searchText.trim();
      if (text.endsWith("*") && !text.endsWith(".*")) {
        text = `${text.slice(0, -1)}.*`;
      }

      if (text !== "") {
        this.wordHitsSelected.push(text);
        this.wordHits.push(text);

        this.searchText = ""; // Reset the search field
      }
    },

    generateStringOfSelected() {
      this.searchString = [...this.wordHitsSelected];
      this.searchString = this.searchString.join(",");
      return this.searchString;
    },

    getUniqueWords() {
      return Array.from(
        new Set(this.wordTrends.flatMap((item) => Object.keys(item.count)))
      );
    },

    downloadCSVcountsWT(selected_metadata) {
      const uniqueWords = this.getUniqueWords();
      let csvContent = `year,${uniqueWords.join(",")}\n`;
      this.wordTrends.forEach((item) => {
        const counts = uniqueWords
          .map((word) => item.count[word] || 0)
          .join(",");
        csvContent += `${item.year},${counts}\n`;
      });

      const zip = new JSZip();

      zip.file("ordtrender.csv", csvContent);
      zip.file("metadata.txt", selected_metadata);

      zip.generateAsync({ type: "blob" }).then((content) => {
        downloadDataStore().setupDownload("wordtrendsCSV.zip", content);
      });
    },

    async downloadExcelCountsWT(selected_metadata) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      const uniqueWords = this.getUniqueWords();
      worksheet.addRow(["year", ...uniqueWords]);

      this.wordTrends.forEach((item) => {
        const counts = uniqueWords.map((word) => item.count[word] || 0);
        worksheet.addRow([item.year, ...counts]);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const zip = new JSZip();

      zip.file("data.xlsx", buffer);
      zip.file("metadata.txt", selected_metadata);

      zip.generateAsync({ type: "blob" }).then((content) => {
        downloadDataStore().setupDownload("wordtrendsExcel.zip", content);
      });
    },
  },
});
