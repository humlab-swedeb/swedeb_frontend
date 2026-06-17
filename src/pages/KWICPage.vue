<template>
  <q-card flat class="q-px-md background q-pt-sm q-pb-md">
    <q-item-label class="text-h6 q-pb-sm q-pt-none">{{
      $t("kwicIntroTitle")
    }}</q-item-label>
    <i18n-t
      keypath="kwicIntro"
      tag="div"
      class="word-trends-intro lineHeight"
      scope="global"
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
      <template #kwicExample3>
        <code>{{ $t("searchExample3") }}</code>
      </template>
      <template #serachExample4>
        <code>{{ $t("serachExample4") }}</code>
      </template>
    </i18n-t>
  </q-card>
  <q-banner
    v-if="kwicStore.errorMessage"
    rounded
    class="bg-red-1 text-negative q-mt-md"
  >
    {{ kwicStore.errorMessage }}
  </q-banner>
  <div v-show="showData">
    <div class="q-pb-md" data-test="kwic-show-data">
      <ShowData :filterSelections="'KWIC'" />
    </div>
    <div class="q-pb-xl">
      <kwicDataTable />
    </div>
  </div>
</template>

<script setup>
import ShowData from "src/components/ShowData.vue";
import kwicDataTable from "src/components/kwicDataTable.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { kwicDataStore } from "src/stores/kwicDataStore";
import { ref, watch, onMounted } from "vue";

const metaStore = metaDataStore();
const kwicStore = kwicDataStore();

const showData = ref(false);
onMounted(() => {
  if (kwicStore.hasSubmittedQuery) {
    showData.value = true;
  }
});

watch(
  () => metaStore.submitEventKWIC,
  async (submitRequested) => {
    if (!submitRequested) {
      return;
    }

    showData.value = true;
    await kwicStore.getKwicResult(kwicStore.searchText);

    metaStore.cancelSubmitKwicEvent();
  },
);
</script>
