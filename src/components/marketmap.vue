<template>
  <div>
    <div class="map-container">
      <div id="map"></div>
    </div>
    <div class="button-group">
      <button @click="registerCoordinates" v-if="latitude && longitude">내 위치 저장하기</button>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  // Your Firebase configuration goes here
  apiKey: "AIzaSyAjh-tLB9jHUFxtvf1OlFTN4TU9p0u-VTQ",
  authDomain: "tdmk-595a3.firebaseapp.com",
  databaseURL: "https://tdmk-595a3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tdmk-595a3",
  storageBucket: "tdmk-595a3.appspot.com",
  messagingSenderId: "849130639775",
  appId: "1:849130639775:web:e4d64bda00fd4a4d89adaa",
  measurementId: "G-QXH609W16C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default {
  name: "KakaoMap",
  emits: ['location-updated'],
  data() {
    return {
      latitude: null,
      longitude: null,
      isConfirmationVisible: false
    };
  },
  mounted() {
    const script = document.createElement('script');
      script.async = true;
      script.src =
          "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=46a783bba3ff193bea6e663af44c3b84";
      document.head.appendChild(script);  

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(36.3296, 127.4332),
          level: 1
        };
        const map = new window.kakao.maps.Map(container, options);

        // 현재 위치 표시
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const latLng = new window.kakao.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            const marker = new window.kakao.maps.Marker({
              position: latLng,
              clickable: false
            });
            marker.setMap(map);
            map.setCenter(latLng);

            // 좌표값 데이터바인딩
            this.latitude = latLng.getLat();
            this.longitude = latLng.getLng();
          }, () => {
            console.log("위치 정보를 가져올 수 없습니다.");
          });
        } else {
          console.log("위치 정보를 지원하지 않는 브라우저입니다.");
        }

        // 클릭 이벤트 리스너 등록
        window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
          const latLng = mouseEvent.latLng;
          const marker = new window.kakao.maps.Marker({
            position: latLng
          });
          marker.setMap(map);
          // 좌표값 데이터바인딩
          this.latitude = latLng.getLat();
          this.longitude = latLng.getLng();
        });
      });
    };
  },
  methods: {
    registerCoordinates() {
      const coordinatesCollection = collection(db, 'coordinates');
      const location = { lat: this.latitude, lng: this.longitude };
      addDoc(coordinatesCollection, location)
        .then(() => {
          console.log('위치 정보를 DB에 등록하였습니다');
          this.isConfirmationVisible = true;
          this.$emit('location-updated', location);
        })
        .catch((error) => {
          console.error('위치 정보 등록에 실패하였습니다', error);
        });
    }
  }
};
</script>

<style>
.map-container {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}

.button-group {
  text-align: center;
}

.button-group button {
  padding: 10px 20px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button-group button:hover {
  background-color: #0056b3;
}
</style>
