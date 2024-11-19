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
      <q-item-label class="text-subtitle1">
        <a v-if="link" class="link-deco text-accent text-bold" :href="link">
          {{ name }}
        </a>
        <span v-else>{{ name }}</span>
      </q-item-label>
      <q-item-label caption class="text-grey-8">{{ title }}</q-item-label>

      <!--       <q-item-label class='text-body2 text-grey-7'>{{ description }}</q-item-label> -->
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineProps } from "vue";
import { useLink } from "vue-router";

const props = defineProps({
  avatarUrl: String,
  name: String,
  title: String,
  link: String,
});
</script>

<style scoped></style>
