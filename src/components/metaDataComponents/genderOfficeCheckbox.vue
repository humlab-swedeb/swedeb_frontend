<template>
  <q-item-label class="text-bold">{{ $t(`${props.type}`) + ":" }}</q-item-label>
  <q-checkbox
    @click="store.selectAll(props.type)"
    v-model="store[`${props.type}AllSelect`]"
    label="Välj alla"
    color="accent"
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
    color="accent"
    @click="store.ifAllSelected(props.type)"
  />
</template>

<script setup>
import { metaDataStore } from "src/stores/metaDataStore.js";
import { defineProps } from "vue";
const store = metaDataStore();
store.getOfficeOptions();
store.getGenderOptions();
const props = defineProps(["type"]);
</script>
