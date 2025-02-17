<template>
  <template v-if="kwicStore.kwicData && kwicStore.kwicData.length > 0">
    <div class="row q-py-md justify-between">
      <q-item-label class="col-9 q-mt-md" v-if="kwicStore.kwicData.length > 0">
        {{ $t("searchResult1") }} <b>{{ kwicStore.kwicData.length }}</b>
        {{ $t("searchResult2") }}
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
          <q-item clickable v-close-popup @click="downloadKWICTableAsCSV">
            <q-item-section>
              <q-item-label>{{ $t("downloadCSV") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="downloadKWICTableAsExcel">
            <q-item-section>
              <q-item-label>{{ $t("downloadExcel") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="downloadKWICAsSpeeches">
            <q-item-section>
              <q-item-label>{{ $t("downloadSpeech") }}</q-item-label>
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
      :pagination="pagination"
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
              <q-tooltip v-if="col.value !== '[-]'">
                {{ props.row.speaker }}
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
import { ref } from "vue";
import { metaDataStore } from "src/stores/metaDataStore";
import { kwicDataStore } from "src/stores/kwicDataStore";
import { downloadDataStore } from "src/stores/downloadDataStore";
import expandingTableRow from "src/components/expandingTableRow.vue";
import noResults from "src/components/noResults.vue";

const metaStore = metaDataStore();
const kwicStore = kwicDataStore();
const downloadStore = downloadDataStore();

const rows = ref([]);
const columns = ref([]);
const KWICTable = ref(null);
const visibleRows = ref([]);

const expandRow = async (props) => {
  props.expand = !props.expand;
};

const getParamString = () => {
  return metaStore.selectedMetadataToText("kwic");
};

const downloadKWICTableAsExcel = () => {
  kwicStore.downloadKWICTableExcel(getParamString());
};

const downloadKWICTableAsCSV = () => {
  kwicStore.downloadKWICTableCSV(getParamString());
};

const downloadKWICAsSpeeches = () => {
  visibleRows.value = KWICTable.value.computedRows.map((row) => row.id);
  downloadStore.downloadSpeechesZip(visibleRows.value, getParamString());
};

rows.value = kwicStore.kwicData.map((entry, index) => ({
  id: entry.speech_id,
  unique_id: index,
  left_word: entry.left_word,
  node_word: entry.node_word,
  right_word: entry.right_word,
  year: entry.year,
  speaker: entry.name,
  party: entry.party_abbrev,
  gender: entry.gender,
  person_id: entry.person_id,
  link: entry.link,
  protocol: entry.speech_name,
  source: entry.speech_link,
}));

columns.value = [
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
    name: "id",
    required: true,
    label: "Anförande",
    field: "protocol",
    sortable: true,
    align: "left",
  },
];

const pagination = ref({
  sortBy: "id",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
</script>

<style></style>
