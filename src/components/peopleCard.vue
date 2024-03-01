<template>
  <q-card class="row q-px-lg">
    <q-card-section>
      <q-avatar>
        <img src="https://cdn.quasar.dev/img/avatar.png" />
      </q-avatar>
    </q-card-section>

    <q-card-section class="q-pl-none">
      <q-item-label class="text-subtitle1">{{ name }}</q-item-label>
      <q-item-label caption class="text-bold">{{ title }}</q-item-label>
<!--       <q-item-label class='text-body2 text-grey-7'>{{ description }}</q-item-label> -->
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  avatarUrl: String,
  name: String,
  title: String,
  description: String,
});
</script>

<style scoped></style>
