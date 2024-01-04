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
  >
    <template v-slot:selected-item="select">
      <q-chip
        v-if="store.selected[props.type]"
        square
        removable
        color="grey-4"
        @remove="select.removeAtIndex(select.index)"
      >
        {{ select.opt }}
      </q-chip>
    </template>
  </q-select>
</template>

<script setup>
import { dataStore } from "src/stores/dataStore.js";
import { defineProps, ref, watchEffect, onMounted } from "vue";
const store = dataStore();
const props = defineProps(["type"]);

const options = ref([]);

watchEffect(async () => {
  try {
    if (props.type === "party") {
      await store.getPartyOptions();
      options.value = store.options.party || [];
    } else if (props.type === "subOffice") {
      /*       await store.getSubOfficeOptions();
       */ options.value = store.options.subOffice || [];
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

<!-- <q-select
    dense
    multiple
    clearable
    v-model="store.selected[props.type]"
    :options="store.options[props.type]"
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
    style="font-weight: bold"
  > -->
