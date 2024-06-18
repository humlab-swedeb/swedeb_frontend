<template>
  <q-page class="max-width background q-pa-lg q-px-xl">
    <q-card flat class="text-center background">
      <q-item-label class="text-h1">{{ $t("aboutPageTitle") }}</q-item-label>
      <q-card-section class="text-align text-left text-body2 q-mt-sm">
        {{ $t("indexPageIntroText") }}
      </q-card-section>
      <q-card-section class="row justify-center">
        <q-card
          flat
          class="q-my-md column justify-center size bg-secondary q-py-lg"
        >
          <div>
            <q-item-label class="text-accent text-h6"> Finansiär </q-item-label>
            <q-item-label :class="$q.screen.lt.sm ? 'q-px-lg' : 'q-py-sm'">
              {{ $t("aboutFinance") }}
            </q-item-label>
            <q-img
              src="../../public/images/umu-logo-SE.png"
              alt="Umeå Universitets logotyp."
              style="width: 200px"
              class="q-my-md"
            />
          </div>
        </q-card>
      </q-card-section>

      <q-card-section class="column content-center">
        <q-item-label class="text-h5 text-center q-pb-lg">
          {{ $t("aboutTeam") }}
        </q-item-label>
        <q-card-section class="row fit justify-center">
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
      </q-card-section>
      <q-card-section>
        <q-item-label class="text-h5 text-center q-pb-lg">
          {{ $t("aboutReference") }}
        </q-item-label>
        <q-card-section class="row fit justify-center">
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

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}

.size {
  width: 50vw;
}

.content-align {
  padding: 0 300px;
}
</style>
