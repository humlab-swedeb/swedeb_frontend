import { defineStore } from "pinia";
import { api } from "boot/axios";
import { Notify } from "quasar";
import JSZip from "jszip";
import i18n from "src/i18n/sv/index.js";
import { metaDataStore } from "./metaDataStore";
import { pollArchiveTicket } from "./ticketPolling";

export const downloadDataStore = defineStore("downloadData", {
  state: () => ({
    activeDownloads: {},
    archiveTicketId: null,
    archiveTicketStatus: null,
    archiveRetrievalUrl: null,
  }),

  actions: {
    isDownloadActive(downloadKey) {
      return Boolean(this.activeDownloads[downloadKey]);
    },

    resetArchiveTicketState() {
      this.archiveTicketId = null;
      this.archiveTicketStatus = null;
      this.archiveRetrievalUrl = null;
    },

    setDownloadActive(downloadKey, isActive) {
      if (!downloadKey) {
        return;
      }

      if (isActive) {
        this.activeDownloads = {
          ...this.activeDownloads,
          [downloadKey]: true,
        };
        return;
      }

      const nextActiveDownloads = { ...this.activeDownloads };
      delete nextActiveDownloads[downloadKey];
      this.activeDownloads = nextActiveDownloads;
    },

    getDownloadFeedbackMessages() {
      return {
        preparing:
          i18n.downloadFeedback?.preparing || "Förbereder nedladdning...",
        success: i18n.downloadFeedback?.success || "Nedladdningen har startat.",
        error:
          i18n.downloadFeedback?.error || "Kunde inte starta nedladdningen.",
      };
    },

    getDownloadErrorMessage(error, fallbackMessage) {
      return error?.response?.data?.detail || error?.message || fallbackMessage;
    },

    async runTrackedDownload(downloadKey, task, options = {}) {
      if (!downloadKey || this.isDownloadActive(downloadKey)) {
        return false;
      }

      const messages = this.getDownloadFeedbackMessages();
      const preparingMessage = options.preparingMessage || messages.preparing;
      const successMessage = options.successMessage || messages.success;
      const resolveErrorMessage = () => {
        const optionErrorMessage =
          typeof options.getErrorMessage === "function"
            ? options.getErrorMessage()
            : options.errorMessage;

        return optionErrorMessage || messages.error;
      };

      let dismissPreparingNotify = null;
      let taskError = null;
      let wasSuccessful = false;

      this.setDownloadActive(downloadKey, true);

      try {
        dismissPreparingNotify = Notify.create({
          spinner: true,
          message: preparingMessage,
          timeout: 0,
          position: "top",
        });
        const result = await task();
        wasSuccessful = result !== false;
      } catch (error) {
        taskError = error;
      } finally {
        if (typeof dismissPreparingNotify === "function") {
          dismissPreparingNotify();
        }
        this.setDownloadActive(downloadKey, false);
      }

      if (taskError) {
        Notify.create({
          type: "negative",
          message: this.getDownloadErrorMessage(
            taskError,
            resolveErrorMessage(),
          ),
          timeout: 3000,
          position: "top",
        });
        return false;
      }

      if (!wasSuccessful) {
        Notify.create({
          type: "negative",
          message: resolveErrorMessage(),
          timeout: 3000,
          position: "top",
        });
        return false;
      }

      Notify.create({
        type: "positive",
        message: successMessage,
        timeout: 1500,
        position: "top",
      });
      return true;
    },

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
        const sanitizedExtendedFilename =
          this.sanitizeDownloadFilename(extendedFilename);

        if (sanitizedExtendedFilename) {
          return sanitizedExtendedFilename;
        }
      }

      const match = disposition?.match(
        /filename\s*=\s*"([^"]+)"|filename\s*=\s*([^;]+)/i,
      );
      const filename = match?.[1] || match?.[2]?.trim();

      return (
        this.sanitizeDownloadFilename(filename || fallbackName) || fallbackName
      );
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
        return true;
      } catch (error) {
        console.error("Error fetching data for download:", error);
        return false;
      }
    },

    async downloadSpeechesZipByTicket(ticketId) {
      this.resetArchiveTicketState();

      try {
        // 1. Request archive ticket
        const prepareResponse = await api.post(
          `/tools/speeches/archive/${encodeURIComponent(ticketId)}?archive_format=zip`,
        );
        const archiveTicketId = prepareResponse.data.archive_ticket_id;
        this.archiveTicketId = archiveTicketId;
        this.archiveTicketStatus = "pending";
        this.archiveRetrievalUrl = prepareResponse.data.retrieval_url || null;

        // 2. Poll until ready
        await pollArchiveTicket(api, {
          statusUrl: `/tools/speeches/archive/status/${archiveTicketId}`,
          onStatus: (status) => {
            this.archiveTicketStatus = status;
          },
        });

        // 3. Download the artifact
        const downloadResponse = await api.get(
          `/tools/speeches/archive/download/${archiveTicketId}`,
          { responseType: "blob" },
        );
        this.setupDownload(
          this.getFilenameFromDisposition(
            downloadResponse.headers,
            `speeches_${ticketId}.zip`,
          ),
          downloadResponse.data,
        );
        return true;
      } catch (error) {
        console.error("Error downloading speeches zip by ticket:", error);
        this.resetArchiveTicketState();
        return false;
      }
    },
  },
});
