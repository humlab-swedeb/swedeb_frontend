<template>
  <q-card flat class="background row justify-center max-width q-mt-lg">
    <q-item-label class="text-h1">SweDeb</q-item-label>
    <q-card-section
      class="text-body2 q-mt-sm"
      :class="$q.screen.lt.sm ? '' : 'text-align'"
    >
      {{ $t("indexPageIntroText") }}
    </q-card-section>
    <q-card-section
      class="row justify-center full-width"
      :class="$q.screen.lt.sm ? 'q-pt-sm q-pb-xl' : 'q-py-xl'"
    >
      <div class="grid-container row justify-center q-gutter-lg max">
        <IndexToolCard
          @click="redirect('tools/wordtrends')"
          :title="$t('wordTrendsTitle')"
          :text="$t('wordTrendsText')"
          :icon="$t('wordTrendsIcon')"
        />
        <IndexToolCard
          @click="redirect('tools/kwic')"
          :title="$t('kwicTitle')"
          :text="$t('kwicText')"
          :icon="$t('kwicIcon')"
        />
        <IndexToolCard
          @click="redirect('tools/speeches')"
          :title="$t('speechesTitle')"
          :text="$t('speechesText')"
          :icon="$t('speechesIcon')"
        />
<!--         <IndexToolCard
          @click="redirect('tools/ngram')"
          :title="$t('nGramsTitle')"
          :text="$t('nGramsText')"
          :icon="$t('nGramsIcon')"
        /> -->
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useRouter } from "vue-router";
import IndexToolCard from "../components/IndexToolCard.vue";

const router = useRouter();

const redirect = (route) => {
  router.push(route);
};
</script>

<style scoped>
.max {
  max-width: 1200px;
}
/* .grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
} */

/* @media (max-width: 785px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
} */
</style>
