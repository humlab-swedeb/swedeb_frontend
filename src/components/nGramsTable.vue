<template>
  <div class="row q-py-md justify-between">
    <q-item-label class="col-9 q-mt-md" v-if="nGramStore.nGrams.length > 0">
      {{ $t("searchResult1") }} <b>{{ nGramStore.nGrams.length }}</b>
      {{ $t("searchResult2") }}
    </q-item-label>

    <q-btn
      no-caps
      icon="download"
      class="text-grey-8 col-3"
      color="secondary"
      :label="$t('downloadNgram')"
      style="width: fit-content"
    >
    </q-btn>
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
                <b>{{ props.row.count }}</b> {{ $t("searchResult2") }}
              </q-item-label>
            </div>
            <!-- SECOND TABLE -->

            <div v-if="innerLoading[props.row.id]">
              <loadingIcon />
            </div>
            <div v-else>
              <speechDataTable type="ngram" />
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
import speechDataTable from "src/components/speechDataTable.vue";
import { nGramDataStore } from "src/stores/nGramDataStore";

const nGramStore = nGramDataStore();

const rows = ref([]);
const columns = ref([]);
const loading = ref(false);
const innerLoading = ref({});

const formatSearch = (value) => {
  const searchString = nGramStore.searchString;
  if (searchString && value.includes(searchString)) {
    // Split the value and wrap the matching part in bold tags
    return value.replace(searchString, `<b>${searchString}</b>`);
  }
  return value;
};

const expandRow = async (props) => {
  props.expand = !props.expand;

  if (props.expand) {
    console.log(props.row);
    innerLoading.value[props.row.id] = true;
    try {
      await nGramStore.getNGramSpeeches(props.row.id - 1, props.row.ngram);
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
/* rows.value = [
      { id: 1, words: "ett ord", frequency: 1 },
    { id: 2, words: "två ord", frequency: 2 },
    { id: 3, words: "tre ord", frequency: 3 },
  ];*/
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
