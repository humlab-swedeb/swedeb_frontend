<template>
  <div class="text-center q-pa-xl q-mt-xl">
    <div>
      <q-icon
        name="sentiment_dissatisfied"
        size="xl"
        color="accent"
        class="q-ma-none"
      />
      <q-item-label class="text-h4 text-grey-8 q-mt-md">
        {{ $t("accessibility.errorMessage404") }}
      </q-item-label>
      <q-btn
        class="q-mt-xl q-px-lg"
        color="accent"
        text-color="white"
        unelevated
        to="/"
        :label="$t('accessibility.errorMessageButton')"
        no-caps
      />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
