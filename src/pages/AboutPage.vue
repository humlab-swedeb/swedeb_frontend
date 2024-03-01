<template>
  <q-page class="max-width background q-pa-lg q-px-xl">
    <q-card flat class="text-center background">
      <q-item-label class="text-h3">{{ $t("aboutPageTitle") }}</q-item-label>
      <q-card-section class="text-align text-left text-body2 q-mt-sm">
        {{ $t("indexPageIntroText") }}
      </q-card-section>
      <q-card-section class="row justify-center">
        <q-card flat bordered class="q-my-md column justify-center size bg-primary">
          <q-item-label class="text-accent text-bold">Finansiär</q-item-label>
          <p class="q-mb-none">Umeå Universitet, 2 år osv osv osv, logo?</p>
        </q-card>
      </q-card-section>

      <q-card-section class="row justify-center q-mb-lg content-align">
        <q-card-section class="full-width">
          <q-item-label class="text-h5 text-center q-pb-lg">Team</q-item-label>
          <div class="grid-container text-left">
            <peopleCard
              v-for="(person, index) in peopleDev"
              :key="index"
              :name="person.name"
              :title="person.title"
              :description="person.description"
            />
          </div>
        </q-card-section>
        <q-card-section class="full-width">
          <q-item-label class="text-h5 text-center q-pb-lg"
            >Referensgrupp</q-item-label
          >
          <div class="grid-container text-left">
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
  </q-page>
</template>

<script setup>
import peopleCard from "src/components/peopleCard.vue";
import i18n from "src/i18n/sv";

const peopleDev = i18n.peopleDevelopment;
const peopleRef = i18n.peopleReference;
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
}

.size {
  width: 500px;
  height: 100px;
}

.content-align {
  padding: 0 300px;
}
</style>
