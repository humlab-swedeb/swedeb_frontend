import { defineStore } from "pinia";
import { api } from "boot/axios";

export const downloadDataStore = defineStore("downloadData", {
  actions: {
    async getSpeechesZip(speech_list) {
      try {
        const path = "tools/speech_download/";
        const json_payload = JSON.stringify(speech_list);
        console.log(json_payload);
        const response = await api.post(path, json_payload, {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        });

        console.log(response.data);
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create an anchor element
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.setAttribute('download', 'speeches.zip'); // Set the default file name for download
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
