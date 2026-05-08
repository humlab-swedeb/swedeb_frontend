<template>
  <template v-if="showLoadingIndicator">
    <loadingIcon size="64" />
  </template>
  <template v-else-if="kwicStore.kwicData && kwicStore.kwicData.length > 0">
    <div class="row q-py-md justify-between">
      <q-item-label class="col-9 q-mt-md" v-if="kwicStore.totalHits > 0">
        <i18n-t keypath="searchResultHits" tag="span">
          <template #count>
            <b>{{ kwicStore.totalHits }}</b>
          </template>
        </i18n-t>
      </q-item-label>

      <q-btn-dropdown
        no-caps
        icon="download"
        class="text-grey-8 col-3"
        color="secondary"
        :label="$t('downloadKWIC')"
        style="width: fit-content"
      >
        <q-list>
          <q-item
            clickable
            v-close-popup
            :disable="isDownloadActive(downloadKeys.csv)"
            @click="downloadKWICTableAsCSV"
          >
            <q-item-section>
              <q-item-label class="row items-center no-wrap">
                <q-spinner-tail
                  v-if="isDownloadActive(downloadKeys.csv)"
                  size="16px"
                  class="q-mr-sm"
                />
                {{ $t("downloadCSV") }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            :disable="isDownloadActive(downloadKeys.jsonlgz)"
            @click="downloadKWICTableAsJsonlGz"
          >
            <q-item-section>
              <q-item-label class="row items-center no-wrap">
                <q-spinner-tail
                  v-if="isDownloadActive(downloadKeys.jsonlgz)"
                  size="16px"
                  class="q-mr-sm"
                />
                {{ $t("downloadKwicJsonlGzArchive") }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            :disable="isDownloadActive(downloadKeys.excel)"
            @click="downloadKWICTableAsExcel"
          >
            <q-item-section>
              <q-item-label class="row items-center no-wrap">
                <q-spinner-tail
                  v-if="isDownloadActive(downloadKeys.excel)"
                  size="16px"
                  class="q-mr-sm"
                />
                {{ $t("downloadExcel") }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            :disable="isDownloadActive(downloadKeys.speeches)"
            @click="downloadKWICAsSpeeches"
          >
            <q-item-section>
              <q-item-label class="row items-center no-wrap">
                <q-spinner-tail
                  v-if="isDownloadActive(downloadKeys.speeches)"
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
            :disable="isDownloadActive(downloadKeys.speechesJsonlgz)"
            @click="downloadKWICAsSpeechesJsonlGz"
          >
            <q-item-section>
              <q-item-label class="row items-center no-wrap">
                <q-spinner-tail
                  v-if="isDownloadActive(downloadKeys.speechesJsonlgz)"
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
            :disable="isDownloadActive(downloadKeys.speechesCsvgz)"
            @click="downloadKWICAsSpeechesCsvGz"
          >
            <q-item-section>
              <q-item-label class="row items-center no-wrap">
                <q-spinner-tail
                  v-if="isDownloadActive(downloadKeys.speechesCsvgz)"
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
      ref="KWICTable"
      :rows="rows"
      :columns="columns"
      row-key="unique_id"
      :rows-per-page-options="[10, 20, 50]"
      v-model:pagination="pagination"
      :loading="kwicStore.isPageLoading"
      class="bg-grey-2"
      @request="onRequest"
    >
      <template v-slot:top-row v-if="kwicStore.isPartial">
        <q-tr>
          <q-td :colspan="columns.length + 1" class="q-pa-none">
            <q-linear-progress
              :value="
                kwicStore.shardsTotal > 0
                  ? kwicStore.shardsComplete / kwicStore.shardsTotal
                  : 0
              "
              color="accent"
              track-color="grey-3"
              class="q-mb-none"
              style="height: 6px"
            />
            <q-item-label caption class="q-px-sm q-pt-xs text-grey-7">
              {{
                $t("kwicShardProgress", {
                  complete: kwicStore.shardsComplete,
                  total: kwicStore.shardsTotal,
                })
              }}
            </q-item-label>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing class="kwic-table-loading-overlay">
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
        <q-tr :props="props" @click="expandRow(props)" class="cursor-pointer">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="bg-white"
            :class="props.expand ? 'bg-grey-3' : ''"
            :style="{
              'max-width':
                col.name === 'left_word' || col.name === 'right_word'
                  ? '200px'
                  : 'none',
              'white-space':
                col.name === 'left_word' || col.name === 'right_word'
                  ? 'normal'
                  : 'nowrap',
              'word-wrap':
                col.name === 'left_word' || col.name === 'right_word'
                  ? 'break-word'
                  : 'normal',
            }"
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
              :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            />
          </q-td>
        </q-tr>
        <!-- If row in table is clicked, EXPAND -->
        <expandingTableRow :props="props" />
      </template>
    </q-table>
  </template>
  <template v-else>
    <!-- Show a message when there's no data -->
    <noResults />
  </template>
</template>

<script setup>
import { computed, ref } from "vue";
import { metaDataStore } from "src/stores/metaDataStore";
import { kwicDataStore } from "src/stores/kwicDataStore";
import { downloadDataStore } from "src/stores/downloadDataStore";
import expandingTableRow from "src/components/expandingTableRow.vue";
import loadingIcon from "src/components/loadingIcon.vue";
import noResults from "src/components/noResults.vue";

const metaStore = metaDataStore();
const kwicStore = kwicDataStore();
const downloadStore = downloadDataStore();

const downloadKeys = {
  csv: "kwic-csv",
  jsonlgz: "kwic-jsonlgz",
  excel: "kwic-excel",
  speeches: "kwic-speeches",
  speechesJsonlgz: "kwic-speeches-jsonlgz",
  speechesCsvgz: "kwic-speeches-csvgz",
};

const KWICTable = ref(null);

const pagination = computed({
  get: () => kwicStore.pagination,
  set: (value) => {
    kwicStore.pagination = value;
  },
});

const showLoadingIndicator = computed(
  () =>
    (kwicStore.isLoading && kwicStore.kwicData.length === 0) ||
    (!!kwicStore.ticketId &&
      kwicStore.totalHits > 0 &&
      kwicStore.kwicData.length === 0 &&
      !kwicStore.errorMessage),
);

const expandRow = async (props) => {
  props.expand = !props.expand;
};

const onRequest = async ({ pagination }) => {
  if (!kwicStore.ticketId) {
    return;
  }

  // Ignore sort changes while results are still loading (PARTIAL)
  if (
    kwicStore.isPartial &&
    (pagination.sortBy !== kwicStore.pagination.sortBy ||
      pagination.descending !== kwicStore.pagination.descending)
  ) {
    return;
  }

  await kwicStore.fetchKwicPage({
    page: pagination.page,
    rowsPerPage: pagination.rowsPerPage,
    sortBy: pagination.sortBy,
    descending: pagination.descending,
  });
};

const isDownloadActive = (downloadKey) =>
  downloadStore.isDownloadActive(downloadKey);

const downloadKWICTableAsExcel = async () => {
  await kwicStore.downloadKwicExcel(downloadKeys.excel);
};

const downloadKWICTableAsCSV = async () => {
  await kwicStore.downloadKwicCsvGz(downloadKeys.csv);
};

const downloadKWICTableAsJsonlGz = async () => {
  await kwicStore.downloadKwicJsonlGz(downloadKeys.jsonlgz);
};

const downloadKWICAsSpeeches = async () => {
  await kwicStore.downloadKwicSpeechesZip(downloadKeys.speeches);
};

const downloadKWICAsSpeechesJsonlGz = async () => {
  await kwicStore.downloadKwicSpeechesJsonlGz(downloadKeys.speechesJsonlgz);
};

const downloadKWICAsSpeechesCsvGz = async () => {
  await kwicStore.downloadKwicSpeechesCsvGz(downloadKeys.speechesCsvgz);
};

const rows = computed(() =>
  kwicStore.kwicData.map((entry, index) => ({
    id: entry.speech_id,
    unique_id: `${kwicStore.pagination.page}-${index}-${entry.speech_id}`,
    left_word: entry.left_word,
    node_word: entry.node_word,
    right_word: entry.right_word,
    year: entry.year,
    speaker: entry.name,
    party: entry.party_abbrev,
    party_full: entry.party,
    gender: entry.gender,
    person_id: entry.person_id,
    link: entry.link,
    protocol: entry.speech_name,
    source: entry.speech_link,
  })),
);

const columns = [
  {
    name: "left_word",
    required: true,
    label: "Vänster",
    align: "right",
    field: "left_word",
    sortable: true,
  },
  {
    name: "node_word",
    required: true,
    label: "Sökord",
    field: "node_word",
    sortable: true,
    align: "center",
  },
  {
    name: "right_word",
    required: true,
    label: "Höger",
    field: "right_word",
    sortable: true,
    align: "left",
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
  {
    name: "protocol",
    required: true,
    label: "Anförande",
    field: "protocol",
    sortable: true,
    align: "left",
  },
];
</script>

<style scoped>
.kwic-table-loading-overlay {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(1px);
}
</style>
