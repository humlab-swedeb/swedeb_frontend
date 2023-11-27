<template>
  <!-- create at quasar card that contains a q-select-->
  <q-card flat class="fit q-mt-md">
    <q-card-section>
      <q-select
        multiple
        clearable
        v-model="store.partySelected"
        :options="store.partyOptions"
        label="Party"
      >
      <template v-slot:selected-item="selected">
          <q-chip
            v-if="store.partySelected"
            removable
            square
          >
            {{ selected.opt }}
          </q-chip>
        </template>
      </q-select>
    </q-card-section>
  </q-card>
</template>

<script>
import { useMyStore } from "stores/example-store.js";
const store = useMyStore();

export default {
  // name: 'ComponentName',
  setup() {
    store.getpartyOptions();
    return {
      store,
    };
  },
};
</script>
