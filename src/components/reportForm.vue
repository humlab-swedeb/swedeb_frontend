<template>
  <q-dialog v-model="dialogVisible" @hide="handleClose" full-width>
    <q-card class="q-px-xl q-py-lg">
      <q-card-section class="q-px-none q-pb-sm">
        <p class="text-h6 q-mb-none">
          Skicka in förslag på ändringar i anförandet
        </p>
      </q-card-section>
      <q-form @submit="submitForm">
        <q-item-label class="text-subtitle1 text-bold q-pb-sm"
          >Metadata</q-item-label
        >
        <div
          class="cursor-pointer"
          v-for="(value, key) in feedbackStore.getFeedbackVariables(
            feedbackStore.data
          )"
          :key="key"
        >
          {{ key }}: {{ value }}
          <q-popup-edit
            v-model="feedbackStore.data[key]"
            auto-save
            v-slot="scope"
            title="Föreslå ändringar i metadatan för anförandet"
            buttons
            color="accent"
            label-set="Spara Ändring"
            label-cancel="Avbryt"
          >
            <q-input
              v-model="scope.value"
              :label="key"
              dense
              autofocus
              color="accent"
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </div>
        <q-item-label class="text-subtitle1 text-bold q-pb-sm q-pt-md">
          Anförandetext och talarnotering
        </q-item-label>
        <div v-for="(value, key) in feedbackStore.speech" :key="key">
          {{ key }}:
          <div v-html="key === 'speech_text' ? testet : value" />

          <q-popup-edit
            v-model="feedbackStore.speech[key]"
            auto-save
            buttons
            v-slot="scope"
            title="Föreslå ändringar i anförandet"
            color="accent"
            label-set="Spara Ändring"
            label-cancel="Avbryt"
          >
            <q-input
              v-model="scope.value"
              :label="key"
              dense
              autofocus
              autogrow
              color="accent"
              @keyup.enter.stop
              spellcheck="false"
            >
            </q-input>
          </q-popup-edit>
        </div>

        <q-btn type="submit" label="Submit" color="accent" flat no-caps></q-btn>
      </q-form>
    </q-card>
    <q-card-actions align="center">
      <q-btn
        label="Stäng"
        color="accent"
        no-caps=""
        @click="handleClose"
      ></q-btn>
    </q-card-actions>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits, watchEffect } from "vue";
import { feedbackDataStore } from "src/stores/feedbackDataStore";

const feedbackStore = feedbackDataStore();

const props = defineProps({
  clicked: Boolean,
  speechText: String,
});

const dialogVisible = ref(props.clicked);
const emit = defineEmits(["close"]);

const submitForm = () => {
  console.log("submitting form");
};

/* const closeDialog = () => {
  dialogVisible.value = false;
}; */

const replaceWordWithBoldTags = (str, word) => {
  const words = word.split(",").map((w) => w.trim());

  words.forEach((w) => {
    const regex = new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, "giu");
    str = str.replace(regex, (match) => `<b>${match}</b>`);
  });

  return str;
};
const replaceNewLine = (str) => {
  return str.replace(/\n/g, "<br><br>");
};

const testet = ref("");
watchEffect(() => {
  testet.value = replaceWordWithBoldTags(
    replaceNewLine(feedbackStore.speech.speech_text),
    feedbackStore.data.node_word
  );
});

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
