<template>
  <q-dialog v-model="dialogVisible" @hide="handleClose">
    <q-card class="q-pa-lg bg-primary">
      <q-card-section class="q-pb-sm">
        <q-item-label class="text-h6 q-mb-none">
          {{ $t("reportTitle") }}
        </q-item-label>
        <q-item-label>
          {{ $t("reportText") }}
        </q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label class="text-subtitle1 text-bold q-pb-sm">
          {{ $t("meta") }}
        </q-item-label>
        <div class="bg-grey-4 q-pa-md q-pr-xl" style="max-width: fit-content">
          <div
            class="text-caption text-bold"
            v-for="(value, key) in feedbackStore.getFeedbackVariables(
              feedbackStore.data
            )"
            :key="key"
          >
            {{ key }}: {{ value }}
          </div>
        </div>
        <q-btn
          no-caps
          flat
          color="accent"
          :icon="copyIcon"
          :label="copyLabel"
          @click="copy"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Stäng" no-caps @click="handleClose" icon="close" />
        <q-btn
          label="Gå vidare till Github"
          href="https://github.com/orgs/swerik-project/discussions/categories/report-errors"
          target="_blank"
          color="accent"
          no-caps
          icon-right="open_in_new"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits } from "vue";
import { feedbackDataStore } from "src/stores/feedbackDataStore";

const feedbackStore = feedbackDataStore();

const props = defineProps({
  clicked: Boolean,
});

const copyIcon = ref("content_copy");
const copyLabel = ref("Kopiera metadata");

const copy = () => {
  navigator.clipboard.writeText(
    JSON.stringify(feedbackStore.getFeedbackVariables(feedbackStore.data))
  );
  copyIcon.value = "done";
  copyLabel.value = "Kopierat!";
};

const dialogVisible = ref(props.clicked);
const emit = defineEmits(["close"]);

watch(
  () => props.clicked,
  (newValue) => {
    dialogVisible.value = newValue;
  }
);

const handleClose = () => {
  emit("close");
};
</script>

<style scoped>
/* Add custom styles here */
</style>
