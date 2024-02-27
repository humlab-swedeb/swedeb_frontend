<template>
  <q-layout view="lHh Lpr lff">
    <q-header class="row no-wrap">
      <q-toolbar class="bg-secondary text-grey-8">
        <q-toolbar-title class="text-bold">{{ $t("swedeb") }}</q-toolbar-title>
        <q-tabs no-caps color="black" class="gt-sm">
          <q-route-tab to="/" :label="$t('home')" />
          <q-route-tab to="/tools/wordtrends" :label="$t('tools')" />
          <q-route-tab to="/about" :label="$t('about')" />
          <q-route-tab to="/faq" :label="$t('faq')" />
        </q-tabs>
      </q-toolbar>
    </q-header>
    <q-page-container class="q-px-xl justify-center row">
      <router-view />
    </q-page-container>
    <q-footer class="bg-secondary text-black">
      <div class="custom-footer"></div>
      <q-toolbar class="row justify-center q-px-xl q-py-md">
        <q-card class="col-5 text-center q-mr-lg transparentColor" flat>
          <q-card-section>
            <q-item-label class="text-subtitle1">{{
              $t("swedeb")
            }}</q-item-label>
            <q-item-label caption class="text-accent">{{
              $t("contact")
            }}</q-item-label>
            <q-item-label class="q-px-xl q-pt-md text-left" style="font-size: 12px">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consequatur officiis molestiae quam odio, quasi voluptatum dolorum
              inventore cumque dolore nobis laboriosam sunt in debitis vitae
              nemo quos quo iusto deserunt.
            </q-item-label>
            <q-btn
              no-caps
              color="accent"
              label="swedeb@swedeb.com"
              class="q-my-md q-px-lg"

              icon="alternate_email"
              href="mailto:example@example.com"
            />
          </q-card-section>
        </q-card>
        <q-card flat class="bg-transparent col-2">
          <q-card-section class="q-pb-xs">
            <router-link to="/about" class="text-deco">{{
              $t("about")
            }}</router-link>
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <router-link to="/faq" class="text-deco">{{
              $t("faq")
            }}</router-link>
          </q-card-section>
        </q-card>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup></script>

<style lang="scss" scoped>
.transparentColor {
  background-color: rgba($secondary, 0.4); /* Adjust transparency */
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

.text-deco {
  text-decoration: none;
  color: black;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 2px;
    background-color: $accent;
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
}
</style>
