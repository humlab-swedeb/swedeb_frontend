<template>
  <template
    v-if="
      (wtStore.speechesData.length > 0 &&
        $route.path === '/tools/wordtrends') ||
      ($route.path === '/tools/speeches' &&
        speechStore.speechesData.length > 0) ||
      ($route.path === '/tools/ngram' && nGramStore.nGramSpeeches.length > 0)
    "
  >
    <div>
      <div class="row q-py-md justify-between">
        <q-item-label
          class="col-9 q-mt-md"
          v-if="
            wtStore.speechesData.length > 0 &&
            $route.path === '/tools/wordtrends'
          "
        >
          {{ $t("searchResult1") }}
          <b>{{ wtStore.speechesData.length }}</b>
          {{ $t("searchResult2") }}
        </q-item-label>
        <q-item-label
          class="col-9 q-mt-md"
          v-else-if="
            $route.path === '/tools/speeches' &&
            speechStore.speechesData.length > 0
          "
        >
          {{ $t("searchResult1") }}
          <b>{{ speechStore.speechesData.length }}</b> {{ $t("searchResult2") }}
        </q-item-label>
        <q-btn
          no-caps
          icon="download"
          class="text-grey-8 col-3"
          color="secondary"
          :label="$t('downloadSpeech')"
          @click="downloadSpeeches"
          style="width: fit-content"
        ></q-btn>
      </div>

      <q-table
        ref="SpeechTable"
        bordered
        flat
        :rows="rows"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[10, 20, 50]"
        v-model:pagination="pagination"
        class="bg-grey-2"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
              <q-icon
                v-if="col.label === 'Anförande'"
                name="info_outline"
                color="accent"
                class="q-mb-md q-ml-xs"
              >
                <q-tooltip>
                  {{ $t("accessibility.tooltipSpeechID") }}
                </q-tooltip>
              </q-icon>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" @click="expandRow(props)" class="cursor-pointer">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="bg-white"
              :class="props.expand ? 'bg-grey-3' : ''"
            >
              <q-item-label
                v-if="col.name === 'party'"
                :class="
                  col.value === '[-]' ? 'text-italic text-grey-6' : 'text-bold'
                "
                :style="{ color: metaStore.getPartyAbbrevColor(col.value) }"
              >
                {{
                  col.value === "[-]"
                    ? $t("accessibility.metadataMissing")
                    : col.value
                }}
                <q-tooltip
                  v-if="col.value !== '[-]'"
                  class="text-subtitle2"
                >
                  {{ props.row.party_full }}
                </q-tooltip>
              </q-item-label>
              <q-item-label
                v-else-if="col.name === 'node_word'"
                class="text-bold"
              >
                {{ col.value }}
              </q-item-label>
              <q-item-label
                v-else-if="col.value === 'Okänd' || col.value === 'Okänt'"
                class="text-italic text-grey-6"
              >
                {{ $t("accessibility.metadataMissing") }}
              </q-item-label>

              <q-item-label v-else>
                {{ col.value }}
              </q-item-label>
            </q-td>
            <q-td
              auto-width
              class="bg-white"
              :class="props.expand ? 'bg-grey-3' : ''"
            >
              <q-btn
                size="sm"
                color="accent"
                round
                dense
                flat
                :icon="
                  props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                "
              />
            </q-td>
          </q-tr>
          <!-- If row in table is clicked, EXPAND -->
          <expandingTableRow :props="props" />
        </template>
      </q-table>
    </div>
  </template>
  <template v-else>
    <!-- Show a message when there's no data -->
    <noResults />
  </template>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { speechesDataStore } from "src/stores/speechesDataStore.js";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import { nGramDataStore } from "src/stores/nGramDataStore";
import { downloadDataStore } from "src/stores/downloadDataStore";
import expandingTableRow from "src/components/expandingTableRow.vue";
import noResults from "src/components/noResults.vue";

const metaStore = metaDataStore();
const speechStore = speechesDataStore();
const wtStore = wordTrendsDataStore();
const nGramStore = nGramDataStore();
const downloadStore = downloadDataStore();

const props = defineProps({
  type: String,
  download: Function,
});

const displayedData = ref([]);
const SpeechTable = ref(null);
const visibleRows = ref([]);

const rows = ref([]);
const columns = ref([]);

const expandRow = async (props) => {
  props.expand = !props.expand;
};

if (props.type === "wordTrends") {
  displayedData.value = wtStore.speechesData; // detta kan sättas som en prop?
} else if (props.type === "speeches") {
  displayedData.value = speechStore.speechesData;
} else if (props.type === "ngram") {
  displayedData.value = nGramStore.nGramSpeeches;
}

rows.value = displayedData.value.map((speech) => ({
  id: speech.document_name,
  protocol: speech.speech_name,
  node_word: speech.node_word,
  speaker: speech.name,
  gender: speech.gender,
  party: speech.party_abbrev,
  party_full: speech.party,
  source: speech.speech_link,
  year: speech.year,
  link: speech.link,
}));

columns.value = [
  {
    name: "protocol",
    required: true,
    label: "Anförande",
    align: "left",
    field: (row) => row.protocol,
    sortable: true,
    sort: (a, b) => sortSpeeches(a, b),
  },
  {
    name: "speaker",
    required: true,
    label: "Talare",
    field: "speaker",
    sortable: true,
    align: "left",
  },
  {
    name: "gender",
    required: true,
    label: "Kön",
    field: "gender",
    sortable: true,
    align: "left",
  },
  {
    name: "party",
    required: true,
    label: "Parti",
    field: "party",
    sortable: true,
    align: "left",
  },
  {
    name: "year",
    required: true,
    label: "År",
    field: "year",
    sortable: true,
    align: "left",
  },
];

if (props.type === "wordTrends") {
  columns.value.splice(1, 0, {
    name: "node_word",
    required: true,
    label: "Sökord",
    field: "node_word",
    sortable: true,
    align: "left",
  });
}

const pagination = ref({});

function sortByYear(a, b) {
  const yearRegex = /(\d{4})/;

  // Extract the year from the protocol strings
  const yearA = a.match(yearRegex)[0];
  const yearB = b.match(yearRegex)[0];
  if (yearA < yearB) {
    return -1;
  } else if (yearA > yearB) {
    return 1;
  } else {
    return 0;
  }
}

function sortByChamber(a, b) {
  if (a.includes("Första") && !b.includes("Första")) {
    return -1;
  } else if (!a.includes("Första") && b.includes("Första")) {
    return 1;
  } else if (a.includes("Andra") && !b.includes("Andra")) {
    return 1;
  } else if (!a.includes("Andra") && b.includes("Andra")) {
    return -1;
  } else {
    return 0;
  }
}

function sortByNumber(a, b) {
  const numberA = parseInt(a.split(":")[1].replace(/\s/g, ""));
  const numberB = parseInt(b.split(":")[1].replace(/\s/g, ""));
  return numberA - numberB;
}

function sortSpeeches(a, b) {
  const yearRes = sortByYear(a, b);
  if (yearRes !== 0) {
    return yearRes;
  }
  const chamberRes = sortByChamber(a, b);
  if (chamberRes !== 0) {
    return chamberRes;
  }

  return sortByNumber(a, b);
}

function downloadSpeeches() {
  visibleRows.value = SpeechTable.value.computedRows.map((row) => row.id);
  const paramString = metaStore.selectedMetadataToText(props.type);
  downloadStore.downloadSpeechesZip(visibleRows.value, paramString);
}
</script>

<style scoped></style>
