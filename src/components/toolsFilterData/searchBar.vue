<template>
  <q-input
    v-model="wtStore.searchText"
    rounded
    outlined
    clearable
    placeholder="T.ex klimat eller skola"
    label="Lägg till ord"
    bg-color="white"
    color="accent"
    @keydown.enter="
      wtStore.searchText.includes('*')
        ? wtStore.getWordHits(wtStore.searchText) && wtStore.addChip()
        : wtStore.addChip()
    "
  >
    <template v-slot:prepend>
      <q-icon name="query_stats" color="accent" />
    </template>
    <template v-slot:after>
      <q-btn
        round
        color="accent"
        @click="wtStore.getWordHits(wtStore.searchText) && wtStore.addChip()"
        icon="add"
      />
    </template>
  </q-input>
  <div class="row fit q-py-md">
    <q-card-section class="col q-pa-none">
      <q-btn
        v-if="wtStore.wordHitsSelected.length > 0"
        no-caps
        flat
        label="Ta bort alla ord"
        color="grey-7"
        class="resetStyle"
        @click="(wtStore.wordHitsSelected = []) && (wtStore.wordHits = [])"
      />
    </q-card-section>
  </div>
  <div v-show="wtStore.wordHitsSelected.length > 0">
    <q-item-label class="text-bold">Valda ord:</q-item-label>
    <q-select
      v-if="wtStore.wordHitsSelected.length > 0"
      v-model="wtStore.wordHitsSelected"
      :options="wtStore.wordHits"
      multiple
      color="accent"
      use-chips
      dense
    >
      <template v-slot:selected-item="select">
        <q-chip
          square
          removable
          dense
          :class="{ 'chip-with-blank-space': select.opt.includes(' ') }"
          @remove="
            select.removeAtIndex(select.index);
            doThing(select.opt);
          "
        >
          {{ select.opt }}
        </q-chip>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { watchEffect } from "vue";
import { useRoute } from "vue-router";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";

const wtStore = wordTrendsDataStore();
const route = useRoute();

const doThing = (wordToRemove) => {
  console.log(wordToRemove);
  wtStore.wordHits = wtStore.wordHits.filter((word) => word !== wordToRemove);
};

watchEffect(() => {
  if (route.path === "/tools/kwic") {
    wtStore.wordHits = [];
    wtStore.wordHitsSelected = [];
  }
});
</script>

<style lang="scss" scoped>
.chip-with-blank-space {
  color: white;
  background-color: $accent;
}
</style>
