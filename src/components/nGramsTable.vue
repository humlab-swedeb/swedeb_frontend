<template>
  <template v-if="showLoadingIndicator">
    <loadingIcon size="64" />
  </template>
  <template v-else-if="hasNGramRows">
    <div class="row q-py-md justify-between">
      <q-item-label class="col-9 q-mt-md" v-if="nGramStore.totalHits > 0">
        {{ $t("searchResult1") }} <b>{{ nGramStore.totalHits }}</b>
        {{ $t("searchResult2ngram") }}
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
      :rows-per-page-options="[10, 25, 50]"
      v-model:pagination="paginationModel"
      @request="onRequest"
      :loading="nGramStore.isPageLoading"
      v-if="!loading"
      class="bg-grey-2"
    >
      <template v-slot:top-row v-if="nGramStore.ticketStatus === 'partial'">
        <q-tr>
          <q-td :colspan="columns.length + 1" class="q-pa-none">
            <q-linear-progress
              indeterminate
              color="accent"
              track-color="grey-3"
              class="q-mb-none"
              style="height: 6px"
            />
            <q-item-label caption class="q-px-sm q-pt-xs text-grey-7">
              {{ $t("accessibility.loadingResults") }}
            </q-item-label>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
            <q-badge
              v-if="
                col.name === 'count' && nGramStore.ticketStatus === 'partial'
              "
              color="warning"
              class="q-ml-xs"
              >{{ $t("ngramCountApproximate") }}</q-badge
            >
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
  <template v-else-if="showNoResults">
    <!-- Show a message when there's no data and not loading -->
    <noResults />
  </template>
</template>

<script setup>
import { ref, computed } from "vue";
import loadingIcon from "src/components/loadingIcon.vue";
import speechDataTableNgram from "src/components/speechDataTableNgram.vue";
import { nGramDataStore } from "src/stores/nGramDataStore";
import noResults from "src/components/noResults.vue";

const nGramStore = nGramDataStore();

const hasNGramRows = computed(
  () => nGramStore.nGrams && nGramStore.nGrams.length > 0,
);

const isWaitingForInitialResults = computed(
  () =>
    nGramStore.hasSubmittedQuery &&
    !hasNGramRows.value &&
    (nGramStore.isLoading ||
      nGramStore.isPageLoading ||
      nGramStore.ticketStatus === "pending" ||
      nGramStore.ticketStatus === "partial"),
);

const showLoadingIndicator = computed(() => isWaitingForInitialResults.value);

const showNoResults = computed(
  () =>
    nGramStore.hasSubmittedQuery &&
    !hasNGramRows.value &&
    !nGramStore.isLoading &&
    !nGramStore.isPageLoading &&
    !nGramStore.errorMessage &&
    nGramStore.ticketStatus === "ready" &&
    nGramStore.totalHits === 0,
);

const loading = ref(false);
const innerLoading = ref({});
const speechesNgram = ref(null);

// Reactive rows derived from store's current page
const rows = computed(() =>
  nGramStore.nGrams.map((entry, index) => ({
    id: index + 1,
    ngram: entry.ngram,
    count: entry.count,
    speeches: entry.documents.length,
  })),
);

const paginationModel = computed({
  get: () => nGramStore.pagination,
  set: (value) => {
    nGramStore.pagination = value;
  },
});

const onRequest = async ({ pagination }) => {
  await nGramStore.fetchNgramPage({
    page: pagination.page,
    rowsPerPage: pagination.rowsPerPage,
    sortBy: pagination.sortBy,
    descending: pagination.descending,
  });
};

const formatSearch = (value) => {
  let searchString = nGramStore.searchString;
  if (searchString.includes(".*")) {
    searchString = searchString.replace(".*", "");
  }
  if (!searchString) return value;

  const lowerValue = value.toLowerCase();
  const lowerSearchString = searchString.toLowerCase();
  let startIndex = 0;
  let matchIndex = lowerValue.indexOf(lowerSearchString, startIndex);
  let formattedValue = "";

  while (matchIndex !== -1) {
    formattedValue += value.slice(startIndex, matchIndex);
    formattedValue += `<b>${value.slice(matchIndex, matchIndex + searchString.length)}</b>`;
    startIndex = matchIndex + searchString.length;
    matchIndex = lowerValue.indexOf(lowerSearchString, startIndex);
  }

  formattedValue += value.slice(startIndex);
  return formattedValue;
};

const downloadNgram = () => {
  nGramStore.downloadNGramTableCSV();
};

const downloadNgramExcel = () => {
  nGramStore.downloadNGramTableExcel();
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
        10, //hits per page, initial value
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      innerLoading.value[props.row.id] = false;
    }
  }
};

const columns = [
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
    sortable: false,
  },
];
</script>

<style scoped></style>
