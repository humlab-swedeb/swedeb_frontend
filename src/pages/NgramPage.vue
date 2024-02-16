<template>
  <q-card flat class="q-pa-md">
    <div class="word-trends-intro text-grey-8" v-html="formattedIntro"></div>
  </q-card>
</template>

<script setup>
import i18n from "src/i18n/sv";

const intro = i18n.ngramIntro;
const formattedIntro = intro;
</script>
