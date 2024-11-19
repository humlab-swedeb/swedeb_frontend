<template>
  <q-card flat class="background row justify-center max-width q-mt-lg">
    <q-item-label class="text-h1">{{ $t("aboutPageTitle") }}</q-item-label>
    <q-card-section
      class="text-body2 q-mt-sm"
      :class="$q.screen.lt.sm ? '' : 'text-align'"
    >
      {{ $t("indexPageIntroText") }}
      <a :href="$t('links.swerik')" class="link-deco text-accent text-bold">
        Swerik
      </a>
    </q-card-section>
    <q-card-section class="col-12 items-center column">
      <q-card
        flat
        bordered
        class="bg-secondary q-py-lg column items-center"
        :class="$q.screen.lt.sm ? 'q-px-md' : 'q-px-xl'"
        style="max-width: fit-content"
      >
        <q-item-label class="text-accent text-h6"> Finansiär </q-item-label>
        <q-item-label>
          {{ $t("aboutFinance") }}
          <a :href="$t('links.swerik')" class="link-deco text-accent text-bold">
            Huminfra.
          </a>
        </q-item-label>
        <div class="q-gutter-sm">
          <q-img
            v-for="(financier, index) in financiers"
            :key="index"
            :src="financier.src"
            :alt="financier.alt"
            :style="financier.style"
            class="q-my-md"
          />
        </div>
      </q-card>
    </q-card-section>

    <q-card-section
      class="q-pa-none"
      :class="$q.screen.lt.sm ? 'column' : 'row'"
    >
      <q-card-section :class="$q.screen.lt.sm ? 'column' : 'col'">
        <q-item-label class="text-h5 text-center q-pb-lg">
          {{ $t("aboutTeam") }}
        </q-item-label>
        <peopleCard
          v-for="(person, index) in peopleDev"
          :key="index"
          :name="person.name"
          :title="person.title"
          :description="person.description"
          :link="person.link"
        />
      </q-card-section>
      <q-card-section :class="$q.screen.lt.sm ? 'column' : 'col'">
        <q-item-label class="text-h5 text-center q-pb-lg">
          {{ $t("aboutReference") }}
        </q-item-label>
        <peopleCard
          v-for="(person, index) in peopleRef"
          :key="index"
          :name="person.name"
          :title="person.title"
        />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup>
import peopleCard from "src/components/peopleCard.vue";
import i18n from "src/i18n/sv";

const peopleDev = i18n.peopleDevelopment;
const peopleRef = i18n.peopleReference;
const financiers = i18n.financiers;
</script>

<style lang="scss" scoped>
/* .grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
} */

/* .size {
  width: 50vw;
}

.content-align {
  padding: 0 300px;
} */
</style>
