<template>
  <!--     <q-item-label class="text-bold">{{ $t(`${props.type}`) + ":" }}</q-item-label>
 -->
  <q-select
    dense
    multiple
    clearable
    v-model="store.selected[props.type]"
    :options="options"
    :label="$t(`${props.type}`)"
    label-color="black"
    use-chips
    filled
    bg-color="white"
    color="primary"
    class="q-my-lg shadow"
    :popup-content-style="{
      borderRadius: '0px 0px 7px 7px',
    }"
    option-label="speaker_name"
  >
    <template v-slot:selected-item="select">
      <q-chip
        v-if="store.selected[props.type]"
        square
        removable
        :style="getChipStyle(select.opt)"
        @remove="select.removeAtIndex(select.index)"
      >
        <q-item-label v-if="props.type === 'speakers'">
          {{ select.opt.speaker_name }}
        </q-item-label>
        <q-item-label v-else>{{ select.opt }}</q-item-label>
      </q-chip>
    </template>
  </q-select>
</template>

<script setup>
import { dataStore } from "src/stores/dataStore.js";
import { defineProps, ref, watchEffect } from "vue";
const store = dataStore();
const props = defineProps(["type"]);

const options = ref([]);

const getChipStyle = (opt) => {
  if (props.type === "party") {
    return {
      backgroundColor: "white",
      color: store.getPartyColor(opt),
      fontWeight: "bold",
      border: `2px solid ${store.getPartyColor(opt)}`,
    };
  } else {
    return {}; // Returnera tom objekt för andra typer
  }
};

watchEffect(async () => {
  try {
    if (props.type === "party") {
      await store.getPartyOptions();
      options.value = store.options.party || [];
    } else if (props.type === "subOffice") {
      await store.getSubOfficeOptions();
      options.value = store.options.subOffice || [];
    } else if (props.type === "speakers") {
      if (store.selected.party.length > 0) {
        await store.getSpeakersOptions();
        options.value = store.options.speakers || [];
      } else {
        await store.getSpeakersOptions();
        options.value = store.options.speakers || [];
      }
    }
  } catch (error) {
    console.error("Error updating options:", error);
  }
});
</script>

<style scoped>
.shadow {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.11);
}
</style>
