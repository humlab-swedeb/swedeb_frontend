<template>
  <q-card flat class="q-px-md background q-pt-sm q-pb-md">
    <q-item-label class="text-h6 q-pb-sm q-pt-none">{{
      $t("kwicIntroTitle")
    }}</q-item-label>
    <div class="word-trends-intro lineHeight" v-html="formattedIntro"></div>
  </q-card>
  <div v-show="showData">
    <div class="q-pb-md">
      <ShowData />
    </div>
    <loadingIcon v-if="loading" size="100" />

    <div v-else class="q-pb-xl">
      <kwicDataTable />
    </div>

    <div>
      <q-btn @click="cancelFetch" :disable="!loading "
        >Avbryt sökning</q-btn
      >
    </div>
  </div>
</template>

<script setup>
import ShowData from "src/components/ShowData.vue";
import kwicDataTable from "src/components/kwicDataTable.vue";
import loadingIcon from "src/components/loadingIcon.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { kwicDataStore } from "src/stores/kwicDataStore";
import i18n from "src/i18n/sv";
import { ref, watchEffect, nextTick, onMounted } from "vue";

const metaStore = metaDataStore();
const kwicStore = kwicDataStore();

const intro = i18n.kwicIntro;
const formattedIntro = intro;

const showData = ref(false);
const loading = ref(false);


onMounted(() => {
  console.log('mounting kwic page')
  if(kwicStore.kwicData && kwicStore.kwicData.length > 0) {
    console.log('kwic page has data')
    showData.value = true;
    loading.value = false;
    console.log('showData.value i onmounted i kwic', showData.value)
  }

});


watchEffect(async () => {
  if (metaStore.submitKwicEvent) {
    loading.value = true;
    showData.value = true; // Otherwise the loading icon does not show until second search/after pending

    await nextTick();

    await kwicStore.getKwicResult(kwicStore.searchText);
    loading.value = false;

  }
  //metaStore.cancelSubmitEvent(" KWICPage ");
  //metaStore.cancelUpdateEvent(" KWICPage ");
  metaStore.cancelSubmitKwicEvent(" KWICPage ");
});

const cancelFetch = () => {
  kwicStore.cancelFetch();
};
</script>
