<template>
  <div>
    <q-slide-transition>
      <q-list dense bordered class="q-pa-md rounded-borders bg-grey-2">
        <q-item-label caption class="text-black text-bold">
          {{ $t("selectedMetaDataTitle") }}
        </q-item-label>
        <div v-for="(value, key) in displayedData" :key="key" class="q-mr-md">
          <!-- If the key is 'yearRange', display the min and max values -->
          <div v-if="key === 'yearRange'">
            <b>{{ customKey(key) }}:</b> {{ value.min }} - {{ value.max }}
          </div>
          <div v-else-if="key === 'speakers' && value.length > 0">
            <b>{{ customKey(key) }}:</b>
            {{ value.map((speaker) => speaker.name).join(", ") }}
          </div>
          <div v-else-if="key === 'gender' && value.length > 0">
            <b>{{ customKey(key) }}:</b>
            {{
              value
                .map((gender_id) => store.options.gender[gender_id].displayStr)
                .join(", ")
            }}
          </div>
          <div v-else-if="key === 'chamber' && value.length > 0">
            <b>{{ customKey(key) }}:</b>
            {{
              value
                .map(
                  (chamber_id) => store.options.chamber[chamber_id].displayStr,
                )
                .join(", ")
            }}
          </div>
          <div v-else-if="key === 'party' && value.length > 0">
            <b>{{ customKey(key) }}:</b> {{ value.join(", ") }}
          </div>
          <div
            v-else-if="
              (key === 'gender' ||
                key === 'speakers' ||
                key === 'party' ||
                key === 'chamber') &&
              value.length == 0
            "
          >
            <b>{{ customKey(key) }}:</b> Alla
          </div>
        </div>
        <div class="text-caption q-mt-sm">
          {{ $t("dataVersion") }}
          <a
            :href="$t('links.swerik_version')"
            target="_blank"
            class="link-deco text-accent text-bold"
          >
            {{ $t("dataVersionLinkText") }} </a
          >&nbsp;,
          <a
            :href="$t('links.swerik_persons')"
            target="_blank"
            class="link-deco text-accent text-bold"
          >
            {{ $t("personVersionText") }}
          </a>
        </div>
      </q-list>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { metaDataStore } from "src/stores/metaDataStore.js";
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

const store = metaDataStore();
const displayedData = ref({});

const customKey = (key) => {
  const keyMap = {
    office: "office",
    subOffice: "subOffice",
    party: "party",
    gender: "gender",
    yearRange: "year",
    speakers: "speakers",
    chamber: "chamber",
  };
  return t(keyMap[key] || key);
};

const props = defineProps({
  filterSelections: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  let selectedData;
  switch (props.filterSelections) {
    case "WordTrends":
      selectedData = { ...store.filterAtSearchWT };
      break;
    case "Speeches":
      selectedData = { ...store.filterAtSearchSpeeches };
      break;
    case "Ngrams":
      selectedData = { ...store.filterAtSearchNgrams };
      break;
    case "KWIC":
      selectedData = { ...store.filterAtSearchKWIC };
      break;
    default:
      selectedData = {};
  }

  if (selectedData !== undefined && Object.keys(selectedData).length > 0) {
    displayedData.value = { ...selectedData };
  }
});

watch(
  () => {
    switch (props.filterSelections) {
      case "WordTrends":
        return store.filterAtSearchWT;
      case "Speeches":
        return store.filterAtSearchSpeeches;
      case "Ngrams":
        return store.filterAtSearchNgrams;
      case "KWIC":
        return store.filterAtSearchKWIC;
      default:
        selectedData = {};
    }
  },
  (newValue) => {
    displayedData.value = newValue;
  },
);
</script>
