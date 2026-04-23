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
  <q-select
    v-model="kwicStore.cutOff"
    :options="cutOffOptions"
    emit-value
    map-options
    outlined
    :label="$t('nrCutOffKWIC')"
    class="bg-white q-mt-sm"
    color="accent"
  />
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { kwicDataStore } from "src/stores/kwicDataStore.js";

const { t } = useI18n();
const kwicStore = kwicDataStore();

const cutOffOptions = [
  { label: "100 000", value: 100000 },
  { label: "1 000 000", value: 1000000 },
  { label: "10 000 000", value: 10000000 },
  { label: t("allHits"), value: null },
];
</script>
