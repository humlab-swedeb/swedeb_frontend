<template>
  <q-card flat class="q-pa-md">
    <div class="word-trends-intro text-grey-8" v-html="formattedIntro"></div>
  </q-card>
  <div v-show="showData">
    <SpeechDataTable type="speeches" />
  </div>
</template>

<script setup>
import SpeechDataTable from "src/components/speechDataTable.vue";
import { metaDataStore } from "src/stores/metaDataStore";
import { ref, watchEffect } from "vue";
import i18n from "src/i18n/sv";

const intro = i18n.speechesIntro;
const formattedIntro = intro;

const metaStore = metaDataStore();
const showData = ref(false);

watchEffect(() => {
  if (metaStore.submitEvent) {
    showData.value = true;
  }
});
</script>
