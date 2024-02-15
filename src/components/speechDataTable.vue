<template>
  <q-table
    bordered
    flat
    :rows="rows"
    :columns="columns"
    row-key="id"
    :rows-per-page-options="[10, 20, 50, 100, 0]"
    v-if="!loading"
    class="bg-grey-2"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="">
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
        >
          <q-item-label
            v-if="col.name === 'party'"
            class="text-bold"
            :style="{ color: metaStore.getPartyColor(col.value) }"
          >
            {{ col.value }}
          </q-item-label>
          <q-item-label v-else>
            {{ col.value }}
          </q-item-label>
        </q-td>
        <q-td auto-width class="bg-white">
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
        <q-td colspan="100%">
          <div class="text-left">
            <q-item-label caption>{{ speakerNote }}</q-item-label>
            <q-item-label>{{ speechText }}</q-item-label>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { ref, watchEffect, defineProps } from "vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { speechesDataStore } from "src/stores/speechesDataStore.js";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";

const metaStore = metaDataStore();
const speechStore = speechesDataStore();
const wtStore = wordTrendsDataStore();
const props = defineProps(["type"]);

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
  if (metaStore.submitEvent || wtStore.wordTrendsSpeeches.length > 0) {
    loading.value = true;
    if (props.type === "wordTrends") {
      if (wtStore.wordTrendsSpeeches.length === 0) {
        await wtStore.getWordTrendsSpeeches(wtStore.searchText);
      }
      displayedData.value = wtStore.wordTrendsSpeeches;
    } else if (props.type === "speeches") {
      await speechStore.getSpeechesResult();
      displayedData.value = speechStore.speechesData;
    }
    rows.value = displayedData.value.map((speech) => ({
      id: speech.speech_id_column,
      speaker: speech.speaker_column,
      gender: speech.gender_column,
      party: speech.party_column,
      source: speech.source_column,
      year: speech.year_column,
    }));
    columns.value = [
      {
        name: "id",
        required: true,
        label: "ID",
        align: "left",
        field: "id",
        sortable: true,
      },
      {
        name: "speaker",
        required: true,
        label: "Speaker",
        field: "speaker",
        sortable: true,
        align: "left",
      },
      {
        name: "gender",
        required: true,
        label: "Gender",
        field: "gender",
        sortable: true,
        align: "left",
      },
      {
        name: "party",
        required: true,
        label: "Party",
        field: "party",
        sortable: true,
        align: "left",
      },
      {
        name: "source",
        required: true,
        label: "Source",
        field: "source",
        sortable: true,
        align: "left",
      },
      {
        name: "year",
        required: true,
        label: "Year",
        field: "year",
        sortable: true,
        align: "left",
      },
    ];

    metaStore.submitEvent = false;
    loading.value = false;
  }
});
</script>

<style scoped></style>
