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
      party: {},
      gender: {},
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
      const param_value = this.selected[current_key];

      if (param_value.length > 0) {
        param_value.forEach((item) => query_params.append(api_key, item));
      }
    },

    addPartyParam(selected_params){

      if (this.selected.party.length > 0) {
        // add the value from this.party.options for each selected party in this.party.selected
        this.selected.party.forEach((party) => selected_params.append("party_id", this.options.party[party]));

      }
    },

    addSpeakerParam(selected_params) {
      if (this.selected.speakers.length > 0) {
        this.selected.speakers.forEach((speaker) => selected_params.append("speaker_idsgit", speaker.person_id));
      }
    },


    getSelectedParams() {
      const searchParams = new URLSearchParams();

      this.addPartyParam(searchParams);
      this.addSpeakerParam(searchParams);
      this.addParamArray("gender", "gender_id", searchParams);
      this.addParamArray("office", "office_types", searchParams);
      this.addParamArray("subOffice", "sub_office_types", searchParams);

      const year_value = this.selected["yearRange"];
      if (year_value.min !== null) {
        searchParams.append("from_year", year_value.min);
      }

      if (year_value.max !== null) {
        searchParams.append("to_year", year_value.max);
      }

      return searchParams.toString();
    },

    getSelectedParamsForSpeakerList(){
      const searchParams = new URLSearchParams();
      this.addPartyParam(searchParams);
      this.addParamArray("gender", "gender_id", searchParams);
      this.addParamArray("office", "office_types", searchParams);
      this.addParamArray("subOffice", "sub_office_types", searchParams);
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

      this.options.party = response.data.party_list.reduce((acc, party) => {
        acc[party.party_abbrev] = party.party_id;
        return acc;
      }, {});

    },

    async getOfficeOptions() {
      const path = "/metadata/office_types";
      const response = await api.get(path);
      this.options.office = response.data.office_type_list.map(office_type=>office_type.office);
    },

    async getGenderOptions() {
      const path = "/metadata/genders";
      const response = await api.get(path);
      this.options.gender = response.data.gender_list.reduce((acc, gender) => {
        acc[gender.gender_id] = gender.swedish_gender;
        return acc;
    }, {});
    },

    async getSubOfficeOptions() {
      const path = "/metadata/sub_office_types";
      const response = await api.get(path);
      const sub_offices = response.data.sub_office_type_list.map(subOffice=>subOffice.identifier);
      this.options.subOffice = sub_offices.filter((subOffice) => subOffice !== null);

    },


    async getSpeakersOptions() {
      try {
        const path = "/metadata/speakers";
        const queryString = this.getSelectedParamsForSpeakerList();
        const response = await api.get(`${path}?${queryString}`);

        this.options.speakers = response.data.speaker_list;

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
