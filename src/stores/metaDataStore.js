import { defineStore } from "pinia";
import { api } from "boot/axios";
import i18n from "src/i18n/sv/index.js";

export const metaDataStore = defineStore("metaDataStore", {
  state: () => ({
    data: null,
    mobilePopup: false,

    options: {
      party: {},
      gender: {},
      office: [],
      subOffice: [],
      speakers: [],
      chamber: [],
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
      chamber: [],
      yearRange: {
        min: 0,
        max: 0,
      },
    },

    genderFilter: false,
    partyFilter: false,
    chamberFilter: false,

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
    selectedWithOnlyValidSpeakers() {
      return {
        ...this.selected,
        speakers: this.filterSelectedSpeakers(this.selected.speakers),
      };
    },

    saveKwicFilterData(search) {
      this.filterAtSearchKWIC = { ...this.selectedWithOnlyValidSpeakers() };
      this.filterAtSearchKWIC["search"] = search;
    },

    saveWTFilterData(search) {
      this.filterAtSearchWT = { ...this.selectedWithOnlyValidSpeakers() };
      this.filterAtSearchWT["search"] = search;
    },

    saveSpeechesFilterData() {
      this.filterAtSearchSpeeches = { ...this.selectedWithOnlyValidSpeakers() };
    },

    saveNgramsFilterData(search) {
      this.filterAtSearchNgrams = { ...this.selectedWithOnlyValidSpeakers() };
      this.filterAtSearchNgrams["search"] = search;
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
        chamber: [],
        yearRange: {
          min: this.options.yearRange.min,
          max: this.options.yearRange.max,
        },
      };

      this.selected.gender = Object.keys(this.options.gender);
      this.selected.chamber = Object.keys(this.options.chamber);
      this.genderFilter = false;
      this.chamberFilter = false;
    },

    async fetchAllMetaData() {
      // to load all metadata on mount
      this.getYearOptions();
      this.getPartyOptions();
      this.getOfficeOptions();
      this.getGenderOptions();
      this.getSpeakersOptions();
      this.getChamberOptions();
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
        // Get the list of valid speaker IDs from options.speakers
        const validSpeakerIds = this.options.speakers.map(
          (speaker) => speaker.person_id
        );

        // Filter the selected speakers to include only those with valid IDs
        this.selected.speakers
          .filter((speaker) => validSpeakerIds.includes(speaker.person_id))
          .forEach((speaker) =>
            selected_params.append("who", speaker.person_id)
          );
      }
    },

    genderToText(gender_id) {
      return this.options.gender[gender_id];
    },

    addChamberParam(selected_params) {
      if (this.selected.chamber.length > 0) {
        this.selected.chamber.forEach((chamber) =>
          selected_params.append(
            "chamber_abbrev",
            this.options.chamber[chamber].chamber_abbrev.toLowerCase()
          )
        );
      }
    },

    getMetaRow(metadata_variable, metadata_variable_name) {
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

    getValidSpeakerIds() {
      return this.options.speakers.map((speaker) => speaker.person_id);
    },

    filterSelectedSpeakers(selectedSpeakers) {
      return selectedSpeakers.filter((speaker) =>
        this.getValidSpeakerIds().includes(speaker.person_id)
      );
    },

    selectedMetadataToText(tool_type) {
      // String representation of selected metadata to be included in downloads

      const selected_metadata = this.getSelectedAtSearchMetadata(tool_type);
      const selected_years_start = selected_metadata.yearRange.min;
      const selected_years_end = selected_metadata.yearRange.max;
      const year_string = `${i18n.yearInterval}: ${selected_years_start} - ${selected_years_end}`;

      const selected_parties = this.getMetaRow(
        selected_metadata.party,
        `${i18n.parties}`
      );

      const selectedValidSpeakers = this.filterSelectedSpeakers(
        selected_metadata.speakers
      );

      const selected_speakers_as_string = selectedValidSpeakers.map((speaker) =>
        this.getSpeakerAsString(speaker)
      );
      const selected_speakers = this.getMetaRow(
        selected_speakers_as_string,
        `${i18n.speakers}`.toLowerCase()
      );

      const selected_chambers_as_string = selected_metadata.chamber.map(
        (chamber) => this.options.chamber[chamber].displayStr
      );

      const selected_genders_as_string = selected_metadata.gender.map(
        (gender) => this.options.gender[gender].displayStr
      );

      const selected_genders = this.getMetaRow(
        selected_genders_as_string,
        `${i18n.gender}`.toLowerCase()
      );

      const selected_chambers = this.getMetaRow(
        selected_chambers_as_string,
        `${i18n.chamber}`.toLowerCase()
      );

      const selected_terms = this.getSearchTermsAsString(
        selected_metadata.search
      );
      const corpus_version = i18n.downLoadInfo.corpus_version;
      const swerik_ref = i18n.downLoadInfo.swerik_ref;
      const swerik_persons = i18n.downLoadInfo.swerik_persons;
      const swedeb_ref = i18n.downLoadInfo.swedeb_ref;

      return `${selected_speakers}\n${selected_parties}\n${selected_genders}\n${selected_chambers}\n${year_string}\n${selected_terms}\n${corpus_version}\n${swerik_ref}\n${swerik_persons}\n${swedeb_ref}`;
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
      if (this.chamberFilter) {
        this.addChamberParam(searchParams);
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
      this.addChamberParam(searchParams);
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
        .sort((a, b) => a.party_id - b.party_id)
        .reduce((acc, party) => {
          party.party =
            party.party === "Okänt" ? "Metadata saknas" : party.party; // QUICK FIX OF OKÄNT TO METADATA SAKNAS!
          acc[party.party] = {
            party_id: party.party_id,
            party_abbrev: party.party_abbrev,
            party_color: party.party_color,
          };
          return acc;
        }, {});
    },

    async getChamberOptions() {
      const path = "/metadata/chambers";
      const response = await api.get(path);
      this.options.chamber = response.data.chamber_list.reduce(
        (acc, chamber) => {
          acc[chamber.chamber_id] = {
            displayStr: chamber.chamber,
            chamber_abbrev: chamber.chamber_abbrev,
          };
          return acc;
        },
        {}
      );
      this.selected.chamber = Object.keys(this.options.chamber);
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
        acc[gender.gender_id] = {
          displayStr:
            gender.gender === "Okänt" ? "Metadata saknas" : gender.gender, // QUICK FIX OF OKÄNT TO METADATA SAKNAS!
        };
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

        this.options.speakers = response.data.speaker_list
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((speaker) => ({
            ...speaker,
            name: speaker.name === "Okänd" ? "Metadata saknas" : speaker.name, // QUICK FIX OF OKÄND TO METADATA SAKNAS!
          }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
});
