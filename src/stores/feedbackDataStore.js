import { defineStore } from "pinia";
import i18n from "src/i18n/sv/index.js";

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
      const feedbackVariables = {
        ID: data.id,
        Kön: data.gender,
        Parti: data.party,
        //source: data.source,
        År: data.year,
        Talare: data.speaker,
        Data: `${i18n.dataVersionLinkText}, ${i18n.personVersionText}`,
      };
      return feedbackVariables;
    },
  },
});
