<template>
  <q-card class="q-mx-sm">
    <q-card-section
      horizontal
      @click="showing = !showing"
      class="items-center cursor-pointer q-pr-sm"
    >
      <q-card-section class="text-subtitle1">
        <q-icon name="o_filter_alt" color="primary" size="sm" class="q-pr-sm" />
        {{ $t("metaDataFilter") }}</q-card-section
      >

      <q-space />
      <q-btn
        color="primary"
        round
        flat
        dense
        size="lg"
        :icon="showing ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
      />
    </q-card-section>

    <q-slide-transition v-show="showing">
      <q-card-section class="q-px-lg q-pt-none">
        <q-separator />
        <q-card-section class="q-px-none">
          <!-- PLACE METADATA FILTER COMPONENTS HERE -->
          <yearRange />
          <dropdownSelection type="party" />
          <q-card-section horizontal class="q-px-none">
            <q-card-section>
              <genderOfficeCheckbox type="gender" />
            </q-card-section>
            <q-card-section>
              <genderOfficeCheckbox type="office" />
            </q-card-section>
          </q-card-section>
          <dropdownSelection type="subOffice" />
          <dropdownSelection type="speakers" />
        </q-card-section>
      </q-card-section>
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import yearRange from "src/components/metaDataComponents/yearRange.vue";
import genderOfficeCheckbox from "src/components/metaDataComponents/genderOfficeCheckbox.vue";
import dropdownSelection from "./metaDataComponents/dropdownSelection.vue";
import { ref } from "vue";
const showing = ref(true);
</script>
