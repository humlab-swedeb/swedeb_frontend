<template>
  <div style="max-width: 400px">
    <q-card class="q-mx-sm bg-grey-2">
      <q-card-section
        horizontal
        @click="showing = !showing"
        class="items-center cursor-pointer q-pr-sm bg-white"
      >
        <q-card-section class="text-subtitle1">
          <q-icon
            name="o_filter_alt"
            color="accent"
            size="sm"
            class="q-pr-sm"
          />
          {{ $t("metaDataFilter") }}</q-card-section
        >

        <q-space />
        <q-btn
          color="accent"
          round
          flat
          dense
          size="lg"
          :icon="showing ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        />
      </q-card-section>

      <!-- <q-slide-transition v-show="showing"> -->
      <q-slide-transition
        v-if="$route.path === '/tools/speeches' ? !showing : showing"
      >
        <q-card-section class="q-px-md q-pt-none">
          <q-separator />
          <q-card-section class="q-px-none q-pb-none">
            <!-- PLACE METADATA FILTER COMPONENTS HERE -->
            <yearRange />
            <dropdownSelection type="party" />
            <q-card-section horizontal class="q-px-none">
              <q-card-section class="q-py-none">
                <genderOfficeCheckbox type="gender" />
              </q-card-section>
              <q-card-section class="q-py-none">
                <!-- <genderOfficeCheckbox type="office" /> -->
              </q-card-section>
            </q-card-section>
            <!-- Do not show sub office type as of now -->
            <!-- <dropdownSelection type="subOffice" /> -->
            <dropdownSelection type="speakers" />
            <div class="column items-end q-">
              <q-btn
                v-if="hasSelections"
                @click="store.resetSelectedState"
                class="resetStyle col"
                flat
                no-caps
                label="Rensa filter"
                color="grey-7"
              >
              </q-btn>
            </div>
          </q-card-section>
        </q-card-section>
        <!--       </q-scroll-area>
      -->
      </q-slide-transition>
    </q-card>
    <q-card flat class="q-ma-md bg-transparent padding-bot">
      <toolsFilters @normalize-data="handleNormalizeData" />
      <div class="q-pa-lg full-width sticky-bottom">
        <q-btn
          @click="handleSubmit"
          no-caps
          class="fit text-h6"
          color="accent"
          label="Sök"
          v-if="$route.path !== '/tools/speeches'"
          :disabled="
            wtStore.wordHitsSelected.length < 1 ||
            ($route.path === '/tools/wordtrends' &&
              wtStore.wordHitsSelected.some(
                (word) => word.includes(' ') || word.includes('*')
              )) ||
            ($route.path === '/tools/kwic' &&
              wtStore.wordHitsSelected.length > 1) ||
            ($route.path === '/tools/ngram' &&
              wtStore.wordHitsSelected.length > 1)
          "
        >
          <q-tooltip
            v-if="wtStore.wordHitsSelected.length < 1"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            Lägg till sökord
          </q-tooltip>
          <q-tooltip
            v-if="
              $route.path === '/tools/kwic' &&
              wtStore.wordHitsSelected.length > 1
            "
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            Key words in context (KWIC) kan endast användas med ett sökord eller
            sökfras år gången.
          </q-tooltip>

          <q-tooltip
            v-if="
              $route.path === '/tools/ngram' &&
              wtStore.wordHitsSelected.length > 1
            "
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            I verktyget N-gram kan endast ett sökord användad åt gången, alt. använda <code>.*</code> för wildcardsökning.
          </q-tooltip>

          <q-tooltip
            v-if="
              $route.path === '/tools/wordtrends' &&
              wtStore.wordHitsSelected.some(
                (word) => word.includes(' ') || word.includes('*')
              )
            "
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            I verktyget <b>Ordtrender</b> kan du inte söka på fraser: Ta bort
            dessa för att genomföra sökningen <br /><br />
            <code>{{
              wtStore.wordHitsSelected.filter(
                (word) => word.includes(" ") || word.includes("*")
              )
            }}</code>
          </q-tooltip>
        </q-btn>
        <q-btn
          @click="handleSubmit"
          no-caps
          class="fit text-h6"
          color="accent"
          label="Sök"
          v-else-if="$route.path === '/tools/speeches'"
        >
        </q-btn>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import yearRange from "src/components/metaDataComponents/yearRange.vue";
import genderOfficeCheckbox from "src/components/metaDataComponents/genderOfficeCheckbox.vue";
import dropdownSelection from "./metaDataComponents/dropdownSelection.vue";
import toolsFilters from "./toolsFilters.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
const store = metaDataStore();
const wtStore = wordTrendsDataStore();
const showing = ref(false);
const route = useRoute();

const handleNormalizeData = (newValue) => {
  // only really for word trends right now,
  // for KWIC this could/should be used for lemmatization instead
  // should also be two different toggles


  if (route.path === '/tools/wordtrends') {
    wtStore.normalizeResults = newValue;

  } else if (route.path === '/tools/kwic') {
    //console.log('Toggle event emitted with value: IN METADATA for KWIC', newValue);

  } else {
    //console.log('should not happen...')
  }
};

const handleSubmit = async () => {
  store.submitEvent = true;
  store.updateEvent = true;
};

const hasSelections = computed(() => {
  const { party, gender, office, subOffice, speakers } = store.selected;
  return (
    party.length > 0 ||
    gender.length > 0 ||
    office.length > 0 ||
    subOffice.length > 0 ||
    speakers.length > 0 ||
    store.selected.yearRange.min !== store.options.yearRange.min ||
    store.selected.yearRange.max !== store.options.yearRange.max
  );
});
</script>

<style lang="scss" scoped>
.sticky-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, #eeeeee, rgb(238, 238, 238, 0.5));
}

.padding-bot {
  padding-bottom: 80px;
}
</style>
