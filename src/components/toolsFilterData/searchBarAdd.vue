<template>
  <q-input
    v-model="wtStore.searchText"
    rounded
    outlined
    clearable
    placeholder="T.ex klimat eller skola"
    :label="$t('searchAdd')"
    bg-color="white"
    color="accent"
    @keydown.enter="addSearchWord"
  >
    <template v-slot:prepend>
      <q-icon name="query_stats" color="accent" />
    </template>
    <template v-slot:after>
      <q-btn
        round
        color="accent"
        @click="addSearchWord"
        icon="add"
        :aria-label="$t('accessibility.searchAdd')"
      />
    </template>
  </q-input>
  <div class="row justify-end">
    <q-btn
      v-if="wtStore.wordHitsSelected.length > 0"
      no-caps
      flat
      :label="$t('searchClear')"
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
    <q-item-label class="text-bold">{{ $t("searchAddedWords") }}</q-item-label>
    <div class="row items-center justify-between">
      <div class="row">
        <q-item-label caption class="q-my-sm text-bold text-grey-8"
          >Visa alla
          <span class="text-black">{{ wtStore.wordHitsSelected.length }}</span>
          valda ord som en linje:
        </q-item-label>
        <q-icon name="info_outline" color="accent" class="q-mb-md q-ml-xs">
          <q-tooltip>Slå ihop alla ord till en linje</q-tooltip>
        </q-icon>
      </div>
      <q-toggle
        v-model="wtStore.singleLine"
        color="accent"
        keep-color
        checked-icon="check"
        unchecked-icon="close"
        @update:model-value="toggleSingleLine"
      />
    </div>
    <q-item-label caption class="text-grey-8" v-if="wtStore.ifAsterisk"
      >{{ $t("searchDropdownOfHits1") }}
      <b class="text-subtitle2">{{ $t("searchDropdownOfHits2") }} </b>
      {{ $t("searchDropdownOfHits3") }}
      <b>{{ wtStore.wordHits.length - wtStore.wordHitsSelected.length }}</b>
      {{ $t("searchDropdownOfHits4") }}
    </q-item-label>

    <div class="row items-center justify-between">
      <div class="row">
        <q-item-label caption class="q-my-sm text-bold text-grey-8"
          >{{
            selectAll ? "Återgå till de 5 vanligaste orden" : "Välj alla ord"
          }}:
        </q-item-label>
      </div>

      <q-toggle
        class="q-mr-lg"
        v-model="selectAll"
        color="accent"
        keep-color
        checked-icon="check"
        unchecked-icon="close"
        @update:model-value="toggleSelectAll"
      >
      </q-toggle>
    </div>
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
import { ref, watchEffect, watch } from "vue";
import { useRoute } from "vue-router";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import loadingIcon from "src/components/loadingIcon.vue";

const wtStore = wordTrendsDataStore();
const route = useRoute();
const loading = ref(false);
const selectAll = ref(false);

// Funktionen för att slå ihop alla ord till en enda linje
const toggleSingleLine = (value) => {
  if (value) {
    wtStore.singleLine = true;
  } else {
    wtStore.singleLine = false;
  }
};

const removeSelectedWord = () => {
  if (wtStore.wordHitsSelected.length === 0) {
    wtStore.wordHits = [];
    wtStore.ifAsterisk = false;
  }
};

const addSearchWord = () => {
  loading.value = true;

  wtStore.searchText.includes("*")
    ? wtStore.getWordHits(wtStore.searchText) && wtStore.addChip()
    : wtStore.addChip();

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

const toggleSelectAll = () => {
  if (selectAll.value) {
    wtStore.wordHitsSelected = [...wtStore.wordHits];
  } else {
    wtStore.wordHitsSelected = wtStore.wordHits.slice(0, 5);
  }
};

watch(
  () => wtStore.wordHitsSelected.length,
  () => {
    // Kontrollera om alla ord är valda, och uppdatera selectAll
    selectAll.value =
      wtStore.wordHitsSelected.length === wtStore.wordHits.length;
  }
);
</script>

<style lang="scss" scoped>
.chip-with-blank-space {
  color: white;
  background-color: $accent;
}
</style>
