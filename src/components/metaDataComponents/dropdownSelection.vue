<template>
  <!--     <q-item-label class="text-bold">{{ $t(`${props.type}`) + ":" }}</q-item-label>
 -->
  <q-select
    dense
    multiple
    clearable
    v-model="store.selected[props.type]"
    :options="filterOptions"
    :label="
      store.selected[props.type].length > 0
      ? ''
      : 'Alla ' + (props.type === 'party' ? 'Partier' : $t(`${props.type}`))
    "

    :placeholder="
      store.selected[props.type].length === 0
        ? 'Välj specifika ' + (props.type === 'party' ? 'Partier' : $t(`${props.type}`))
        : ''
    "
    label-color="black"
    use-chips
    filled
    bg-color="white"
    color="accent"
    class="q-my-lg shadow"
    :popup-content-style="{
      borderRadius: '0px 0px 7px 7px',
      height: '300px',
    }"
    :option-label="customOptionLabel"
    @filter="filterHandler"
    use-input
    @clear="handleClear"
  >
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps" dense>
        <q-item-section>
          <q-item-label v-if="props.type === 'speakers'">
            {{ customOptionLabel(opt) }}
          </q-item-label>

          <q-item-label v-else>{{ opt }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-checkbox
            color="accent"
            :model-value="selected"
            @update:model-value="toggleOption(opt)"
          />
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:selected-item="select">
      <q-chip
        v-if="store.selected[props.type]"
        square
        removable
        :style="getChipStyle(select.opt)"
        @remove="select.removeAtIndex(select.index)"
        class="chip-size q-pr-md"
      >
        <q-item-label class="chip-wrap" v-if="props.type === 'speakers'">
          {{ customOptionLabel(select.opt) }}
        </q-item-label>

        <q-item-label class="chip-wrap" v-else>{{ select.opt }}</q-item-label>
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
      color: store.getPartyNameColor(opt),
      fontWeight: "bold",
      border: `2px solid ${store.getPartyNameColor(opt)}`,
    };
  } else if (props.type === "speakers") {
    const nonValidSpeaker = !store.options.speakers.some(
      (speaker) => speaker.person_id === opt.person_id
    );

    if (nonValidSpeaker) {
      return {
        color: "#808080",
        textDecoration: "line-through",
      };
    } else {
      return {
        border: `1px solid ${store.getPartyAbbrevColor(opt.party_abbrev)}`,
        backgroundColor: `${store.getPartyAbbrevColor(opt.party_abbrev)}20`,
      };
    }
  } else {
    return {};
  }
};
watchEffect(async () => {
  try {
    if (props.type === "party") {
      options.value = Object.keys(store.options.party) || [];
    } else if (props.type === "subOffice") {
      options.value = store.options.subOffice || [];
    } else if (props.type === "speakers") {
      // speaker list always updated (also on clear)
      await store.getSpeakersOptions();
      options.value = store.options.speakers || [];
    }
  } catch (error) {
    console.error("Error updating options:", error);
  }
});

const filterHandler = (searchTerm, updateOptions) => {
  const lowercasedInput = searchTerm.toLowerCase();
  if (props.type === "speakers") {
    filterOptions.value = options.value.filter((opt) =>
      customOptionLabel(opt).toLowerCase().includes(lowercasedInput)
    );
  } else if (props.type === "party") {
    filterOptions.value = options.value.filter((opt) =>
      opt.toLowerCase().includes(lowercasedInput)
    );
  } else {
    // For other types, set filterOptions to be the same as options.value
    filterOptions.value = options.value;
  }
  updateOptions(filterOptions.value);
};

const customOptionLabel = (opt) => {
  if (props.type === "speakers") {
    // Check if both birth year and death year are defined
    const birthYear = opt.year_of_birth ? opt.year_of_birth : " ";
    const deathYear = opt.year_of_death ? opt.year_of_death : " ";

    let party = opt.party_abbrev ? opt.party_abbrev : "";
    party = getPartyLabel(opt.party_abbrev);

    if (opt.name.includes("&quot")) {
      opt.name = opt.name.replace(/&quot/g, '"');
    }

    return `${opt.name}, ${party}  (${birthYear}-${deathYear})`;
  } else {
    return opt; // Return to default display for other types
  }
};

const getPartyLabel = (party) => {
  if (party && party !== "None" && party !== "?") {
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
.chip-size {
  min-height: max-content;
}
.chip-wrap {
  white-space: normal;
}
</style>
