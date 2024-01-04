<template>
  <q-item-label class="text-bold">{{ $t(`${props.type}`) + ":" }}</q-item-label>
  <q-checkbox
    @click="store.selectAll(props.type)"
    v-model="store[`${props.type}AllSelect`]"
    label="Välj alla"
  />
  <br />
  <q-checkbox
    v-for="o in store.options[props.type]"
    :key="o"
    v-model="store.selected[props.type]"
    :val="o"
    :label="o"
    class="q-ml-md"
    size="sm"
    @click="store.ifAllSelected(props.type)"
  />
</template>

<script setup>
import { dataStore } from "src/stores/dataStore.js";
const store = dataStore();
const props = defineProps(["type"]);
</script>
