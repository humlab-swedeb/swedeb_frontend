<template>
  <q-card class="q-mx-sm bg-grey-2">
    <q-card-section
      horizontal
      @click="showing = !showing"
      class="items-center cursor-pointer q-pr-sm bg-white"
    >
      <q-card-section class="text-subtitle1">
        <q-icon name="o_filter_alt" color="accent" size="sm" class="q-pr-sm" />
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

    <q-slide-transition v-show="showing">
      <!--       <q-scroll-area v-show="showing" style="height: 80px">
 -->
      <q-card-section class="q-px-md q-pt-none">
        <q-separator />
        <q-card-section class="q-px-none q-pb-none">
          <!-- PLACE METADATA FILTER COMPONENTS HERE -->
          <yearRange />
          <dropdownSelection type="party" />
          <q-card-section horizontal class="q-px-none">
            <q-card-section>
              <genderOfficeCheckbox type="gender" />
            </q-card-section>
            <q-card-section>
              <genderOfficeCheckbox type="office" />
            </q-card-section>
          </q-card-section>
          <dropdownSelection type="subOffice" />
          <dropdownSelection type="speakers" />
          <div class="column items-end q-">
            <q-btn
              v-if="hasSelections"
              @click="store.resetSelectedState"
              class="buttonStyle col"
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
  <q-card flat class="q-ma-md bg-transparent">
    <toolsFilters />
    <q-btn @click="handleSubmit" no-caps class="fit q-py-sm" color="accent">
      Submit
    </q-btn>
  </q-card>
</template>

<script setup>
import yearRange from "src/components/metaDataComponents/yearRange.vue";
import genderOfficeCheckbox from "src/components/metaDataComponents/genderOfficeCheckbox.vue";
import dropdownSelection from "./metaDataComponents/dropdownSelection.vue";
import toolsFilters from "./toolsFilters.vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import { ref, computed } from "vue";
const store = metaDataStore();
const wtStore = wordTrendsDataStore();
const showing = ref(true);

const handleSubmit = async () => {
  store.submitEvent = true;
  store.updateEvent = true;
  await wtStore.getWordTrendsResult(wtStore.searchText);
};

const hasSelections = computed(() => {
  const { party, gender, office, subOffice, speakers } = store.selected;
  return (
    party.length > 0 ||
    gender.length > 0 ||
    office.length > 0 ||
    subOffice.length > 0 ||
    speakers.length > 0
  );
});
</script>

<style scoped>
.buttonStyle {
  text-decoration: underline;
}
</style>
