import { defineStore } from "pinia";
import { api } from "boot/axios";
import { ref } from "vue";

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
      office: ["Ledamot", "Minister", "Talman", "Okänt"],
      subOffice: [
        "Arbetsmarknadsutskottet",
        "Civilutskottet",
        "Finansutskottet",
        "Försvarsutskottet",
        "Justitieutskottet",
        "Kulturutskottet",
        "Miljö- och jordbruksutskottet",
        "Näringsutskottet",
        "Skatteutskottet",
        "Socialutskottet",
        "Trafikutskottet",
        "Utbildningsutskottet",
        "Utrikesutskottet",
        "Valberedningen",
        "Vetenskapsutskottet",
        "Övriga utskott",
        "Okänt",
      ],
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

    submitEvent: false,
    updateEvent: false,
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

    async getPartyOptions() {
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

    async getSpeakersOptions() {
      try {
        const path = "/speakers";
        const response = await api.get(path);
        this.data = response.data;

        // Filter speakers based on selected party
        const selectedParty = this.selected.party;
        if (selectedParty.length > 0) {
          this.options.speakers = this.data
            .filter((speaker) => selectedParty.includes(speaker.party))
            .map((speaker) => speaker.name);
        } else {
          this.options.speakers = this.data.map((speaker) => speaker.name);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async getSubOfficeOptions() {
      try {
        /* const path = "/speakers";
        const response = await api.get(path);
        this.data = response.data;

        // Filter speakers based on selected party
        const selectedParty = this.selected.party;
        if (selectedParty.length > 0) {
          this.options.subOffice = this.data
            .filter((speaker) => selectedParty.includes(speaker.party))
            .map((speaker) => speaker.subOffice);
        } else {
          this.options.subOffice = this.data.map((speaker) => speaker.subOffice);
        } */
        console.log("Get suboffice options");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    getPartyFromSpeaker(speaker) {
      try {
        const speakerObj = this.data.find((obj) => obj.name === speaker);
        return speakerObj.party;
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
