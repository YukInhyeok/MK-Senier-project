<template>
  <div style="width: 100%; text-align: center; padding:20px">
    <b>나의 근처 상점들</b>
  </div>
  <div id="map"></div>
</template>

<script>
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
  name: "marketMap",

  data() {
    return {
      latitude: null,
      longitude: null,
      map: null
    };
  },

  mounted() {
    const script = document.createElement('script');

    script.async = true;
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=46a783bba3ff193bea6e663af44c3b84";

    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(async () => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(36.3296, 127.4332),
          level: 1
        };

        this.map = new window.kakao.maps.Map(container, options);

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

            marker.setMap(this.map);

            this.map.setCenter(latLng);
          }, () => console.log("위치 정보를 가져올 수 없습니다."));

        } else console.log("위치 정보를 지원하지 않는 브라우저입니다.");

        this.fetchStores().then(() => {
          console.log('Fetched stores successfully.');
        }).catch((error) => {
          console.error('Failed to fetch stores:', error);
        });
      });

    }
  },
  methods:{
    async fetchStores() {
      try {
        const db = getFirestore();
        const storesCollection = collection(db, 'stores');
        const querySnapshot = await getDocs(storesCollection);

        this.stores = querySnapshot.docs
            .map((doc) => doc.data())
            .sort((a, b) => a.Stnum - b.Stnum);

        let currentInfowindow; // To keep track of the currently open infowindow.

        // Create a marker for each store and add it to the map.
        this.stores.forEach(store => {
          if (store.location && store.location.lat && store.location.lng) {
            console.log(`Creating marker for store at ${store.location.lat}, ${store.location.lng}`);

            const latLng = new window.kakao.maps.LatLng(store.location.lat, store.location.lng);

            const marker = new window.kakao.maps.Marker({
              position: latLng,
              clickable: true
            });

            // Add an event listener to the marker.
            window.kakao.maps.event.addListener(marker, 'click', () => {
              // Close the previous infowindow if it exists.
              if (currentInfowindow) {
                currentInfowindow.close();
              }

              var infowindow = new window.kakao.maps.InfoWindow({zIndex:1});
              infowindow.setContent('<div style="width:200px;text-align:center;"><div style="padding:5px;font-size:13px;font-weight: bold"><a href="#" id="infoWindowLink">' + store.storename + '</a></div></div>');

              infowindow.open(this.map, marker);

              // Keep track of the newly opened infowindow.
              currentInfowindow = infowindow;

              document.getElementById('infoWindowLink').addEventListener('click', (event) => {
                event.preventDefault();
                this.$router.push({ name: 'StorePage', params: { storeId: store.Stnum } }).catch((error) => {
                  console.error(`Failed to navigate to store page: ${error}`);
                });
              } )
            });
            marker.setMap(this.map);
          } else {
            console.log('Store does not have valid location data:', store);
          }

          // Add an event listener to close any open info windows when clicking on the map.
          window.kakao.maps.event.addListener(this.map, 'click', function() {
            if (currentInfowindow) {
              currentInfowindow.close();
            }
          });

        });

      } catch (error) {
        console.error('Failed to fetch stores:', error);
      }
    },
  }
};

</script>

<style scoped>
#map{
  width :90%;
  height :90%;
  margin :0 auto;
  border :1px #000 solid;
}

.button-group{
  margin:
      10px
      0px;
}

button{
  margin:
      0
      3px;
}
</style>
