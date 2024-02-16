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
    :rules="[(val) => val.length >= 1 || 'Sökordet måste vara minst 1 tecken']"
  >
    <template v-slot:prepend>
      <q-icon name="search" color="accent" />
    </template>
  </q-input>
</template>

<script setup>
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";

const wtStore = wordTrendsDataStore();
</script>
