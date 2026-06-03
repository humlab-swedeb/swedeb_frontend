<template>
  <q-btn flat no-caps @click="goBack" icon="close" class="q-mt-lg">
    {{ $t("closeSpeech") }}
  </q-btn>
  <q-card
    flat
    class="background justify-center full-width"
    :class="$q.screen.lt.md ? '' : 'row justify-center q-px-xl'"
  >
    <q-card-section :class="$q.screen.lt.md ? 'q-pa-none' : 'col-7'">
      <q-card-section class="row justify-center justify-between q-py-none full-width">
        <q-card-section class="q-pt-none">
          <q-btn
            class="q-mr-md q-pl-sm"
            color="accent"
            no-caps
            @click="prevPage"
            icon="chevron_left"
            :disable="page <= firstPage"
          >
            {{ $t("previousPage") }}
          </q-btn>
          <span class="text-bold text-subtitle1">
            {{ page }} / {{ lastPage }}
          </span>
          <q-btn
            class="q-ml-md q-pr-sm"
            color="accent"
            no-caps
            icon-right="chevron_right"
            @click="nextPage"
            :disable="page >= lastPage"
          >
            {{ $t("nextPage") }}
          </q-btn>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-btn no-caps flat @click="zoomIn" icon="zoom_in">{{ $t("zoomIn") }}</q-btn>
          <q-btn no-caps flat @click="zoomOut" icon="zoom_out">{{ $t("zoomOut") }}</q-btn>
        </q-card-section>
      </q-card-section>
      <div class="q-ml-md q-pr-sm text-bold text-negative">{{ $t("pageNrInfoText") }}</div>
      <q-separator size="2px" color="grey-5" />
      <q-card-section class="pdf row justify-center bg-white q-ma-none">
        <div v-if="pdfSrc">
          <PdfEmbed :key="pdfSrc" :source="pdfSrc" :width="docWidth" />
        </div>
        <div v-else>
          <p>PDF is not available.</p>
        </div>
      </q-card-section>
      <div class="q-ml-md q-pr-sm">
        {{ $t("riksdagenLinkText") }}
        <a
          :href="$t('riksdagenLink')"
          target="_blank"
          rel="noopener noreferrer"
          class="q-ml-sm text-accent"
        >
          {{ $t("riksdagenLink") }}
        </a>
      </div>
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
                v-if="speakerData.speaker"
                class="q-mt-xs"
                :class="speakerData.speaker === 'Okänd' ? 'text-italic text-grey-6' : ''"
              >
                {{
                  speakerData.speaker === "Okänd"
                    ? $t("accessibility.speakerMissing")
                    : speakerData.speaker
                }},&nbsp;
              </q-item-label>
              <q-item-label
                v-if="speakerData.party"
                class="q-mt-xs"
                :class="speakerData.party === '[-]' ? 'text-italic text-grey-6' : ''"
              >
                ({{
                  speakerData.party === "[-]"
                    ? $t("accessibility.partyMissing")
                    : speakerData.party
                }}),&nbsp;
              </q-item-label>
              <q-item-label
                v-if="speakerData.gender"
                class="q-mt-xs"
                :class="speakerData.gender === 'Okänt' ? 'text-italic text-grey-6' : ''"
              >
                {{
                  speakerData.gender === "Okänt"
                    ? $t("accessibility.genderMissing")
                    : speakerData.gender
                }}
              </q-item-label>
            </div>
            <q-item-label caption class="text-bold">{{ speakerData.protocol }}</q-item-label>
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
import { onMounted, ref } from "vue";
import PdfEmbed from "vue-pdf-embed";

import { api } from "boot/axios";
import { metaDataStore } from "src/stores/metaDataStore";
import { pdfDataStore } from "src/stores/pdfDataStore";

const PAGE_PDF_PATH_RE = /\/(?<year>\d{4,8})\/(?<protocol>prot-[^/]+)\/(?<filename>prot-[^/]+)_(?<page>\d+)\.pdf$/;

const pdfStore = pdfDataStore();
const metaStore = metaDataStore();

const speakerData = ref({});
const speechText = ref("");
const speakerNote = ref("");
const page = ref(1);
const firstPage = ref(1);
const lastPage = ref(1);
const pdfSrc = ref(null);
const docWidth = ref(600);

const parsePagePdfSource = (source) => {
  if (!source) {
    return null;
  }

  try {
    const pathname = new URL(source).pathname;
    const match = pathname.match(PAGE_PDF_PATH_RE);
    if (!match?.groups) {
      return null;
    }
    return {
      protocolName: match.groups.protocol,
      page: Number.parseInt(match.groups.page, 10),
    };
  } catch (error) {
    const match = source.match(PAGE_PDF_PATH_RE);
    if (!match?.groups) {
      return null;
    }
    return {
      protocolName: match.groups.protocol,
      page: Number.parseInt(match.groups.page, 10),
    };
  }
};

const replacePageNumberInSource = (source, nextPage) => {
  const paddedPage = String(nextPage).padStart(3, "0");

  try {
    const url = new URL(source);
    url.pathname = url.pathname.replace(/_\d+\.pdf$/, `_${paddedPage}.pdf`);
    return url.toString();
  } catch (error) {
    return source.replace(/_\d+\.pdf(?=$|[?#])/, `_${paddedPage}.pdf`);
  }
};

const persistPdfData = () => {
  const data = {
    speakerNote: speakerNote.value,
    speechText: speechText.value,
    speakerData: {
      ...speakerData.value,
      source: pdfSrc.value,
    },
    page: page.value,
  };

  pdfStore.setRowData(data);
  sessionStorage.setItem("pdfData", JSON.stringify(data));
};

const loadPageRange = async (protocolName) => {
  try {
    const response = await api.get("/tools/protocol/page_range", {
      params: { protocol_name: protocolName },
    });

    if (Array.isArray(response.data) && response.data.length === 2) {
      firstPage.value = Number(response.data[0]);
      lastPage.value = Number(response.data[1]);
    }
  } catch (error) {
    console.error("Error fetching protocol page range:", error);
    firstPage.value = page.value;
    lastPage.value = page.value;
  }
};

const setPage = (nextPage) => {
  if (!pdfSrc.value) {
    return;
  }

  page.value = nextPage;
  pdfSrc.value = replacePageNumberInSource(pdfSrc.value, nextPage);
  persistPdfData();
};

const nextPage = () => {
  if (page.value < lastPage.value) {
    setPage(page.value + 1);
  }
};

const prevPage = () => {
  if (page.value > firstPage.value) {
    setPage(page.value - 1);
  }
};

const zoomIn = () => {
  docWidth.value += 30;
};

const zoomOut = () => {
  if (docWidth.value > 200) {
    docWidth.value -= 30;
  }
};

const goBack = () => {
  window.close();
};

onMounted(async () => {
  const storedData = sessionStorage.getItem("pdfData");
  if (!storedData) {
    return;
  }

  const parsed = JSON.parse(storedData);
  pdfStore.setRowData(parsed);

  speakerData.value = parsed.speakerData ?? {};
  speechText.value = parsed.speechText ?? "";
  speakerNote.value = parsed.speakerNote ?? "";
  pdfSrc.value = parsed.speakerData?.source ?? null;

  const pagePdfInfo = parsePagePdfSource(pdfSrc.value);
  page.value = pagePdfInfo?.page ?? Number(parsed.page ?? 1);
  firstPage.value = page.value;
  lastPage.value = page.value;

  if (pagePdfInfo?.protocolName) {
    await loadPageRange(pagePdfInfo.protocolName);
  }

  persistPdfData();
});
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
