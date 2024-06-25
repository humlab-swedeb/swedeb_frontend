<template>
  <q-card flat class="background row justify-center max-width q-mt-lg">
    <q-item-label class="text-h1 q-px-md">{{ $t("faqPageTitle") }}</q-item-label>
    <q-card-section
      class="text-body2 q-mt-sm"
      :class="$q.screen.lt.sm ? '' : 'text-align'"
    >
      {{ $t("indexPageIntroText") }}

      <div v-for="(faq, index) in faq" :key="index" class="q-pt-md">
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
