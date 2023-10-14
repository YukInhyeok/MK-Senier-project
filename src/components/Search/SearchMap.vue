<template>
  <br>
    <div id="map">
    </div>
    <div style="width: 100%; height: 100%; text-align: center; padding:20px" >
      선택한 상품의 상점 위치
    </div>
</template>

<script>
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjh-tLB9jHUFxtvf1OlFTN4TU9p0u-VTQ",
  authDomain: "tdmk-595a3.firebaseapp.com",
  databaseURL: "https://tdmk-595a3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tdmk-595a3",
  storageBucket: "tdmk-595a3.appspot.com",
  messagingSenderId: "849130639775",
  appId: "1:849130639775:web:e4d64bda00fd4a4d89adaa",
  measurementId: "G-QXH609W16C"
};

if (!getApps().length) {
 initializeApp(firebaseConfig);
}
const db = getFirestore();

export default {
 name : 'SearchMap',
 data() {
   return {
     map:null,
     markers:[],
     selectedProducts:[],
     stores:[]
   };
 },
 async mounted() {
  this.selectedProducts = JSON.parse(this.$route.query.selectedProducts); 
  console.log("받은 정보 : ",this.selectedProducts)

  const script = document.createElement('script');
  script.async = true;
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=46a783bba3ff193bea6e663af44c3b84";
      document.head.appendChild(script);

  const loadKakaoMapAPI = new Promise((resolve) => {
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(36.3296,127.4332),
          level :3
        };
        this.map=new window.kakao.maps.Map(container,options);
        resolve();
      });
    };
  });

  // Wait for both the map API and the store data to be ready before creating markers
  Promise.all([loadKakaoMapAPI, this.fetchStores()])
    .then(() => { 
      if(this.selectedProducts && this.selectedProducts.length>0){
        for(let product of this.selectedProducts){
          let store=this.stores.find(store=>store.Stnum===product.stnum);
          if(store){
            let locationData=store.location;
            let latLng=new window.kakao.maps.LatLng(locationData.lat,locationData.lng);
            let marker=new window.kakao.maps.Marker({position :latLng});
            marker.setMap(this.map);
            this.markers.push(marker);
          }
        }
      }
     })
     .catch(error => { console.error('Failed to load map API or fetch stores:', error); });
},
 methods: {
  // Fetch store data from Firestore
  async fetchStores() {
    try {
      const storesCollection = collection(db, 'stores');
      const querySnapshot = await getDocs(storesCollection);

      this.stores = querySnapshot.docs.map((doc) => doc.data());

    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  },
}
};
</script>

<style>
#map {
  width: 100%;
  height: 500px; /* or any other size you want */
}
</style>
