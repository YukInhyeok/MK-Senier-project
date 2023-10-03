<template>
   <div style="width: 100%; text-align: center; padding:20px" >
      나의 근처 상점들 
    </div>
    <div id="map">
    </div>
   
  </template>
  
  <script>
  
  export default {
    name : "marketMap",
    data() {
      return {
        latitude: null,
        longitude: null
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
    height: 90%;
    margin: 0 auto;
    border: 1px #000 solid ;
  }
  
  .button-group {
    margin: 10px 0px;
  }
  
  button {
    margin: 0 3px;
  }
  </style>