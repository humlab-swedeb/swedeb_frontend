import { defineStore } from "pinia";
import { api } from "boot/axios";
import JSZip from "jszip";

export const downloadDataStore = defineStore("downloadData", {
  actions: {




    async getSpeechesZip(speech_list, selected_metadata) {
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

        originalZip.file('metadata.txt', selected_metadata);

        // Generate the new ZIP file asynchronously
        const newZipBlob = await originalZip.generateAsync({ type: 'blob' });

        // Create a temporary URL for the new ZIP file
        const url = window.URL.createObjectURL(newZipBlob);

        // Create an anchor element for initiating the download
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.setAttribute('download', 'new_speeches.zip');
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
