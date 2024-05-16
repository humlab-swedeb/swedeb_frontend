import { defineStore } from "pinia";
import { api } from "boot/axios";

export const metaDataStore = defineStore("metaDataStore", {
  state: () => ({
    data: null,

    options: {
      party: {},
      gender: {},
      office: [],
      subOffice: [],
      speakers: [],
      yearRange: {
        min: 0,
        max: 0,
      },
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
          min: this.options.yearRange.min,
          max: this.options.yearRange.max,
        },
      };
      this.genderAllSelect = false;
      this.officeAllSelect = false;
    },

    async fetchAllMetaData() {
      // to load all metadata on mount
      this.getYearOptions();
      this.getPartyOptions();
      this.getOfficeOptions();
      this.getGenderOptions();
      this.getSpeakersOptions();
    },

    addParamArray(current_key, api_key, query_params) {
      const param_value = this.selected[current_key];

      if (param_value.length > 0) {
        param_value.forEach((item) => query_params.append(api_key, item));
      }
    },

    addPartyParam(selected_params) {
      if (this.selected.party.length > 0) {
        // add the value from this.party.options for each selected party in this.party.selected
        this.selected.party.forEach((party) =>
          selected_params.append("party_id", this.options.party[party].party_id)
        );
      }
    },

    addSpeakerParam(selected_params) {
      if (this.selected.speakers.length > 0) {
        this.selected.speakers.forEach((speaker) =>
          selected_params.append("who", speaker.person_id)
        );
      }
    },

    genderToText(gender_id) {
      return this.options.gender[gender_id];
    },

    getMetarRow(metadata_variable, metadata_variable_name) {
      // Helper function to create a string representation of selected metadata
      let selected = "Alla";
      if (metadata_variable.length > 0) {
        selected = metadata_variable.join(", ");
      }
      return `Valda ${metadata_variable_name}: ${selected}`;
    },

    getSpeakerAsString(speaker) {
      // Helper function to create a string representation of a speaker
      const year_of_death = speaker.year_of_death ? speaker.year_of_death : "";
      return `${speaker.name}, ${speaker.party_abbrev}, ${speaker.year_of_birth} - ${year_of_death}`;
    },

    selectedMetadataToText() {
      // String representation of selected metadata to be included in downloads
      const selected_years_start = this.selected.yearRange.min;
      const selected_years_end = this.selected.yearRange.max;
      const year_string = `Årsintervall: ${selected_years_start} - ${selected_years_end}`;

      const selected_parties = this.getMetarRow(this.selected.party, "partier");
      const selected_speakers_as_string = this.selected.speakers.map(
        (speaker) => this.getSpeakerAsString(speaker)
      );
      const selected_speakers = this.getMetarRow(
        selected_speakers_as_string,
        "talare"
      );
      const selected_genders_as_string = this.selected.gender.map(
        (gender) => this.options.gender[gender]
      );

      const selected_genders = this.getMetarRow(
        selected_genders_as_string,
        "kön"
      );

      return `${year_string}\n${selected_parties}\n${selected_speakers}\n${selected_genders}`;
    },

    getSelectedParams(additional_params = {}) {
      const searchParams = new URLSearchParams();

      for (const key in additional_params) {
        searchParams.append(key, additional_params[key]);
      }

      this.addPartyParam(searchParams);
      this.addSpeakerParam(searchParams);
      this.addParamArray("gender", "gender_id", searchParams);
      //this.addParamArray("office", "office_types", searchParams);
      //this.addParamArray("subOffice", "sub_office_types", searchParams);

      const year_value = this.selected["yearRange"];
      if (year_value.min !== null) {
        searchParams.append("from_year", year_value.min);
      }

      if (year_value.max !== null) {
        searchParams.append("to_year", year_value.max);
      }

      return searchParams.toString();
    },

    getSelectedParamsForSpeakerList() {
      const searchParams = new URLSearchParams();
      this.addPartyParam(searchParams);
      this.addParamArray("gender", "gender_id", searchParams);
      //this.addParamArray("office", "office_types", searchParams);
      //this.addParamArray("subOffice", "sub_office_types", searchParams);
      return searchParams.toString();
    },

    async getYearOptions() {
      try {
        const start_path = "/metadata/start_year";
        const end_path = "/metadata/end_year";

        const start_response = await api.get(start_path);
        const end_response = await api.get(end_path);

        this.options.yearRange.min = parseInt(start_response.data);
        this.options.yearRange.max = parseInt(end_response.data);
        this.selected.yearRange.min = parseInt(start_response.data);
        this.selected.yearRange.max = parseInt(end_response.data);
      } catch (error) {
        console.error(error);
      }
    },

    getPartyColor(party_abbreviation) {

      if (!this.options.party.hasOwnProperty(party_abbreviation)){
        return "#808080";
      }
      return this.options.party[party_abbreviation].party_color || "#808080";
    },

    async getPartyOptions() {
      const path = "/metadata/parties";
      const response = await api.get(path);

      this.options.party = response.data.party_list
        .sort((a, b) => a.party_abbrev.localeCompare(b.party_abbrev))
        .reduce((acc, party) => {
          acc[party.party_abbrev] = {
            party_id: party.party_id,
            party_name: party.party,
            party_color: party.party_color,
          };
          return acc;
        }, {});
    },

    async getOfficeOptions() {
      const path = "/metadata/office_types";
      const response = await api.get(path);
      this.options.office = response.data.office_type_list.map(
        (office_type) => office_type.office
      );
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
      const sub_offices = response.data.sub_office_type_list.map(
        (subOffice) => subOffice.identifier
      );
      this.options.subOffice = sub_offices.filter(
        (subOffice) => subOffice !== null
      );
    },

    async getSpeakersOptions() {
      try {
        const path = "/metadata/speakers";
        const queryString = this.getSelectedParamsForSpeakerList();
        const response = await api.get(`${path}?${queryString}`);

        this.options.speakers = response.data.speaker_list.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
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
