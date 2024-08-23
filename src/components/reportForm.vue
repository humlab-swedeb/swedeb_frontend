<template>
  {{ props.clicked }}
  <q-dialog v-model="dialogVisible" @hide="handleClose">
    <q-card class="q-px-xl q-py-md">
      <q-form @submit="submitForm">
        <q-input
          v-model="name"
          label="Name"
          dense
          outlined
          required
          color="accent"
        ></q-input>
        <q-input
          v-model="email"
          :label="speechData.props.row.party"
          dense
          outlined
          required
        ></q-input>
        <q-input
          v-model="message"
          label="Message"
          type="textarea"
          dense
          outlined
          required
        ></q-input>
        {{ props.speechData.props.row }}
        <q-btn type="submit" label="Submit" color="primary" dense flat></q-btn>
      </q-form>
    </q-card>
    <q-card-actions align="right">
      <q-btn
        label="Close"
        color="primary"
        dense
        flat
        @click="handleClose"
      ></q-btn>
    </q-card-actions>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits } from "vue";

const props = defineProps({
  clicked: Boolean,
  speechData: Object,
  speechText: String,
});

const dialogVisible = ref(props.clicked);
const emit = defineEmits(["close"]);
const speechData = ref(props.speechData);
const speechText = ref(props.speechText);

const name = ref("");
const email = ref("");
const message = ref("");

const submitForm = () => {

  console.log(email.value);
};

/* const closeDialog = () => {
  dialogVisible.value = false;
}; */

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
