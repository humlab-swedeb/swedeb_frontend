<template>
  <!--     <q-item-label class="text-bold">{{ $t(`${props.type}`) + ":" }}</q-item-label>
 -->
  <q-select
    dense
    multiple
    clearable
    v-model="store.selected[props.type]"
    :options="filterOptions"
    :label="$t(`${props.type}`)"
    label-color="black"
    use-chips
    filled
    bg-color="white"
    color="accent"
    class="q-my-lg shadow"
    :popup-content-style="{
      borderRadius: '0px 0px 7px 7px',
    }"
    :option-label="customOptionLabel"
    @filter="filterHandler"
    :use-input="props.type === 'speakers'"
    @clear="handleClear"
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
          {{ select.opt.speaker_name }},
          {{ getPartyLabel(select.opt.speaker_party[0]) }}
          <!--       <span
            :style="{
              backgroundColor: store.getPartyColor(select.opt.speaker_party[0]),
              color: 'white',
              padding: '0.2rem 0.5rem',
              borderRadius: '0.2rem',
            }"
          >
            {{ select.opt.speaker_party[0] }} </span
          > -->({{
            select.opt.speaker_birth_year
              ? select.opt.speaker_birth_year.year
              : ""
          }}-{{
            select.opt.speaker_death_year
              ? select.opt.speaker_death_year.year
              : " "
          }})
        </q-item-label>
        <q-item-label v-else>{{ select.opt }}</q-item-label>
      </q-chip>
    </template>
  </q-select>
</template>

<script setup>
import { metaDataStore } from "src/stores/metaDataStore.js";
import { defineProps, ref, watchEffect } from "vue";
const store = metaDataStore();
const props = defineProps(["type"]);

const options = ref([]);
const filterOptions = ref([]);

const getChipStyle = (opt) => {
  if (props.type === "party") {
    return {
      backgroundColor: "white",
      color: store.getPartyColor(opt),
      fontWeight: "bold",
      border: `2px solid ${store.getPartyColor(opt)}`,
    };
  } /* else if (props.type === "speakers") {
    return {
      backgroundColor: "white",
      color: store.getPartyColor(opt.speaker_party[0]),
      fontWeight: "bold",
      border: `2px solid ${store.getPartyColor(opt.speaker_party[0])}`,
    };
  } */ else {
    return {};
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

const filterHandler = (searchTerm, updateOptions) => {
  if (props.type === "speakers") {
    const lowercasedInput = searchTerm.toLowerCase();
    filterOptions.value = options.value.filter((opt) =>
      customOptionLabel(opt).toLowerCase().includes(lowercasedInput)
    );
    updateOptions(filterOptions.value);
  } else {
    // For other types, set filterOptions to be the same as options.value
    filterOptions.value = options.value;
    updateOptions(filterOptions.value);
  }
};

const customOptionLabel = (opt) => {
  if (props.type === "speakers") {
    // Check if both birth year and death year are defined
    const birthYear = opt.speaker_birth_year
      ? opt.speaker_birth_year.year
      : " ";
    const deathYear = opt.speaker_death_year
      ? opt.speaker_death_year.year
      : " ";

    let party = opt.speaker_party ? opt.speaker_party : "";
    party = getPartyLabel(opt.speaker_party);

    return `${opt.speaker_name}, ${party}  (${birthYear}-${deathYear})`;
  } else {
    return opt; // Return to default display for other types
  }
};

const getPartyLabel = (party) => {
  if (party && party !== "None") {
    return party;
  } else {
    return "Okänt"; // Display "Okänt" for "None" or empty party
  }
};

const handleClear = () => {
  store.selected[props.type] = [];
};
</script>

<style scoped>
.shadow {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.11);
}
</style>
