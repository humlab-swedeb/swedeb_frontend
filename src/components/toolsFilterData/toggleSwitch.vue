<template>
  <div class="q-mt-lg">
    <div class="row items-center justify-between">
      <div class="row">
        <q-item-label caption class="q-my-sm text-bold text-grey-8"
          >{{ label }}:
        </q-item-label>
        <q-icon name="info_outline" color="accent" class="q-mb-md q-ml-xs">
          <q-tooltip>{{ tooltip }}</q-tooltip>
        </q-icon>
      </div>

      <q-toggle
        class="q-mr-lg"
        v-model="toggleValue"
        color="accent"
        keep-color
        @click="handleToggle"
        checked-icon="check"
        unchecked-icon="close"
      >
      </q-toggle>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps(["label", "tooltip"]);
const emit = defineEmits(["toggle-event"]);

const toggleValue = ref(false);

const handleToggle = () => {
  emit("toggle-event", toggleValue.value);
};
</script>
