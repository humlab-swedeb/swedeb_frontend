<template>
  <q-page class="flex flex-center">
    <div
      style="
        width: 80vw;
        max-width: 1000px;

        background-color: rgb(219, 219, 219);
        border-radius: 7px;
      "
      class="q-pa-lg"
    >
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae
      excepturi deleniti hic eveniet eius necessitatibus sit suscipit ea modi
      ratione commodi qui voluptatem, ut eum tempora quis? Id, quia dolorem.

      <div class="grid-container q-mt-lg">
        <IndexToolCard @click="redirect(wordTrendsTitle)" :title="wordTrendsTitle" :text="wordTrendsText" :icon='wordTrendsIcon'/>
        <IndexToolCard @click="redirect(kwicTitle)" :title="kwicTitle" :text="kwicText" :icon='kwicIcon'/>
        <IndexToolCard @click="redirect(speechesTitle)" :title="speechesTitle" :text="speechesText" :icon='speechesIcon'/>
        <IndexToolCard @click="redirect(nGramsTitle)" :title="nGramsTitle" :text="nGramsText" :icon='nGramsIcon'/>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import IndexToolCard from '../components/IndexToolCard.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { IndexToolCard },
  data() {
    return {
      wordTrendsTitle: 'Ordtrender',
      wordTrendsText: 'Se vilka ord som är mest populära i dag',
      wordTrendsIcon: 'trending_up',
      kwicTitle: 'KWIC',
      kwicText: 'Se hur ett ord används i olika sammanhang',
      kwicIcon: 'o_library_books',
      speechesTitle: 'Anföranden',
      speechesText: 'Se vilka anföranden specifika personer gjort',
      speechesIcon: 'o_campaign',
      nGramsTitle: 'N-Gram',
      nGramsText: 'Se hur ett ord har använts över tid',
      nGramsIcon: 'show_chart',

    };
  },
  methods: {
    redirect(title) {
      if (title === 'Ordtrender') {
        this.$router.push('tools/wordtrends');
      }
      else if (title === 'KWIC') {
        this.$router.push('tools/kwic');
      }
      else if (title === 'Anföranden') {
        this.$router.push('tools/speeches');
      }
      else if (title === 'N-Gram') {
        this.$router.push('tools/ngram');
      }
    },
  },
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
}
</style>
