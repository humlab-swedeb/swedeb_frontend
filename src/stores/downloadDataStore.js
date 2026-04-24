import { defineStore } from "pinia";
import { api } from "boot/axios";
import JSZip from "jszip";
import i18n from "src/i18n/sv/index.js";
import { metaDataStore } from "./metaDataStore";

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
      const swerik_persons = i18n.downLoadInfo.swerik_persons;
      const swedeb_ref = i18n.downLoadInfo.swedeb_ref;

      //speaker, party, gender,

      return `${speaker}\n${party}\n${gender}\n${year}\n${id}\n${hit}\n${corpus_version}\n${swerik_ref}\n${swerik_persons}\n${swedeb_ref}\n\n`;
    },

    formatFileName(currentProps) {
      const speaker = currentProps.speaker;

      const id = currentProps.id;
      return `${speaker}_${id}.txt`.replace(/ /g, "_");
    },

    setupDownload(filename, blob) {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.setAttribute("download", filename);
      anchor.click(); // Trigger the download

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    },

    sanitizeDownloadFilename(filename) {
      return filename?.replace(/[\\/]/g, "_");
    },

    decodeRfc5987Value(value) {
      const match = value?.match(/^([^']*)'([^']*)'(.*)$/);
      const encodedValue = match ? match[3] : value;

      try {
        return decodeURIComponent(encodedValue);
      } catch {
        return encodedValue;
      }
    },

    getFilenameFromDisposition(headers, fallbackName) {
      const disposition = headers?.["content-disposition"];

      const extendedMatch = disposition?.match(/filename\*\s*=\s*([^;]+)/i);
      if (extendedMatch?.[1]) {
        const extendedFilename = this.decodeRfc5987Value(
          extendedMatch[1].trim().replace(/^"(.*)"$/, "$1"),
        );
        const sanitizedExtendedFilename = this.sanitizeDownloadFilename(
          extendedFilename,
        );

        if (sanitizedExtendedFilename) {
          return sanitizedExtendedFilename;
        }
      }

      const match = disposition?.match(
        /filename\s*=\s*"([^"]+)"|filename\s*=\s*([^;]+)/i,
      );
      const filename = match?.[1] || match?.[2]?.trim();

      return this.sanitizeDownloadFilename(filename || fallbackName) || fallbackName;
    },

    async extractJsonPayloadFromZip(blob) {
      try {
        const archive = await JSZip.loadAsync(blob);
        const payloadName = Object.keys(archive.files).find(
          (name) => name.endsWith(".json") && name !== "manifest.json",
        );

        if (!payloadName) {
          return [];
        }

        const payloadFile = archive.file(payloadName);
        if (!payloadFile) {
          return [];
        }

        const payload = await payloadFile.async("string");
        return JSON.parse(payload);
      } catch (error) {
        console.error("Error extracting JSON payload from zip:", error);
        return [];
      }
    },

    async downloadCurrentSpeechText(text, currentMetadata) {
      try {
        const filename = this.formatFileName(currentMetadata);
        const content = `${this.formatProps(currentMetadata)}\n${text}`;
        const blob = new Blob([content], { type: "text/plain" });
        this.setupDownload(filename, blob);
      } catch (error) {
        console.error("Error downloading text file:", error);
      }
    },

    async downloadSpeechesZip(speech_list) {
      try {
        const queryString = metaDataStore().getSelectedParams();
        const path = `tools/speeches/download${
          queryString ? `?${queryString}` : ""
        }`;
        const json_payload = JSON.stringify(speech_list);

        const response = await api.post(path, json_payload, {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        });

        this.setupDownload("tal.zip", new Blob([response.data]));
      } catch (error) {
        console.error("Error fetching data for download:", error);
      }
    },

    async downloadSpeechesZipByTicket(ticketId) {
      try {
        const response = await api.get(
          `/tools/speeches/archive/${encodeURIComponent(ticketId)}`,
          {
            responseType: "blob",
          },
        );

        this.setupDownload(
          this.getFilenameFromDisposition(response.headers, `speeches_${ticketId}.zip`),
          response.data,
        );
      } catch (error) {
        console.error("Error fetching ticket download:", error);
      }
    },
  },
});
