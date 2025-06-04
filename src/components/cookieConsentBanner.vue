<template>
  <q-banner
    dense
    rounded
    inline-actions
    v-if="showBanner"
    class="cookie-banner"
  >
  <q-avatar>🍪</q-avatar>
    Riksdagsdebatter.se använder cookies för webb- och statistikanalys, är detta
    ok?
    <template v-slot:action>
      <q-btn no-caps flat color="red" label="Nej" @click="rejectCookies" />
      <q-btn no-caps flat color="green" label="Ja" @click="acceptCookies" />
    </template>
  </q-banner>
</template>

<script setup>
import { ref, onMounted } from "vue";

const showBanner = ref(false);

onMounted(() => {
  showBanner.value = localStorage.getItem("cookie_consent") === null;
});

const acceptCookies = () => {
  localStorage.setItem("cookie_consent", "true");
  location.reload(); // Ladda om för att aktivera analytics
};

const rejectCookies = () => {
  localStorage.setItem("cookie_consent", "false");
  location.reload(); // Se till att analytics inte körs
};
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 16px;
  right: 16px;
  border-radius: 8px;
  z-index: 9999;
  background-color: #1d1c2bd5;
  color: white;
  align-items: center;
  padding: 8px 16px;
}
</style>
