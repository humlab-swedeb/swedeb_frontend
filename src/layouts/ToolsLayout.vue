<template>
  <q-layout view="hHh Lpr lff">
    <q-header class="row" :class="$q.screen.lt.sm ? '' : 'no-wrap'">
      <q-toolbar
        class="bg-secondary text-grey-9"
        :style="$q.screen.lt.sm ? '' : 'max-width: 400px; min-width: 400px'"
      >
        <q-toolbar-title class="text-bold q-pa-none">
          <router-link to="/" style="text-decoration: none; color: inherit">{{
            $t("swedeb")
          }}</router-link>
        </q-toolbar-title>
        <!--         <q-tabs no-caps color="black" class="gt-sm">
          <q-route-tab to="/" :label="$t('home')" />
          <q-route-tab to="/about" :label="$t('about')" />
          <q-route-tab to="/faq" :label="$t('faq')" />
        </q-tabs> -->

        <q-btn flat round icon="menu">
          <q-menu>
            <q-list>
              <q-item to="/" clickable>
                <q-item-section>{{ $t("home") }}</q-item-section>
              </q-item>
              <q-item to="/about" clickable>
                <q-item-section>{{ $t("about") }}</q-item-section>
              </q-item>
              <q-item to="/faq" clickable>
                <q-item-section>{{ $t("faq") }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
      <q-toolbar :class="$q.screen.lt.sm ? 'bg-primary' : 'background'">
        <div
          :style="
            $q.screen.lt.sm
              ? ''
              : $q.screen.lt.md
              ? 'max-width:30vw'
              : 'max-width: 95vw'
          "
        >
          <q-tabs
            no-caps
            inline-label
            outside-arrows
            mobile-arrows
            active-color="accent"
            class="text-bold text-black"
          >
            <q-route-tab
              to="/tools/wordtrends"
              :label="$t('wordTrendsTitle')"
            />
            <q-route-tab to="/tools/kwic" :label="$t('kwicTitle')" />
            <q-route-tab to="/tools/speeches" :label="$t('speechesTitle')" />
            <q-route-tab to="/tools/ngram" :label="$t('nGramsTitle')" />
          </q-tabs>
        </div>
      </q-toolbar>
      <q-toolbar class="lt-sm bg-white">
        <q-btn
          class="text-white full-width q-my-md q-py-sm"
          @click="metaStore.mobilePopup = true"
          :label="$t('filterAndSearch')"
          no-caps
          color="accent"
        />
        <q-dialog v-model="metaStore.mobilePopup" class="fit">
          <q-card class="fit full-width bg-grey-2">
            <q-card-section class="row items-center justify-between">
              <q-item-label class="text-body1 text-bold">
                {{ $t("filterAndSearch") }}
              </q-item-label>
              <q-btn
                flat
                icon="close"
                color="black"
                class="item-end"
                @click="metaStore.mobilePopup = false"
              />
            </q-card-section>
            <metaDataFilter />
          </q-card>
        </q-dialog>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$q.screen.gt.sm || $q.screen.sm"
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
              :aria-label="$t('accessibility.filtersectionOut')"
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
          :aria-label="$t('accessibility.filtersectionIn')"
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
      <q-page :class="$q.screen.lt.sm ? '' : 'q-px-lg q-py-md'">
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
import { metaDataStore } from "src/stores/metaDataStore";

const metaStore = metaDataStore();

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
.button-container {
  margin-top: 130px; /* Adjust as needed */
}
</style>
