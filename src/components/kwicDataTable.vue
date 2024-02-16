<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    :rows-per-page-options="[10, 20, 30]"
    :pagination="pagination"
  >
    <template v-slot:body="props">
      <q-tr :props="props" @click="expandRow(props)" class="cursor-pointer">
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="bg-white"
        >
          <q-item-label
            v-if="col.name === 'party_abbrev'"
            class="text-bold"
            :style="{ color: metaStore.getPartyColor(col.value) }"
          >
            {{ col.value }}
          </q-item-label>
          <q-item-label v-else-if="col.name === 'node_word'" class="text-bold">
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
import { ref, watchEffect } from "vue";
import { metaDataStore } from "src/stores/metaDataStore";
import { kwicDataStore } from "src/stores/kwicDataStore";
import { speechesDataStore } from "src/stores/speechesDataStore";
import i18n from "src/i18n/sv";

const metaStore = metaDataStore();
const kwicStore = kwicDataStore();
const speechStore = speechesDataStore();

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

watchEffect(() => {
  if (metaStore.submitEvent) {
    if (Array.isArray(kwicStore.kwicData) && kwicStore.kwicData.length > 0) {
      const uniqueColumns = new Set();
      kwicStore.kwicData.forEach((entry) => {
        Object.keys(entry).forEach((word) => {
          uniqueColumns.add(word);
        });
      });

      const allColumns = [
        ...Array.from(uniqueColumns).map((word) => ({
          name: word,
          required: true,
          label: i18n.kwicLable[word],
          field: word,
          sortable: true,
          align: word === "left_word" ? "right" : "left",
        })),
      ];

      columns.value = allColumns;
      rows.value = kwicStore.kwicData.map((entry) => ({
        left_word: entry.left_word,
        node_word: entry.node_word,
        right_word: entry.right_word,
        year_title: entry.year_title,
        name: entry.name,
        party_abbrev: entry.party_abbrev,
        speech_title: entry.speech_title,
        gender: entry.gender,
      }));
    }
  }
});

const pagination = ref({
  sortBy: "id",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
</script>
