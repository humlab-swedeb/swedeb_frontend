<template>
  <p caption>
    {{ $t("nrOfWordsIntro") }}
  </p>
  <q-card-section horizontal class="">
    <q-input
      v-model="kwicStore.wordsLeft"
      outlined
      label="Vänster"
      type="number"
      class="bg-white"
      color="accent"
      max="10"
      min="0"
    >
      <template v-slot:prepend>
        <q-icon name="chevron_left" color="accent" size="sm" />
      </template>
    </q-input>

    <q-item-label class="q-ma-none q-pa-md text-bold">{{
      $t("nrOfWordsSearch")
    }}</q-item-label>

    <q-input
      v-model="kwicStore.wordsRight"
      outlined
      label="Höger"
      type="number"
      class="bg-white"
      color="accent"
      max="10"
      min="0"
    >
      <template v-slot:append>
        <q-icon name="chevron_right" color="accent" size="sm" />
      </template>
    </q-input>
  </q-card-section>
</template>

<script setup>
import { kwicDataStore } from "src/stores/kwicDataStore.js";
const kwicStore = kwicDataStore();
</script>
