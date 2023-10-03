<template>
    <div>
        <div id="map"></div>
    </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
    name: 'kioskMap',
    setup() {
        const latitude = ref(null);
        const longitude = ref(null);


        onMounted(() => {
            const script = document.createElement('script');
            script.async = true;
            script.src =
                '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=46a783bba3ff193bea6e663af44c3b84';
            document.head.appendChild(script);

            script.onload = () => {
                window.kakao.maps.load(() => {
                    const container = document.getElementById('map');
                    const options = {
                        center: new window.kakao.maps.LatLng(36.3296, 127.4332),
                        level: 1,
                    };
                    const map = new window.kakao.maps.Map(container, options);

                    // Firebase 초기화
                    const firebaseConfig = {
                        // Firebase 설정 정보 입력
                        apiKey: "AIzaSyAjh-tLB9jHUFxtvf1OlFTN4TU9p0u-VTQ",
                        authDomain: "tdmk-595a3.firebaseapp.com",
                        databaseURL: "https://tdmk-595a3-default-rtdb.asia-southeast1.firebasedatabase.app",
                        projectId: "tdmk-595a3",
                        storageBucket: "tdmk-595a3.appspot.com",
                        messagingSenderId: "849130639775",
                        appId: "1:849130639775:web:e4d64bda00fd4a4d89adaa",
                        measurementId: "G-QXH609W16C"
                    };
                    const firebaseApp = initializeApp(firebaseConfig);
                    const db = getFirestore(firebaseApp);

                    // InfoWindow 인스턴스를 저장하기 위한 배열
                    const infoWindows = [];

                    // Firestore 데이터 가져오기
                    const storeCollection = collection(db, 'stores');
                    getDocs(storeCollection)
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                const storeData = doc.data();
                                const latitude = storeData.location.lat;
                                const longitude = storeData.location.lng;
                                const storeName = storeData.storename;

                                const latLng = new window.kakao.maps.LatLng(latitude, longitude);
                                const marker = new window.kakao.maps.Marker({
                                    position: latLng,
                                });
                                marker.setMap(map);

                                window.kakao.maps.event.addListener(marker, 'click', () => {
                                    // 기존에 열려있는 InfoWindow 모두 닫기
                                    infoWindows.forEach((infoWindow) => {
                                        infoWindow.close();
                                    });
                                    const infowindow = new window.kakao.maps.InfoWindow({
                                        content: `<div : class="info-content">${storeName}</div>`,
                                    });
                                    infowindow.open(map, marker);

                                    // 열린 InfoWindow 인스턴스를 배열에 추가
                                    infoWindows.push(infowindow);
                                });

                            });
                        })
                        .catch((error) => {
                            console.log('Firestore 데이터를 가져오는 중 오류가 발생했습니다.', error);
                        });
                });
            };
        });

        return {
            latitude,
            longitude,
        };
    },
};
</script>
  
<style scoped>
#map {
    width: 85vw;
    height: 85vh;
    margin: 0 auto;
}

.button-group {
    margin: 10px 0px;
}

button {
    margin: 0 3px;
}

:global(.info-content) {
    text-align: center;
    font-weight: bold;
    white-space: pre-wrap;
    max-width: 200px;
    min-width: 200px;
}
</style>
  