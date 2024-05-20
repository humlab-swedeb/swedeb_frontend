<template>
  <q-input
    v-model="nGramStore.width"
    outlined
    label="N-Gram bredd"
    type="number"
    class="bg-white full-width"
    color="accent"
    max="20"
    min="1"
  />
</template>

<script setup>
import { nGramDataStore } from "src/stores/nGramDataStore.js";
const nGramStore = nGramDataStore();
</script>

<style scoped></style>
