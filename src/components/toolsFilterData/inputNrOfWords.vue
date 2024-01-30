<template lang="">
  <p caption class="q-my-sm">
    Välj hur många ord som ska visas till vänster och höger om sökorden
  </p>
  <q-card-section horizontal class="">
    <q-input
      v-model="kwicStore.wordsLeft"
      outlined
      label="Vänster"
      type="number"
      class="bg-white"
    >
      <template v-slot:prepend>
        <q-icon name="chevron_left" color="accent" size="sm" />
      </template>
    </q-input>

    <q-item-label class="q-ma-none q-pa-md text-bold">Sökord</q-item-label>

    <q-input
      v-model="kwicStore.wordsRight"
      outlined
      label="Höger"
      type="number"
      class="bg-white"
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
