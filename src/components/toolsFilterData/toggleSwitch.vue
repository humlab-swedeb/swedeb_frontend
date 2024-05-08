<template>
  <q-toggle
    v-model="toggleValue"
    :label="label"
    color="accent"
    keep-color
    @click="handleInput"

  />
</template>

<script setup>
import { ref } from "vue";
const props = defineProps(["label"]);
const emit = defineEmits(["normalize-data"])


const toggleValue = ref(false);

const handleInput = () => {
  emit('normalize-data', toggleValue.value);
};
</script>
