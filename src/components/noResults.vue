<template>
  <div class="text-center q-gutter-md q-mt-sm">
    <q-icon
      name="sentiment_dissatisfied"
      size="xl"
      color="accent"
      class="q-ma-none"
    />
    <q-item-label class="text-black text-bold">
      {{ $t("accessibility.noResults") }}
    </q-item-label>
    <q-item-label>
      {{ $t("accessibility.noResultsTip") }}
    </q-item-label>
  </div>
</template>

<script setup>
// Add your script logic here
</script>
