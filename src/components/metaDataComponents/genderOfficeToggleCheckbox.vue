<template>
  <div class="row items-center justify-between">
    <q-item-label class="text-bold text-grey-9">
      {{ toggle_label + ":" }}</q-item-label
    >

    <q-toggle
      class="q-mr-lg"
      @click="setAllTrue(props.type)"
      v-model="store[`${props.type}Filter`]"
      :label="store[`${props.type}Filter`] ? 'Ja' : 'Nej'"
      color="accent"
      checked-icon="check"
      unchecked-icon="close"
    />
  </div>
  <q-checkbox
    v-for="(value, key) in store.options[props.type]"
    :key="key"
    :val="key"
    :label="value"
    class="q-ml-md"
    size="sm"
    color="accent"
    :disable="!store[`${props.type}Filter`]"
    :modelValue="store.selected[props.type].includes(key)"
    @update:modelValue="handleCheckboxChange($event, key)"
  />
</template>

<script setup>
import { metaDataStore } from "src/stores/metaDataStore.js";
import { defineProps } from "vue";
const store = metaDataStore();

const props = defineProps(["type", "toggle_label"]);
const disable = !store[`${props.type}Filter`];

const setAllTrue = (type) => {
  // When toggled, all options are always selected
  store.selected[type] = Object.keys(store.options[type]);
};

const handleCheckboxChange = (checked, key) => {
  if (checked) {
    if (!store.selected[props.type].includes(key)) {
      store.selected[props.type].push(key);
    }
  } else {
    const index = store.selected[props.type].indexOf(key);
    if (index > -1) {
      store.selected[props.type].splice(index, 1);
    }
  }
};
</script>
