<template>
  <q-card
    style="width: 40vw; max-width: 400px"
    :style="$q.screen.lt.sm ? 'width: 90vw' : ' '"
    class="q-mb-sm q-px-md"
  >
    <!--     <q-card-section>
      <q-avatar>
        <img src="https://cdn.quasar.dev/img/avatar.png" />
      </q-avatar>
    </q-card-section> -->

    <q-card-section class="q-pl-none">
      <q-item-label class="text-subtitle1">{{ name }}</q-item-label>
      <q-item-label caption class="text-grey-8">{{ title }}</q-item-label>
      <q-item-label caption>
        <a class="link-deco text-accent text-bold" :href="'mailto:' + email">{{ email }}</a>
      </q-item-label>

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
  email: String,
});
</script>

<style scoped></style>
