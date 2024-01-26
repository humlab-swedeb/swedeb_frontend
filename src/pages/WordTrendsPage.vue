<template>
  <div v-show="showData">
    <ShowData />
    <br />
    <DataTable />
  </div>
</template>
<script setup>
import ShowData from "src/components/ShowData.vue";
import DataTable from "src/components/dataTable.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { ref, watchEffect } from "vue";
const store = metaDataStore();
const showData = ref(false);

watchEffect(() => {
  // Gemensam logik för att hantera showData
  if (store.submitEvent) {
    showData.value = true;
  }
});
</script>
