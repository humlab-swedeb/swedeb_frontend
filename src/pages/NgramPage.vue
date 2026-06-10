<template>
  <q-card flat class="q-px-md background q-pt-sm q-pb-md">
    <q-item-label class="text-h6 q-pb-sm q-pt-none">{{
      $t("ngramIntroTitle")
    }}</q-item-label>
    <i18n-t
      keypath="ngramIntro"
      tag="div"
      class="word-trends-intro lineHeight"
    >
      <template #filterText>
        <b>"{{ $t("filterOnMetadata") }}"</b>
      </template>
      <template #kwicTitleText>
        <strong>{{ $t("kwicTitle") }}</strong>
      </template>
      <template #searchExample1>
        <code>{{ $t("searchExample1") }}</code>
      </template>
            <template #searchExample2>
        <code>{{ $t("searchExample2") }}</code>
      </template>
            <template #searchExample3>
        <code>{{ $t("searchExample3") }}</code>
      </template>

    </i18n-t>
  </q-card>
  <loadingIcon v-if="nGramStore.isLoading" size="100" />
  <div v-if="nGramStore.errorMessage && !nGramStore.isLoading" class="q-pa-md">
    <q-banner class="bg-negative text-white">{{
      nGramStore.errorMessage
    }}</q-banner>
  </div>
  <div v-show="showData">
    <div class="q-pb-md">
      <ShowData :filterSelections="'Ngrams'" />
    </div>
    <div v-if="!nGramStore.isLoading" class="q-pb-xl">
      <nGramsTable />
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue";
import nGramsTable from "src/components/nGramsTable.vue";
import ShowData from "src/components/ShowData.vue";
import { metaDataStore } from "src/stores/metaDataStore";
import { nGramDataStore } from "src/stores/nGramDataStore";
import loadingIcon from "src/components/loadingIcon.vue";
import { ref, onMounted } from "vue";

const metaStore = metaDataStore();
const nGramStore = nGramDataStore();

const showData = ref(false);

onMounted(() => {
  if (nGramStore.nGrams && nGramStore.nGrams.length > 0) {
    showData.value = true;
  }
});

watch(
  () => metaStore.submitEventNgrams,
  async (submitRequested) => {
    if (!submitRequested) {
      return;
    }

    showData.value = false;
    await nGramStore.getNGramsResult(nGramStore.searchText);
    showData.value = true;
    metaStore.cancelSubmitNgramsEvent();
  },
);
</script>
