<template>
  <q-input
    v-model="kwicStore.searchText"
    rounded
    outlined
    clearable
    placeholder="T.ex klimat eller skola"
    :label="$t('searchInput')"
    bg-color="white"
    color="accent"
    @clear="kwicStore.searchText = ''"
    @keydown.enter="handleEnter"
  >
    <template v-slot:prepend>
      <q-icon name="search" color="accent" />
    </template>
  </q-input>
</template>

<script setup>
import { kwicDataStore } from "src/stores/kwicDataStore";
import { metaDataStore } from "src/stores/metaDataStore";

const kwicStore = kwicDataStore();
const metaStore = metaDataStore();

const handleEnter = () => {
  if (!kwicStore.searchText.includes(",")) {
    metaStore.saveKwicFilterData(kwicStore.searchText);
    metaStore.setSubmitKwicEvent();
  }
};
</script>

<style scoped></style>
