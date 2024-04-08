<template>
  <div>
    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="year"
      style="width: fit-content"
      separator="vertical"
      class="bg-grey-2"
      :rows-per-page-options="[10, 20, 50]"
    >
      <template v-slot:body="props">
        <q-tr :props="props" class="bg-white">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="bg-white"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-btn
      no-caps
      icon="download"
      class="q-my-md text-grey-8"
      color="secondary"
      label="Ladda ner resultat"
      @click="downloadWTCounts"
      ></q-btn>
  </div>
</template>





<script setup>
import { ref, watchEffect } from "vue";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import { metaDataStore } from "src/stores/metaDataStore";
const metaStore = metaDataStore();
const wtStore = wordTrendsDataStore();
const rows = ref([]);
const columns = ref([]);

watchEffect(() => {
  const wordTrends = wtStore.wordTrends;
  if (metaStore.submitEvent || wordTrends.length > 0) {
    if (Array.isArray(wordTrends) && wordTrends.length > 0) {
      const uniqueWords = new Set();
      wordTrends.forEach((entry) => {
        Object.keys(entry.count).forEach((word) => {
          uniqueWords.add(word);
        });
      });

      const allColumns = [
        {
          name: "Year",
          required: true,
          label: "År",
          align: "left",
          field: "year",
          sortable: true,
        },
        ...Array.from(uniqueWords).map((word) => ({
          name: word,
          required: true,
          label: word,
          field: word,
          sortable: true,
          align: "left",
        })),
      ];

      columns.value = allColumns;

      rows.value = wordTrends.map((entry) => {
        const rowData = { year: entry.year };
        Object.entries(entry.count).forEach(([word, count]) => {
          rowData[word] = count;
        });
        return rowData;
      });
    }
  }
});
function downloadWTCounts() {
  wtStore.downloadCSV();
}
</script>

<style></style>
