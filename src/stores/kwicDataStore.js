import { defineStore } from "pinia";
import { api } from "boot/axios";
import axios from "axios";
import { metaDataStore } from "./metaDataStore";
import { downloadDataStore } from "./downloadDataStore";
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
      name: "Name",
      gender: "Kön",
      document_name: "Anförande",
      link: "Länk talare",
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
      if (search.endsWith("*") && !search.endsWith(".*")) {
        search = search.slice(0, -1) + ".*";
      }
      this.cancelTokenSource = axios.CancelToken.source();
      try {
        const path = `/tools/kwic/${search}`;
        const additionalParams = {
          words_before: this.wordsLeft,
          words_after: this.wordsRight,
          lemmatized: this.lemmatizeSearch,
          cut_off: 100000,
        };

        const queryString = metaDataStore().getSelectedParams(additionalParams);
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
        const data = this.kwicData.map((obj) => {
          let newObj = {};
          Object.keys(this.columnNames).forEach((key) => {
            newObj[this.columnNames[key]] = obj[key];
          });
          return newObj;
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        worksheet.columns = Object.values(this.columnNames).map((header) => ({
          header,
          key: header,
        }));

        data.forEach((row) => worksheet.addRow(row));

        const buffer = await workbook.xlsx.writeBuffer();

        const zip = new JSZip();
        zip.file("kwicData.xlsx", buffer);
        zip.file("metadata.txt", selectedMetadata);

        zip.generateAsync({ type: "blob" }).then((content) => {
          downloadDataStore().setupDownload("kwicExcel.zip", content);
        });
      }
    },

    downloadKWICTableCSV(selectedMetadata) {
      if (this.kwicData.length > 0) {
        const headerRow = Object.values(this.columnNames).join(",");

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
          downloadDataStore().setupDownload("kwicCSV.zip", content);
        });
      }
    },
  },
});
