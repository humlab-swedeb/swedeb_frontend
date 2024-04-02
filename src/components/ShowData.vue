<template>
  <div>
    <q-slide-transition v-show="showData">
      <q-list dense bordered class="q-pa-md rounded-borders bg-grey-2">
        <q-item-label caption class="text-black text-bold">
          {{ $t("selectedMetaDataTitle") }}
        </q-item-label>
        <div v-for="(value, key) in displayedData" :key="key" class="q-mr-md">
          <!-- If the key is 'yearRange', display the min and max values -->
          <div v-if="key === 'yearRange'">
            <b>{{ customKey(key) }}:</b> {{ value.min }} - {{ value.max }}
          </div>
          <div v-else-if="key === 'speakers' && value.length > 0">
            <b>{{ customKey(key) }}:</b>
            {{ value.map((speaker) => speaker.name).join(", ") }}
          </div>
          <div v-else-if="key === 'party'  && value.length > 0">
            <b>{{ customKey(key) }}:</b> {{ value.join(", ") }}
          </div>
          <div v-else-if=" key === 'gender'  && value.length > 0">
            <b>{{ customKey(key) }}:</b> {{ getJoinedGender() }}
          </div>
          <div v-else-if="(key === 'party' || key === 'gender' || key === 'speakers') ">
            <b>{{ customKey(key) }}:</b> Alla
          </div>
        </div>
      </q-list>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { metaDataStore } from "src/stores/metaDataStore.js";
import { ref, watchEffect } from "vue";
import i18n from "src/i18n/sv/index.js";
const store = metaDataStore();
const displayedData = ref({});
const showData = ref(false);

const customKeys = {
  office: i18n.office,
  subOffice: i18n.subOffice,
  party: i18n.party,
  gender: i18n.gender,
  yearRange: i18n.year,
  speakers: i18n.speakers,
};
const customKey = (key) => customKeys[key] || key;

const getJoinedGender = () => {
  return store.selected.gender.map(gender => store.options.gender[gender]).join(", ");
};

watchEffect(() => {
  // When the submitEvent is triggered in the store, update the displayedData and showData values
  if (store.submitEvent && store.updateEvent) {
    showData.value = true;
    displayedData.value = { ...store.selected };
  }
  store.updateEvent = false;
});
</script>
