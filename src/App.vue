<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';
import { metaDataStore } from "src/stores/metaDataStore.js";


export default defineComponent({
  name: 'App',
  beforeMount() {
    const metaStore = metaDataStore();
    metaStore.fetchAllMetaData();
    document.title = "Riksdagsdebatter.se - Riksdagens anföranden";

  }
});
</script>
