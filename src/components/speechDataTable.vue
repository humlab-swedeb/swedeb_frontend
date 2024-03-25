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
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class=""
          >
            {{ col.label }}
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
            <q-item-label v-else-if="col.name === 'hit'" class="text-bold">
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
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="7" no-hover>
            <q-card flat class="bg-transparent">
              <q-card-section class="q-px-md row">
                <q-card-section class="col q-pa-none">
                  <q-item-label
                    class="text-h6"
                    :style="{ color: metaStore.getPartyColor(props.row.party) }"
                    >{{ props.row.speaker }}, ({{ props.row.party }}),
                    {{ props.row.gender }}
                  </q-item-label>
                  <q-item-label>{{ props.row.protocol }}</q-item-label>
                </q-card-section>
                <q-card-section class="col q-pa-none">
                  <q-item-label>{{ props.row.hit }}</q-item-label>
                </q-card-section>
              </q-card-section>
              <q-card-section class="row">
                <q-card-section
                  class="q-pa-none q-pr-md col-10"
                  style="white-space: normal"
                >
                  <q-item-label caption class="text-bold">{{
                    speakerNote
                  }}</q-item-label>
                  <q-item-label>{{ speechText }}</q-item-label>
                </q-card-section>
                <q-card-section class="col-2 q-pa-none">
                  <div class="column q-gutter-y-md">
                    <q-btn
                      no-caps
                      :href="props.row.source"
                      class="full-width items-start text-grey-8"
                      color="white"
                    >
                      <q-icon left name="open_in_new" color="accent" />
                      <q-item-label>Öppna källa</q-item-label>
                    </q-btn>
                    <q-btn
                      outline
                      no-caps
                      class="full-width items-start text-grey-8"
                      color="accent"
                    >
                      <q-icon left name="open_in_new" color="accent" />
                      <q-item-label>Ladda ned</q-item-label>
                    </q-btn>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-btn
      color="primary"
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

const metaStore = metaDataStore();
const speechStore = speechesDataStore();
const wtStore = wordTrendsDataStore();
const downloadStore = downloadDataStore();
//const props = defineProps(["type"]);
const props = defineProps({
  dataLoaded: Boolean,
  type: String,
});

const displayedData = ref({});
const rows = ref([]);
const columns = ref([]);
const speakerNote = ref("");
const speechText = ref("");
const loading = ref(false);

const expandRow = async (props) => {
  props.expand = !props.expand;
  if (props.expand) {
    const speechData = await speechStore.getSpeech(props.row.id);
    speakerNote.value = speechData.speaker_note;
    speechText.value = speechData.speech_text;
  }
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
      hit: speech.hit,
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
        name: "hit",
        required: true,
        label: "Sökord",
        field: "hit",
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
