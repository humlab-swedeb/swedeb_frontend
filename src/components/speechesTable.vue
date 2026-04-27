<template>
  <template v-if="speechesStore.errorMessage">
    <q-banner class="bg-negative text-white q-mb-md" rounded>
      {{ speechesStore.errorMessage }}
    </q-banner>
  </template>
  <template v-else-if="showLoadingIndicator">
    <loadingIcon size="64" />
  </template>
  <template v-else-if="speechesStore.speechesData.length > 0">
    <div>
      <div class="row q-py-md justify-between">
        <q-item-label class="col-9 q-mt-md">
          {{ $t("searchResult1") }}
          <b>{{ speechesStore.totalHits }}</b>
          {{ $t("searchResult2") }}
        </q-item-label>
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
              :disable="isDownloadActive(downloadKeys.csvgz)"
              @click="downloadCsvGzArchive"
            >
              <q-item-section>
                <q-item-label class="row items-center no-wrap">
                  <q-spinner-tail
                    v-if="isDownloadActive(downloadKeys.csvgz)"
                    size="16px"
                    class="q-mr-sm"
                  />
                  {{ $t("downloadSpeechCsvGzArchive") }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              :disable="isDownloadActive(downloadKeys.jsonlgz)"
              @click="downloadJsonlGzArchive"
            >
              <q-item-section>
                <q-item-label class="row items-center no-wrap">
                  <q-spinner-tail
                    v-if="isDownloadActive(downloadKeys.jsonlgz)"
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
              :disable="isDownloadActive(downloadKeys.zip)"
              @click="downloadZipArchive"
            >
              <q-item-section>
                <q-item-label class="row items-center no-wrap">
                  <q-spinner-tail
                    v-if="isDownloadActive(downloadKeys.zip)"
                    size="16px"
                    class="q-mr-sm"
                  />
                  {{ $t("downloadSpeechTextArchive") }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
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
        :loading="speechesStore.isLoading || speechesStore.isPageLoading"
        class="bg-grey-2"
        @request="onRequest"
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
                <q-tooltip v-if="col.value !== '[-]'" class="text-subtitle2">
                  {{ props.row.party_full }}
                </q-tooltip>
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
          <expandingTableRow :props="props" />
        </template>
      </q-table>
    </div>
  </template>
  <template v-else>
    <noResults />
  </template>
</template>

<script setup>
import { computed, ref } from "vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { speechesDataStore } from "src/stores/speechesDataStore";
import { downloadDataStore } from "src/stores/downloadDataStore";
import expandingTableRow from "src/components/expandingTableRow.vue";
import loadingIcon from "src/components/loadingIcon.vue";
import noResults from "src/components/noResults.vue";

const metaStore = metaDataStore();
const speechesStore = speechesDataStore();
const downloadStore = downloadDataStore();

const downloadKeys = {
  csvgz: "speeches-archive-csvgz",
  jsonlgz: "speeches-archive-jsonlgz",
  zip: "speeches-archive-zip",
};

const SpeechTable = ref(null);

const pagination = computed({
  get: () => speechesStore.pagination,
  set: (value) => {
    speechesStore.pagination = value;
  },
});

const showLoadingIndicator = computed(
  () =>
    speechesStore.isLoading ||
    speechesStore.isPageLoading ||
    (!!speechesStore.ticketId &&
      speechesStore.totalHits > 0 &&
      speechesStore.speechesData.length === 0 &&
      !speechesStore.errorMessage),
);

const expandRow = (props) => {
  props.expand = !props.expand;
};

const onRequest = async ({ pagination }) => {
  if (!speechesStore.ticketId) return;
  await speechesStore.fetchSpeechesPage({
    page: pagination.page,
    rowsPerPage: pagination.rowsPerPage,
    sortBy: pagination.sortBy,
    descending: pagination.descending,
  });
};

const isDownloadActive = (downloadKey) =>
  downloadStore.isDownloadActive(downloadKey);

const downloadCsvGzArchive = async () => {
  await speechesStore.downloadSpeechesCsvGz(downloadKeys.csvgz);
};

const downloadJsonlGzArchive = async () => {
  await speechesStore.downloadSpeechesJsonlGz(downloadKeys.jsonlgz);
};

const downloadZipArchive = async () => {
  await speechesStore.downloadSpeechesZip(downloadKeys.zip);
};

const rows = computed(() =>
  speechesStore.speechesData.map((speech, index) => ({
    id: speech.speech_id,
    unique_id: `${speechesStore.pagination.page}-${index}-${speech.speech_id}`,
    protocol: speech.speech_name,
    speaker: speech.name,
    gender: speech.gender,
    party: speech.party_abbrev,
    party_full: speech.party,
    source: speech.speech_link,
    year: speech.year,
    link: speech.link,
  })),
);

const columns = [
  {
    name: "protocol",
    required: true,
    label: "Anförande",
    align: "left",
    field: "protocol",
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
    sortable: false,
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
</script>

<style scoped></style>
