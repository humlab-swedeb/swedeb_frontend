<template>
  <div>
    <q-table
      bordered
      flat
      :rows="rows"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[10, 20, 50]"
      v-model:pagination="pagination"
      v-if="!loading"
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
              <q-tooltip> Här ska det vara en beskrivning av hur anförande-ID beskrivs </q-tooltip>
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
              class="text-bold"
              :style="{ color: metaStore.getPartyColor(col.value) }"
            >
              {{ col.value }}
            </q-item-label>
            <q-item-label
              v-else-if="col.name === 'node_word'"
              class="text-bold"
            >
              {{ col.value }}
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
    <q-btn
      no-caps
      icon="download"
      class="q-my-md text-grey-8"
      color="secondary"
      label="Ladda ner tal"
      @click="downloadSpeeches"
    ></q-btn>
  </div>
</template>

<script setup>
import { ref, watchEffect, defineProps } from "vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { speechesDataStore } from "src/stores/speechesDataStore.js";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import { downloadDataStore } from "src/stores/downloadDataStore";
import expandingTableRow from "src/components/expandingTableRow.vue";

const metaStore = metaDataStore();
const speechStore = speechesDataStore();
const wtStore = wordTrendsDataStore();
const downloadStore = downloadDataStore();

const props = defineProps({
  dataLoaded: Boolean,
  type: String,
});

const displayedData = ref({});
const rows = ref([]);
const columns = ref([]);

const loading = ref(false);

const expandRow = async (props) => {
  props.expand = !props.expand;
};

watchEffect(async () => {
  if (metaStore.submitEvent || props.dataLoaded) {
    loading.value = true;
    if (props.type === "wordTrends") {
      displayedData.value = wtStore.wordTrendsSpeeches;
    } else if (props.type === "speeches") {
      await speechStore.getSpeechesResult();
      displayedData.value = speechStore.speechesData;
    }

    rows.value = displayedData.value.map((speech) => ({
      id: speech.document_name,
      protocol: speech.formatted_speech_id,
      node_word: speech.node_word,
      speaker: speech.name,
      gender: speech.gender,
      party: speech.party_abbrev,
      source: speech.speech_link,
      year: speech.year,
    }));

    columns.value = [
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
      /* {
        name: "source",
        required: true,
        label: "Källa",
        field: "source",
        sortable: true,
        align: "left",
      }, */
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

    metaStore.submitEvent = false;
    loading.value = false;
  }
});
const pagination = ref({});

function downloadSpeeches() {
  // Accessing the current page from the pagination object
  const currentPage = pagination.value.page;

  const startIndex = pagination.value.rowsPerPage * (currentPage - 1);
  const endIndex = pagination.value.rowsPerPage * currentPage;
  const documentNames = displayedData.value
    .slice(startIndex, endIndex)
    .map((speech) => speech.document_name);

  const paramString = metaStore.selectedMetadataToText();
  downloadStore.getSpeechesZip(documentNames, paramString);
}
</script>

<style scoped></style>
