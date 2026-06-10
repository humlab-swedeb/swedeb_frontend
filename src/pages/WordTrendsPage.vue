<template>
  <q-card flat class="q-px-md background q-pt-sm q-pb-md">
    <q-item-label class="text-h6 q-pb-sm q-pt-none">{{
      $t("wordTrendsIntroTitle")
    }}</q-item-label>
    <i18n-t keypath="wordTrendsIntro" tag="div" class="word-trends-intro lineHeight">
      <template #filterText>
        <b>"{{ $t("filterOnMetadata") }}"</b>
      </template>
      <template #searchExample5>
        <code>{{ $t("searchExample5") }}</code>
      </template>
      <template #searchExample3>
        <code>{{ $t("searchExample3") }}</code>
      </template>
      <template #serachExample4>
        <code>{{ $t("serachExample4") }}</code>
      </template>
    </i18n-t>
  </q-card>

  <div v-show="showData">
    <ShowData :filterSelections="'WordTrends'" />
    <br />
  </div>
  <q-tabs
    v-model="tabs"
    inline-label
    no-caps
    active-color="accent"
    align="justify"
    class="q-mt-lg"
  >
    <q-tab name="diagram" icon="show_chart" label="Trendlinje" />
    <q-tab name="table" icon="table_view" label="Tabell" />
    <q-tab name="speech" icon="groups" label="Anföranden" />
  </q-tabs>

  <q-tab-panels v-model="tabs" class="background">
    <q-tab-panel name="diagram">
      <div class="q-py-md text-grey-8">
        <i18n-t keypath="wordtrendsResultInfo" tag="span">
          <template #resultType>
            <b>{{ $t("wordtrendsResultLine") }}</b>
          </template>
        </i18n-t>
      </div>
      <loadingIcon v-if="loadingChart" size="100" />
      <lineChart v-else-if="showDataTable" />
    </q-tab-panel>
    <q-tab-panel name="table">
      <div class="q-py-md text-grey-8">
        <i18n-t keypath="wordtrendsResultInfo" tag="span">
          <template #resultType>
            <b>{{ $t("wordtrendsResultTable") }}</b>
          </template>
        </i18n-t>
      </div>
      <loadingIcon v-if="loadingChart" size="100" />
      <div v-else-if="showDataTable">
        <wordTrendsCountTable />
      </div>
    </q-tab-panel>
    <q-tab-panel name="speech">
      <div class="q-py-md text-grey-8">
        <i18n-t keypath="wordtrendsResultSpeechInfo" tag="span">
          <template #resultType>
            <b>{{ $t("wordtrendsResultSpeech") }}</b>
          </template>
        </i18n-t>
      </div>
      <loadingIcon v-if="loadingSpeeches" size="100" />
      <wordTrendsSpeechTable v-else />
    </q-tab-panel>
  </q-tab-panels>
</template>
<script setup>
import ShowData from "src/components/ShowData.vue";
import lineChart from "src/components/lineChart.vue";
import wordTrendsCountTable from "src/components/wordTrendsCountTable.vue";
import wordTrendsSpeechTable from "src/components/wordTrendsSpeechTable.vue";
import loadingIcon from "src/components/loadingIcon.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import { ref, watch, onMounted } from "vue";

const store = metaDataStore();
const wtStore = wordTrendsDataStore();

const showData = ref(false);
const dataLoaded = ref(false);
const loadingChart = ref(false);
const loadingSpeeches = ref(false);
const showDataTable = ref(false);
const dataLoadedTable = ref(false);
const tabs = ref("diagram");

onMounted(() => {
  if (wtStore.wordTrends && wtStore.wordTrends.length > 0) {
    showDataTable.value = true;
    dataLoadedTable.value = true;
  }
  if (wtStore.speechesData && wtStore.speechesData.length > 0) {
    showData.value = true;
    dataLoaded.value = true;
  }
});

watch(
  () => store.submitEventWT,
  async (submitRequested) => {
    if (!submitRequested) {
      return;
    }

    loadingChart.value = true;
    loadingSpeeches.value = true;
    showData.value = false;
    showDataTable.value = false;

    const textString = wtStore.generateStringOfSelected().trim();

    if (!textString) {
      loadingChart.value = false;
      loadingSpeeches.value = false;
      store.cancelSubmitWTEvent();
      return;
    }

    const trendsPromise = wtStore.getWordTrendsResult(textString);
    const speechesPromise = wtStore.getWordTrendsSpeechesTicket(textString);

    showData.value = true;

    trendsPromise
      .then(() => {
        showDataTable.value = true;
        dataLoadedTable.value = true;
        loadingChart.value = false;
      })
      .catch((error) => {
        console.error("Error loading trends:", error);
        loadingChart.value = false;
      });

    speechesPromise
      .then(() => {
        dataLoaded.value = true;
        loadingSpeeches.value = false;
      })
      .catch((error) => {
        console.error("Error loading speeches:", error);
        loadingSpeeches.value = false;
      });

    try {
      await Promise.all([trendsPromise, speechesPromise]);
    } finally {
      store.cancelSubmitWTEvent();
    }
  },
);
</script>

<style scoped></style>
