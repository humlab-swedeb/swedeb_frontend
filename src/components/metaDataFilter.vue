<template>
  <div :style="$q.screen.lt.sm ? '90vw' : 'max-width: 400px'">
    <q-card class="q-mx-sm bg-grey-2">
      <q-card-section
        horizontal
        @click="showing = !showing"
        class="items-center q-pr-sm bg-white"
        :class="$route.path === '/tools/speeches' ? '' : 'cursor-pointer'"
      >
        <q-card-section class="text-subtitle1">
          <q-icon
            name="o_filter_alt"
            color="accent"
            size="sm"
            class="q-pr-sm"
          />
          {{ $t("metaDataFilter") }}</q-card-section
        >
        <q-space />
        <q-btn
          v-if="$route.path !== '/tools/speeches'"
          :aria-label="$t('accessibility.metadataFilter')"
          color="accent"
          round
          flat
          dense
          size="lg"
          :icon="showing ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        />
      </q-card-section>

      <!-- <q-slide-transition v-show="showing"> -->
      <q-slide-transition
        v-if="$route.path === '/tools/speeches' ? (showing = true) : showing"
      >
        <q-card-section class="q-px-md q-pt-none">
          <q-separator />
          <q-card-section class="q-px-none q-pb-none">
            <!-- PLACE METADATA FILTER COMPONENTS HERE -->
            <yearRange />
            <dropdownSelection type="party" />
            <!-- <q-card-section horizontal class="q-px-none"> -->
            <genderOfficeToggleCheckbox
              type="gender"
              :toggle_label="$t('toggleGenderLabel')"
            />
            <genderOfficeToggleCheckbox
              type="chamber"
              :toggle_label="$t('toggleChamberLabel')"
            />
            <!-- <genderOfficeCheckbox type="gender" /> -->
            <!-- <q-card-section class="q-py-none"> -->
            <!-- <genderOfficeCheckbox type="office" /> -->
            <!-- </q-card-section> -->
            <!-- </q-card-section> -->
            <!-- Do not show sub office type as of now -->
            <!-- <dropdownSelection type="subOffice" /> -->
            <dropdownSelection type="speakers" />
            <div class="column items-end">
              <q-btn
                v-if="hasSelections"
                @click="store.resetSelectedState"
                class="resetStyle col"
                flat
                no-caps
                :label="$t('clearFilter')"
                color="grey-7"
              >
              </q-btn>
            </div>
          </q-card-section>
        </q-card-section>
        <!--       </q-scroll-area>
      -->
      </q-slide-transition>
    </q-card>
    <q-card
      flat
      class="bg-transparent padding-bot"
      :class="$q.screen.lt.sm ? 'q-ma-xs' : 'q-ma-md'"
    >
      <toolsFilters />
      <div class="q-pa-lg full-width sticky-bottom">
        <!-- Search button for WORDTRENDS -->
        <q-btn
          v-if="$route.path === '/tools/wordtrends'"
          @click="handleSubmit"
          no-caps
          class="fit text-h6"
          color="accent"
          :label="$t('searchButton')"
          :disabled="
            wtStore.wordHitsSelected.length < 1 ||
            ($route.path === '/tools/wordtrends' &&
              wtStore.wordHitsSelected.some(
                (word) => word.includes(' ') || word.includes('*')
              ))
          "
        >
          <!-- tooltip to put in search words -->
          <q-tooltip
            v-if="wtStore.wordHitsSelected.length < 1"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            {{ $t("searchTooltipWordtrends") }}
          </q-tooltip>
          <!-- Tooltip if user puts in sentence -->
          <q-tooltip
            v-if="
              $route.path === '/tools/wordtrends' &&
              wtStore.wordHitsSelected.some(
                (word) => word.includes(' ') || word.includes('*')
              )
            "
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            {{ $t("searchTooltipWordtrendsError") }}<br /><br />
            <code>{{
              wtStore.wordHitsSelected.filter(
                (word) => word.includes(" ") || word.includes("*")
              )
            }}</code>
          </q-tooltip>
        </q-btn>

        <!-- Search button for KWIC -->
        <q-btn
          v-if="$route.path === '/tools/kwic'"
          @click="handleSubmit"
          no-caps
          class="fit text-h6"
          color="accent"
          :label="$t('searchButton')"
          :disabled="
            kwicStore.searchText.length < 1 ||
            kwicStore.searchText.includes(',')
          "
        >
          <!-- Tooltip for search for words or sentences -->
          <q-tooltip
            v-if="kwicStore.searchText.length < 1"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            {{ $t("searchTooltipKWIC_Ngram") }}
          </q-tooltip>

          <!-- Tooltip for only searching on one word or sentence at a time -->
          <q-tooltip
            v-if="kwicStore.searchText.includes(',')"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            {{ $t("searchTooltipKWICError") }}
          </q-tooltip>
        </q-btn>

        <!-- Search button for NGRAMS -->
        <q-btn
          v-if="$route.path === '/tools/ngram'"
          @click="handleSubmit"
          no-caps
          class="fit text-h6"
          color="accent"
          :label="$t('searchButton')"
          :disabled="
            ngramStore.searchText.length < 1 ||
            ngramStore.searchText.includes(',')
          "
        >
          <q-tooltip
            v-if="ngramStore.searchText.length < 1"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            {{ $t("searchTooltipKWIC_Ngram") }}
          </q-tooltip>
          <!-- Tooltip for only searching for one word at a time, or wildcard -->
          <q-tooltip
            v-if="ngramStore.searchText.includes(',')"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            {{ $t("searchTooltipNgramError") }}
          </q-tooltip>
        </q-btn>

        <!-- Search button for SPEECHES -->
        <q-btn
          @click="handleSubmit"
          no-caps
          class="fit text-h6"
          color="accent"
          :label="$t('searchButton')"
          v-else-if="$route.path === '/tools/speeches'"
        >
        </q-btn>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import yearRange from "src/components/metaDataComponents/yearRange.vue";
