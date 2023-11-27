<!-- src/components/ApiTest.vue -->

<template>
  <q-card class="fit q-ma-xl q-py-lg q-px-xl shadow-8">
    <h3>API Test</h3>
    <button @click="fetchDataFromApi">Fetch Data</button>
    <div v-if="store.data">
      <h5>Data from API:</h5>
      <q-list dense bordered>
        <q-item v-for="o in store.data" :key="o.id">
          {{ o.name + ", " + o.party }}
        </q-item>
      </q-list>
      <p>{{$t('success')}}</p>
      <metaData />
    </div>
  </q-card>
</template>

<script>
import { useMyStore } from "src/stores/example-store.js";
import metaData from "../components/metaData.vue";

export default {
  components: {
    metaData,
  },

  setup() {
    const store = useMyStore();

    const fetchDataFromApi = async () => {
      try {
        await store.fetchData("/speakers");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    return {
      store,
      fetchDataFromApi,
    };
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
