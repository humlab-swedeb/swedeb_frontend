<template>
  <div class="row">
    <q-item-label caption class="text-bold q-mb-sm q-mt-lg text-grey-8 col-11">
      {{ $t("nrOfWordsIntro") }}
    </q-item-label>
    <q-icon
      name="info_outline"
      color="accent"
      class="q-mt-lg"
      style="margin-left: -10px"
    >
      <q-tooltip>{{ $t("tooltipKWIC") }}</q-tooltip>
    </q-icon>
  </div>
  <q-card-section horizontal class="row justify-between q-pa-none">
    <div class="col">
      <q-input
        v-model="kwicStore.wordsLeft"
        outlined
        :label="$t('nrOfWordsLeft')"
        type="number"
        class="bg-white"
        color="accent"
        max="20"
        min="1"
      >
      </q-input>
    </div>
    <q-item-label class="q-ma-none q-pa-md text-bold">{{
      $t("nrOfWordsSearch")
    }}</q-item-label>
    <div class="col">
      <q-input
        v-model="kwicStore.wordsRight"
        outlined
        :label="$t('nrOfWordsRight')"
        type="number"
        class="bg-white"
        color="accent"
        max="20"
        min="1"
      >
      </q-input>
    </div>
  </q-card-section>
</template>

<script setup>
import { kwicDataStore } from "src/stores/kwicDataStore.js";
const kwicStore = kwicDataStore();
</script>
