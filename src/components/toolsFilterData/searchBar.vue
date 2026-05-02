<template>
  <q-input
    v-model="searchText"
    rounded
    outlined
    clearable
    placeholder="T.ex klimat eller skola"
    :label="$t('searchInput')"
    bg-color="white"
    color="accent"
    @clear="searchText = ''"
    @keydown.enter="handleEnter"
  >
    <template v-slot:prepend>
      <q-icon name="search" color="accent" />
    </template>
  </q-input>
</template>

<script setup>
import { computed, watch, onBeforeUnmount } from "vue";
import { kwicDataStore } from "src/stores/kwicDataStore";
import { metaDataStore } from "src/stores/metaDataStore";
import { nGramDataStore } from "src/stores/nGramDataStore";
import { useRoute } from "vue-router";
import { useGtagEvent } from "src/composables/useGtagEvent";

const kwicStore = kwicDataStore();
const metaStore = metaDataStore();
const nGramStore = nGramDataStore();
const route = useRoute();

const { gtagEvent } = useGtagEvent();

const searchText = computed({
  get() {
    return route.path === "/tools/kwic"
      ? kwicStore.searchText
      : nGramStore.searchText;
  },
  set(value) {
    if (route.path === "/tools/kwic") {
      kwicStore.searchText = value;
    } else {
      nGramStore.searchText = value;
    }
  },
});

const handleEnter = () => {
  if (!searchText.value.includes(",")) {
    if (route.path === "/tools/kwic") {
      metaStore.saveKwicFilterData(searchText.value);
      metaStore.setSubmitKwicEvent();
      gtagEvent("kwic_search", {
        event_category: "search",
        event_label: "KWIC-SÖK",
        value: 1,
      });
    } else if (route.path === "/tools/ngram") {
      metaStore.saveNgramsFilterData(searchText.value);
      metaStore.setSubmitNgramsEvent();
    }
  }
};

let estimateDebounceTimer = null;

watch(
  () => (route.path === "/tools/kwic" ? kwicStore.searchText : null),
  (newWord) => {
    if (route.path !== "/tools/kwic") return;
    clearTimeout(estimateDebounceTimer);
    kwicStore.estimatedHits = null;
    kwicStore.inVocabulary = null;
    if (!newWord || !newWord.trim()) {
      return;
    }
    estimateDebounceTimer = setTimeout(() => {
      if (route.path === "/tools/kwic") {
        kwicStore.fetchEstimate(newWord);
      }
    }, 400);
  },
);

watch(
  () => (route.path === "/tools/ngram" ? nGramStore.searchText : null),
  (newWord) => {
    if (route.path !== "/tools/ngram") return;
    clearTimeout(estimateDebounceTimer);
    nGramStore.clearEstimate();
    if (!nGramStore.canEstimateSearch(newWord)) {
      return;
    }
    estimateDebounceTimer = setTimeout(() => {
      if (route.path === "/tools/ngram") {
        nGramStore.fetchEstimate(newWord);
      }
    }, 400);
  },
);

watch(
  () => metaStore.getSelectedKwicTicketFilters(),
  () => {
    if (route.path === "/tools/kwic") {
      const word = kwicStore.searchText;
      if (!word || !word.trim()) return;
      clearTimeout(estimateDebounceTimer);
      estimateDebounceTimer = setTimeout(() => {
        if (route.path === "/tools/kwic") {
          kwicStore.fetchEstimate(word);
        }
      }, 400);
    } else if (route.path === "/tools/ngram") {
      const word = nGramStore.searchText;
      clearTimeout(estimateDebounceTimer);
      nGramStore.clearEstimate();
      if (!nGramStore.canEstimateSearch(word)) return;
      estimateDebounceTimer = setTimeout(() => {
        if (route.path === "/tools/ngram") {
          nGramStore.fetchEstimate(word);
        }
      }, 400);
    }
  },
  { deep: true },
);

onBeforeUnmount(() => {
  clearTimeout(estimateDebounceTimer);
});
</script>

<style scoped></style>
