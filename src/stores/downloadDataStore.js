import { defineStore } from "pinia";
import { api } from "boot/axios";
import JSZip from "jszip";
import i18n from "src/i18n/sv/index.js";

export const downloadDataStore = defineStore("downloadData", {
  actions: {
    formatProps(currentProps) {
      const speaker = `Talare: ${currentProps.speaker}`;
      const hit = `Sökord ${currentProps.node_word}`;
      const id = `Anförande-ID: ${currentProps.protocol}`;
      const party = `Parti: ${currentProps.party}`;
      const year = `År: ${currentProps.year}`;
      const gender = `Kön: ${currentProps.gender}`;

      const corpus_version = i18n.downLoadInfo.corpus_version;
      const swerik_ref = i18n.downLoadInfo.swerik_ref;
      const swedeb_ref = i18n.downLoadInfo.swedeb_ref;

      //speaker, party, gender,

      return `${speaker}\n${party}\n${gender}\n${year}\n${id}\n${hit}\n${corpus_version}\n${swerik_ref}\n${swedeb_ref}\n\n`;
    },

    formatFileName(currentProps) {
      const speaker = currentProps.speaker;

      const id = currentProps.id;
      return `${speaker}_${id}.txt`.replace(/ /g, "_");
    },

    async downloadCurrentSpeechText(text, currentMetadata) {
      try {
        const filename = this.formatFileName(currentMetadata);
        // Create a new Blob object with the text content
        const content = `${this.formatProps(currentMetadata)}\n${text}`;
        const blob = new Blob([content], { type: "text/plain" });
        // Create a temporary URL for the Blob object
        const url = window.URL.createObjectURL(blob);

        // Create an anchor element for initiating the download
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.setAttribute("download", filename);
        anchor.click(); // Trigger the download

        // Revoke the temporary URL after a short delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } catch (error) {
        console.error("Error downloading text file:", error);
      }
    },

    async downloadSpeechesZip(speech_list, selected_metadata) {
      try {
        const path = "tools/speech_download/";
        const json_payload = JSON.stringify(speech_list);

        const response = await api.post(path, json_payload, {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        });

        const originalZipBlob = new Blob([response.data]);

        // Create a new instance of JSZip
        const zip = new JSZip();

        // Load the original ZIP file
        const originalZip = await zip.loadAsync(originalZipBlob);

        // Create a new text file with the selected metadata

        originalZip.file("metadata.txt", selected_metadata);

        // Generate the new ZIP file asynchronously
        const newZipBlob = await originalZip.generateAsync({ type: "blob" });

        // Create a temporary URL for the new ZIP file
        const url = window.URL.createObjectURL(newZipBlob);

        // Create an anchor element for initiating the download
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.setAttribute("download", "tal.zip");
        anchor.click(); // Trigger the download

        // Revoke the temporary URL after a short delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data for download:", error);
      }
    },
  },
});
