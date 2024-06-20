<template>
  <q-card flat class="q-pa-md background">
    <div class="word-trends-intro lineHeight" v-html="formattedIntro"></div>
    <div v-show="showData">
      <ShowData :filterSelections="'Ngrams'"/>
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
import { kwicDataStore } from "src/stores/kwicDataStore";
import loadingIcon from "src/components/loadingIcon.vue";

const intro = i18n.ngramIntro;
const formattedIntro = intro;
const metaStore = metaDataStore();
const nGramStore = nGramDataStore();
const kwicStore = kwicDataStore();

const loading = ref(false);
const showData = ref(false);

watchEffect(async () => {
  if (metaStore.submitEventNgrams) {
    showData.value = false;
    loading.value = true;
    await nGramStore.getNGramsResult(kwicStore.searchText);
    showData.value = true;
    loading.value = false;
    metaStore.cancelSubmitNgramsEvent();

  }
});
</script>
