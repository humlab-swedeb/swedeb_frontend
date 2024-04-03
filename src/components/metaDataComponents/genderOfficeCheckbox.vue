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
    v-for="(value, key) in store.options[props.type]"
    :key="key"
    v-model="store.selected[props.type]"
    :val="key"
    :label="value"
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

const props = defineProps(["type"]);
</script>
