<template>
  <q-dialog v-model="dialogVisible" @hide="handleClose" full-width full-height>
    <q-card flat class="background q-mt-lg">
      <q-card-section class="row justify-between">
        <q-item-label class="text-h6">PDF Viewer</q-item-label>
        <q-btn flat no-caps @click="handleClose" icon="close">Stäng tal</q-btn>
      </q-card-section>
      <q-card-section class="row justify-center justify-between q-py-none">
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
      <q-separator inset size="2px" color="grey-5" />
      <q-card-section class="pdf row justify-center bg-white">
        <VuePDF :pdf="pdf" :page="page" :scale="scale" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits } from "vue";
import { VuePDF, usePDF } from "@tato30/vue-pdf";

const props = defineProps({
  clicked: Boolean,
});

const dialogVisible = ref(props.clicked);
const emit = defineEmits(["close"]);
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

watch(
  () => props.clicked,
  (newValue) => {
    dialogVisible.value = newValue;
  }
);

const handleClose = () => {
  scale.value = 1.2;
  page.value = 1;
  emit("close");
};
</script>

<style scoped></style>
