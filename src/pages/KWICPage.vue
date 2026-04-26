<template>
  <q-card flat class="q-px-md background q-pt-sm q-pb-md">
    <q-item-label class="text-h6 q-pb-sm q-pt-none">{{
      $t("kwicIntroTitle")
    }}</q-item-label>
    <div class="word-trends-intro lineHeight" v-html="formattedIntro"></div>
  </q-card>
  <q-banner v-if="kwicStore.errorMessage" rounded class="bg-red-1 text-negative q-mt-md">
    {{ $t("kwicFetchError") }}
    <span v-if="kwicStore.errorMessage"> {{ kwicStore.errorMessage }}</span>
  </q-banner>
  <div v-if="loading" class="column items-center q-py-lg q-gutter-sm">
    <loadingIcon size="100" />
  </div>
  <div v-show="showData">
    <div class="q-pb-md">
      <ShowData :filterSelections="'KWIC'" />
    </div>
    <div v-if="!loading" class="q-pb-xl">
      <kwicDataTable />
    </div>

    <!--     <div>
      <q-btn
        no-caps
        v-show="loading"
        @click="cancelFetch"
        color="primary"
        :label="$t('searchCancel')"
      />
      >
    </div> -->

  </div>
</template>

<script setup>
import ShowData from "src/components/ShowData.vue";
import kwicDataTable from "src/components/kwicDataTable.vue";
import loadingIcon from "src/components/loadingIcon.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { kwicDataStore } from "src/stores/kwicDataStore";
import i18n from "src/i18n/sv";
import { ref, watch, onMounted } from "vue";


const metaStore = metaDataStore();
const kwicStore = kwicDataStore();

const formattedIntro = i18n.kwicIntro;

const showData = ref(false);
const loading = ref(false);

onMounted(() => {
  if (kwicStore.hasSubmittedQuery) {
    showData.value = true;
    loading.value = false;
  }
});

watch(
  () => metaStore.submitEventKWIC,
  async (submitRequested) => {
    if (!submitRequested) {
      return;
    }

    showData.value = false;
    loading.value = true;
    await kwicStore.getKwicResult(kwicStore.searchText);
    showData.value = true;
    loading.value = false;

    metaStore.cancelSubmitKwicEvent();
  }
);

const cancelFetch = () => {
  kwicStore.cancelFetch();
};
</script>
