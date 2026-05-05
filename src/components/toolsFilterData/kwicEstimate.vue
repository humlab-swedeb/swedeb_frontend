<template>
  <div v-if="show" class="q-mt-sm">
    <q-banner v-if="!kwicStore.inVocabulary" dense class="bg-grey-2 text-grey-7 text-caption">
      {{ $t("kwicEstimateNotInVocabulary") }}
    </q-banner>
    <q-banner v-else-if="isHighCount" dense class="bg-orange-1 text-orange-9 text-caption">
      {{ $t("kwicEstimateHitsWarning", { hits: formattedHits }) }}
    </q-banner>
    <q-banner v-else dense class="bg-green-1 text-green-9 text-caption">
      {{ $t("kwicEstimateHitsInfo", { hits: formattedHits }) }}
    </q-banner>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { kwicDataStore } from "src/stores/kwicDataStore";

const HIGH_HIT_THRESHOLD = 10000;

const kwicStore = kwicDataStore();

const show = computed(
  () => kwicStore.inVocabulary !== null
);

const isHighCount = computed(
  () => kwicStore.estimatedHits != null && kwicStore.estimatedHits >= HIGH_HIT_THRESHOLD
);

const formattedHits = computed(() =>
  kwicStore.estimatedHits != null
    ? kwicStore.estimatedHits.toLocaleString("sv-SE")
    : ""
);
</script>
