<template>
  <q-card flat class="background row justify-center max-width q-pa-lg q-px-xl">
    <q-item-label class="text-h3">{{ $t("faqPageTitle") }}</q-item-label>
    <q-card-section class="text-align text-body2 q-mt-sm">
      {{ $t("indexPageIntroText") }}
    </q-card-section>
    <q-card-section class="full-width text-align q-my-lg">
      <div v-for="(faq, index) in faq" :key="index" class='q-pb-md'>
        <q-item-label class="text-h6 q-mb-sm">{{ faq.q }}</q-item-label>
        <p class="text-body2">{{ faq.a }}</p>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import i18n from "src/i18n/sv";

const faq = i18n.faqContent;
</script>
