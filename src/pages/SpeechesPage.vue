<template>
  <div v-show="showData">
    <SpeechDataTable type="speeches" />
  </div>
</template>

<script setup>
import SpeechDataTable from "src/components/speechDataTable.vue";
import { metaDataStore } from "src/stores/metaDataStore";
import { ref, watchEffect } from "vue";

const metaStore = metaDataStore();
const showData = ref(false);

watchEffect(() => {
  if (metaStore.submitEvent) {
    showData.value = true;
  }
});
</script>
