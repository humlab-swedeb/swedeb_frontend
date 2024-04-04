import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";

export const kwicDataStore = defineStore("kwicData", {
  state: () => ({
    /* selected: metaDataStore().selected, */
    wordsLeft: 2,
    wordsRight: 2,
    kwicData: [],
  }),

  actions: {
    async getKwicResult(search) {
      try {
        console.log(search);
        const path = `/tools/kwic/${search}`;

        const additional_params = {'words_before': this.wordsLeft, 'words_after': this.wordsRight};

        const queryString = metaDataStore().getSelectedParams(additional_params);
        const response = await api.get(`${path}?${queryString}`);
        this.kwicData = response.data.kwic_list;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
});
