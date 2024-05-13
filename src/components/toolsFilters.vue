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
    v-if="$route.path === '/tools/wordtrends' || $route.path === '/tools/kwic' || $route.path === '/tools/ngram'"
  >
    <searchBar />
    <toggleSwitch />
  </q-card-section>
  <q-card-section
    v-if="$route.path === '/tools/kwic'"
  >
    <inputNrOfWords />
  </q-card-section>
  <q-card-section v-if="$route.path === '/tools/speeches'">
    {{ $t("speechesNoTools") }}
  </q-card-section>
</template>

<script setup>
import searchBar from "src/components/toolsFilterData/searchBar.vue";
import inputNrOfWords from "src/components/toolsFilterData/inputNrOfWords.vue";
import toggleSwitch from "src/components/toolsFilterData/toggleSwitch.vue";
</script>
