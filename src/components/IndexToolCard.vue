<template>
  <q-card
    v-ripple
    class="grid-item shadow-5 text-center cursor-pointer bg-primary q-hoverable"
  >
    <q-card-section>
      <q-icon :name="icon" color="accent" size="md"></q-icon>
      <q-item-label class="text-h6 q-my-md">{{ title }}</q-item-label>
      <p class="text-center">{{ text }}</p>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  icon: String,
  title: String,
  text: String,
});
</script>

<style scoped>
.grid-item {
  min-width: 100%;
}
</style>