//import genderOfficeCheckbox from "src/components/metaDataComponents/genderOfficeCheckbox.vue";
import genderOfficeToggleCheckbox from "src/components/metaDataComponents/genderOfficeToggleCheckbox.vue";
import dropdownSelection from "./metaDataComponents/dropdownSelection.vue";
import toolsFilters from "./toolsFilters.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import { kwicDataStore } from "src/stores/kwicDataStore";
import { nGramDataStore } from "src/stores/nGramDataStore";
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { useGtag } from "vue-gtag-next";

const store = metaDataStore();
const wtStore = wordTrendsDataStore();
const kwicStore = kwicDataStore();
const ngramStore = nGramDataStore();

const showing = ref(false);
const route = useRoute();
const $q = useQuasar();
const { event } = useGtag();

const handleNormalizeData = (newValue) => {
  if (route.path === "/tools/wordtrends") {
    wtStore.normalizeResults = newValue;
  }
};

const lemmatizeSearch = (newValue) => {
  if (route.path === "/tools/kwic") {
    kwicStore.lemmatizeSearch = newValue;
  }
};

const handleSubmit = async () => {
  if (route.path === "/tools/kwic") {
    store.saveKwicFilterData(kwicStore.searchText);
    store.setSubmitKwicEvent();
    event("kwic_search", {
      event_category: "search",
      event_label: "KWIC-SÖK",
      value: 1,
    });
  } else if (route.path === "/tools/wordtrends") {
    const wordHitsString = wtStore.wordHitsSelected.join(", ");
    store.saveWTFilterData(wordHitsString);
    store.setSubmitWTEvent();
    event("wordtrend_search", {
      event_category: "search",
      event_label: "Wordtrends-SÖK",
      value: 1,
    });
  } else if (route.path === "/tools/speeches") {
    store.saveSpeechesFilterData();
    store.setSubmitSpeechesEvent();
    event("speeches_search", {
      event_category: "search",
      event_label: "Speeches-SÖK",
      value: 1,
    });
  } else if (route.path === "/tools/ngram") {
    store.saveNgramsFilterData();
    store.setSubmitNgramsEvent();
    event("ngram_search", {
      event_category: "search",
      event_label: "nGram-SÖK",
      value: 1,
    });
  } else {
    console.log("unknown route in handleSubmit, metadatafilter.vue");
  }
  if ($q.screen.lt.sm) {
    store.mobilePopup = false;
  }
};

const hasSelections = computed(() => {
  const { party, gender, office, subOffice, speakers } = store.selected;
  return (
    party.length > 0 ||
    gender.length > 0 ||
    office.length > 0 ||
    subOffice.length > 0 ||
    speakers.length > 0 ||
    store.genderFilter == true ||
    store.selected.yearRange.min !== store.options.yearRange.min ||
    store.selected.yearRange.max !== store.options.yearRange.max
  );
});
</script>

<style lang="scss" scoped>
.sticky-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, #e4e4eb, rgba(238, 238, 238, 0.5));
}

.padding-bot {
  padding-bottom: 80px;
}
</style>
