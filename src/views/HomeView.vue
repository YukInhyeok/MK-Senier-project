<template>
  <div class="home">

    <Homemarket msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Homemarket from '@/components/HelloMarket.vue'

export default {
  name: 'HomeMarket',
  components: {
    Homemarket
  }
}
</script>
