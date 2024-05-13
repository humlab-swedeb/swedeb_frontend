import { defineStore } from 'pinia';

export const nGramDataStore = defineStore('nGramDataStore', {
  state: () => ({
    nGrams: [],
    nGramSpeeches: [],

  }),

  actions: {

    async getNGramsResult(search){
      try {
        const path = `/tools/ngrams/${search}`;
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(`${path}?${queryString}`);
        this.nGrams
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  },
});
