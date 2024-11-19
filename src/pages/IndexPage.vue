<template>
  <q-card flat class="background row justify-center max-width q-mt-lg">
    <q-item-label class="text-h4">{{ $t("indexPageTitle") }}</q-item-label>
    <q-card-section
      class="text-body2 q-mt-sm lineHeight"
      :class="$q.screen.lt.sm ? '' : 'text-align'"
    >
      {{ $t("indexPageIntroText") }}
      <a :href="$t('links.humlab')" class="link-deco text-accent text-bold">
        Humlab
      </a>
      {{ $t("indexPageIntroText2") }}
      <a :href="$t('links.swerik')" class="link-deco text-accent text-bold">
        SWERIK.
      </a>
    </q-card-section>
    <q-card-section
      class=""
      :class="$q.screen.lt.sm ? 'q-pt-sm q-pb-xl' : 'q-py-xl'"
    >
      <div class="grid-container max">
        <IndexToolCard
          v-for="(tool, index) in tools"
          :key="index"
          :title="$t(tool.title)"
          :text="$t(tool.text)"
          :icon="$t(tool.icon)"
          @click="redirect(tool.route)"
          class="full-width"
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

const tools = [
  {
    route: "tools/wordtrends",
    title: "wordTrendsTitle",
    text: "wordTrendsText",
    icon: "wordTrendsIcon",
  },
  {
    route: "tools/kwic",
    title: "kwicTitle",
    text: "kwicText",
    icon: "kwicIcon",
  },
  {
    route: "tools/speeches",
    title: "speechesTitle",
    text: "speechesText",
    icon: "speechesIcon",
  },
  {
    route: "tools/ngram",
    title: "nGramsTitle",
    text: "nGramsText",
    icon: "nGramsIcon",
  },
];
</script>

<style scoped>
.max {
  max-width: 1200px;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 400px));
  grid-gap: 30px;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}
</style>
