<template>
  <q-input
    v-model="kwicStore.searchText"
    rounded
    outlined
    clearable
    placeholder="T.ex klimat eller skola"
    label="Sök på ett ord"
    bg-color="white"
    color="accent"
    @clear="kwicStore.searchText = ''"
  >
    <template v-slot:prepend>
      <q-icon name="search" color="accent" />
    </template>
  </q-input>
</template>

<script setup>
import { kwicDataStore } from "src/stores/kwicDataStore";

const kwicStore = kwicDataStore();
</script>

<style lang="scss" scoped>
.chip-with-blank-space {
  color: white;
  background-color: $accent;
}
</style>
