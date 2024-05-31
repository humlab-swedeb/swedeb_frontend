

<template>
  <q-toggle
    v-model="toggleValue"
    :label="label"
    color="accent"
    keep-color
    @click="handleToggle"
  >
    <q-tooltip>{{ tooltip }}</q-tooltip>
  </q-toggle>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps(["label", "tooltip"]);
const emit = defineEmits(["toggle-event"])


const toggleValue = ref(false);

const handleToggle = () => {
  emit('toggle-event', toggleValue.value);
};
</script>
