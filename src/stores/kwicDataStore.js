import { defineStore } from "pinia";
import { api } from "boot/axios";
import axios from "axios";
import { metaDataStore } from "./metaDataStore";
import JSZip from "jszip";
import ExcelJS from "exceljs";

export const kwicDataStore = defineStore("kwicData", {
  state: () => ({
    wordsLeft: 5,
    wordsRight: 5,
    kwicData: [],
    searchText: "",
    columnNames: {
      left_word: "Vänster",
      node_word: "Sökord",
      right_word: "Höger",
      year: "År",
      party_abbrev: "Parti",
      gender: "Kön",
      formatted_speech_id: "Anförande",
      link: "Länk talare",
      speech_link: "Länk tal",
    },
    lemmatizeSearch: false,
    cancelTokenSource: null,
  }),

  actions: {
    cancelFetch() {
      if (this.cancelTokenSource) {
        this.cancelTokenSource.cancel("Sökning avbruten");
      }
    },

    async getKwicResult(search) {
      this.cancelTokenSource = axios.CancelToken.source();
      try {
        const path = `/tools/kwic/${search}`;
        const additional_params = {
          words_before: this.wordsLeft,
          words_after: this.wordsRight,
          lemmatized: this.lemmatizeSearch,
          cut_off: 10000,
        };

        const queryString =
          metaDataStore().getSelectedParams(additional_params);
        const response = await api.get(`${path}?${queryString}`, {
          cancelToken: this.cancelTokenSource.token,
        });
        this.kwicData = response.data.kwic_list;
      } catch (error) {
        this.kwiData = [];
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else console.error("Error fetching data:", error);
      }
    },
    async downloadKWICTableExcel(selectedMetadata) {

      if (this.kwicData.length > 0) {
        // Map each object in kwicData to an array of objects with new column names
        const data = this.kwicData.map((obj) => {
          let newObj = {};
          Object.keys(this.columnNames).forEach((key) => {
            newObj[this.columnNames[key]] = obj[key];
          });
          return newObj;
        });

        // Create a new workbook and add the data
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        // Add the header row
        worksheet.columns = Object.values(this.columnNames).map((header) => ({
          header,
          key: header,
        }));

        // Add the data rows
        data.forEach((row) => worksheet.addRow(row));

        const buffer = await workbook.xlsx.writeBuffer();

        const zip = new JSZip();
        zip.file("kwicData.xlsx", buffer);
        zip.file("metadata.txt", selectedMetadata);

        zip.generateAsync({ type: "blob" }).then((content) => {
          // Create a temporary URL for the Blob
          const url = window.URL.createObjectURL(content);

          // Create an anchor element for initiating the download
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.setAttribute("download", "kwic.zip");
          anchor.click(); // Trigger the download

          // Revoke the temporary URL after a short delay
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        });
      }
    },

    downloadKWICTableCSV(selectedMetadata) {

      if (this.kwicData.length > 0) {
        // Get the keys from columnNames to create the header row
        const headerRow = Object.values(this.columnNames).join(",");

        // Map each object in kwicData to a CSV row, only including keys from columnNames
        const dataRows = this.kwicData
          .map((obj) =>
            Object.keys(this.columnNames)
              .map((key) => `"${obj[key].toString().replace(/"/g, '""')}"`)
              .join(",")
          )
          .join("\n");


        const csvContent = headerRow + "\n" + dataRows;

        const zip = new JSZip();
        zip.file("kwicData.csv", csvContent);
        zip.file("metadata.txt", selectedMetadata);

        zip.generateAsync({ type: "blob" }).then((content) => {
          // Create a temporary URL for the Blob
          const url = window.URL.createObjectURL(content);
          // Create an anchor element for initiating the download
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.setAttribute("download", "kwic.zip");
          anchor.click(); // Trigger the download
          // Revoke the temporary URL after a short delay
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        });
      }
    },
  },
});
