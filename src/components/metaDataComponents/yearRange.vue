<template>
  <q-item-label class="text-bold">{{ $t("year") + ":" }}</q-item-label>
  <q-list>
    <q-item class="q-px-none">
      <q-item-label>{{ store.options.yearRange.min }}</q-item-label>
      <q-range
        v-model="store.selected.yearRange"
        :min="store.options.yearRange.min"
        :max="store.options.yearRange.max"
        label-always
        class="q-mt-md q-mb-lg"
        switch-label-side
        color="accent"
      />
      <q-item-label>{{ store.options.yearRange.max }}</q-item-label>
    </q-item>
  </q-list>
</template>

<script setup>
import { metaDataStore } from "src/stores/metaDataStore.js";

const store = metaDataStore();

</script>
