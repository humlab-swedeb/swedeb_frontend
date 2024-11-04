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
import { computed } from "vue";
import { kwicDataStore } from "src/stores/kwicDataStore";
import { metaDataStore } from "src/stores/metaDataStore";
import { nGramDataStore } from "src/stores/nGramDataStore";
import { useRoute } from "vue-router";

const kwicStore = kwicDataStore();
const metaStore = metaDataStore();
const nGramStore = nGramDataStore();
const route = useRoute();

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
    } else if (route.path === "/tools/ngram") {
      metaStore.saveNgramsFilterData(searchText.value);
      metaStore.setSubmitNgramsEvent();
    }
  }
};
</script>

<style scoped></style>
