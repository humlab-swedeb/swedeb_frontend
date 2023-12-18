<template>
  <q-item-label class="text-bold">{{ $t(`${props.type}`) }}</q-item-label>
  <q-select
  dense
    multiple
    clearable
    v-model="store.selected[props.type]"
    :options="store.options[props.type]"
    label="PARTI"
    use-chips
    filled
    bg-color="grey-1"
    color="primary"
    class="q-my-lg"
  >
    <template v-slot:selected-item="select">
      <q-chip
        v-if="store.selected[props.type]"
        square
        removable
        @remove="select.removeAtIndex(select.index)"
      >
        {{ select.opt }}
      </q-chip>
    </template>
  </q-select>
</template>

<script setup>
import { dataStore } from "src/stores/dataStore.js";
const store = dataStore();
store.getpartyOptions();
store.getspeakersOptions();
const props = defineProps(["type"]);
</script>
<!-- <template>
  <q-item-label class="text-bold">Parti:</q-item-label>
  <q-select
    multiple
    clearable
    v-model="store.selected.party"
    :options="store.options.party"
    label="Parti"
    use-chips
    filled
    bg-color="grey-1"
    color="primary"
    class="q-my-lg"
  >
    <template v-slot:selected-item="select">
      <q-chip
        v-if="store.selected.party"
        square
        removable
        @remove="select.removeAtIndex(select.index)"
      >
        {{ select.opt }}
      </q-chip>
    </template>
  </q-select>
</template>

<script setup>
import { dataStore } from "src/stores/dataStore.js";
const store = dataStore();
store.getpartyOptions();
</script>
 -->
