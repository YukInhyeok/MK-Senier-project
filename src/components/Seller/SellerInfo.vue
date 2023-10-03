<template>
  <br>
  <div class="SellerInfo-container">
    <h1>판매자 프로필</h1>
    <div class="SellerInfo">
      <p><strong>이름 :</strong> {{ username }}</p>
      <p><strong>이메일 :</strong> {{ email }}</p>
      <p><strong>전화번호 :</strong> {{ phone }}</p>
    </div>
  </div>
  <br><br>
  
  <h2>나의 상점 목록</h2>
  <div class="gallery">
    <div v-for="store in sortedStores" :key="store.Stnum" class="store-profile">
      <img :src="store.image" alt="store" class="store-image">
      <p><strong>상점 번호 :</strong> {{ store.Stnum }}</p>
      <p><strong>상점 이름 :</strong> {{ store.storename }}</p>
      <p><strong>상점 위치 :</strong> {{ store.location }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export default {
  name: 'SellerInfo',
  setup() {
    const username = ref('');
    const email = ref('');
    const phone = ref('');
    const stores = ref([]);

    onMounted(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          email.value = user.email;
          const db = getFirestore();
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('uid', '==', user.uid));
          getDocs(q)
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                username.value = userData.name;
                phone.value = userData.phone;
              }
            })
            .catch((error) => {
              console.error('Error getting user data:', error);
            });

          const storesRef = collection(db, 'stores');
          const q2 = query(storesRef, where('uid', '==', user.uid));
          getDocs(q2)
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const storesData = querySnapshot.docs.map((doc) => doc.data());
                stores.value = storesData;
              }
            })
            .catch((error) => {
              console.error('Error getting stores data:', error);
            });
        }
      });
    });

    const sortedStores = computed(() => {
      return stores.value.slice().sort((a, b) => a.Stnum - b.Stnum);
    });

    return {
      username,
      email,
      phone,
      sortedStores
    };
  }
};
</script>



<style>

h2 { text-align: center; }
.SellerInfo-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

h1 {
  font-size: 24px;
  text-align: center;
}

.SellerInfo {
  margin-top: 20px;
}

.SellerInfo p {
  margin-bottom: 10px;
  font-size: 14px;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 20px;
  margin-top: 20px;
}

.store-profile {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
}

.store-profile img {
  max-width: 100%;
  margin: 0 auto; /* Center-align the images */
}

.store-profile p {
  margin-bottom: 5px;
  font-size: 14px;
}
</style>  