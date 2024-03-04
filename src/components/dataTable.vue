<template>
  <div v-if="store.selected.speakers.length > 0">
    <q-table bordered flat :rows="rows" :columns="columns" row-key="id">
      <template v-slot:body="props">
        <q-tr
          :props="props"
          @click="props.expand = !props.expand"
          class="cursor-pointer"
        >
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
              This is the expand slot for row above: {{ props.row.speakers }}.
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
const store = metaDataStore();
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
      speakers: speaker.name,
      party: speaker.party_abbrev,
      gender: speaker.gender,
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
        align: "left",
        style: (row) => ({ color: store.getPartyColor(row.party) }),
      },
      {
        name: "speakers",
        label: "Speakers",
        field: "speakers",
        sortable: true,
        align: "left",
      },
      {
        name: "gender",
        label: "Gender",
        field: "gender",
        sortable: true,
        align: "left",
      },
    ];
  }
});
</script>
