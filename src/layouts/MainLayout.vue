<template>
  <q-layout view="lHh Lpr lff">
    <q-header class="row no-wrap">
      <q-toolbar class="bg-secondary text-grey-9">
        <q-toolbar-title class="text-bold">{{ $t("swedeb") }}</q-toolbar-title>
        <q-tabs no-caps color="black" class="gt-sm">
          <q-route-tab to="/" :label="$t('home')" />
          <q-route-tab to="/tools/wordtrends" :label="$t('tools')" />
          <q-route-tab to="/about" :label="$t('about')" />
          <q-route-tab to="/faq" :label="$t('faq')" />
        </q-tabs>
        <q-btn flat round icon="menu" class="lt-md">
          <q-menu>
            <q-list>
              <q-item to="/" clickable>
                <q-item-section>Hem</q-item-section>
              </q-item>
              <q-item to="/tools/wordtrends" clickable>
                <q-item-section>Verktyg</q-item-section>
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
    </q-header>
    <q-page-container class="q-px-xl justify-center row">
      <router-view />
    </q-page-container>
    <q-footer class="bg-secondary text-black">
      <div class="custom-footer"></div>
      <q-toolbar
        v-if="$q.screen.gt.sm"
        class="row justify-center q-px-xl q-py-md"
      >
        <q-card
          bordered
          class="col-5 text-center q-mr-lg transparentColor"
          flat
        >
          <q-card-section>
            <q-item-label class="text-subtitle1">{{
              $t("swedeb")
            }}</q-item-label>
            <q-item-label caption class="text-accent">{{
              $t("contact")
            }}</q-item-label>
            <q-item-label
              class="q-px-xl q-pt-md text-left"
              style="font-size: 12px"
            >
              {{ $t("indexPageIntroText") }}
            </q-item-label>
            <q-btn
              no-caps
              color="accent"
              label="Kontakta SweDeb-Teamet"
              class="q-my-md q-px-lg"
              icon="alternate_email"
            />
          </q-card-section>
        </q-card>
        <q-card flat class="bg-transparent col-2">
          <q-card-section class="q-pb-xs">
            <router-link to="/about" class="link-deco">{{
              $t("about")
            }}</router-link>
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <router-link to="/faq" class="link-deco">{{
              $t("faq")
            }}</router-link>
          </q-card-section>
        </q-card>
      </q-toolbar>

      <!-- IF small screen -->
      <q-toolbar v-else class="column justify-center q-px-md q-py-md">
        <q-card flat class="bg-transparent row">
          <q-card-section>
            <router-link to="/about" class="link-deco">{{
              $t("about")
            }}</router-link>
          </q-card-section>
          <q-card-section>
            <router-link to="/faq" class="link-deco">{{
              $t("faq")
            }}</router-link>
          </q-card-section>
        </q-card>
        <q-card bordered class="text-center transparentColorSM" flat>
          <q-card-section>
            <q-item-label class="text-subtitle1">{{
              $t("swedeb")
            }}</q-item-label>
            <q-item-label caption class="text-accent">{{
              $t("contact")
            }}</q-item-label>
            <q-item-label
              class="q-px-md q-pt-md text-left"
              style="font-size: 12px"
            >
              {{ $t("indexPageIntroText") }}
            </q-item-label>
            <q-btn
              no-caps
              color="accent"
              label="Kontakta SweDeb-Teamet"
              class="q-my-md q-px-lg"
            />
          </q-card-section>
        </q-card>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup></script>

<style lang="scss" scoped>
.transparentColor {
  background-color: rgba($secondary, 0.6);
}

.transparentColorSM {
  background-color: rgba($secondary, 0.8);
}
.custom-footer {
  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &:before {
    clip-path: polygon(
      0% 100%,
      20% 50%,
      40% 80%,
      60% 60%,
      80% 90%,
      100% 70%,
      100% 100%,
      0% 100%
    );
    background-color: $accentLight;
  }
  &:after {
    clip-path: polygon(
      0% 100%,
      10% 60%,
      30% 80%,
      50% 50%,
      70% 90%,
      90% 70%,
      100% 100%,
      0% 100%
    );
    background-color: lighten($accentLight, 20%);
  }
}
</style>
