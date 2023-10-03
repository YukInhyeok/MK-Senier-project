<template>
    <div class="kakaoMap">
      <MapView msg="Welcome to Your Vue.js App"/>
    </div>
</template>
  
  <script>
  // @ is an alias to /src
  import kakaoMap from '../components/kakaoMap.vue'
  
  export default {
    name: 'kakaoMapView',
    components: {
        kakaoMap
    }
  }
  </script>
  