<template>
  <q-card flat class="row justify-center max-width q-pa-lg q-px-xl">
    <q-item-label class="text-h3">SweDeb</q-item-label>
    <q-card-section class="text-align text-body2">
      {{ $t("indexPageIntroText") }}
    </q-card-section>
    <q-card-section class="full-width q-pt-lg">
      <div class="grid-container">
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
        <IndexToolCard
          @click="redirect('tools/ngram')"
          :title="$t('nGramsTitle')"
          :text="$t('nGramsText')"
          :icon="$t('nGramsIcon')"
        />
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
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
  padding: 0 100px;
}

.max-width {
  max-width: 1600px;
}

.text-align {
  padding: 0 200px;
}
</style>
