<template>
  <q-card flat class="background justify-center max-width q-mt-lg">
    <q-card-section class="row justify-between">
      <q-item-label class="text-h6">PDF Viewer</q-item-label>
      <q-btn flat no-caps @click="goBack" icon="close">Stäng tal</q-btn>
    </q-card-section>
    <q-card-section
      class="toolbar row justify-center justify-between q-py-none"
    >
      <q-card-section class="q-pt-none">
        <q-btn
          class="q-mr-md q-pl-sm"
          color="accent"
          no-caps
          @click="prevPage"
          icon="chevron_left"
          :disable="page <= 1"
        >
          Föregående sida
        </q-btn>
        <span class="text-bold text-subtitle1">{{ page }} / {{ pages }}</span>
        <q-btn
          class="q-ml-md q-pr-sm"
          color="accent"
          no-caps
          icon-right="chevron_right"
          @click="nextPage"
          :disable="page >= pages"
        >
          Nästa sida
        </q-btn>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-btn no-caps flat @click="zoomOut" icon="zoom_out">Zoom ut</q-btn>
        <q-btn no-caps flat @click="zoomIn" icon="zoom_in">Zoom in</q-btn>
      </q-card-section>
    </q-card-section>
    <q-separator size="2px" color="grey-5" />
    <q-card-section class="pdf row justify-center bg-white">
      <VuePDF :pdf="pdf" :page="page" :scale="scale" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { VuePDF, usePDF } from "@tato30/vue-pdf";
import { ref } from "vue";

const { pdf, pages } = usePDF("/pdf/test.pdf");
const page = ref(1);
const scale = ref(1.2);

const nextPage = () => {
  if (page.value < pages.value) {
    page.value++;
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
  }
};

const zoomIn = () => {
  scale.value += 0.1;
};

const zoomOut = () => {
  if (scale.value > 0.5) {
    scale.value -= 0.1;
  }
};

const goBack = () => {
  window.close();
};
</script>

<style scoped>
.pdf {
  width: 800px;
  height: 900px;
  overflow: auto;
}
</style>
