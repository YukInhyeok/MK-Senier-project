<template>
  <div class="store-gallery">
    <h2 style="padding: 25px;">중앙시장 상점목록</h2>
    <div class="store-grid">
      <div v-for="(store, index) in stores" :key="index" class="store-item" style="margin-left: 5px; margin-right: 5px; margin-bottom: 5px;">
        <div class="img_area">
        <img :src="store.image" alt="Store Image" class="store-image" />
      </div>
        <div class="store-details">
          <p class="store-number">{{ store.Stnum }}번 상점</p>
          <p class="store-name">{{ store.storename }}</p>
          <div class="btnGroup">
            <div style=" padding: 5px;">
          <span class="store-click" @click="openMapModal(store.location, store.storename)">상점위치</span>               
          </div>
          <div style="padding: 5px;">
          <span class="store-click" @click="goTosubmitReview(store.Stnum)">상점리뷰</span>
        </div>
        </div>
        </div>
      </div>
    </div>

    <!-- Modal for displaying the map -->
    <div class="modal" :class="{ 'modal-open': isMapModalOpen }">
      <div class="modal-content">
        <span class="close" @click="closeMapModal">&times;</span>
        <div id="map" class="map-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
  name: 'StoreInfo',
  props: {
    averageRating: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      stores: [],
      isMapModalOpen: false, // Track the state of the map modal      
      mapInitialized: false,
      map: null,
      markers: [] // Initialize markers array
         
    };
  },
  updated() {
    if (this.isMapModalOpen && !this.mapInitialized) {
      this.initializeKakaoMap();
      this.mapInitialized = true;
    }
  },
  mounted() {
    this.loadKakaoMapAPI();
    this.markers = []; // Initialize markers array
    console.log('averageRating prop:', this.averageRating);
  },
  methods: {
    goTosubmitReview(storeId) {
      const path = `/submitReview/${storeId}`;
      this.$router.push(path);
    },
    updateAverageRating() {
      const averageRating = this.$refs.submitReviewRef.averageRatingRef;
      // 수신한 averageRating 값을 활용하여 원하는 로직을 수행하세요.
      console.log('Received average rating:', averageRating.value);
      // ...
    },
    // Fetch store data from Firestore
    async fetchStores() {
      try {
        const db = getFirestore();
        const storesCollection = collection(db, 'stores');
        const querySnapshot = await getDocs(storesCollection);

        this.stores = querySnapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.Stnum - b.Stnum);

      } catch (error) {
        console.error('Failed to fetch stores:', error);
      }
    },

    // Load the Kakao Maps API script
    loadKakaoMapAPI() {
      const script = document.createElement('script');
      script.onload = () => {
        window.kakao.maps.load(() => {
          this.$nextTick(() => {
            this.initializeKakaoMap();
            this.fetchStores();
          });
        });
      };
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=46a783bba3ff193bea6e663af44c3b84";
      document.head.appendChild(script);
    },

    // Initialize the Kakao Map
    initializeKakaoMap() {
      const mapContainer = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(36.3296, 127.4332),
        level: 3
      };

      if (window.kakao && window.kakao.maps && typeof window.kakao.maps.LatLng === 'function') {
        // `LatLng` 생성자가 이미 로드되어 있음
        this.map = new window.kakao.maps.Map(mapContainer, options);
      } else {
        // `LatLng` 생성자가 로드되기 전일 때는 지도를 초기화하지 않음
        // `initializeKakaoMap` 메소드가 다시 호출될 때 지도를 초기화함
        console.warn('Kakao Maps API has not been fully loaded yet.');
      }
    },    
    openMapModal(location, storeName) {      
      this.isMapModalOpen = true;

      let latitude, longitude;

      if (typeof location === 'string') {
        const coordinates = location.split(',');
        if (coordinates.length !== 2) {
          console.error('Invalid coordinates:', coordinates);
          return;
        }

        latitude = parseFloat(coordinates[0].trim());
        longitude = parseFloat(coordinates[1].trim());

        if (isNaN(latitude) || isNaN(longitude)) {
          console.error('Invalid coordinates:', coordinates);
          return;
        }
      } else if (typeof location === 'object' && location.lat && location.lng) {
        latitude = location.lat;
        longitude = location.lng;
      } else {
        console.error('Invalid location:', location);
        return;
      }

      // Remove existing markers from the map
      this.clearMarkers();

      // Create a new marker and add it to the map
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(latitude, longitude),
        map: this.map
      });

      // 마커 누르면 상점 이름 나오는 기능
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">${storeName}</div>`
      });

      // Add a click listener to the marker
      window.kakao.maps.event.addListener(marker, 'click', () => {
        // 정보창이 이미 열려있는지 확인
        if (infoWindow.getMap()) {
          // 정보창이 열려 있는 경우 정보창을 닫습니다
          infoWindow.close();
        } else {
          // 정보창이 닫혀 있는 경우 정보창을 해당 마커의 위치에 엽니다.
          infoWindow.open(this.map, marker);
        }
      });
      // 여기까지임========================================================
      
      // Set the marker as the center of the map
      this.map.setCenter(new window.kakao.maps.LatLng(latitude, longitude));

      // Pan to the marker's position
      this.map.panTo(marker.getPosition());

      // Add the marker to the markers array
      this.markers.push(marker);
    },

    // Clear all markers from the map
    clearMarkers() {
      if (this.markers && this.markers.length > 0) {
        for (let i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(null);
        }      
        this.markers = [];
      }      
    },
    // Close the map modal
    closeMapModal() {
      this.isMapModalOpen = false;
    },
  }
};
</script>

<style>
.store-gallery {
  width: 100%;
  padding: 20px;

}

.store-grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
}

.store-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.store-details {
  text-align: center;
  margin-top: 10px;

}
.store-name{
  font-size: 15px;
  padding-bottom: 12px;
}
.store-number {
  font-weight: bold;
  font-size: 14px;
}

.store-image {
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    max-width: 150px;
    max-height: 150px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
}
.store-click {
  cursor: pointer;
  border: 1px #888 solid;
  padding: 10px;
  border-radius: 10px;
  font-size: 10px;
}

.store-click:hover{
  background-color: rgb(30, 97, 252);
  color: #fff;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  background-color: #fefefe;
  display: flex;
  flex-direction: column;
  height: 800px;
  /* 모달 창의 높이 조정 */
}

.map-container {
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
}


.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.modal-open {
  display: block;
}
.btnGroup{
  display: flex;
}
.img_area{
  width: 100%;
  text-align: center;
  height: 100%;
  border: 1px solid #b8b8b8;
  border-radius:12px
}
</style>