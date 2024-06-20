import { defineStore } from "pinia";
import { api } from "boot/axios";
import i18n from "src/i18n/sv/index.js";

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
      genderList: [],
      office: [],
      subOffice: [],
      speakers: [],
      yearRange: {
        min: 0,
        max: 0,
      },
    },

    genderFilter: false,
    partyFilter: false,

    submitEventKWIC: false,
    submitEventWT: false,
    submitEventSpeeches: false,
    submitEventNgrams: false,

    filterAtSearchKWIC: undefined,
    filterAtSearchWT: undefined,
    filterAtSearchSpeeches: undefined,
    filterAtSearchNgrams: undefined,
  }),

  actions: {

    saveKwicFilterData(search){
      this.filterAtSearchKWIC = {...this.selected}
      this.filterAtSearchKWIC['search'] = search
    },

    saveWTFilterData(search){
      this.filterAtSearchWT = {...this.selected}
      this.filterAtSearchWT['search'] = search
    },

    saveSpeechesFilterData(){
      this.filterAtSearchSpeeches = {...this.selected}
    },

    saveNgramsFilterData(){
      this.filterAtSearchNgrams = {...this.selected}
    },


    setSubmitNgramsEvent() {
      this.submitEventNgrams = true;
    },
    cancelSubmitNgramsEvent() {
      this.submitEventNgrams = false;
    },

    setSubmitSpeechesEvent() {
      this.submitEventSpeeches = true;
    },
    cancelSubmitSpeechesEvent() {
      this.submitEventSpeeches = false;
    },

    setSubmitKwicEvent() {
      this.submitEventKWIC = true;
    },
    cancelSubmitKwicEvent() {
      this.submitEventKWIC = false;
    },

    setSubmitWTEvent() {
      this.submitEventWT = true;
    },
    cancelSubmitWTEvent() {
      this.submitEventWT = false;
    },

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

      this.selected.gender = Object.keys(this.options.gender);
      this.genderFilter = false;
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

    getSearchTermsAsString(searchTerms) {
      if (searchTerms === undefined || searchTerms === "") {
        return "";
      } else {
        return `Sökord: ${searchTerms}`;
      }
    },

    getSelectedAtSearchMetadata(tool_type) {
      switch (tool_type) {
        case "kwic":
          return this.filterAtSearchKWIC;
        case "wordTrends":
          return this.filterAtSearchWT;
        case "speeches":
          return this.filterAtSearchSpeeches;
        case "ngrams":
          return this.filterAtSearchNgrams;
        default:
          return this.selected;
      }


    },

    selectedMetadataToText(searchTerms, tool_type) {


      const selected_metadata = this.getSelectedAtSearchMetadata(tool_type);


      // String representation of selected metadata to be included in downloads
      const selected_years_start = selected_metadata.yearRange.min;
      const selected_years_end = selected_metadata.yearRange.max;
      const year_string = `Årsintervall: ${selected_years_start} - ${selected_years_end}`;

      const selected_parties = this.getMetarRow(selected_metadata.party, "partier");
      const selected_speakers_as_string = selected_metadata.speakers.map(
        (speaker) => this.getSpeakerAsString(speaker)
      );
      const selected_speakers = this.getMetarRow(
        selected_speakers_as_string,
        "talare"
      );
      const selected_genders_as_string = selected_metadata.gender.map(
        (gender) => this.options.gender[gender]
      );

      const selected_genders = this.getMetarRow(
        selected_genders_as_string,
        "kön"
      );
      const selected_terms = this.getSearchTermsAsString(selected_metadata.search);
      const corpus_version = i18n.downLoadInfo.corpus_version;
      const swerik_ref = i18n.downLoadInfo.swerik_ref;
      const swedeb_ref = i18n.downLoadInfo.swedeb_ref;

      return `${selected_speakers}\n${selected_parties}\n${selected_genders}\n${year_string}\n${selected_terms}\n${corpus_version}\n${swerik_ref}\n${swedeb_ref}`;
    },

    getSelectedParams(additional_params = {}) {
      const searchParams = new URLSearchParams();

      for (const key in additional_params) {
        searchParams.append(key, additional_params[key]);
      }

      this.addPartyParam(searchParams);
      this.addSpeakerParam(searchParams);
      if (this.genderFilter) {
        this.addParamArray("gender", "gender_id", searchParams);
      }
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

    getPartyNameColor(party_name) {
      if (!this.options.party.hasOwnProperty(party_name)) {
        return "#808080";
      }
      return this.options.party[party_name].party_color || "#808080";
    },
    getPartyAbbrevColor(party_abbrev) {
      for (const party in this.options.party) {
        if (this.options.party[party].party_abbrev === party_abbrev) {
          return this.options.party[party].party_color || "#808080";
        }
      }
      return "#808080";
    },

    async getPartyOptions() {
      const path = "/metadata/parties";
      const response = await api.get(path);

      this.options.party = response.data.party_list
        .sort((a, b) => a.party_abbrev.localeCompare(b.party))
        .reduce((acc, party) => {
          acc[party.party] = {
            party_id: party.party_id,
            party_abbrev: party.party_abbrev,
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
      this.selected.gender = Object.keys(this.options.gender);
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
  },
});
