<template>
  <div
    v-for="option in nGramStore.placingOptions"
    :key="option"
    class="q-pa-sm row items-center"
  >
    <q-radio
      dense
      v-model="nGramStore.placingSelected"
      :val="option"
      color="accent"
      @click="toggleSelected(option)"
    />
    <!--
 -->
    <q-item-label class="q-ml-sm">{{ option }}</q-item-label>
  </div>
</template>

<script setup>
import { nGramDataStore } from "src/stores/nGramDataStore";
import { ref, watch, onMounted } from "vue";

const lastSelected = ref("");

onMounted(() => {
  watch(
    () => nGramStore.placingSelected,
    (newVal, oldVal) => {
      if (newVal === oldVal) {
        nGramStore.placingSelected = "";
      } else {
        lastSelected.value = newVal;
      }
    }
  );
});

function toggleSelected(option) {
  if (lastSelected.value === option) {
    nGramStore.placingSelected = "";
  } else {
    nGramStore.placingSelected = option;
  }
}

const nGramStore = nGramDataStore();
</script>
