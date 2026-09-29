<template>
  <template
    v-if="$route.path === '/tools/ngram' && innerStore.innerSpeeches.length > 0"
  >
    <div>
      <div class="row q-py-md justify-between">
<q-btn-dropdown
        no-caps
        icon="download"
        class="text-grey-8 col-3"
        color="secondary"
        :label="$t('downloadSpeech')" 
        style="width: fit-content"
      >
        <q-list>
          <q-item
            clickable
            v-close-popup
            :disable="isDownloadActive(downloadKeys.speechesZip)"
            @click="downloadNgramSpeechesZip"
          >
            <q-item-section>
              <q-item-label class="row items-center no-wrap">
                <q-spinner-tail
                  v-if="isDownloadActive(downloadKeys.speechesZip)"
                  size="16px"
                  class="q-mr-sm"
                />
                {{ $t("downloadSpeechTextArchive") }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            :disable="isDownloadActive(downloadKeys.speechesJsonlGz)"
            @click="downloadNgramSpeechesJsonlGz"
          >
            <q-item-section>
              <q-item-label class="row items-center no-wrap">
                <q-spinner-tail
                  v-if="isDownloadActive(downloadKeys.speechesJsonlGz)"
                  size="16px"
                  class="q-mr-sm"
                />
                {{ $t("downloadSpeechJsonlGzArchive") }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            :disable="isDownloadActive(downloadKeys.speechesCsvGz)"
            @click="downloadNgramSpeechesCsvGz"
          >
            <q-item-section>
              <q-item-label class="row items-center no-wrap">
                <q-spinner-tail
                  v-if="isDownloadActive(downloadKeys.speechesCsvGz)"
                  size="16px"
                  class="q-mr-sm"
                />
                {{ $t("downloadSpeechCsvGzArchive") }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      </div>

      <q-table
        ref="SpeechTableNgram"
        bordered
        flat
        :rows="rows"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[10, 20, 50]"
        v-model:pagination="pagination"
        :loading="loading"
        class="bg-grey-2"
        @request="onRequest"
      >
        <template v-slot:top-row v-if="innerStore.isPartialInner">
          <q-tr>
            <q-td :colspan="columns.length + 1" class="q-pa-none">
              <q-linear-progress
                :value="
                  innerStore.shardsTotalInner > 0
                    ? innerStore.shardsCompleteInner /
                      innerStore.shardsTotalInner
                    : 0
                "
                color="accent"
                track-color="grey-3"
                class="q-mb-none"
                style="height: 6px"
              />
              <q-item-label caption class="q-px-sm q-pt-xs text-grey-7">
                {{
                  $t("ngramShardProgress", {
                    complete: innerStore.shardsCompleteInner,
                    total: innerStore.shardsTotalInner,
                  })
                }}
              </q-item-label>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:loading>
          <q-inner-loading showing class="table-loading-overlay">
            <q-spinner-tail size="48px" color="accent" :thickness="5" />
            <q-item-label caption class="text-center text-bold q-mt-md">
              {{ $t("accessibility.loadingResults") }}
            </q-item-label>
          </q-inner-loading>
        </template>

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
          <q-tr
            :props="props"
            @click="expandRow(props)"
            class="cursor-pointer"
            data-test="table-row"
          >
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
                <q-tooltip class="text-subtitle2" v-if="col.value !== '[-]'">
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
import { ref, defineProps, computed } from "vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { innerNGramDataStore } from "src/stores/innerNGramDataStore"
import { downloadDataStore } from "src/stores/downloadDataStore";
import expandingTableRow from "src/components/expandingTableRow.vue";
import noResults from "src/components/noResults.vue";

const metaStore = metaDataStore();
const downloadStore = downloadDataStore();
const innerStore = innerNGramDataStore();

const props = defineProps({
  type: String,
  download: Function,
  totalHits: Number,
  rowID: Number,
  ngram: String,
});

const downloadKeys = {
  csv: "ngram-csv",
  excel: "ngram-excel",
  speechesZip: "ngram-speeches-zip",
  speechesJsonlGz: "ngram-speeches-jsonlgz",
  speechesCsvGz: "ngram-speeches-csvgz",
};

const isDownloadActive = (downloadKey) =>
  downloadStore.isDownloadActive(downloadKey);

innerStore.innerPagination.rowsNumber = props.totalHits;

const pagination = computed({
  get: () => innerStore.innerPagination,
  set: (value) => {
    innerStore.innerPagination = value;
  },
});

const SpeechTableNgram = ref(null);

const columns = ref([]);

const expandRow = async (props) => {
  props.expand = !props.expand;
};

const loading = ref(false);

const onRequest = async ({ pagination }) => {
  loading.value = true;

  if (!innerStore.ticketIdInner) {
    return;
  }

  // Ignore sort changes while results are still loading (PARTIAL)
  if (
    innerStore.isPartialInner &&
    (pagination.sortBy !== innerStore.innerPagination.sortBy ||
      pagination.descending !== innerStore.innerPagination.descending)
  ) {
    loading.value = false;
    return;
  }

  await innerStore.fetchInnerPage({
    page: pagination.page,
    rowsPerPage: pagination.rowsPerPage,
    sortBy: pagination.sortBy,
    descending: pagination.descending,
  });

  loading.value = false;
};

const customOptionName = (name) => {
  return name.replace(/&quot/g, '"');
};

const rows = computed(() =>
  innerStore.innerSpeeches.map((entry, index) => ({
    id: entry.speech_id,
    unique_id: `${innerStore.innerPagination.page}-${index}-${entry.speech_id}`,
    year: entry.year,
    speaker: customOptionName(entry.name),
    party: entry.party_abbrev,
    party_full: entry.party,
    gender: entry.gender,
    person_id: entry.person_id,
    link: entry.link,
    protocol: entry.speech_name,
    source: entry.speech_link,
    node_word: entry.node_word,
  })),
);

columns.value = [
  {
    name: "protocol",
    required: true,
    label: "Anförande",
    align: "left",
    field: (row) => row.protocol,
    sortable: true,
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

const downloadNgramSpeechesZip = async () => {
  await innerStore.downloadNGramSpeechesZipInner(downloadKeys.speechesZip);
};

const downloadNgramSpeechesJsonlGz = async () => {
  await innerStore.downloadNGramSpeechesJsonlGzInner(downloadKeys.speechesJsonlGz);
};

const downloadNgramSpeechesCsvGz = async () => {
  await innerStore.downloadNGramSpeechesCsvGzInner(downloadKeys.speechesCsvGz);
};
</script>

<style scoped>
.table-loading-overlay {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(1px);
}
</style>
