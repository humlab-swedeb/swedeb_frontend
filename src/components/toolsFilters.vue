<template>
  <div
    v-if="currentPath !== '/tools/speeches'"
    class="text-center text-h6 q-pt-lg"
  >
    <q-item-label class="text-bold">{{ $t(currentPath) }}</q-item-label>
    <q-item-label caption class="text-bold q-pb-sm text-grey-8">{{
      $t("toolsFilterTitle")
    }}</q-item-label>
  </div>
  <q-card-section v-if="currentPath === '/tools/wordtrends'">
    <searchBarAdd />

    <toggleSwitch
      class="q-mt-md"
      :label="$t('normalizeResultLabel')"
      :tooltip="$t('normalizeResultTooltip')"
      @toggle-event="handleNormalizeData"
    />
  </q-card-section>
  <q-card-section v-else-if="currentPath === '/tools/kwic'">
    <searchBar />
    <toggleSwitch
      class="q-mt-md"
      :label="$t('lemmaResultLabel')"
      :tooltip="$t('lemmaResultTooltip')"
      @toggle-event="handleLemmatizedSearch"
    />
    <inputNrOfWords />
  </q-card-section>
  <q-card-section v-if="currentPath === '/tools/ngram'">
    <searchBar />
    <q-item-label caption class="text-bold q-mt-lg text-grey-8">
      {{ $t("ngramSizePlaceLabel") }}
    </q-item-label>
    <q-card-section horizontal class="q-px-none">
      <q-card-section class="col-6"><nGramWidth /></q-card-section>
      <q-card-section class="col-6"><nGramPlacingRadio /></q-card-section>
    </q-card-section>
  </q-card-section>
  <q-card-section v-if="currentPath === '/tools/speeches'">
    {{ $t("speechesNoTools") }}
  </q-card-section>
</template>

<script setup>
import searchBarAdd from "src/components/toolsFilterData/searchBarAdd.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import searchBar from "src/components/toolsFilterData/searchBar.vue";
import inputNrOfWords from "src/components/toolsFilterData/inputNrOfWords.vue";
import toggleSwitch from "src/components/toolsFilterData/toggleSwitch.vue";
import nGramWidth from "src/components/toolsFilterData/nGramWidth.vue";
import nGramPlacingRadio from "src/components/toolsFilterData/nGramPlacingRadio.vue";

const route = useRoute();

const currentPath = computed(() => route.path);

const emit = defineEmits(["normalize-data", "lemmatize-search"]);

function handleNormalizeData(newValue) {
  emit("normalize-data", newValue);
}

function handleLemmatizedSearch(newValue) {
  emit("lemmatize-search", newValue);
}
</script>
