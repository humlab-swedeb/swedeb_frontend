<!-- src/components/ApiTest.vue -->

<template>
  <q-btn @click="store.fetchData(test)" color="primary" class="q-ma-lg">
    Fetch Data
  </q-btn>
</template>

<script setup>
import { dataStore } from "src/stores/dataStore.js";
const store = dataStore();
const test = "/speakers";
</script>
