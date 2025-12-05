<template>
  <q-btn flat no-caps @click="goBack" icon="close" class="q-mt-lg">{{
    $t("closeSpeech")
  }}</q-btn>
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
            :disable="currentPage <= 1"
          >
            {{ $t("previousPage") }}
          </q-btn>
          <span class="text-bold text-subtitle1">
            {{ currentPage }} / {{ totalNumPages }}
          </span>
          <q-btn
            class="q-ml-md q-pr-sm"
            color="accent"
            no-caps
            icon-right="chevron_right"
            @click="nextPage"
            :disable="currentPage >= totalNumPages"
          >
            {{ $t("nextPage") }}
          </q-btn>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-btn no-caps flat @click="zoomOut" icon="zoom_out">{{
            $t("zoomOut")
          }}</q-btn>
          <q-btn no-caps flat @click="zoomIn" icon="zoom_in">{{
            $t("zoomIn")
          }}</q-btn>
        </q-card-section>
      </q-card-section>
      <div class="q-ml-md q-pr-sm text-bold text-negative">
        {{ pageNumberMissing ? $t("pageNrMissingText") : $t("pageNrInfoText") }}
      </div>
      <q-separator size="2px" color="grey-5" />
      <q-card-section class="pdf row justify-center bg-white q-ma-none">
        <div v-if="singlePagePdfUrl">
          <PdfEmbed :source="singlePagePdfUrl" :page="1" :width="docWith" />
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
import PdfEmbed from "vue-pdf-embed";
import { ref, onMounted, computed, watch } from "vue";
import { pdfDataStore } from "src/stores/pdfDataStore";
import { metaDataStore } from "src/stores/metaDataStore";
import { getPdfPageCount } from "src/utils/pdfPageCount";

const pdfStore = pdfDataStore();
const metaStore = metaDataStore();

const speakerData = ref([]);
const speechText = ref();
const speakerNote = ref();
const pdfLink = ref();
const pdfData = ref(null);
const searchWord = ref(""); // The word to search for
const currentPage = ref(1);
const pdfSrc = ref(null); // Full PDF URL (used for getting page count)
const singlePagePdfUrl = ref(null); // Single-page PDF URL (used for display)
const totalNumPages = ref(0);
const docWith = ref(600);
const pageNumberMissing = ref(false); // Track if original page was -1

/**
 * Converts a full PDF URL to a single-page PDF URL
 * @param {string} fullPdfUrl - Full PDF URL (e.g., https://pdf.swedeb.se/riksdagen-records-pdf/1870/prot-1870--ak--0118.pdf#page=1)
 * @param {number} pageNumber - Page number (1-indexed)
 * @returns {string} Single-page PDF URL
 */
function getSinglePagePdfUrl(fullPdfUrl, pageNumber) {
  if (!fullPdfUrl) return null;

  // Remove the #page=X fragment if present
  const urlWithoutFragment = fullPdfUrl.split("#")[0];

  // Extract the base URL and filename
  // Example: https://pdf.swedeb.se/riksdagen-records-pdf/1870/prot-1870--ak--0118.pdf
  const lastSlashIndex = urlWithoutFragment.lastIndexOf("/");
  const baseUrl = urlWithoutFragment.substring(0, lastSlashIndex);
  const filename = urlWithoutFragment.substring(lastSlashIndex + 1);

  // Remove .pdf extension
  const filenameWithoutExt = filename.replace(".pdf", "");

  // Special case for years 199293 and 199394:
  // - Pages are 1-indexed (not 0-indexed)
  // - Page numbers are zero-padded to 4 digits
  const isSpecialYear =
    urlWithoutFragment.includes("/199293/") ||
    urlWithoutFragment.includes("/199394/");

  let paddedPageNumber;
  if (isSpecialYear) {
    // 1-indexed, 4 digits (e.g., page 1 → 0001, page 2 → 0002)
    paddedPageNumber = String(pageNumber).padStart(4, "0");
  } else {
    // 0-indexed, 3 digits (e.g., page 1 → 000, page 2 → 001)
    const pageIndex = pageNumber - 1;
    paddedPageNumber = String(pageIndex).padStart(3, "0");
  }

  // Construct single-page URL
  // Example: https://pdf.swedeb.se/riksdagen-records-pdf/1870/prot-1870--ak--0118/prot-1870--ak--0118_000.pdf
  // Special: https://pdf.swedeb.se/riksdagen-records-pdf/199293/prot-199293--007/prot-199293--007_0001.pdf
  return `${baseUrl}/${filenameWithoutExt}/${filenameWithoutExt}_${paddedPageNumber}.pdf`;
}

onMounted(async () => {
  const storedData = sessionStorage.getItem("pdfData");
  if (storedData) {
    pdfStore.setRowData(JSON.parse(storedData));

    const parsed = JSON.parse(storedData);
    console.log("Parsed PDF Data:", parsed);

    // Store the full PDF URL (for getting page count)
    pdfSrc.value = parsed.speakerData?.source;

    speakerData.value = pdfStore.speechData.speakerData;
    speechText.value = pdfStore.speechData.speechText;
    speakerNote.value = pdfStore.speechData.speakerNote;

    // If page is -1 (missing), set it to 1
    if (parsed.page === -1) {
      pageNumberMissing.value = true;
      currentPage.value = 1;
    } else {
      currentPage.value = parsed.page;
    }

    // Set the initial single-page PDF URL
    if (pdfSrc.value) {
      singlePagePdfUrl.value = getSinglePagePdfUrl(
        pdfSrc.value,
        currentPage.value
      );
      console.log("Single-page PDF URL:", singlePagePdfUrl.value);
    }

    // Get total page count from PDF using efficient range requests
    if (pdfSrc.value) {
      try {
        // Remove the #page=X fragment from URL if present
        const pdfUrl = pdfSrc.value.split("#")[0];
        totalNumPages.value = await getPdfPageCount(pdfUrl);
        console.log("Total pages loaded:", totalNumPages.value);
      } catch (error) {
        console.error("Failed to get page count:", error);
      }
    }
  }
});

// Watch for page changes and update the single-page PDF URL
watch(currentPage, (newPage) => {
  if (pdfSrc.value) {
    singlePagePdfUrl.value = getSinglePagePdfUrl(pdfSrc.value, newPage);
    console.log("Updated single-page PDF URL:", singlePagePdfUrl.value);
  }
});

const nextPage = () => {
  if (currentPage.value < totalNumPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const zoomIn = () => {
  docWith.value += 30;
};

const zoomOut = () => {
  if (docWith.value > 200) {
    docWith.value -= 30;
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
