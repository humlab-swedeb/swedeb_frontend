<template>
  <q-card
    class="grid-item shadow-5 text-center cursor-pointer bg-primary onHover"
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

<style lang="scss" scoped>
.grid-item {
  min-width: 100%;
}

.onHover:hover {
  background-color: darken($primary, 7%) !important;
  transition: 200ms ease-in-out;
}
</style>
