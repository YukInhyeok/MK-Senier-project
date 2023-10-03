<template>
  <div class="submitProducts">

    <form @submit.prevent="selectStnum">
      <h2>등록할 상점</h2>
      <select v-model="product.stnum" @change="filterStore" required>
        <option value="">선택하세요</option>
        <option v-for="store in filteredStores" :key="store.Stnum" :value="store.Stnum">{{ store.Stnum }}</option>
      </select>
      <div v-if="selectedStore" class="store-item">
        <img :src="selectedStore.image" alt="Store Image" class="store-image" />
        <div class="store-details">
          <span class="store-number">상점 번호: {{ selectedStore.Stnum }}</span>
          <br>
          <span class="store-name">상점 이름: {{ selectedStore.storename }}</span>
        </div>
      </div>
    </form>

    <form @submit.prevent="submitProducts">
      <h2>새 상품 등록</h2>
      <!-- 상품 분류(select 요소) -->
      <div class="form-group">
        <label for="category">상품 분류:</label>
        <select v-model="product.category" id="category" required>
          <option value="">선택하세요</option>
          <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
        </select>
      </div>

      <!-- 하위 카테고리(select 요소) -->
      <div class="form-group" v-if="product.category">
        <label for="subCategory">세부 분류:</label>
        <select v-model="product.subCategory" id="subCategory" required>
          <option value="">선택하세요</option>
          <option v-for="option in subOptions[product.category]" :key="option.value" :value="option.value">{{ option.text
          }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="text">상품 이름 : </label>
        <input type="text" v-model="product.name" required>
      </div>
      <div class="form-group">
        <label for="text">상품 가격:</label>
        <input type="number" v-model="product.price" required>
      </div>
      <div class="form-group">
        <label for="text">상품 설명:</label>
        <input type="text" v-model="product.description" required>
      </div>
      <button type="submit">상품 등록하기</button>

      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
    </form>
    <h2>나의 상품 목록</h2>
    <ul class="myProduct"> 
      <li v-for="product in products" :key="product.id">
        <p>상품분류 : {{ product.category }}</p>
        <p>세부분류 : {{ product.subCategory }}</p>
        <p>상품이름 : {{ product.name }}</p>
        <p>상품설명 : {{ product.description }}</p>
        <p>상품가격 : {{ product.price }}원</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  // Firebase Configurations
  apiKey: "AIzaSyAjh-tLB9jHUFxtvf1OlFTN4TU9p0u-VTQ",
  authDomain: "tdmk-595a3.firebaseapp.com",
  databaseURL: "https://tdmk-595a3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tdmk-595a3",
  storageBucket: "tdmk-595a3.appspot.com",
  messagingSenderId: "849130639775",
  appId: "1:849130639775:web:e4d64bda00fd4a4d89adaa",
  measurementId: "G-QXH609W16C"
};
initializeApp(firebaseConfig);
// Firebase 초기화
const app = initializeApp(firebaseConfig);
// Firestore 인스턴스 가져오기
const db = getFirestore(app);

