<template>
  <q-table
    bordered
    flat
    :rows="rows"
    :columns="columns"
    row-key="id"
    :rows-per-page-options="[10, 20, 50, 100, 0]"
  >
    <template v-slot:body="props">
      <q-tr :props="props" @click="expandRow(props)" class="cursor-pointer">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <q-item-label v-if="col.name === 'party'" class="text-bold">
            {{ col.value }}
          </q-item-label>
          <q-item-label v-else>
            {{ col.value }}
          </q-item-label>
        </q-td>
        <q-td auto-width>
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
import { ref, watchEffect } from "vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { speechesDataStore } from "src/stores/speechesDataStore.js";

const metaStore = metaDataStore();
const speechStore = speechesDataStore();

const displayedData = ref({});
const rows = ref([]);
const columns = ref([]);
const speakerNote = ref("");
const speechText = ref("");

const expandRow = async (props) => {
  props.expand = !props.expand;
  if (props.expand) {
    const speechData = await speechStore.getSpeech(props.row.id);
    speakerNote.value = speechData.speaker_note;
    speechText.value = speechData.speech_text;
  }
};

watchEffect(async () => {
  if (metaStore.submitEvent) {
    await speechStore.getSpeechesResult();
    displayedData.value = { ...speechStore.speechesData };
    console.log(displayedData.value.speech_list);

    rows.value = displayedData.value.speech_list.map((speech) => ({
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
  }
});
</script>
