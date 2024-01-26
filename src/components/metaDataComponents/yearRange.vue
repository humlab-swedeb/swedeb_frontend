<template>
  <q-item-label class="text-bold">{{ $t("year") + ":" }}</q-item-label>
  <q-list>
    <q-item class="q-px-none">
      <q-item-label>{{ $t("yearRangeMin") }}</q-item-label>
      <q-range
        v-model="store.selected.yearRange"
        :min="min"
        :max="max"
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
import { ref } from "vue";
const store = dataStore();

let min = ref(0);
let max = ref(0);

const getYearRange = async () => {
  min.value = await store.getStartYear();
  max.value = await store.getEndYear();
};

getYearRange();
</script>
