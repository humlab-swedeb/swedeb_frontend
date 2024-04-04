<!-- ExpandingRow.vue -->
<template>
  <q-tr v-show="props.props.expand" :props="props.props">
    <q-td colspan="7" no-hover>
      <q-card flat class="bg-transparent">
        <q-card-section class="q-px-md row">
          <q-card-section class="col q-pa-none">
            <q-item-label
              class="text-h6"
              :style="{
                color: metaStore.getPartyColor(props.props.row.party),
              }"
              >{{ props.props.row.speaker }}, ({{ props.props.row.party }}),
              {{ props.props.row.gender }}
            </q-item-label>
            <q-item-label>{{ props.props.row.protocol }}</q-item-label>
          </q-card-section>
          <q-card-section class="col q-pa-none">
            <q-item-label>{{ props.props.row.node_word }}</q-item-label>
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
            <div v-html="speechText"></div>
          </q-card-section>
          <q-card-section class="col-2 q-pa-none">
            <div class="column q-gutter-y-md">
              <q-btn
                no-caps
                :href="props.props.row.source"
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
import { metaDataStore } from "src/stores/metaDataStore";
import { speechesDataStore } from "src/stores/speechesDataStore";
import { downloadDataStore } from "src/stores/downloadDataStore";

const metaStore = metaDataStore();
const speechStore = speechesDataStore();
const downloadStore = downloadDataStore();

const props = defineProps({
  props: Object,
});

const speakerNote = ref("");
const speechText = ref("");
const originalSpeechText = ref("");

const replaceNewLine = (str) => {
 return str.replace(/\n/g, "<br><br>");
};

const replaceWordWithBoldTags = (str, word) => {
  // add bold tags to word hits. Only matches whole words
 // which might not be ideal for lemmatized matches
  const regex = new RegExp(`(?<!\\p{L})${word}(?!\\p{L})`, "giu");
  return str.replace(regex, `<b>${word}</b>`);
};

const downloadCurrentSpeech = () => {

  downloadStore.downloadCurrentSpeechText(
    originalSpeechText.value,
    props.props.row
  );
}

watchEffect(() => {
  if (props.props.expand) {

    (async () => {


      const speechData = await speechStore.getSpeech(props.props.row.id);
      speakerNote.value = speechData.speaker_note;
      originalSpeechText.value = speechData.speech_text;
      speechText.value = replaceWordWithBoldTags(
        replaceNewLine(speechData.speech_text),
        props.props.row.node_word
      );
    })();
  }
});
</script>
