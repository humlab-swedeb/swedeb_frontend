import { defineStore } from "pinia";
import { api } from "boot/axios";

/* const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  // andra konfigurationer här...
}); */

export const dataStore = defineStore("dataStore", {
  state: () => ({
    data: null,
    options: {
      party: [],
      gender: ["Man", "Kvinna", "Okänt"],
      office: ["Riksdag", "Regering", "Kommun", "Landsting"],
      subOffice: ["test", "test2"],
      speakers: [],
    },
    selected: {
      party: [],
      gender: [],
      office: [],
      subOffice: [],
      speakers: [],
      yearRange: {
        min: 1920,
        max: 2022,
      },
    },

    genderAllSelect: false,
    officeAllSelect: false,
  }),

  actions: {
    async fetchData(path) {
      try {
        const response = await api.get(path);
        this.data = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async getpartyOptions() {
      try {
        const path = "/speakers";
        const response = await api.get(path);
        this.data = response.data;
        this.options.party = this.data.map((speakers) => speakers.party);
        //get rid of duplicates
        this.options.party = [...new Set(this.options.party)];
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async getspeakersOptions() {
      try {
        const path = "/speakers";
        const response = await api.get(path);
        this.data = response.data;
        this.options.speakers = this.data.map((speakers) => speakers.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    selectAll(type) {
      this.selected[type] = this.options[type];
      //if click again unselect all
      if (!this[`${type}AllSelect`]) {
        this.selected[type] = [];
      }
    },

    // If all genders are selected, select "Select All"
    ifAllSelected(type) {
      if (this.selected[type].length === this.options[type].length) {
        this[`${type}AllSelect`] = true;
      } else {
        this[`${type}AllSelect`] = false;
      }
    },
  },
});
