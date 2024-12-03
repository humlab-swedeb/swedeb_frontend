<!-- <template>
  <q-card flat class="background row justify-center max-width q-mt-lg">
    <q-item-label class="text-h1 q-px-md">{{
      $t("faqPageTitle")
    }}</q-item-label>
    <q-card-section
      class="text-body2 q-mt-sm q-mb-xl"
      :class="$q.screen.lt.sm ? '' : 'text-align'"
    >
      <div
        v-for="(faq, index) in faqContent"
        :key="index"
        class="q-pt-md"
        :class="$q.screen.lt.md ? 'none' : 'q-mx-xl'"
      >
        <q-item-label class="text-h6 q-mb-sm">{{ faq.q }}</q-item-label>
        <q-item-label class="text-body2 lineHeight2">
          <span v-html="faq.a" />
          <q-item-label>
            <a
              v-for="(link, index) in faq.links"
              :key="index"
              :href="link.link"
              class="link-deco text-accent text-bold q-mr-sm"
              >{{ link.linkText }}
            </a>
          </q-item-label>
        </q-item-label>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import i18n from "src/i18n/sv";

const faqContent = i18n.faqContent;
</script> -->

<template>
  <q-card flat class="background row justify-center max-width q-mt-lg">
    <q-item-label class="text-h1 q-px-md">{{
      $t("faqPageTitle")
    }}</q-item-label>
    <q-card-section
      class="q-mt-sm q-mb-xl full-width"
      :class="$q.screen.lt.sm ? '' : 'text-align'"
    >
      <div
        v-for="(faq, index) in faqContent"
        :key="index"
        class="q-pt-md"
        :class="$q.screen.lt.md ? 'none' : 'q-mx-xl'"
      >
        <q-card-section
          horizontal
          @click="toggle(index)"
          class="cursor-pointer items-center q-px-md"
        >
          <q-item-label class="text-subtitle1 text-bold">
            {{ faq.q }}
          </q-item-label>
          <q-space />
          <q-btn
            :aria-label="$t('accessibility.metadataFilter')"
            color="accent"
            round
            flat
            dense
            size="lg"
            :icon="
              activeIndex === index
                ? 'keyboard_arrow_up'
                : 'keyboard_arrow_down'
            "
          />
        </q-card-section>
        <q-slide-transition v-if="activeIndex === index">
          <q-card-section class="text-body2 lineHeight2 q-px-md q-pt-none">
            <span v-html="faq.a" />
            <q-item-label class="q-mt-md">
              <a
                v-for="(link, index) in faq.links"
                :key="index"
                :href="link.link"
                class="link-deco text-accent text-bold q-mr-sm"
                >{{ link.linkText }}
              </a>
            </q-item-label>
          </q-card-section>
        </q-slide-transition>
        <q-separator/>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import i18n from "src/i18n/sv";
import { ref } from "vue";

const faqContent = i18n.faqContent;
const activeIndex = ref(null);

const toggle = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};
</script>
