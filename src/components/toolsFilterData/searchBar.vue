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
      <q-icon name="search" color="accent" />
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
    <!--     <q-card-section class="col q-pa-none">
      <q-btn
        no-caps
        label="Liknande ord"
        icon="emergency"
        color="accent"
        @click="wtStore.getWordHits(wtStore.searchText)"
        :disabled="!wtStore.searchText.includes('*')"
      >
        <q-tooltip
          v-if="!wtStore.searchText.includes('*')"
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]"
          class="bg-accent text-white"
        >
          Sök på ett ord med en asterisk (*) för att hitta liknande ord. T.ex
          <code>klimat*</code>
        </q-tooltip>
      </q-btn>
    </q-card-section> -->
    <q-card-section class="col q-pa-none">
      <q-btn
        v-if="
          wtStore.wordHitsSelected.length > 0 || wtStore.searchWords.length > 0
        "
        no-caps
        flat
        label="Ta bort alla ord"
        color="grey-7"
        class="resetStyle"
        @click="(wtStore.wordHitsSelected = []) && (wtStore.searchWords = [])"
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
          @remove="select.removeAtIndex(select.index)"
        >
          {{ select.opt }}
        </q-chip>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";

const wtStore = wordTrendsDataStore();

</script>
