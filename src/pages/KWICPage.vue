<template>
  <q-card flat class="q-pa-md">
    <div class="word-trends-intro text-grey-8" v-html="formattedIntro"></div>
  </q-card>
  <div>
    <ShowData />
  </div>
</template>
<script setup>
import ShowData from "src/components/ShowData.vue";
import i18n from "src/i18n/sv";

const intro = i18n.kwicIntro;
const formattedIntro = intro;
</script>
