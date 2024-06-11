<template>
  <q-layout view="hHh Lpr lff">
    <q-header class="row no-wrap">
      <q-toolbar
        class="bg-secondary text-grey-9"
        style="max-width: 400px; min-width: 400px"
      >
        <q-toolbar-title class="text-bold">{{ $t("swedeb") }}</q-toolbar-title>
        <q-tabs no-caps color="black" class="gt-sm">
          <q-route-tab to="/" :label="$t('home')" />
          <q-route-tab to="/about" :label="$t('about')" />
          <q-route-tab to="/faq" :label="$t('faq')" />
        </q-tabs>

        <q-btn flat round icon="menu" class="lt-md">
          <q-menu>
            <q-list>
              <q-item to="/" clickable>
                <q-item-section>Hem</q-item-section>
              </q-item>
              <q-item to="/about" clickable>
                <q-item-section>Om SweDeb</q-item-section>
              </q-item>
              <q-item to="/faq" clickable>
                <q-item-section>FAQ</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
      <q-toolbar class="background">
        <q-tabs no-caps active-color="accent" class="text-bold text-black">
          <q-route-tab to="/tools/wordtrends" label="Ordtrender" />
          <q-route-tab to="/tools/kwic" label="KWIC" />
          <q-route-tab to="/tools/speeches" label="Anföranden" />
          <q-route-tab to="/tools/ngram" label="N-Grams" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="!drawer || miniState"
      @click.capture="drawerClick"
      :width="400"
      :breakpoint="400"
      bordered
      class="bg-grey-3"
    >
      <!-- If small -->
      <template v-slot:mini>
        <div class="cursor-pointer fit">
          <q-item>
            <q-btn
              aria-label="Fäll ut filtersektionen"
              dense
              round
              unelevated
              color="accent"
              icon="chevron_right"
              @click="miniState = false"
            />
          </q-item>

          <q-item>
            <q-btn flat no-caps>
              <p class="metadata-filter-text text-grey-8">
                {{ $t("metaDataFilterMini") }}
              </p>
              <q-icon name="o_filter_alt" color="accent" />
            </q-btn>
          </q-item>
          <q-item>
            <q-btn flat no-caps>
              <p class="metadata-filter-text text-grey-8">
                {{ $t("toolsFilterMini") }}
              </p>
              <q-icon name="construction" color="accent" />
            </q-btn>
          </q-item>
        </div>
      </template>

      <!-- If exdended -->
      <q-scroll-area
        class="fit q-pt-md"
        :horizontal-thumb-style="{ opacity: 0 }"
      >
        <metaDataFilter />
      </q-scroll-area>

      <div
        class="q-mini-drawer-hide absolute"
        style="top: 5px; right: -20px; overflow: hidden"
      >
        <q-btn
          aria-label="Fäll in filtersektionen"
          dense
          round
          unelevated
          color="grey-5"
          icon="chevron_left"
          @click="miniState = true"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="q-px-lg q-py-md">
        <router-view />
      </q-page>
    </q-page-container>
    <q-footer>
      <q-toolbar class="q-py-md q-flex justify-center">
        <router-link to="/about" class="link-deco q-mr-md">{{
          $t("about")
        }}</router-link>
        <router-link to="/faq" class="link-deco q-mr-md">{{
          $t("faq")
        }}</router-link>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import metaDataFilter from "src/components/metaDataFilter.vue";
import { ref } from "vue";

const miniState = ref(false);

const drawer = ref(false);

const drawerClick = (e) => {
  // if in "mini" state and user
  // click on drawer, we switch it to "normal" mode
  if (miniState.value) {
    miniState.value = false;
    e.stopPropagation();
  }
};
</script>

<style scoped>
.metadata-filter-text {
  writing-mode: vertical-lr;
  rotate: 180deg;
  padding: 0 0 20px 0;
  font-weight: bold;
}
</style>
