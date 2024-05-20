<template>
  <div
    v-for="option in nGramStore.placingOptions"
    :key="option"
    class="q-pa-sm row items-center"
  >
    <q-radio
      dense
      v-model="nGramStore.placingSelected"
      :val="option"
      color="accent"
    />
    <q-item-label class="q-ml-sm">{{ option }}</q-item-label>
  </div>
</template>

<script setup>
import { nGramDataStore } from "src/stores/nGramDataStore";

const nGramStore = nGramDataStore();
</script>
