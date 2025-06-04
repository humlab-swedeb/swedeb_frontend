<template>
  <div class="row items-center justify-between q-py-none q-px-none">
    <q-item-label class="text-bold text-grey-9">
      {{ toggle_label + ":" }}
      <q-icon
        v-show="(props.type == 'chamber')"
        name="info_outline"
        color="accent"
        class="q-mb-md q-ml-xs"
      >
        <q-tooltip>{{ $t('tooltipChamber') }}</q-tooltip>
      </q-icon>
    </q-item-label>

    <q-toggle
      class="q-mr-lg"
      @click="setAllTrue(props.type)"
      v-model="store[`${props.type}Filter`]"
      color="accent"
      checked-icon="check"
      unchecked-icon="close"
      keep-color
    />
  </div>
  <q-checkbox
    v-for="(value, key) in store.options[props.type]"
    :key="key"
    :val="key"
    :label="value.displayStr === 'Sveriges riksdag' ? 'Enkammare' : value.displayStr"
    class="q-ml-md"
    size="sm"
    :color="!store[`${props.type}Filter`] ? 'grey' : 'accent'"
    :disable="!store[`${props.type}Filter`]"
    :model-value="isSelected(key)"
    @update:model-value="toggleSelection(key)"
  />
</template>

<script setup>
import { metaDataStore } from "src/stores/metaDataStore.js";
import { defineProps } from "vue";
const store = metaDataStore();

const props = defineProps(["type", "toggle_label"]);

const setAllTrue = (type) => {
  // When toggled, all options are always selected
  store.selected[type] = Object.keys(store.options[type]);
};


const isSelected = (key) => store.selected[props.type].includes(key);

const toggleSelection = (key) => {
  if (isSelected(key)) {
    store.selected[props.type] = store.selected[props.type].filter((item) => item !== key);
  } else {
    store.selected[props.type] = [...store.selected[props.type], key];
  }
};
</script>
