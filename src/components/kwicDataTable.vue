<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    :rows-per-page-options="[10, 20, 50]"
    :pagination="pagination"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
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
          <q-item-label v-else-if="col.name === 'node_word'" class="text-bold">
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
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { metaDataStore } from "src/stores/metaDataStore";
import { kwicDataStore } from "src/stores/kwicDataStore";
import { speechesDataStore } from "src/stores/speechesDataStore";
import expandingTableRow from "src/components/expandingTableRow.vue";

const metaStore = metaDataStore();
const kwicStore = kwicDataStore();
const speechStore = speechesDataStore();

const rows = ref([]);
const columns = ref([]);

const expandRow = async (props) => {
  props.expand = !props.expand;
};

watchEffect(() => {
  if (metaStore.submitEvent) {
    rows.value = kwicStore.kwicData.map((entry) => ({
      id: entry.speech_title,
      left_word: entry.left_word,
      node_word: entry.node_word,
      right_word: entry.right_word,
      year: entry.year,
      speaker: entry.name,
      party: entry.party_abbrev,
      gender: entry.gender,
      person_id: entry.person_id,
      link: entry.link,
    }));

    columns.value = [
      {
        name: "left_word",
        required: true,
        label: "Väster",
        align: "right",
        field: "left_word",
        sortable: true,
      },
      {
        name: "node_word",
        required: true,
        label: "Nod",
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
        field: "id",
        sortable: true,
        align: "left",
      },
    ];
  }
});

const pagination = ref({
  sortBy: "id",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
</script>
