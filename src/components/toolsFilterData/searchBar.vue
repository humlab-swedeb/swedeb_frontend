<template>
  <q-input
    v-model="kwicStore.searchText"
    rounded
    outlined
    clearable
    placeholder="T.ex klimat eller skola"
    label="Sök på ett ord"
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
import { store } from "quasar/wrappers";
import { kwicDataStore } from "src/stores/kwicDataStore";
import { metaDataStore } from "src/stores/metaDataStore";

const kwicStore = kwicDataStore();
const metaStore = metaDataStore();

const handleEnter = () => {
  if (!kwicStore.searchText.includes(",")) {

    metaStore.setSubmitEvent("searchBar kwic");
    metaStore.setUpdateEvent("searchBar kwic");
  }
};
</script>

<style scoped></style>
