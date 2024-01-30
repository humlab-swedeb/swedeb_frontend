import { defineStore } from "pinia";

export const kwicDataStore = defineStore("kwicData", {
  state: () => ({
    /* selected: metaDataStore().selected, */
    wordsLeft: 0,
    wordsRight: 0,
  }),

  actions: {},
});
