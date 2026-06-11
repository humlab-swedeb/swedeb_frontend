<template>
  <q-card flat class="q-px-md background q-pt-sm q-pb-md">
    <q-item-label class="text-h6 q-pb-sm q-pt-none">{{
      $t("speechesIntroTitle")
    }}</q-item-label>
    <i18n-t
      keypath="speechesIntro"
      tag="div"
      class="word-trends-intro lineHeight"
      scope="global"
    >
      <template #filterText>
        <b>"{{ $t("filterOnMetadata") }}"</b>
      </template>
    </i18n-t>
  </q-card>
  <loadingIcon v-if="loading" size="100" />
  <div v-show="showData">
    <div class="q-pb-md">
      <ShowData :filterSelections="'Speeches'" />
    </div>
    <div v-if="!loading" class="q-pb-xl q-px-md">
      <speechesTable />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { metaDataStore } from "src/stores/metaDataStore";
import { speechesDataStore } from "src/stores/speechesDataStore.js";
import speechesTable from "src/components/speechesTable.vue";
import ShowData from "src/components/ShowData.vue";
import loadingIcon from "src/components/loadingIcon.vue";

const metaStore = metaDataStore();
const speechStore = speechesDataStore();

const loading = ref(false);
const showData = ref(false);

onMounted(() => {
  showData.value = true;
  if (speechStore.speechesData && speechStore.speechesData.length > 0) {
    loading.value = false;
  }
});

watch(
  () => metaStore.submitEventSpeeches,
  async (submitRequested) => {
    if (!submitRequested) {
      return;
    }

    showData.value = false;
    loading.value = true;
    await speechStore.getSpeechesTicketResult();
    setTimeout(() => {
      loading.value = false;
      showData.value = true;
    }, 400);
    metaStore.cancelSubmitSpeechesEvent();
  },
);
</script>
