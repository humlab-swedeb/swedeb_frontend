import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";
import JSZip from "jszip";
import ExcelJS from 'exceljs';

export const wordTrendsDataStore = defineStore("wordTrendsData", {
  state: () => ({
    wordTrends: [],
    wordTrendsSpeeches: [],
    searchText: "",
    wordHits: [],
    wordHitsSelected: [],
    searchString: [],
    ifAsterisk: false,
    normalizeResults: false,
  }),

  actions: {
    async getWordTrendsResult(search) {
      try {
        const path = `/tools/word_trends/${search}`;
        const additional_params = { normalize: this.normalizeResults };
        const queryString =
          metaDataStore().getSelectedParams(additional_params);
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
          ...newHits.slice(0, 10),
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
        text = text.split(",").map(word => word.trim());
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
      console.log(text);
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

    downloadCSVcountsWT(selected_metadata) {


        // Get unique words from all word trends
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

        // Create a new instance of JSZip
        const zip = new JSZip();

        // Add the CSV file to the zip
        zip.file("ordtrender.csv", csvContent);

        // Add the file containing the string in selected_metadata to the zip
        zip.file("metadata.txt", selected_metadata);

        // Generate the zip file asynchronously
        zip.generateAsync({ type: "blob" }).then((content) => {
          // Create a temporary URL for the Blob
          const url = window.URL.createObjectURL(content);
          // Create an anchor element for initiating the download
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.setAttribute("download", "ordtrender.zip");
          anchor.click(); // Trigger the download
          // Revoke the temporary URL after a short delay
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        });
      },

      async downloadExcelCountsWT(selected_metadata) {
        // Get unique words from all word trends
        const uniqueWords = Array.from(
          new Set(this.wordTrends.flatMap((item) => Object.keys(item.count)))
        );

        // Create an Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Data");

        // Set the header row
        worksheet.addRow(["year", ...uniqueWords]);

        // Add data rows
        this.wordTrends.forEach((item) => {
          const counts = uniqueWords.map((word) => item.count[word] || 0);
          worksheet.addRow([item.year, ...counts]);
        });

        // Create a buffer to store the workbook data
        const buffer = await workbook.xlsx.writeBuffer();

        // Create a new instance of JSZip
        const zip = new JSZip();

        // Add the Excel file to the zip
        zip.file("data.xlsx", buffer);

        // Add the file containing the string in selected_metadata to the zip
        zip.file("metadata.txt", selected_metadata);

        // Generate the zip file asynchronously
        zip.generateAsync({ type: "blob" }).then((content) => {
          // Create a temporary URL for the Blob
          const url = window.URL.createObjectURL(content);

          // Create an anchor element for initiating the download
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.setAttribute("download", "wordtrends.zip");
          anchor.click(); // Trigger the download

          // Revoke the temporary URL after a short delay
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        });
      },



  },
});
