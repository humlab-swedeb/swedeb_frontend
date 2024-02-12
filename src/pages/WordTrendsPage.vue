<template>
  <q-card flat class="q-pa-md">
    <div class="word-trends-intro text-grey-8" v-html="formattedIntro"></div>
  </q-card>

  <div v-show="showData">
    <ShowData />
    <br />
    <DataTable />
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
    </q-tab-panel>
    <q-tab-panel name="table">
      <div>tabell</div>
    </q-tab-panel>
    <q-tab-panel name="speech">
      <div>anföranden</div>
    </q-tab-panel>
  </q-tab-panels>
</template>
<script setup>
import ShowData from "src/components/ShowData.vue";
import DataTable from "src/components/dataTable.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { ref, watchEffect } from "vue";
import i18n from "src/i18n/sv";
const store = metaDataStore();
const showData = ref(false);

const tabs = ref("diagram");

const intro = i18n.wordTrendsIntro;
const formattedIntro = intro;

watchEffect(() => {
  // Gemensam logik för att hantera showData
  if (store.submitEvent) {
    showData.value = true;
  }
});
</script>

<style scoped></style>
