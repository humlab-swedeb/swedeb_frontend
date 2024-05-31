<template>
  <q-item-label caption class="text-bold q-mb-sm q-mt-lg">
    {{ $t("nrOfWordsIntro") }}
  </q-item-label>
  <q-card-section horizontal class="row justify-between q-pa-none">
    <div class="col">
      <q-input
        v-model="kwicStore.wordsLeft"
        outlined
        label="Vänster"
        type="number"
        class="bg-white"
        color="accent"
        max="20"
        min="0"
      >
      </q-input>
    </div>
      <q-item-label class="q-ma-none q-pa-md text-bold">{{
        $t("nrOfWordsSearch")
      }}</q-item-label>
    <div class="col">
      <q-input
        v-model="kwicStore.wordsRight"
        outlined
        label="Höger"
        type="number"
        class="bg-white"
        color="accent"
        max="20"
        min="0"
      >
      </q-input>
    </div>
  </q-card-section>
</template>

<script setup>
import { kwicDataStore } from "src/stores/kwicDataStore.js";
const kwicStore = kwicDataStore();
</script>
