<template>
  <q-item-label class="text-bold">{{ $t("year") + ":" }}</q-item-label>
  <q-list>
    <q-item class="q-px-none">
      <q-item-label>{{ $t("yearRangeMin") }}</q-item-label>
      <q-range
        v-model="store.selected.yearRange"
        :min="1920"
        :max="2020"
        label-always
        class="q-mt-md q-mb-lg"
        switch-label-side
      />
      <q-item-label>{{ $t("yearRangeMax") }}</q-item-label>
    </q-item>
  </q-list>
</template>

<script setup>
import { dataStore } from "src/stores/dataStore.js";
const store = dataStore();
</script>
