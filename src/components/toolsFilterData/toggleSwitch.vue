<template>
  <q-toggle
    v-model="toggleValue"
    label="Lemmatiserad sökning"
    color="accent"
    keep-color
  />
</template>

<script setup>
import { ref } from "vue";

const toggleValue = ref(false);
</script>
