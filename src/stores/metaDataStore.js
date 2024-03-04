import { defineStore } from "pinia";
import { api } from "boot/axios";

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
        min: 0,
        max: 0,
      },
    },

    genderAllSelect: false,
    officeAllSelect: false,

    submitEvent: false,
    updateEvent: false,
  }),

  actions: {
    async resetSelectedState() {
      this.selected = {
        party: [],
        gender: [],
        office: [],
        subOffice: [],
        speakers: [],
        yearRange: {
          min: null,
          max: null,
        },
      };
      this.selected.yearRange.min = await this.getStartYear();
      this.selected.yearRange.max = await this.getEndYear();
      this.genderAllSelect = false;
      this.officeAllSelect = false;
    },

    addParamArray(current_key, api_key, query_params) {
      const party_value = this.selected[current_key];
      if (party_value.length > 0) {
        party_value.forEach((item) => query_params.append(api_key, item));
      }
    },

    getSelectedParams() {
      const searchParams = new URLSearchParams();

      this.addParamArray("party", "parties", searchParams);
      this.addParamArray("gender", "genders", searchParams);
      this.addParamArray("office", "office_types", searchParams);
      this.addParamArray("subOffice", "sub_office_types", searchParams);
      this.addParamArray("speakers", "speaker_ids", searchParams);

      const year_value = this.selected["yearRange"];
      if (year_value.min !== null) {
        searchParams.append("from_year", year_value.min);
      }

      if (year_value.max !== null) {
        searchParams.append("to_year", year_value.max);
      }

      return searchParams.toString();
    },

    async getStartYear() {

      try {
        const path = "/metadata/start_year";
        const response = await api.get(path);
        const min_year = parseInt(response.data);
        return min_year;
      } catch (error) {console.log(error);}
    },
    async getEndYear() {
      try {
        const path = "/metadata/end_year";
        const response = await api.get(path);
        const max_year = parseInt(response.data);
        return max_year;
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
      this.options.party = response.data.party_list;
      //this.options.party = response.data.party_list.map(party => party.party_abbrev);

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
        const queryString = this.getSelectedParams();
        const response = await api.get(`${path}?${queryString}`);
        /*         console.log(`${path}/?${queryString}`); */
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
