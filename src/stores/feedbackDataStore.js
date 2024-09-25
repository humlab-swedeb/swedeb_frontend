import { defineStore } from "pinia";

export const feedbackDataStore = defineStore("feedbackDataStore", {
  state: () => ({
    data: {
      gender: "",
      id: "",
      link: "",
      node_word: "",
      party: "",
      source: "",
      speaker: "",
      year: 0,
    },
  }),

  actions: {
    getFeedbackVariables: (data) => {
      const feedbackVariables = {
        id: data.id,
        gender: data.gender,
        party: data.party,
        //source: data.source,
        year: data.year,
        speaker: data.speaker,
      };
      return feedbackVariables;
    },
  },
});
