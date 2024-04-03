<template>
  <q-item-label class="text-bold">{{ $t("year") + ":" }}</q-item-label>
  <q-list>
    <q-item class="q-px-none">
      <q-item-label>{{ min }}</q-item-label>
      <q-range
        v-model="store.selected.yearRange"
        :min="min"
        :max="max"
        label-always
        class="q-mt-md q-mb-lg"
        switch-label-side
        color="accent"
      />
      <q-item-label>{{ max }}</q-item-label>
    </q-item>
  </q-list>
</template>

<script setup>
import { metaDataStore } from "src/stores/metaDataStore.js";
import { ref } from "vue";

const store = metaDataStore();

let min = ref(store.options.yearRange.min);
let max = ref(store.options.yearRange.max);


</script>
