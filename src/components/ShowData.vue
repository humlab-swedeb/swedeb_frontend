<template>
  <div>
    <div v-if="store.data">
      <h5>Data from API:</h5>
      <q-list dense bordered>
        <q-item v-for="o in store.data" :key="o.id">
          {{ o.name + ", " + o.party }}
        </q-item>
      </q-list>
      <p>{{ $t("success") }}</p>
    </div>
  </div>
</template>

<script setup>
import { dataStore } from "src/stores/dataStore.js";
const store = dataStore();

</script>
