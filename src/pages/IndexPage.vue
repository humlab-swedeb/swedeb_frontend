<template>
  <q-page class="flex flex-center">
    <ApiTest />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import ApiTest from '../components/ApiTest.vue'

export default defineComponent({
  name: 'IndexPage',

  components: {
    ApiTest
  }
})
</script>
