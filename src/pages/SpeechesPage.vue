<template>
  <q-card flat class="q-pa-md background">
    <div class="word-trends-intro lineHeight" v-html="formattedIntro"></div>
  </q-card>
  <div v-show="showData">
    <div class="q-pb-md">
      <ShowData />
    </div>
    <loadingIcon v-if="loading" size="100" />

    <div v-else class="q-pb-xl">
      <speechDataTable type="speeches" />
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { metaDataStore } from "src/stores/metaDataStore";
import { speechesDataStore } from "src/stores/speechesDataStore.js";
import speechDataTable from "src/components/speechDataTable.vue";
import ShowData from "src/components/ShowData.vue";
import loadingIcon from "src/components/loadingIcon.vue";
import i18n from "src/i18n/sv";

const metaStore = metaDataStore();
const speechStore = speechesDataStore();

const formattedIntro = i18n.speechesIntro;
const loading = ref(false);
const showData = ref(false);

watchEffect(async () => {
  if (metaStore.submitEvent) {
    loading.value = true;
    await speechStore.getSpeechesResult();
    showData.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 400);
  }
});
</script>
