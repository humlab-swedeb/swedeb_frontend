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
    @keydown.enter="addSearchWord"
  >
    <template v-slot:prepend>
      <q-icon name="query_stats" color="accent" />
    </template>
    <template v-slot:after>
      <q-btn round color="accent" @click="addSearchWord" icon="add" />
    </template>
  </q-input>
  <div class="row justify-end">
    <q-btn
      v-if="wtStore.wordHitsSelected.length > 0"
      no-caps
      flat
      label="Ta bort alla ord"
      color="grey-7"
      class="resetStyle q-my-sm"
      @click="(wtStore.wordHitsSelected = []) && (wtStore.wordHits = [])"
    />
  </div>
  <loadingIcon v-if="loading" size="50" />
  <div v-else v-show="wtStore.wordHitsSelected.length > 0">
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
            removeSelectedWord(select.opt);
          "
        >
          {{ select.opt }}
        </q-chip>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import loadingIcon from "src/components/loadingIcon.vue";

const wtStore = wordTrendsDataStore();
const route = useRoute();
const loading = ref(false);

const removeSelectedWord = (wordToRemove) => {
  wtStore.wordHits = wtStore.wordHits.filter((word) => word !== wordToRemove);
};

const addSearchWord = () => {
  loading.value = true;
  if (route.path === "/tools/kwic") {
    wtStore.addKWICChip();
  } else {
    wtStore.searchText.includes("*")
      ? wtStore.getWordHits(wtStore.searchText) && wtStore.addChip()
      : wtStore.addChip();
  }
  setTimeout(() => {
    loading.value = false; // Set loading to false after adding words
  }, 400); // Adjust the delay time as needed
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
