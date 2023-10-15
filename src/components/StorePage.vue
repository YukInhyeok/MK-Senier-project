<template>
  <div class="store-grid">
    <div class="store-item" v-if="store">
      <img class="store-image" :src="store.image" alt="Store Image" />
      <div class="store-text">
        <h3>
          <b>{{ store.Stnum }}번 상점입니다.</b>
        </h3>
        <h3>
          <b>상점 이름 : {{ store.storename }}</b>
        </h3>
        <h3>
          
        </h3>
      </div>
    </div>
  </div>
  <div id="Store"></div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
export default {
  name: "StorePage",

  props: ['storeId'], // change this to storeId

  setup(props) {
    const store = ref(null);

    async function fetchStore() {
      const db = getFirestore();
      const q = query(collection(db, "stores"), where("Stnum", "==", Number(props.storeId)));

      console.log("props.storeId: ", props.storeId);

      const querySnapshot = await getDocs(q);
      console.log('Query Snapshot: ', querySnapshot);
      if (!querySnapshot.empty) {
        console.log("Document data:", querySnapshot.docs[0].data());
        store.value = querySnapshot.docs[0].data();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    onMounted(fetchStore);

    return {
      store
    };
  },
}
</script>

<style scoped>
.store-image {
  width: 100%;
  max-width: 400px;
  text-align: center;
  height: 100%;
  max-height: 400px;
  border: 1px solid #b8b8b8;
  border-radius:12px;
}
.store-text {
  width: 100%;
  text-align: center;
  margin-top: 10px;
  font-size: 12px;
  padding-top: 30px;

}

.store-grid {
  display: grid;
  width: 100%;
  margin-top: 150px;

}

.store-item {
  width: 98%;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 100px;
  padding-bottom: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
