<template>
  <q-card flat class="q-pa-md background">
    <div class="word-trends-intro text-grey-8" v-html="formattedIntro"></div>
    <loadingIcon v-if="loading" size="100" />
    <nGramsTable v-else />
  </q-card>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import i18n from "src/i18n/sv";
import nGramsTable from "src/components/nGramsTable.vue";
import { metaDataStore } from "src/stores/metaDataStore";
import { nGramDataStore } from "src/stores/nGramDataStore";
import loadingIcon from "src/components/loadingIcon.vue";

const intro = i18n.ngramIntro;
const formattedIntro = intro;
const metaStore = metaDataStore();
const nGramStore = nGramDataStore();

const loading = ref(false);

watchEffect(async () => {
  if (metaStore.submitEvent && metaStore.updateEvent) {
    loading.value = true;
    await nGramStore.getNGramsResult();
    loading.value = false;
  }
});
</script>
