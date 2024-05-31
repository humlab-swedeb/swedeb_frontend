<template>
  <div
    v-if="$route.path !== '/tools/speeches'"
    class="text-center text-h6 q-pt-lg"
  >
    <!--     <q-item-label>{{ $t("toolsFilterTitle") }}</q-item-label>
    <q-item-label caption class="text-bold q-pt-sm">{{
      $t($route.path)
    }}</q-item-label> -->
    <q-item-label class="text-bold">{{ $t($route.path) }}</q-item-label>
    <q-item-label caption class="text-bold q-pb-sm">{{
      $t("toolsFilterTitle")
    }}</q-item-label>
  </div>
  <q-card-section
    v-if="$route.path === '/tools/wordtrends'"
  >
    <searchBarAdd />
    <toggleSwitch
      class="q-mt-md"
      label="Normalisera resultatet"
      @normalize-data="handleNormalizeData"
    />
  </q-card-section>
  <q-card-section v-if="$route.path === '/tools/kwic'">
    <searchBar />
    <inputNrOfWords />
    <toggleSwitch
      class="q-mt-md"
      label="Normalisera resultatet"
      @normalize-data="handleNormalizeData"
    />
  </q-card-section>
  <q-card-section v-if="$route.path === '/tools/ngram'">
    <searchBar />
    <q-item-label caption class="text-bold q-mt-lg">
      Välj storlek på N-gram och var sökordet ska vara placerat
    </q-item-label>
    <q-card-section horizontal class="q-px-none">
      <q-card-section class="col-6">
        <nGramWidth />
      </q-card-section>
      <q-card-section class="col-6">
        <nGramPlacingRadio />
      </q-card-section>
    </q-card-section>
  </q-card-section>
  <q-card-section v-if="$route.path === '/tools/speeches'">
    {{ $t("speechesNoTools") }}
  </q-card-section>
</template>

<script setup>
import searchBarAdd from "src/components/toolsFilterData/searchBarAdd.vue";
import searchBar from "src/components/toolsFilterData/searchBar.vue";
import inputNrOfWords from "src/components/toolsFilterData/inputNrOfWords.vue";
import toggleSwitch from "src/components/toolsFilterData/toggleSwitch.vue";
import nGramWidth from "src/components/toolsFilterData/nGramWidth.vue";
import nGramPlacingRadio from "src/components/toolsFilterData/nGramPlacingRadio.vue";

const emit = defineEmits(["normalize-data"]);

function handleNormalizeData(newValue) {
  console.log("Toggle event emitted with value:", newValue);
  emit("normalize-data", newValue);
}
</script>
