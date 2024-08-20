<template>
  <q-card
    class="shadow-5 text-center cursor-pointer bg-primary onHover"
    style="width: 40vw; max-width: 400px; min-height: 180px;"
    :style="$q.screen.lt.sm ? 'width: 90vw' : ' '"
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
.onHover:hover {
  background-color: darken($primary, 7%) !important;
  transition: 200ms ease-in-out;
}
</style>
