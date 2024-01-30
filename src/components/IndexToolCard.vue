<template>
  <q-card v-ripple class="grid-item shadow-5 text-center">
    <q-card-section>
      <q-icon :name="icon" color="accent" size="sm"></q-icon>
    </q-card-section>
    <q-card-section>
      <p class="text-subtitle1 text-bold">{{ title }}</p>
      <p class="text-center">{{ text }}</p>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "IndexToolCard",
  props: ["icon", "title", "text"],

  setup() {
    return {};
  },
};
</script>

<style scoped>
.grid-item {
  min-width: 100%;
}
</style>
