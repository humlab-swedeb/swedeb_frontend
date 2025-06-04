<template>
  <div class="row q-py-md justify-between">
    <q-item-label class="col-9 q-mt-md" v-if="nGramStore.nGrams.length > 0">
      {{ $t("searchResult1") }} <b>{{ nGramStore.nGrams.length }}</b>
      {{ $t("searchResult2") }}
    </q-item-label>

    <q-btn-dropdown
      no-caps
      icon="download"
      class="text-grey-8 col-3"
      color="secondary"
      :label="$t('downloadNgram')"
      style="width: fit-content"
    >
      <q-list>
        <q-item clickable v-close-popup @click="downloadNgram">
            <q-item-section>
              <q-item-label>{{ $t("downloadCSV") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="downloadNgramExcel">
            <q-item-section>
              <q-item-label>{{ $t("downloadExcel") }}</q-item-label>
            </q-item-section>
          </q-item>

      </q-list>
    </q-btn-dropdown>
  </div>
  <q-table
    bordered
    flat
    :rows="rows"
    :columns="columns"
    row-key="id"
    :rows-per-page-options="[10, 20, 50]"
    v-if="!loading"
    class="bg-grey-2"
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
          <q-item-label v-if="col.name === 'ngram'">
            <span v-html="formatSearch(col.value)" />
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
      <!--  -->
      <q-tr v-show="props.expand" class="bg-grey-1">
        <q-td :colspan="props.cols.length" no-hover>
          <div>
            <q-item-label class="text-h6 q-mt-md text-grey-8">
              {{ props.row.ngram }}
            </q-item-label>
            <div class="row q-pb-md justify-between">
              <q-item-label class="col-9 q-mt-md">
                {{ $t("searchResult1") }}
                <b>{{ props.row.speeches }}</b> {{ $t("searchResult2") }}
              </q-item-label>
            </div>
            <!-- SECOND TABLE -->

            <div v-if="innerLoading[props.row.id]">
              <loadingIcon />
            </div>
            <div v-else>
              <speechDataTableNgram
                ref="speechesNgram"
                type="ngram"
                :totalHits="getNumberDocHits(props)"
                :rowID="props.row.id"
                :ngram="props.row.ngram"
              />
            </div>
          </div>
        </q-td>
        <q-td class="bg-grey-1" no-hover />
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from "vue";
import loadingIcon from "src/components/loadingIcon.vue";
import speechDataTableNgram from "src/components/speechDataTableNgram.vue";
import { nGramDataStore } from "src/stores/nGramDataStore";
import { metaDataStore } from "src/stores/metaDataStore";

const nGramStore = nGramDataStore();
const metaStore = metaDataStore();


const rows = ref([]);
const columns = ref([]);
const loading = ref(false);
const innerLoading = ref({});
const speechesNgram = ref(null);



const formatSearch = (value) => {
  let searchString = nGramStore.searchString;
  if (searchString.includes(".*")) {
    searchString = searchString.replace(".*", "");
  }
  if (searchString && value.toLowerCase().includes(searchString.toLowerCase())) {
    const regex = new RegExp(searchString, "gi");
    return value.replace(regex, (match) => `<b>${match}</b>`);
  }
  return value;
};

const getParamString = () => {
  return metaStore.selectedMetadataToText("ngrams");
};

const downloadNgram = () => {
  nGramStore.downloadNGramTableCSV(getParamString());
};


const downloadNgramExcel = () => {
  nGramStore.downloadNGramTableExcel(getParamString())
};


const getNumberDocHits = (props) => {
  return nGramStore.nGrams[props.row.id - 1].documents.length;
};

const expandRow = async (props) => {
  props.expand = !props.expand;


  if (props.expand) {
    innerLoading.value[props.row.id] = true;

    try {
      await nGramStore.getNGramSpeeches(
        props.row.id - 1,
        props.row.ngram,
        1, //page, initial value
        10 //hits per page, initial value
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      innerLoading.value[props.row.id] = false;
    }
  }
};

rows.value = nGramStore.nGrams.map((entry, index) => ({
  id: index + 1,
  ngram: entry.ngram,
  count: entry.count,
  speeches: entry.documents.length,
}));

columns.value = [
  {
    name: "ngram",
    label: "N-gram",
    align: "left",
    field: "ngram",
    sortable: true,
  },
  {
    name: "count",
    label: "Frekvens",
    align: "left",
    field: "count",
    sortable: true,
  },
  {
    name: "speeches",
    label: "Antal anföranden",
    align: "left",
    field: "speeches",
    sortable: true,
  },
];
</script>

<style scoped></style>
