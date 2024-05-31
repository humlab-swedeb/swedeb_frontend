<template>
  <q-card flat class="q-pa-md background">
    <div class="word-trends-intro text-grey-8" v-html="formattedIntro"></div>
  </q-card>
  <div v-show="showData">
    <div class="q-pb-md">
      <ShowData />
    </div>
    <loadingIcon v-if="loading" size="100" />

    <div v-else class="q-pb-xl">
      <div class="row q-py-md justify-between">
        <q-item-label
          class="col-9 q-mt-md"
          v-if="kwicStore.kwicData.length > 0"
        >
          Sökningen resulterade i <b>{{ kwicStore.kwicData.length }}</b> antal
          träffar.
        </q-item-label>
      </div>
      <kwicDataTable />
    </div>
  </div>
</template>

<script setup>
import ShowData from "src/components/ShowData.vue";
import kwicDataTable from "src/components/kwicDataTable.vue";
import loadingIcon from "src/components/loadingIcon.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { kwicDataStore } from "src/stores/kwicDataStore";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import i18n from "src/i18n/sv";
import { ref, watchEffect, nextTick } from "vue";

const metaStore = metaDataStore();
const kwicStore = kwicDataStore();
const wtStore = wordTrendsDataStore();

const intro = i18n.kwicIntro;
const formattedIntro = intro;

const showData = ref(false);
const loading = ref(false);




watchEffect(async () => {
  if (metaStore.submitEvent && metaStore.updateEvent) {
    loading.value = true;
    showData.value = true; // Otherwise the loading icon does not show until second search/after pending
    await nextTick();
    await kwicStore.getKwicResult(kwicStore.searchText);
    setTimeout(() => {
      loading.value = false;
    }, 400);
  }
});
</script>
