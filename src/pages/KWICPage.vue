<template>
  <q-card flat class="q-pa-md background">
    <div class="word-trends-intro text-grey-8" v-html="formattedIntro"></div>
  </q-card>
  <div v-show="showData">
    <div class="q-pb-md">
      <ShowData />
    </div>
    <kwicDataTable />
  </div>
</template>

<script setup>
import ShowData from "src/components/ShowData.vue";
import kwicDataTable from "src/components/kwicDataTable.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { kwicDataStore } from "src/stores/kwicDataStore";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import i18n from "src/i18n/sv";
import { ref, watchEffect } from "vue";

const metaStore = metaDataStore();
const kwicStore = kwicDataStore();
const wtStore = wordTrendsDataStore();

const intro = i18n.kwicIntro;
const formattedIntro = intro;

const showData = ref(false);

watchEffect(async () => {
  if (metaStore.submitEvent && metaStore.updateEvent) {
    const textString = wtStore.generateStringOfSelected();
    await kwicStore.getKwicResult(textString);
    showData.value = true;
  }
});
</script>
