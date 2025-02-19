<!-- ExpandingRow.vue -->
<template>
  <q-tr v-show="props.props.expand" :props="props.props">
    <q-td
      :colspan="
        $q.screen.lt.sm
          ? $route.path === '/tools/kwic'
            ? '3'
            : '2'
          : props.props.cols.length
      "
      no-hover
      :style="$q.screen.lt.sm ? 'width: 40vw' : ''"
    >
      <loadingIcon v-if="loading" size="100" />
      <q-card v-else flat class="bg-transparent">
        <q-card-section class="q-px-md row">
          <q-card-section class="col q-pa-none">
            <div
              class="text-h6 row"
              :style="{
                color: metaStore.getPartyAbbrevColor(props.props.row.party),
              }"
            >
              <q-item-label
                class="q-mt-xs"
                :class="
                  props.props.row.speaker === 'Okänd'
                    ? 'text-italic text-grey-6'
                    : ''
                "
                v-if="props.props.row.speaker"
              >
                {{
                  props.props.row.speaker === "Okänd"
                    ? $t("accessibility.speakerMissing")
                    : props.props.row.speaker
                }},&nbsp;
              </q-item-label>
              <q-item-label
                v-if="props.props.row.party"
                class="q-mt-xs"
                :class="
                  props.props.row.party === '[-]'
                    ? 'text-italic text-grey-6'
                    : ''
                "
              >
                {{
                  props.props.row.party === "[-]"
                    ? $t("accessibility.partyMissing")
                    : props.props.row.party_full
                }},&nbsp;
              </q-item-label>
              <q-item-label
                class="q-mt-xs"
                :class="
                  props.props.row.gender === 'Okänt'
                    ? 'text-italic text-grey-6'
                    : ''
                "
                v-if="props.props.row.gender"
              >
                {{
                  props.props.row.gender === "Okänt"
                    ? $t("accessibility.genderMissing")
                    : props.props.row.gender
                }}
              </q-item-label>
            </div>
            <q-item-label caption class="text-bold">{{
              props.props.row.protocol
            }}</q-item-label>
            <q-item-label class="q-pt-xs" v-if="props.props.row.node_word">
              {{ $t("searchWordLabel") }}
              <b>{{ props.props.row.node_word }}</b>
            </q-item-label>
          </q-card-section>
        </q-card-section>
        <q-card-section
          :class="
            $q.screen.lt.sm ? 'column q-pt-none q-px-none' : 'row q-pr-none'
          "
        >
          <!-- IF SMALL SCREEN -->
          <q-card-section v-show="$q.screen.lt.sm" class="q-pa-none q-mb-md">
            <div class="column q-gutter-y-sm">
              <q-btn
                v-if="props.props.row.link !== 'Okänd'"
                no-caps
                :href="props.props.row.link"
                target="_blank"
                class="text-grey-8 fit"
                color="secondary"
              >
                <q-icon left name="person_search" color="accent" />
                <q-item-label>{{ $t("wikidata") }}</q-item-label>
              </q-btn>
              <q-btn
                no-caps
                :href="props.props.row.source"
                target="_blank"
                class="text-grey-8"
                color="white"
              >
                <q-icon left name="open_in_new" color="accent" />
                <q-item-label>{{ $t("openSource") }}</q-item-label>
              </q-btn>
              <q-btn
                outline
                no-caps
                class="text-grey-8"
                color="accent"
                @click="downloadCurrentSpeech"
              >
                <q-icon left name="download" color="accent" />
                <q-item-label>{{ $t("download") }}</q-item-label>
              </q-btn>
            </div>
          </q-card-section>
          <q-card-section
            class="q-pa-none q-pr-md"
            :class="$q.screen.lt.sm ? '' : 'col-10'"
            style="white-space: normal"
          >
            <q-item-label caption class="text-bold">{{
              speakerNote
            }}</q-item-label>
            <loadingIcon v-if="loading" size="100" />
            <div v-else>
              <div
                v-if="$route.path !== '/tools/speeches'"
                v-html="speechText"
              ></div>
              <div v-else>{{ originalSpeechText }}</div>
            </div>
          </q-card-section>
          <!-- IF LARGE SCREEN -->
          <q-card-section v-show="!$q.screen.lt.sm" class="q-pa-none col-2">
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
                <q-item-label>{{ $t("wikidata") }}</q-item-label>
              </q-btn>
              <q-btn
                no-caps
                :href="props.props.row.source"
                target="_blank"
                class="full-width items-start text-grey-8"
                color="white"
              >
                <q-icon left name="open_in_new" color="accent" />
                <q-item-label>{{ $t("openSource") }}</q-item-label>
              </q-btn>
              <q-btn
                outline
                no-caps
                class="full-width items-start text-grey-8"
                color="accent"
                @click="downloadCurrentSpeech"
              >
                <q-icon left name="download" color="accent" />
                <q-item-label>{{ $t("download") }}</q-item-label>
              </q-btn>
              <div>
                <q-btn
                  flat=""
                  no-caps
                  rounded
                  class="items-start text-grey-7"
                  @click="popup = true"
                >
                  <q-icon left name="report" color="grey-7" />
                  <q-item-label>Rapportera</q-item-label>
                </q-btn>
              </div>
              <reportForm :clicked="popup" @close="popup = false" />
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
import { feedbackDataStore } from "src/stores/feedbackDataStore";
import { nGramDataStore } from "src/stores/nGramDataStore";

