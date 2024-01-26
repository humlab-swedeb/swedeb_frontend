<template>
  <q-input
    v-model="searchText"
    rounded
    outlined
    clearable
    placeholder="T.ex klimat eller skola"
    label="Sök på ordtrender"
    bg-color="white"
    @input="search"
  >
    <template v-slot:prepend>
      <q-icon name="search" color="primary" />
    </template>
  </q-input>
</template>

<script setup>
import { ref } from "vue";

const searchText = ref("");

const search = () => {
  // Perform search logic here
};
</script>