export default {
  name: 'ProductRegistration',
  data() {
    return {
      auth: getAuth(app),
      user: reactive({ uid: '' }),
      product: {
        category: '',
        subCategory: '',
        name: '',
        price: '',
        description: '',
        uid: '',
        stnum: '',
      },
      options: [
        { value: 'Clothes', text: ' 의류•패션' },
        { value: 'Food', text: ' 식품•요리' },
        { value: 'Home', text: ' 주거•생활' },
        { value: 'Service', text: ' 근린•서비스' },
      ],
      subOptions: {
        'Clothes': [
          { value: 'Woman', text: ' 여성복' },
          { value: 'Man', text: ' 남성복' },
          { value: 'Kids ', text: ' 아동복' },
          { value: 'Underwear', text: ' 속옷' },
          { value: 'Sports/Outdoor', text: ' 스포츠•아웃도어' },
          { value: 'Vintage', text: ' 구제의류' },
          { value: 'Uniform', text: ' 유니폼•드레스•특수' },
          { value: 'Han bok', text: ' 한복' },
          { value: 'Shoes', text: ' 신발' },
          { value: 'Glasses', text: ' 안경' },
          { value: 'Bag', text: ' 가방' },
          { value: 'Precious Metals/Watches', text: ' 귀금속•시계' },
          { value: 'Miscellaneous Goods/Accessories', text: ' 잡화•악세서리' },
          { value: 'cosmetics', text: ' 화장품' },
          { value: 'Hair·Skin·Nail·Tattoo', text: ' 헤어•피부•네일•타투' },
        ],
        'Food': [
          { value: 'Agricultural products', text: ' 농산물' },
          { value: 'Fish', text: ' 수산물' },
          { value: 'Meat', text: ' 축산물' },
          { value: 'Fruits', text: ' 과일' },
          { value: 'Dried fish/side dishes', text: ' 건어물•반찬' },
          { value: 'Rice cake/bread/instantfood', text: ' 떡•빵•즉석음식' },
          { value: 'Alcohol/Tobacco/Snack', text: ' 과자•음료•술•담배•마트물' },
          { value: 'Health care food', text: ' 건강기능식품' },
          { value: 'Restaurant/cafe', text: ' 식당•카페' },
        ],
        'Home': [
          { value: 'Dishes/ Kitchenware', text: ' 그릇•주방용품' },
          { value: 'Curtain', text: ' 커텐' },
          { value: 'Furniture/ Interior', text: ' 가구•인테리어' },
          { value: 'Home Appliances/ Computers/ Phones', text: ' 가전•컴퓨터•핸드폰' },
          { value: 'Futon/ bedding', text: ' 이불•침구' },  
          { value: 'Fabric/ Draft/ Paper', text: ' 원단•포목•지업' },
          { value: 'Stationery/ Toys/ Crafts', text: ' 문구•완구•공예' },
          { value: 'Household goods', text: ' 생활용품' },
          { value: 'Lighting and flowers', text: ' 조명•꽃' },
          { value: 'Prediction/ Ibaji', text: ' 예단•이바지' },
          { value: 'Religious items', text: ' 광혼상제•종교용품' },
          { value: 'Sewing/ Sewing line', text: ' 바느질•재봉선•수선' },
          { value: 'Facility/ Repair', text: ' 설비•수리' },
          { value: 'Handicrafts/ Embroidery', text: ' 수예•자수' },
        ],
        'Service': [
          { value: 'Culture', text: ' 문화•관광•체육' },
          { value: 'Hospital', text: ' 병원•약국' },
          { value: 'Academies and Bookstores', text: ' 학원•서점' },
          { value: 'Services', text: ' 일반•서비스' },
        ],
        // 다른 카테고리의 하위 목록도 추가 가능
      },
      stores: [],
      products: [],
      errorMessage: '',
      successMessage: '',
      dialog: false,
      selectedStore: null, // 선택된 상점 정보를 저장할 변수
    };
  },
  mounted() {
    onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        this.user.uid = firebaseUser.uid;
      } else {
        this.user.uid = '';
      }
    });
    this.fetchProducts();
    this.fetchStores();
  },
  methods: {
    async submitProducts() {
      try {
        const firebaseUser = this.auth.currentUser;
        if (!firebaseUser) {
          this.errorMessage = "로그인이 필요합니다.";
          return;
        }
        const productWithId = {
          ...this.$data.product,
          id: Date.now().toString(),
        };
        productWithId.uid = firebaseUser.uid; // uid 속성 할당
        const docRef = await addDoc(collection(db, 'products'), productWithId);
        console.log('상품이 등록되었습니다:', docRef.id);
        console.log(this.$data.product);

        this.successMessage = "상품 등록에 성공했습니다.";
        this.fetchProducts();
      } catch (error) {
        console.error('상품 작성 실패:', error);
        this.successMessage = "상품 등록에 실패했습니다.";
      }
    },
    async fetchStores() {
      try {
        const querySnapshot = await getDocs(collection(db, 'stores'));
        this.stores = querySnapshot.docs.map(doc => {
          const storeData = doc.data();
          if (storeData.uid === this.user.uid) {
            return {
              id: doc.id,
              ...storeData,
            };
          }
        }).filter(store => store); // 유효한 상품만 필터링
      } catch (error) {
        console.error('상품 목록 가져오기 실패:', error);
      }
    },
    async fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        this.products = querySnapshot.docs.map(doc => {
          const productData = doc.data();
          if (productData.uid === this.user.uid) {
            return {
              id: doc.id,
              ...productData,
            };
          }
        }).filter(product => product); // 유효한 상품만 필터링
      } catch (error) {
        console.error('상품 목록 가져오기 실패:', error);
      }
    },
    async filterStore() {
      const uid = this.user.uid;
      this.filteredStores = this.stores.filter(store => store.uid === uid);
      this.selectedStore = null; // 선택된 상점 초기화
      const selectedStnum = this.product.stnum;
      this.selectedStore = this.stores.find(store => store.Stnum === selectedStnum);
    },
  },
  computed: {
    filteredStores() {
      return this.stores;
    },
  },
};
</script>

<style scoped>
.submitProducts {
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input[type="text"],

input[type="number"] {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
}

button[type="submit"] {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

.store-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.store-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.store-details {
  text-align: center;
  margin-top: 10px;
}
.myProduct{
  text-align: start;
  width: 90%;
}
</style>