import loadingIcon from "src/components/loadingIcon.vue";
import reportForm from "src/components/reportForm.vue";

const metaStore = metaDataStore();
const speechStore = speechesDataStore();
const downloadStore = downloadDataStore();
const feedbackStore = feedbackDataStore();
const nGramStore = nGramDataStore();
const route = useRoute();

const props = defineProps({
  props: Object,
});

const feedbackData = (myProps) => {
  feedbackStore.data = myProps;
};

const popup = ref(false);
const speakerNote = ref("");
const speechText = ref("");
const originalSpeechText = ref("");
const loading = ref(false);

const replaceNewLine = (str) => {
  return str.replace(/\n/g, "<br><br>");
};

const replaceWordWithBoldTags = (str, word) => {
  const words = word.includes(",")
    ? word.split(",").map((w) => w.trim())
    : [word.trim()];

  words.forEach((w) => {
    const regex = new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, "giu");
    str = str.replace(regex, (match) => `<b>${match}</b>`);
  });

  return str;
};

const replaceNgramWithBoldTags = (str, ngram) => {
  const fixed_spaces = ngram
    .replace(" .", ".")
    .replace(" ,", ",")
    .replace(" :", ":");
  return str.replace(fixed_spaces, `<b>${fixed_spaces}</b>`);
};

const downloadCurrentSpeech = () => {
  downloadStore.downloadCurrentSpeechText(
    originalSpeechText.value,
    props.props.row
  );
};

watchEffect(() => {
  if (props.props.expand) {
    feedbackData({ ...props.props.row });
    loading.value = true;
    (async () => {
      const speechData = await speechStore.getSpeech(props.props.row.id);
      speakerNote.value = speechData.speaker_note;
      originalSpeechText.value = speechData.speech_text;

      if (route.path !== "/tools/speeches" && route.path !== "/tools/ngram") {
        speechText.value = replaceWordWithBoldTags(
          replaceNewLine(speechData.speech_text),
          props.props.row.node_word
        );
      } else if (route.path === "/tools/ngram") {
        speechText.value = replaceNgramWithBoldTags(
          replaceNewLine(speechData.speech_text),
          props.props.row.node_word
        );
      } else {
        speechText.value = replaceNewLine(speechData.speech_text);
      }
    })();
    setTimeout(() => {
      loading.value = false;
    }, 400);
  }
});
</script>
