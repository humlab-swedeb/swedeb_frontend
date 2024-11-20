<template>
  <q-card flat class="background row justify-center max-width q-mt-lg">
    <q-item-label class="text-h1 q-px-md">{{
      $t("faqPageTitle")
    }}</q-item-label>
    <q-card-section
      class="text-body2 q-mt-sm q-mb-xl"
      :class="$q.screen.lt.sm ? '' : 'text-align'"
    >
<!--       <q-item-label
        v-for="(faq, index) in faqContent"
        :key="index"
        class=""
        :class="$q.screen.lt.md ? 'none' : 'q-mx-xl'"
      >
        {{ faq.q }}
      </q-item-label> -->
      <div
        v-for="(faq, index) in faqContent"
        :key="index"
        class="q-pt-md"
        :class="$q.screen.lt.md ? 'none' : 'q-mx-xl'"
      >
        <q-item-label class="text-h6 q-mb-sm">{{ faq.q }}</q-item-label>
        <q-item-label class="text-body2 lineHeight2">
          <span v-html="faq.a" />
          <a
            v-for="(link, index) in faq.links"
            :key="index"
            :href="link.link"
            class="link-deco text-accent text-bold q-mr-sm"
            >{{ link.linkText }}
          </a>
        </q-item-label>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import i18n from "src/i18n/sv";

const faqContent = i18n.faqContent;
</script>
