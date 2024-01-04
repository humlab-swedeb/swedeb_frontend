<template>
  <div v-if="store.selected.speakers.length > 0">
    <q-table bordered flat :rows="rows" :columns="columns" row-key="id">
      <!--     <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in columns" :key="col.name" :props="props">
          {{ props.row[col.name] }}
        </q-td>
      </q-tr>
    </template> -->
    </q-table>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { dataStore } from "src/stores/dataStore.js";
const store = dataStore();
const displayedData = ref({});
const rows = ref([]);
const columns = ref([]);

watchEffect(() => {
  // When the submitEvent is triggered in the store, update the displayedData and showData values
  if (store.submitEvent) {
    displayedData.value = { ...store.selected };
    store.submitEvent = false;

    rows.value = displayedData.value.speakers.map((speaker, index) => ({
      id: index + 1,
      speakers: speaker,
      party: store.getPartyFromSpeaker(speaker),
      gender: "MaWn",
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
        name: "party",
        required: true,
        label: "Party",
        field: "party",
        sortable: true,
      },
      {
        name: "speakers",
        label: "Speakers",
        field: "speakers",
        sortable: true,
      },
      {
        name: "gender",
        label: "Gender",
        field: "gender",
        sortable: true,
      },
      {
        name: "office",
        label: "Office",
        field: "office",
        sortable: true,
      },
      {
        name: "subOffice",
        label: "Sub Office",
        field: "subOffice",
      },
    ];
  }
});
</script>
