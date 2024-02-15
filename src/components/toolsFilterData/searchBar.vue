<template>
  <q-input
    v-model="wtStore.searchText"
    rounded
    outlined
    clearable
    placeholder="T.ex klimat eller skola"
    label="Sök på ordtrender"
    bg-color="white"
    color="accent"
  >
    <template v-slot:prepend>
      <q-icon name="search" color="accent" />
    </template>
  </q-input>
</template>

<script setup>
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";

const wtStore = wordTrendsDataStore();
/* const props = defineProps({
  searchStore: Object,
  searchMethod: String,
});
props.searchStore[props.searchMethod](searchText.value); */
</script>
