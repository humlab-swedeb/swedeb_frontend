<template>
  <template v-if="wtStore.wordTrends && wtStore.wordTrends.length > 0">
    <div class="column items-end">
      <q-btn-dropdown
        no-caps
        icon="download"
        class="text-grey-8 col-3"
        color="secondary"
        label="Ladda ner ordtrender"
        style="width: fit-content"
      >
        <q-list>
          <q-item clickable v-close-popup @click="downloadWTCountsCSV">
            <q-item-section>
              <q-item-label>CSV</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="downloadWTCountsExcel">
            <q-item-section>
              <q-item-label>Excel</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div>
      <q-table
        flat
        bordered
        :rows="rows"
        :columns="columns"
        row-key="year"
        style="width: fit-content"
        separator="vertical"
        class="bg-grey-2 sticky-column"
        :rows-per-page-options="[10, 20, 50]"
      >
        <template v-slot:body="props">
          <q-tr :props="props" class="bg-white">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="bg-white"
              :class="col.name === 'Year' ? 'bg-grey-1' : ''"
            >
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </template>
  <template v-else>
    <!-- Show a message when there's no data -->
    <noResults />
  </template>
</template>

<script setup>
import { ref } from "vue";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import { metaDataStore } from "src/stores/metaDataStore";
import noResults from "src/components/noResults.vue";

const metaStore = metaDataStore();
const wtStore = wordTrendsDataStore();
const rows = ref([]);
const columns = ref([]);


const get_paramString = () => {
  const tool_type = "wordTrends";
  return metaStore.selectedMetadataToText(wtStore.searchText, tool_type);
};

const downloadWTCountsCSV = () => {
  wtStore.downloadCSVcountsWT(get_paramString());
};

const downloadWTCountsExcel = () => {
  wtStore.downloadExcelCountsWT(get_paramString());
};

const wordTrends = wtStore.wordTrends;


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
        ...Array.from(uniqueWords)
          .sort()
          .map((word) => ({
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


</script>

<style>
.sticky-column {
  max-width: 100%;
}

.sticky-column th:first-child,
.sticky-column td:first-child {
  border-right: 1px solid #e2e2e2;
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: #f5f5f5;
}
</style>
