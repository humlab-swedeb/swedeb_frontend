<template>
  <q-card flat class="q-px-md background text-grey-8 q-pt-sm q-pb-md">
    <q-item-label class="text-h6 q-pb-sm q-pt-none">{{
      $t("wordTrendsIntroTitle")
    }}</q-item-label>
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
    <q-tab name="diagram" icon="show_chart" label="Trendlinje" />
    <q-tab name="table" icon="table_view" label="Tabell" />
    <q-tab name="speech" icon="groups" label="Anföranden" />
  </q-tabs>

  <q-tab-panels v-model="tabs" class="background">
    <q-tab-panel name="diagram">
      <div class="q-py-md text-grey-8">
        Här visas resultatet i en <b>trendlinje</b> för de ord och metadata som
        valts.
      </div>
      <loadingIcon v-if="loading" size="100" />
      <lineChart v-else-if="showDataTable" />
    </q-tab-panel>
    <q-tab-panel name="table">
      <div class="q-py-md text-grey-8">
        Här visas resultatet i en <b>tabell</b> för de ord och metadata som
        valts.
      </div>
      <loadingIcon v-if="loading" size="100" />
      <div v-else-if="showDataTable">
        <wordTrendsCountTable />
      </div>
    </q-tab-panel>
    <q-tab-panel name="speech">
      <div class="q-py-md text-grey-8">
        Här visas alla <b>anföranden</b> i en tabell kopplat till de ord och
        metadata som valts.
      </div>
      <loadingIcon v-if="loading" size="100" />
      <div v-else v-show="showData">
        <speechDataTable type="wordTrends" :dataLoaded="dataLoaded" />
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>
<script setup>
import ShowData from "src/components/ShowData.vue";
import lineChart from "src/components/lineChart.vue";
import wordTrendsCountTable from "src/components/wordTrendsCountTable.vue";
import speechDataTable from "src/components/speechDataTable.vue";
import loadingIcon from "src/components/loadingIcon.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import { ref, watchEffect } from "vue";
import i18n from "src/i18n/sv";
const store = metaDataStore();
const wtStore = wordTrendsDataStore();

const showData = ref(false);
const dataLoaded = ref(false);

const showDataTable = ref(false);
const dataLoadedTable = ref(false);
const loading = ref(false);

const tabs = ref("diagram");

const intro = i18n.wordTrendsIntro;
const formattedIntro = intro;

watchEffect(async () => {
  if (store.submitEvent && store.updateEvent) {
    loading.value = true;
    const textString = wtStore.generateStringOfSelected();
    await wtStore.getWordTrendsResult(textString);
    showDataTable.value = true;
    dataLoadedTable.value = true;
    await wtStore.getWordTrendsSpeeches(textString);
    showData.value = true;
    dataLoaded.value = true;
    loading.value = false;
  }
});
</script>

<style scoped></style>
