import { defineStore } from "pinia";
import { api } from "boot/axios";
import qs from "qs";

/* const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  // andra konfigurationer här...
}); */

export const metaDataStore = defineStore("metaDataStore", {
  state: () => ({
    data: null,

    options: {
      party: [],
      gender: [],
      office: [],
      subOffice: [],
      speakers: [],
    },

    selected: {
      party: [],
      gender: [],
      office: [],
      subOffice: [],
      speakers: [],
      yearRange: {
        min: null,
        max: null,
      },
    },

    genderAllSelect: false,
    officeAllSelect: false,

    submitEvent: false,
    updateEvent: false,
  }),

  actions: {
    async getStartYear() {
      try {
        const path = "/metadata/start_year";
        const response = await api.get(path);
        this.selected.yearRange.min = parseInt(response.data.year);
        return this.selected.yearRange.min;
      } catch (error) {}
    },
    async getEndYear() {
      try {
        const path = "/metadata/end_year";
        const response = await api.get(path);
        this.selected.yearRange.max = parseInt(response.data.year);
        return this.selected.yearRange.max;
      } catch (error) {}
    },

    getPartyColor(party) {
      const colorMap = {
        S: "#E8112d",
        M: "#52BDEC",
        SD: "#DDDD00",
        C: "#009933",
        V: "#DA291C",
        KD: "#000077",
        L: "#006AB3",
        MP: "#83CF39",
        FI: "#CD1B68",
      };
      return colorMap[party] || "#808080";
    },

    async getPartyOptions() {
      const path = "/metadata/parties";
      const response = await api.get(path);
      this.options.party = response.data.parties;
    },

    async getOfficeOptions() {
      const path = "/metadata/office_types";
      const response = await api.get(path);
      this.options.office = response.data.office_types;
    },

    async getGenderOptions() {
      const path = "/metadata/genders";
      const response = await api.get(path);
      this.options.gender = response.data.genders;
    },

    async getSubOfficeOptions() {
      const path = "/metadata/sub_office_types";
      const response = await api.get(path);
      this.options.subOffice = response.data.sub_office_types;
    },

    /*     async getPartyOptions() {
      try {
        const path = "/metadata/speakers";
        const response = await api.get(path);
        this.options.speakers = response.data;
        console.log(this.options.speakers.speaker_list);

        this.options.party = this.options.speakers.map(
          (speakers) => speakers.party
        );
        //get rid of duplicates
        this.options.party = [...new Set(this.options.party)];
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, */

    async getSpeakersOptions() {
      try {
        const path = "/metadata/speakers";
        const queryString = qs.stringify(
          { parties: this.selected.party },
          { arrayFormat: "repeat" }
        );
        const response = await api.get(`${path}?${queryString}`);
        /* const response = await api.get(
          "/metadata/speakers?parties=L"
        ); */
        this.options.speakers = response.data.speaker_list;

        /*         // Filter speakers based on selected party
        const selectedParty = this.selected.party;
        if (selectedParty.length > 0) {
          this.options.speakers = this.options.speakers
            .filter((speaker) => selectedParty.includes(speaker.party))
            .map((speaker) => speaker.name);
        } else {
          this.options.speakers = this.data.map((speaker) => speaker.name);
        } */
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    /*     getPartyFromSpeaker(speaker) {
      try {
        const speakerObj = this.data.find((obj) => obj.name === speaker);
        return speakerObj.party;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, */

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
