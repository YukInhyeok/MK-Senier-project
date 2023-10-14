<template>
  <br>
    <div id="map">
    </div>
    <div style="width: 100%; height: 100%; text-align: center; padding:20px" >
      현재 위치
    </div>
  </template>
  
  <script>
  import { getFirestore, collection, getDocs } from 'firebase/firestore';

  export default {
    name : "marketMap",
    data() {
      return {
        latitude: null,
        longitude: null,
        stores: []
      };
    },
    mounted() {
      const script = document.createElement('script');
      script.async = true;
      script.src =
          "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=46a783bba3ff193bea6e663af44c3b84";
      document.head.appendChild(script);
  
      script.onload = () => {
        window.kakao.maps.load(async () => {
          const container = document.getElementById('map');
          const options = {
            center: new window.kakao.maps.LatLng(36.3296, 127.4332),
            level: 1
          };
          const map = new window.kakao.maps.Map(container, options);

          
      // Firebase에서 매장을 가져옵니다.
      try {
        const db = getFirestore();
        const storesCollection = collection(db, 'stores');
        const querySnapshot = await getDocs(storesCollection);

        this.stores = querySnapshot.docs.map((doc) => doc.data());

        // 상점을 반복하고 각 상점에 대한 마커를 추가합니다.
        this.stores.forEach((store) => {
          let latitude, longitude;

          if (typeof store.location === 'string') {
            const coordinates = store.location.split(',');
            latitude = parseFloat(coordinates[0]);
            longitude = parseFloat(coordinates[1]);
          } else if (typeof store.location === 'object' && store.location.lat && store.location.lng) {
            latitude = store.location.lat;
            longitude = store.location.lng;
          }

          if (!isNaN(latitude) && !isNaN(longitude)) {
            // Create a new marker and add it to the map
            const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
            // Marker 생성
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              map: map,
              title: store.storename // 마커 위로 마우스를 가져가면 표시됩니다.
            });
            // Marker에 클릭 이벤트 리스너 등록
            window.kakao.maps.event.addListener(marker, 'click', () => {
              const infowindow = new window.kakao.maps.InfoWindow({
                content: ('상점 이름: ' + store.storename + '<br>설명: ' + (store.description || '')) 
                // 상점 이름과 설명을 표시합니다. 설명이 없으면 빈 문자열이 표시됩니다.
              });
              infowindow.open(map, marker);
            });
          }
          
        });
      } catch (error) {
         console.error('Failed to fetch stores:', error);
       }

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
  
            // 마커 클릭 이벤트 리스너 등록
            window.kakao.maps.event.addListener(marker, 'click', () => {
              const latLng = marker.getPosition();
              console.log(latLng.getLat(), latLng.getLng());
              const infowindow = new window.kakao.maps.InfoWindow({
                content: ('마커를 클릭했습니다!')
              });
              infowindow.open(map, marker);
            });
          });
        });
      };
    }
  };
  
  </script>
  
  <style scoped>
  #map {
    width: 90%;
    height: 80%;
    margin: 0 auto;
    border: 1px #c2c2c2 solid ;
  }
  
  .button-group {
    margin: 10px 0px;
  }
  
  button {
    margin: 0 3px;
  }
  </style>