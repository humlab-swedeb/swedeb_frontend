<!-- LoadingSpinner.vue -->
<template>
  <div class="row justify-center q-pa-xl">
    <div class="column items-center">
      <q-spinner-tail :size="size" color="accent" :thickness="5" />
      <q-item-label caption class="text-center text-bold q-mt-lg">Resultat hämtas, vänligen vänta...</q-item-label>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  size: {
    type: String,
  },
});
</script>
