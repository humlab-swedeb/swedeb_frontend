<template>
  <div v-show="showData">
    <ShowData />
    <DataTable />
  </div>
</template>
<script setup>
import ShowData from "src/components/ShowData.vue";
import DataTable from "src/components/dataTable.vue";
import { dataStore } from "src/stores/dataStore.js";
import { ref, watchEffect } from "vue";
const store = dataStore();
const showData = ref(false);

watchEffect(() => {
  // Gemensam logik för att hantera showData
  if (store.submitEvent) {
    showData.value = true;
  }
});
</script>
