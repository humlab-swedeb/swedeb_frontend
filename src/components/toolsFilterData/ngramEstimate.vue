<template>
  <div v-if="show" class="q-mt-sm">
    <q-banner
      v-if="!nGramStore.inVocabulary"
      dense
      class="bg-grey-2 text-grey-7 text-caption"
    >
      {{ $t("ngramEstimateNotInVocabulary") }}
    </q-banner>
    <q-banner
      v-else-if="isHighCount"
      dense
      class="bg-orange-1 text-orange-9 text-caption"
    >
      {{ $t("ngramEstimateHitsPrefix") }} {{ formattedHits }}
      {{ $t("ngramEstimateHits") }} –
      {{ $t("ngramEstimateHighWarning") }}
    </q-banner>
    <q-banner v-else dense class="bg-green-1 text-green-9 text-caption">
      {{ $t("ngramEstimateHitsPrefix") }} {{ formattedHits }}
      {{ $t("ngramEstimateHits") }}
    </q-banner>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { nGramDataStore } from "src/stores/nGramDataStore";

const HIGH_HIT_THRESHOLD = 10000;

const nGramStore = nGramDataStore();

const show = computed(() => nGramStore.inVocabulary !== null);

const isHighCount = computed(
  () =>
    nGramStore.estimatedHits != null &&
    nGramStore.estimatedHits >= HIGH_HIT_THRESHOLD,
);

const formattedHits = computed(() =>
  nGramStore.estimatedHits != null
    ? nGramStore.estimatedHits.toLocaleString("sv-SE")
    : "",
);
</script>
