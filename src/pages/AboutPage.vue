<template>
  <q-card flat class="row justify-center max-width q-pa-lg q-px-xl">
    <q-item-label class="text-h3">{{ $t("aboutPageTitle") }}</q-item-label>
    <q-card-section class="text-align text-body2">
      {{ $t("indexPageIntroText") }}
    </q-card-section>

    <q-card-section>
      <q-card-section>
        <q-item-label class="text-h5 text-center q-pb-lg">Team</q-item-label>
        <div class="grid-container">
          <peopleCard
            v-for="(person, index) in peopleDev"
            :key="index"
            :name="person.name"
            :title="person.title"
            :description="person.description"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <q-item-label class="text-h5 text-center q-pb-lg"
          >Referensgrupp</q-item-label
        >
        <div class="grid-container">
          <peopleCard
            v-for="(person, index) in peopleRef"
            :key="index"
            :name="person.name"
            :title="person.title"
          />
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup>
import peopleCard from "src/components/peopleCard.vue";
import i18n from "src/i18n/sv";

const peopleDev = i18n.peopleDevelopment;
const peopleRef = i18n.peopleReference;
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
}
.text-align {
  padding: 0 200px;
}
</style>
