<template>
  <q-card flat class="q-pa-md background">
    <div class="word-trends-intro text-grey-8" v-html="formattedIntro"></div>
    <div v-show="showData">
      <ShowData />
    </div>
    <loadingIcon v-if="loading" size="100" />
    <nGramsTable v-else v-show="showData" />
  </q-card>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import i18n from "src/i18n/sv";
import nGramsTable from "src/components/nGramsTable.vue";
import ShowData from "src/components/ShowData.vue";
import { metaDataStore } from "src/stores/metaDataStore";
import { nGramDataStore } from "src/stores/nGramDataStore";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import loadingIcon from "src/components/loadingIcon.vue";

const intro = i18n.ngramIntro;
const formattedIntro = intro;
const metaStore = metaDataStore();
const nGramStore = nGramDataStore();
const wtStore = wordTrendsDataStore();

const loading = ref(false);
const showData = ref(false);

watchEffect(async () => {
  if (metaStore.submitEvent && metaStore.updateEvent) {
    loading.value = true;
    const textString = wtStore.generateStringOfSelected();
    await nGramStore.getNGramsResult(textString);
    showData.value = true;
    loading.value = false;
  }
});
</script>
