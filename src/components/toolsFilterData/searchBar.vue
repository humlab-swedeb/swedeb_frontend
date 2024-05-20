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
      @click="
        (wtStore.wordHitsSelected = []) &&
          (wtStore.wordHits = []) &&
          (wtStore.ifAsterisk = false)
      "
    />
  </div>
  <loadingIcon v-if="loading" size="50" />
  <div v-else v-show="wtStore.wordHitsSelected.length > 0">
    <q-item-label class="text-bold" v-if="$route.path === '/tools/kwic'"
      >Valt sökord eller fras:</q-item-label
    ><q-item-label class="text-bold" v-else>Valda sökord:</q-item-label>
    <q-item-label caption class="text-grey-8" v-if="wtStore.ifAsterisk"
      >Här visas de 10 vanligaste orden relaterade till söktermen med
      <b class="text-subtitle2">*</b>. Det finns ytterligare
      <b>{{ wtStore.wordHits.length - wtStore.wordHitsSelected.length }}</b> ord
      att lägga till för att förfina sökningen.</q-item-label
    >
    <q-select
      v-if="wtStore.wordHitsSelected.length > 0"
      v-model="wtStore.wordHitsSelected"
      :options="wtStore.wordHits"
      multiple
      color="accent"
      use-chips
      dense
      :popup-content-style="{
        borderRadius: '0px 0px 7px 7px',
        height: '300px',
      }"
    >
      <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
        <q-item v-bind="itemProps" dense>
          <q-item-section>
            <q-item-label> {{ opt }} </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-checkbox
              color="accent"
              :model-value="selected"
              @update:model-value="toggleOption(opt)"
            />
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:selected-item="select">
        <q-chip
          square
          removable
          dense
          :class="{ 'chip-with-blank-space': select.opt.includes(' ') }"
          @remove="
            select.removeAtIndex(select.index);
            removeSelectedWord();
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

const removeSelectedWord = () => {
  if (wtStore.wordHitsSelected.length === 0) {
    wtStore.wordHits = [];
    wtStore.ifAsterisk = false;
  }
};

const addSearchWord = () => {
  loading.value = true;
  if (route.path === "/tools/kwic" || route.path === "/tools/ngram") {
    wtStore.addKWICChip();
  } else {
    wtStore.searchText.includes("*")
      ? wtStore.getWordHits(wtStore.searchText) && wtStore.addChip()
      : wtStore.addChip();
  }
  setTimeout(() => {
    loading.value = false;
  }, 400);
};

watchEffect(() => {
  if (route.path === "/tools/kwic") {
    wtStore.wordHits = [];
    wtStore.wordHitsSelected = [];
    wtStore.ifAsterisk = false;
  }
});
</script>

<style lang="scss" scoped>
.chip-with-blank-space {
  color: white;
  background-color: $accent;
}
</style>
