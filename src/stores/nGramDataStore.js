import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";
import { downloadDataStore } from "./downloadDataStore";

import JSZip from "jszip";
import ExcelJS from "exceljs";

export const nGramDataStore = defineStore("nGramDataStore", {
  state: () => ({
    searchText: "",
    nGrams: [],
    nGramSpeeches: [],
    width: 3,
    placingOptions: ["Ej specificerat", "Vänster", "Höger"],

    placingSelected: "Ej specificerat",
    searchString: "",
    columnNames: ["ngram", "count", "number_speeches"],
  }),

  actions: {
    downloadNGramTableCSV(selectedMetadata) {
      if (this.nGrams.length > 0) {
        const headerRow = this.columnNames.join(",");

        const dataRows = this.nGrams.map((obj) => {
          return `"${obj.ngram},${obj.count}, ${obj.documents.length}"`;
        });

        const csvContent = headerRow + "\n" + dataRows.join("\n");

        const zip = new JSZip();
        zip.file("nGramData.csv", csvContent);
        zip.file("metadata.txt", selectedMetadata);

        zip.generateAsync({ type: "blob" }).then((content) => {
          downloadDataStore().setupDownload("ngramCSV.zip", content);
        });
      }
    },

    async downloadNGramTableExcel(selectedMetadata) {
      if (this.nGrams.length > 0) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("nGramData");

        worksheet.addRow(this.columnNames);

        this.nGrams.forEach((obj) => {
          worksheet.addRow([obj.ngram, obj.count, obj.documents.length]);
        });

        const buffer = await workbook.xlsx.writeBuffer();

        const zip = new JSZip();
        zip.file("nGramData.xlsx", buffer);
        zip.file("metadata.txt", selectedMetadata);

        zip.generateAsync({ type: "blob" }).then((content) => {
          downloadDataStore().setupDownload("ngramExcel.zip", content);
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
  const documents =
    row_nr >= 0 && row_nr < this.nGrams.length
      ? this.nGrams[row_nr].documents
      : [];
  const total = documents.length;

  const start = (page - 1) * rows_per_page;
  const end = start + rows_per_page;
  const speech_ids = documents.slice(start, end);

  // If requested page is beyond last, return empty (and let caller handle)
  if (speech_ids.length === 0) {
    this.nGramSpeeches = [];
    return { items: [], total };
  }

  const queryString = speech_ids.map((id) => `speech_id=${id}`).join("&");
  const path = `/tools/speeches?${queryString}`;

  try {
    const response = await api.get(path);
    const items = response.data.speech_list.map((s) => ({
      ...s,
      node_word: ngram,
    }));
    // (Optional) Keep for legacy consumers
    this.nGramSpeeches = items;
    return { items, total };
  } catch (error) {
    console.log("Error fetching n-gram speeches", error);
    this.nGramSpeeches = [];
    return { items: [], total };
  }
},

    async getNGramsResult(search) {
      if (search.endsWith("*") && !search.endsWith(".*")) {
        search = search.slice(0, -1) + ".*";
      }
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
