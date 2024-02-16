<template>
  <q-card flat class="q-pa-md">
    <div class="word-trends-intro text-grey-8" v-html="formattedIntro"></div>
  </q-card>

  <div v-show="showData">
    <ShowData />
    <br />
  </div>
  <q-tabs
    v-model="tabs"
    inline-label
    no-caps
    active-color="accent"
    align="justify"
  >
    <q-tab name="diagram" icon="show_chart" label="Diagram" />
    <q-tab name="table" icon="table_view" label="Tabell" />
    <q-tab name="speech" icon="groups" label="Anföranden" />
  </q-tabs>

  <q-tab-panels v-model="tabs">
    <q-tab-panel name="diagram">
      <div>diagram</div>

      <lineChart v-show="showData" />
    </q-tab-panel>
    <q-tab-panel name="table">
      <div>tabell</div>
      <wordTrendsCountTable v-show="showData" />
    </q-tab-panel>
    <q-tab-panel name="speech">
      <div>anföranden</div>
      <!-- <wordTrendsSpeechTable v-show="showData" /> -->

      <speechDataTable type="wordTrends" v-show="showData" />
    </q-tab-panel>
  </q-tab-panels>
</template>
<script setup>
import ShowData from "src/components/ShowData.vue";
import lineChart from "src/components/lineChart.vue";
import wordTrendsCountTable from "src/components/wordTrendsCountTable.vue";
import speechDataTable from "src/components/speechDataTable.vue";
import wordTrendsSpeechTable from "src/components/wordTrendsSpeechTable.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import { ref, watchEffect } from "vue";
import i18n from "src/i18n/sv";
const store = metaDataStore();
const wtStore = wordTrendsDataStore();
const showData = ref(false);

const tabs = ref("speech");

const intro = i18n.wordTrendsIntro;
const formattedIntro = intro;

watchEffect(async () => {
  if (store.submitEvent && store.updateEvent) {
    await wtStore.getWordTrendsResult(wtStore.searchText);
    await wtStore.getWordTrendsSpeeches(wtStore.searchText);
    showData.value = true;
  }
});
</script>

<style scoped></style>
