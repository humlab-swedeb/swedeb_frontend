<!-- LoadingSpinner.vue -->
<template>
  <div class="row justify-center q-pa-xl">
    <q-spinner-tail :size="size" color="accent" :thickness="5" />
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
