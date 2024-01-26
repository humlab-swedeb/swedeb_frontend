<template>
  <div>
    <q-slide-transition v-show="showData">
      <q-list dense bordered class="q-pa-md rounded-borders bg-grey-2">
        <q-item-label caption class="text-black text-bold">
          Valda filtreringsalternativ:
        </q-item-label>
        <div v-for="(value, key) in displayedData" :key="key">
          <div v-if="Array.isArray(value) && value.length > 0">
            {{ key }}: {{ value.join(", ") }}
          </div>
          <!-- If the key is 'yearRange', display the min and max values -->
          <div v-else-if="key === 'yearRange'">
            {{ key }}: {{ value.min }} - {{ value.max }}
          </div>
        </div>
      </q-list>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { metaDataStore } from "src/stores/metaDataStore.js";
import { ref, watchEffect } from "vue";
const store = metaDataStore();
const displayedData = ref({});
const showData = ref(false);

watchEffect(() => {
  // When the submitEvent is triggered in the store, update the displayedData and showData values
  if (store.submitEvent && store.updateEvent) {
    showData.value = true;
    displayedData.value = { ...store.selected };
  }
  store.updateEvent = false;
});
</script>
