<template>
  <q-item-label class="text-bold">{{ $t(`${props.type}`) + ":" }}</q-item-label>
  <q-toggle
    @click="setAllTrue(props.type)"
    v-model="store[`${props.type}Filter`]"
    :label="toggle_label"
    color="accent"
  />
  <br />
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
    @update:modelValue="handleCheckboxChange($event, key);"
  />
</template>

<script setup>
import { metaDataStore } from "src/stores/metaDataStore.js";
import { defineProps } from "vue";
const store = metaDataStore();

const props = defineProps(["type", "toggle_label"]);
const disable = !store[`${props.type}Filter`]

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
