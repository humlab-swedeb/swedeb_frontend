<template>
  <router-view />
  <cookieConsentBanner />
</template>

<script>
import { defineComponent } from "vue";
import { metaDataStore } from "src/stores/metaDataStore.js";
import cookieConsentBanner from "./components/cookieConsentBanner.vue";

export default defineComponent({
  name: "App",
  beforeMount() {
    const metaStore = metaDataStore();
    metaStore.fetchAllMetaData();
    document.title = "Riksdagsdebatter.se - Riksdagens anföranden";
  },
  components: {
    cookieConsentBanner,
  },
});
</script>
