<template>
  <q-card flat class="background row justify-center max-width q-mt-lg">
    <q-item-label class="text-h1 q-px-md">{{
      $t("faqPageTitle")
    }}</q-item-label>
    <q-card-section
      class="text-body2 q-mt-sm"
      :class="$q.screen.lt.sm ? '' : 'text-align'"
    >
      <div v-for="(faq, index) in faqContent" :key="index" class="q-pt-md">
        <q-item-label class="text-h6 q-mb-sm">{{ faq.q }}</q-item-label>
        <q-item-label class="text-body2">
          {{ faq.a }}
          <a v-if="faq.link" :href="faq.link" class='link-deco text-accent text-bold'>{{ faq.linkText }}</a>
        </q-item-label>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import i18n from "src/i18n/sv";

const faqContent = i18n.faqContent;
</script>
