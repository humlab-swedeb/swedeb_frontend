<template>
  <q-input
    v-model="wtStore.searchText"
    rounded
    outlined
    clearable
    placeholder="T.ex klimat eller skola"
    label="Sök på ordtrender"
    bg-color="white"
    color="accent"
    @keydown.enter="
      wtStore.searchText.includes('*')
        ? wtStore.getWordHits(wtStore.searchText)
        : wtStore.addChip()
    "
  >
    <template v-slot:prepend>
      <q-icon name="search" color="accent" />
    </template>
    <template v-slot:append>
      <q-btn round @click="wtStore.addChip" icon="add" />
    </template>
  </q-input>
  <div class="row fit q-py-md">
    <q-card-section class="col q-pa-none">
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
    </q-card-section>
    <q-card-section class="col q-pa-none">
      <q-btn
        v-if="wtStore.wordHitsSelected.length > 0"
        no-caps
        flat
        label="Ta bort alla ord"
        @click="wtStore.wordHitsSelected = []"
      />
    </q-card-section>
  </div>
  <div>
    <q-item-label class="text-bold">Valda ord:</q-item-label>
    <q-chip
      removable
      @remove="removeChip(word)"
      v-for="word in wtStore.searchWords"
      :key="word"
    >
      {{ word }}
    </q-chip>
    <q-select
      v-if="wtStore.wordHitsSelected.length > 0"
      v-model="wtStore.wordHitsSelected"
      :options="wtStore.wordHits"
      label="Liknande ord"
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
import { ref } from "vue";

const wtStore = wordTrendsDataStore();
/* const addChip = () => {
  if (wtStore.searchText.trim() !== "") {
    wtStore.addChip(wtStore.searchText.trim());

    //wtStore.searchText = ""; // Återställer sökfältet
  }
}; */
const removeChip = (chip) => {
  const index = wtStore.searchWords.indexOf(chip);
  if (index !== -1) {
    wtStore.removeChip(index); // Call removeChip method from store
  }
};
</script>
