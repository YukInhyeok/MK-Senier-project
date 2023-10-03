<template>
  <div class="SearchProduct">
    <!-- 검색  -->
    <br>
    <div class="category-options">
      <h2>검색 카테고리</h2>
    <div class="searchOption">
      <div class="category-option-list">
        <v-checkbox class="category-option" v-model="selectedOption" label="전체" value="All"></v-checkbox>
      </div>
      <div class="category-option-list" v-for="option in options.slice(1)" :key="option.value">
        <v-checkbox class="category-option" v-model="selectedOption" :label="option.text" :value="option.value"></v-checkbox>
      </div>
    </div>
    </div>
    <h1>상품 검색</h1>
    <div class="search-input">
      <v-text-field v-model="searchText" label="검색어를 입력하세요" @input="searchProducts" @keyup.enter="searchProducts">
      </v-text-field>
      <v-btn @click="searchProducts" class="search-btn">검색</v-btn>
    </div>

    <!-- 카테고리 선택  -->


    <!-- 검색 결과  --> 
    <div class="search-result" v-if="searchResults.length > 0">
      <h2>검색 결과 총 {{ searchResults.length }}개</h2>
      <ul>
        <li v-for="product in searchResults" :key="product.id">
          <v-checkbox v-model="selectedResults" :label="getProductLabel(product)" :value="product"></v-checkbox>
          <button @click="openSearchDialog(product)" class="search-btn-menu">자세히</button>
        </li>
        <br>
        <button v-if="selectedResults.length > 0" @click="showSelectedProducts" class="search-btn">선택한 상품 보기</button>
      </ul>
    </div>

    <!-- 검색 아무것도 안했을때 결과   -->
    <div v-else>
      <p class ="noSearch" >검색 결과가 없거나, 아직 검색을 하지 않았습니다.</p>
    </div>

  </div>

  <!-- 다이얼로그 자세히 버튼 눌렀을 때 나오게 끔 한거 -->
  <v-dialog class="SearchSlectDialog" v-model="dialogOpen" max-width="500">
    <v-card>
      <v-card-title>
        <h2>상품 상세 정보</h2>
      </v-card-title>
      <v-card-text>
        <div class="product-info">
          <p><span class="info-label">상품 분류 :</span> {{ selectedProduct.category }}</p>
          <p><span class="info-label">세부 분류 :</span> {{ selectedProduct.subCategory }}</p>
          <p><span class="info-label">상품 이름 :</span> {{ selectedProduct.name }}</p>
          <p><span class="info-label">상품 설명 :</span> {{ selectedProduct.description }}</p>
          <p><span class="info-label">상품 가격 :</span> {{ selectedProduct.price }} 원</p>
        </div>
        <br>
        <div class="dialog-actions">
          <button @click="closeSearchDialog" class="search-btn">닫기</button>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
  props: ['isLoggedIn', 'loginInfo'],
  emits: ['login', 'logout'],
  data() {
    return {
      product: {
        category: '',
        subCategory: '',
        name: '',
        price: '',
        description: '',
      },
      options: [
        { value: 'All', text: '전체' },
        { value: 'Clothes', text: '의류' },
        { value: 'Food', text: '식품' },
        { value: 'Home', text: '생활' },
        { value: 'Service', text: '서비스' },
      ],
      products: [],
      searchText: '',
      selectedOption: 'All',
      searchResults: [],
      selectedResults: [],
      dialogOpen: false,
      selectedProduct: null,
    };
  },
  methods: {
    async searchProducts() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs.map(doc => doc.data());
        this.searchResults = products.filter(product => {
          const nameIncludesSearchText = product.name.toLowerCase().includes(this.searchText.toLowerCase().trim());
          const categoryMatchesFilter = this.selectedOption === 'All' || product.category === this.selectedOption;
          return nameIncludesSearchText && categoryMatchesFilter;
        });
      } catch (error) {
        console.error('검색 실패:', error);
      }
    },
    getProductLabel(product) {
      return `상품명: ${product.name} 가격: ${product.price}원`;
    },
    openSearchDialog(product) {
      this.selectedProduct = product;
      this.dialogOpen = true;
    },
    closeSearchDialog() {
      this.dialogOpen = false;
    },
    showSelectedProducts() {
      for (const product of this.selectedResults) {
        this.$router.push('/SearchMap');
        console.log('선택한 상품:', product);
      }
      this.$emit('selected-products', this.selectedResults);
    },
  },
};
</script>

<style scoped>
/* 필요한 스타일을 추가해주세요 */
.SearchProduct {
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 10px;
  margin-left: 10px;
}

.search-btn {
  display: inline-block;
  margin-left: 10px;
  margin-bottom: 25px;
  min-width: 120px;
  height: 50px;
  font-size: 18px;
  font-weight: bold;
  padding: 0 16px;
  background-color: white;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.search-btn-menu {
  display: inline-block;
  margin-left: 15px;
  margin-bottom: 5px;
  min-width: 120px;
  height: 50px;
  font-size: 15px;
  font-weight: bold;
  padding: 0 16px;
  background-color: #199356;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.category-options {
  margin-bottom: 10px;
}

.category-options h2 {
  margin-bottom: 10px;
  font-size: 20px;
  color: #000000;
}

.category-option-list {
display: grid;
}

.category-option {
  width: 100%;
  display: grid;

}

.search-result {
  margin-top: 10px;
  margin-bottom: 200px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
}

.search-result h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.search-result ul {
  list-style-type: none;
  padding-left: 0;
}

.search-result li {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.product-info {
  margin-bottom: 20px;
  white-space: pre-line;
}

.info-label {
  font-weight: bold;
  margin-right: 5px;
  margin-bottom: 20px;
}

.dialog-actions {
  text-align: center;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 1rem;
}
.searchOption{
  display: flex;
  justify-content: center;
  align-items: center;
}
.noSearch{
  text-align: center; 
  border-top:1px solid #a6a7a8;
}
</style>
