<template>
  <q-dialog v-model="dialogVisible" @hide="handleClose">
    <q-card class="q-px-xl q-py-lg">
      <q-card-section class="q-px-none q-pb-sm">
        <p class="text-h6 q-mb-none">
          Du kommer skickas vidare att lämna din feedback till SweRiks github
          sida.
        </p>
      </q-card-section>
      <q-card-section>
        <q-item-label class="text-subtitle1 text-bold q-pb-sm">
          Metadata
        </q-item-label>
        <div
          v-for="(value, key) in feedbackStore.getFeedbackVariables(
            feedbackStore.data
          )"
          :key="key"
        >
          {{ key }}: {{ value }}
        </div>
        <q-btn @click="copy">COPY</q-btn>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          label="Stäng"
          no-caps
          @click="handleClose"
        ></q-btn>
        <q-btn
          label="Gå vidare till Github"
          href="https://github.com/orgs/swerik-project/discussions/categories/report-errors"
          target="_blank"
          color="accent"
          no-caps
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits, watchEffect } from "vue";
import { feedbackDataStore } from "src/stores/feedbackDataStore";

const feedbackStore = feedbackDataStore();

const props = defineProps({
  clicked: Boolean,
});

const copy = () => {
  navigator.clipboard.writeText(
    JSON.stringify(feedbackStore.getFeedbackVariables(feedbackStore.data))
  );
  alert("Copied");
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
