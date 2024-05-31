<!-- ExpandingRow.vue -->
<template>
  <q-tr v-show="props.props.expand" :props="props.props">
    <q-td :colspan="props.props.cols.length" no-hover>
      <loadingIcon v-if="loading" size="100" />
      <q-card v-else flat class="bg-transparent">
        <q-card-section class="q-px-md row">
          <q-card-section class="col q-pa-none">
            <div
              class="text-h6 row"
              :style="{
                color: metaStore.getPartyNameColor(props.props.row.party),
              }"
            >
              <q-item-label class="q-mt-xs" v-if="props.props.row.speaker">
                {{ props.props.row.speaker }},&nbsp;
              </q-item-label>
              <q-item-label class="q-mt-xs" v-if="props.props.row.party">
                ({{ props.props.row.party }}),&nbsp;
              </q-item-label>
              <q-item-label class="q-mt-xs" v-if="props.props.row.gender">
                {{ props.props.row.gender }}
              </q-item-label>
            </div>
            <q-item-label caption class="text-bold">{{
              props.props.row.protocol
            }}</q-item-label>
            <q-item-label class="q-pt-xs" v-if="props.props.row.node_word">
              Sökord:
              <b>{{ props.props.row.node_word }}</b>
            </q-item-label>
          </q-card-section>
        </q-card-section>
        <q-card-section class="row">
          <q-card-section
            class="q-pa-none q-pr-md col-10"
            style="white-space: normal"
          >
            <q-item-label caption class="text-bold">{{
              speakerNote
            }}</q-item-label>
            <div
              v-if="$route.path !== '/tools/speeches'"
              v-html="speechText"
            ></div>
            <div v-else>{{ originalSpeechText }}</div>
          </q-card-section>
          <q-card-section class="col-2 q-pa-none">
            <div class="column q-gutter-y-md">
              <q-btn
                v-if="props.props.row.link !== 'Okänd'"
                no-caps
                :href="props.props.row.link"
                target="_blank"
                class="full-width items-start text-grey-8"
                color="secondary"
              >
                <q-icon left name="person_search" color="accent" />
                <q-item-label>Wikidata</q-item-label>
              </q-btn>
              <q-btn
                no-caps
                :href="props.props.row.source"
                target="_blank"
                class="full-width items-start text-grey-8"
                color="white"
              >
                <q-icon left name="open_in_new" color="accent" />
                <q-item-label>Öppna källa</q-item-label>
              </q-btn>
              <q-btn
                outline
                no-caps
                class="full-width items-start text-grey-8"
                color="accent"
                @click="downloadCurrentSpeech"
              >
                <q-icon left name="download" color="accent" />
                <q-item-label>Ladda ned</q-item-label>
              </q-btn>
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-td>
  </q-tr>
</template>

<script setup>
import { ref, watchEffect, defineProps } from "vue";
import { useRoute } from "vue-router";
import { metaDataStore } from "src/stores/metaDataStore";
import { speechesDataStore } from "src/stores/speechesDataStore";
import { downloadDataStore } from "src/stores/downloadDataStore";
import loadingIcon from "src/components/loadingIcon.vue";

const metaStore = metaDataStore();
const speechStore = speechesDataStore();
const downloadStore = downloadDataStore();
const route = useRoute();

const props = defineProps({
  props: Object,
});

const speakerNote = ref("");
const speechText = ref("");
const originalSpeechText = ref("");
const loading = ref(false);

const replaceNewLine = (str) => {
  return str.replace(/\n/g, "<br><br>");
};

const replaceWordWithBoldTags = (str, word) => {
  const words = word.split(",").map((w) => w.trim());

  words.forEach((w) => {
    const regex = new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, "giu");
    str = str.replace(regex, (match) => `<b>${match}</b>`);
  });

  return str;
};

const downloadCurrentSpeech = () => {
  downloadStore.downloadCurrentSpeechText(
    originalSpeechText.value,
    props.props.row
  );
};

watchEffect(() => {
  if (props.props.expand) {
    loading.value = true;
    (async () => {
      const speechData = await speechStore.getSpeech(props.props.row.id);
      speakerNote.value = speechData.speaker_note;
      originalSpeechText.value = speechData.speech_text;
      if (route.path !== "/tools/speeches") {
        speechText.value = replaceWordWithBoldTags(
          replaceNewLine(speechData.speech_text),
          props.props.row.node_word
        );
      }
    })();
    setTimeout(() => {
      loading.value = false;
    }, 400);
  }
});
</script>
