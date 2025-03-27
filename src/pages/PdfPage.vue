<template>
  <q-btn flat no-caps @click="goBack" icon="close" class="q-mt-lg"
    >Stäng anförande</q-btn
  >
  <q-card
    flat
    class="background justify-center full-width"
    :class="$q.screen.lt.sm ? '' : 'row justify-center q-px-xl'"
  >
    <q-card-section :class="$q.screen.lt.md ? 'q-pa-none' : 'col-7'">
      <q-card-section
        class="row justify-center justify-between q-py-none full-width"
      >
        <q-card-section class="q-pt-none">
          <q-btn
            class="q-mr-md q-pl-sm"
            color="accent"
            no-caps
            @click="prevPage"
            icon="chevron_left"
            :disable="page <= 1"
          >
            Föregående sida
          </q-btn>
          <span class="text-bold text-subtitle1">
            {{ page }} / {{ totalPages }}
          </span>
          <q-btn
            class="q-ml-md q-pr-sm"
            color="accent"
            no-caps
            icon-right="chevron_right"
            @click="nextPage"
            :disable="page >= pdfData?.value?.pages"
          >
            Nästa sida
          </q-btn>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-btn no-caps flat @click="zoomOut" icon="zoom_out">Zoom ut</q-btn>
          <q-btn no-caps flat @click="zoomIn" icon="zoom_in">Zoom in</q-btn>
        </q-card-section>
      </q-card-section>
      <q-separator size="2px" color="grey-5" />
      <q-card-section class="pdf row justify-center bg-white q-ma-none">
        <div v-if="pdfData">
          <VuePDF :pdf="pdfData.pdf" :page="page" :scale="scale" />
        </div>
        <div v-else>
          <p class="text-center">PDF data is not available.</p>
        </div>
      </q-card-section>
    </q-card-section>

    <q-card-section :class="$q.screen.lt.md ? '' : 'col-5 q-pt-xl'">
      <q-card flat class="bg-transparent">
        <q-card-section class="q-px-md">
          <q-card-section class="q-px-none">
            <div
              class="text-h6 row"
              :style="{
                color: metaStore.getPartyAbbrevColor(speakerData.party),
              }"
            >
              <q-item-label
                class="q-mt-xs"
                :class="
                  speakerData.speaker === 'Okänd'
                    ? 'text-italic text-grey-6'
                    : ''
                "
                v-if="speakerData.speaker"
              >
                {{
                  speakerData.speaker === "Okänd"
                    ? $t("accessibility.speakerMissing")
                    : speakerData.speaker
                }},&nbsp;
              </q-item-label>
              <q-item-label
                class="q-mt-xs"
                :class="
                  speakerData.party === '[-]' ? 'text-italic text-grey-6' : ''
                "
                v-if="speakerData.party"
              >
                ({{
                  speakerData.party === "[-]"
                    ? $t("accessibility.partyMissing")
                    : speakerData.party
                }}),&nbsp;
              </q-item-label>
              <q-item-label
                class="q-mt-xs"
                :class="
                  speakerData.gender === 'Okänt'
                    ? 'text-italic text-grey-6'
                    : ''
                "
                v-if="speakerData.gender"
              >
                {{
                  speakerData.gender === "Okänt"
                    ? $t("accessibility.genderMissing")
                    : speakerData.gender
                }}
              </q-item-label>
            </div>
            <q-item-label caption class="text-bold">{{
              speakerData.protocol
            }}</q-item-label>
            <q-item-label class="q-pt-xs" v-if="speakerData.node_word">
              {{ $t("searchWordLabel") }}
              <b>{{ speakerData.node_word }}</b>
            </q-item-label>
          </q-card-section>
          <q-card-section
            class="q-pa-none q-pr-md"
            :class="$q.screen.lt.md ? '' : 'textbox'"
            style="white-space: normal"
          >
            <q-item-label caption class="text-bold">
              {{ speakerNote }}
            </q-item-label>
            <div>
              <div v-html="speechText" />
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { VuePDF, usePDF } from "@tato30/vue-pdf";
import { ref, onMounted, computed } from "vue";
import { pdfDataStore } from "src/stores/pdfDataStore";
import { metaDataStore } from "src/stores/metaDataStore";

const pdfStore = pdfDataStore();
const metaStore = metaDataStore();

const speakerData = ref([]);
const speechText = ref();
const speakerNote = ref();
const pdfLink = ref();
const pdfData = ref(null);
const searchWord = ref(""); // The word to search for


onMounted(() => {
  const storedData = sessionStorage.getItem("pdfData");
  if (storedData) {
    pdfStore.setRowData(JSON.parse(storedData));
    speakerData.value = pdfStore.speechData.speakerData;
    speechText.value = pdfStore.speechData.speechText;
    speakerNote.value = pdfStore.speechData.speakerNote;
    pdfLink.value = pdfStore.speechData.speakerData.source;
    pdfData.value = usePDF(pdfLink.value);
  }
});

const totalPages = computed(() => {
  return pdfData.value?.pages || "...";
});



//const { pdf, pages } = usePDF("/pdf/test.pdf");
const page = ref(1);
const scale = ref(1.4);

const nextPage = () => {
  if (page.value < pdfData.value.pages) {
    page.value++;
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
  }
};

const zoomIn = () => {
  scale.value += 0.1;
};

const zoomOut = () => {
  if (scale.value > 0.5) {
    scale.value -= 0.1;
  }
};

const goBack = () => {
  window.close();
};
</script>

<style scoped>
.pdf {
  max-width: 800px;
  max-height: 1200px;
  overflow: auto;
  margin: auto;
}

.textbox {
  max-height: 800px;
  overflow: auto;
}
</style>
