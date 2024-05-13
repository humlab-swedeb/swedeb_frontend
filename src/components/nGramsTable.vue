<template>
  <div>
    <q-item-label class="q-my-md"
      >Sökningen resulterade i 12 antar träffar</q-item-label
    >
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
            {{ col.value }}
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
        <q-tr v-show="props.expand">
          <q-td :colspan="props.cols.length" no-hover>
            <div>
              <div class="row q-py-md justify-between">
                <q-item-label class="col-9 q-mt-md">
                  Sökningen resulterade i
                  <b>12</b> antal träffar.
                </q-item-label>
                <q-btn
                  no-caps
                  icon="download"
                  class="text-grey-8 col-3"
                  color="secondary"
                  label="Ladda ner alla"
                  style="width: fit-content"
                />
              </div>
              <q-table
                bordered
                flat
                :rows="speechRows"
                :columns="speechColumns"
                row-key="id"
                :rows-per-page-options="[10, 20, 50]"
                v-if="!loading"
                class="bg-grey-2 full-width"
              >
                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>

                <template v-slot:body="props">
                  <q-tr
                    :props="props"
                    @click="expandRow(props)"
                    class="cursor-pointer"
                  >
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      class="bg-white"
                      :class="props.expand ? 'bg-grey-3' : ''"
                    >
                      {{ col.value }}
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
                        :icon="
                          props.expand
                            ? 'keyboard_arrow_up'
                            : 'keyboard_arrow_down'
                        "
                      />
                    </q-td>
                  </q-tr>
                  <q-tr v-show="props.expand" :props="props">
                    <q-td :colspan="props.cols.length" no-hover>
                      <loadingIcon v-if="loading" size="100" />
                      <q-card v-else flat class="bg-transparent">
                        <q-card-section class="q-px-md row">
                          <q-card-section class="col q-pa-none">
                            <div class="text-h6 row">
                              <q-item-label
                                class="q-mt-xs"
                                v-if="props.row.speaker"
                              >
                                {{ props.row.speaker }},&nbsp;
                              </q-item-label>
                              <q-item-label
                                class="q-mt-xs"
                                v-if="props.row.party"
                              >
                                ({{ props.row.party }}),&nbsp;
                              </q-item-label>
                              <q-item-label
                                class="q-mt-xs"
                                v-if="props.row.gender"
                              >
                                {{ props.row.gender }}
                              </q-item-label>
                            </div>
                            <q-item-label caption class="text-bold">{{
                              props.row.protocol
                            }}</q-item-label>
                            <q-item-label
                              class="q-pt-xs"
                              v-if="props.row.node_word"
                            >
                              Sökord:
                              <b>{{ props.row.node_word }}</b>
                            </q-item-label>
                          </q-card-section>
                        </q-card-section>
                        <q-card-section class="row q-pr-none">
                          <q-card-section
                            class="q-pa-none q-pr-md col-10"
                            style="white-space: normal"
                          >
                            <q-item-label caption class="text-bold">{{
                              speakerNote
                            }}</q-item-label>
                            <q-item-label>{{ speechText }}</q-item-label>
                          </q-card-section>
                          <q-card-section class="col-2 q-pa-none">
                            <div class="column q-gutter-y-md">
                              <q-btn
                                v-if="props.row.link !== 'Okänd'"
                                no-caps
                                :href="props.row.link"
                                target="_blank"
                                class="full-width items-start text-grey-8"
                                color="secondary"
                              >
                                <q-icon
                                  left
                                  name="person_search"
                                  color="accent"
                                  size="xs"
                                />
                                <q-item-label>Wikidata</q-item-label>
                              </q-btn>
                              <q-btn
                                no-caps
                                :href="props.row.source"
                                target="_blank"
                                class="full-width items-start text-grey-8"
                                color="white"
                              >
                                <q-icon
                                  left
                                  name="open_in_new"
                                  color="accent"
                                  size="xs"
                                />
                                <q-item-label>Öppna källa</q-item-label>
                              </q-btn>
                              <q-btn
                                outline
                                no-caps
                                class="full-width items-start text-grey-8"
                                color="accent"
                              >
                                <q-icon
                                  left
                                  name="download"
                                  color="accent"
                                  size="xs"
                                />
                                <q-item-label>Ladda ned</q-item-label>
                              </q-btn>
                            </div>
                          </q-card-section>
                        </q-card-section>
                      </q-card>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import loadingIcon from "src/components/loadingIcon.vue";
