<template>
  <br>
  <div id="map">
  </div>
  <div style="width: 100%; height: 100%; text-align: center; padding:20px">
    <h3>선택한 상품의 상점 위치</h3>
    <br/>
    <span style="color:blue">파란 핀</span>을 클릭하면 상점과 상품정보를 확인할 수 있습니다.
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
  name: 'SearchMap',
  data() {
    return {
      map: null,
      markers: [],
      selectedProducts: [],
      stores: [],
      infoWindows: [],
    };
  },
  async mounted() {
    this.selectedProducts = JSON.parse(this.$route.query.selectedProducts);
    console.log("받은 정보 : ", this.selectedProducts)

    const script = document.createElement('script');
    script.async = true;
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=46a783bba3ff193bea6e663af44c3b84";

    document.head.appendChild(script);

    const loadKakaoMapAPI = new Promise((resolve) => {
      script.onload = () => {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: new window.kakao.maps.LatLng(36.3296, 127.4332),
            level: 3
          };
          this.map = new window.kakao.maps.Map(container, options);
          resolve();
        });
      };
    });

    Promise.all([loadKakaoMapAPI, this.fetchStores()])
      .then(() => {
        if (this.selectedProducts && this.selectedProducts.length > 0) {
          for (let product of this.selectedProducts) {
            let store = this.stores.find(store => store.Stnum === product.stnum);
            if (store) {
              let locationData = store.location;
              let latLng = new window.kakao.maps.LatLng(locationData.lat, locationData.lng);
              let marker = new window.kakao.maps.Marker({ position: latLng });

              
              window.kakao.maps.event.addListener(marker, 'click', () => {
                // 기존에 열려있는 InfoWindow 모두 닫기
                for (const infoWindow of this.infoWindows) {
                  infoWindow.close();
                }

                const content = `
                <div>
                  <h3>${product.name}</h3>
                  <p>가격: ${product.price}원</p>
                  <p>상점 이름: ${store.storename}</p>
                </div>
              `;

                const infowindow = new window.kakao.maps.InfoWindow({
                  content,
                  removable: true,
                });

                infowindow.open(this.map, marker);

                // 열린 InfoWindow 인스턴스를 배열에 추가
                this.infoWindows = [infowindow];
              });

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
  width: 90%;
  height: 600px;
margin-left: auto;
margin-right: auto;
  /* or any other size you want */
}
</style>