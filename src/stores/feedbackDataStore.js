import { defineStore } from "pinia";
import { i18n } from "boot/i18n";

export const feedbackDataStore = defineStore("feedbackDataStore", {
  state: () => ({
    data: {
      Kön: "",
      ID: "",
      link: "",
      node_word: "",
      Parti: "",
      source: "",
      Talare: "",
      År: 0,
      Data: "",
    },
  }),

  actions: {
    getFeedbackVariables: (data) => {
      const dataVersion = i18n.global.t("dataVersionLinkText");
      const personsVersion = i18n.global.t("personVersionText");

      const feedbackVariables = {
        Protokoll: data.protocol.substring(0, data.protocol.lastIndexOf(" ")),
        Kön: data.gender,
        Parti: data.party,
        År: data.year,
        Talare: data.speaker,
        Data: `${dataVersion} ${personsVersion}`,
      };
      return feedbackVariables;
    },
  },
});

//personVersionText
