<template>
  <q-card flat class="q-px-md background q-pt-sm q-pb-md">
    <q-item-label class="text-h6 q-pb-sm q-pt-none">{{
      $t("ngramIntroTitle")
    }}</q-item-label>
    <div class="lineHeight" v-html="formattedIntro"/>
  </q-card>
    <loadingIcon v-if="loading" size="100" />
    <div v-show="showData">
      <div class="q-pb-md">
        <ShowData :filterSelections="'Ngrams'" />
      </div>
      <div v-if="!loading" class="q-pb-xl">
        <nGramsTable />
      </div>
    </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import i18n from "src/i18n/sv";
import nGramsTable from "src/components/nGramsTable.vue";
import ShowData from "src/components/ShowData.vue";
import { metaDataStore } from "src/stores/metaDataStore";
import { nGramDataStore } from "src/stores/nGramDataStore";
import loadingIcon from "src/components/loadingIcon.vue";

const formattedIntro = i18n.ngramIntro;
const metaStore = metaDataStore();
const nGramStore = nGramDataStore();

const loading = ref(false);
const showData = ref(false);

watchEffect(async () => {
  if (metaStore.submitEventNgrams) {
    showData.value = false;
    loading.value = true;
    await nGramStore.getNGramsResult(nGramStore.searchText);
    showData.value = true;
    loading.value = false;
    metaStore.cancelSubmitNgramsEvent();
  }
});
</script>