import { metaDataStore } from 'src/stores/metaDataStore';
import { nGramsDataStore } from 'src/stores/nGramsDataStore';

const metaStore = metaDataStore();
const nGramsStore = nGramsDataStore();

const rows = ref([]);
const columns = ref([]);
const loading = ref(false);
const speechRows = ref([]);
const speechColumns = ref([]);
const speakerNote = ref("Hello");
const speechText = ref(
  "Fru talman! Jag utgår från att alla som köper en hund eller en häst tänker efter noga innan de gör det och sörjer på bästa sätt för dessa djurs välbefinnande. Vad det handlar om här är saker som man inte har lyckats få fram genom en undersökningsplikt och vem som ska stå för kostnaderna om man har anlitat en veterinär för tillstånd som var okända. Då är idén från regeringens sida att sådana fullständigt oförutsedda kostnader bättre bärs av den som borde känna till dem, nämligen näringsidkaren, än den som har köpt djuret. Här gör vi uppenbarligen olika bedömningar. Jag tror inte att det är entydigt så att köplagen innebär ett bättre djurskydd. Köplagen är en mycket gammal lag som faktiskt inte särskilt har anpassats för detta ändamål. Men det blir kanske inte med nödvändighet sämre. Och det är nog inte detta som det handlar om, utan det handlar om hur man reglerar intressena mellan näringsidkare och konsumenter. Där är skiljelinjen tydlig. Sverigedemokraterna väger än en gång över på näringsidkarnas sida. Det har man gjort tidigare när det gäller sjysta villkor vid upphandling och när det gäller friskoleföretag, och nu handlar det om djuruppfödning. Det får väl föras till protokollet vilken sida Sverigedemokraterna står på, nämligen den som möter vanligt folk, och att Socialdemokraterna står på vanligt folks sida. Om detta lär väl diskussionen fortsätta."
);

const expandRow = async (props) => {
  props.expand = !props.expand;
};

watchEffect(() => {
  if(metaStore.submitEvent) {
    rows.value = nGramsStore.nGrams.map((entry) => ({
      id: entry.id,
      words: entry.words,
      frequency: entry.frequency,

    }))
  }
  rows.value = [
    { id: 1, words: "ett ord", frequency: 1 },
    { id: 2, words: "två ord", frequency: 2 },
    { id: 3, words: "tre ord", frequency: 3 },
  ];
  columns.value = [
    {
      name: "id",
      label: "ID",
      align: "left",
      field: "id",
      sortable: true,
    },
    {
      name: "words",
      label: "Ordfönster",
      align: "left",
      field: "words",
      sortable: true,
    },
    {
      name: "frequency",
      label: "Frekvens",
      align: "left",
      field: "frequency",
      sortable: true,
    },
  ];
  speechRows.value = [
    {
      id: 1,
      left: "ett ord",
      word: "två ord",
      right: "tre ord",
      speaker: "Talare",
      party: "S",
      year: "1940",
      speechID: "1",
    },
    {
      id: 2,
      left: "ett ord",
      word: "två ord",
      right: "tre ord",
      speaker: "Talare",
      party: "M",
      year: "1930",
      speechID: "2",
    },
    {
      id: 3,
      left: "ett ord",
      word: "två ord",
      right: "tre ord",
      speaker: "Talare",
      party: "V",
      year: "1960",
      speechID: "3",
    },
  ];

  speechColumns.value = [
    {
      name: "left",
      label: "Vänster",
      align: "left",
      field: "left",
      sortable: true,
    },
    {
      name: "word",
      label: "Sökord",
      align: "left",
      field: "word",
      sortable: true,
    },
    {
      name: "right",
      label: "Höger",
      align: "left",
      field: "right",
      sortable: true,
    },
    {
      name: "speaker",
      label: "Talare",
      align: "left",
      field: "speaker",
      sortable: true,
    },
    {
      name: "party",
      label: "Parti",
      align: "left",
      field: "party",
      sortable: true,
    },
    {
      name: "year",
      label: "År",
      align: "left",
      field: "year",
      sortable: true,
    },
    {
      name: "id",
      label: "Anförande",
      align: "left",
      field: "speechID",
      sortable: true,
    },
  ];
});
</script>

<style scoped></style>
