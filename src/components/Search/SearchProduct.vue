<template>
  <div class="SearchProduct">
    <!-- 카테고리 선택  -->
    <div class="category-options">
      <h2>검색 카테고리 선택</h2>
      <div class="category-option-list">
        <v-checkbox class="category-option" v-model="selectedOption" label="전체" value="All"></v-checkbox>
        <v-checkbox class="category-option" v-model="selectedOption" v-for="option in options.slice(1)"
          :key="option.value" :label="option.text" :value="option.value">
        </v-checkbox>
      </div>
    </div>
    <!-- 검색  -->
    <div class="search-input">
      <v-text-field v-model="searchText" @input="searchProducts" @keyup.enter="searchProducts"></v-text-field>
      <button @click="searchProducts" class="search">검색</button>
    </div>
    <!-- 검색 결과  -->
    <div class="search-result" v-if="searchResults.length > 0">
      <h2>검색 결과 총 {{ searchResults.length }}개</h2>
      <p style="font-size: 13px; font-style: bold; text-align: center; margin-bottom: 12px;">상품 선택 시 해당 상품의 상점 위치확인이 가능합니다</p>
      <ul>
        
        <li v-for="product in searchResults" :key="product.id">
          <v-checkbox v-model="selectedResults" :label="getProductLabel(product)" :value="product"></v-checkbox>
          <button @click="openSearchDialog(product)" class="search-btn-menu">자세히</button>
        </li>
        <button v-if="selectedResults.length > 0" @click="showSelectedProducts" class="view-btn">선택한 상품 위치 보기</button>
        <button v-if="canLoadMore" @click="loadMoreResults" class="search-btn">결과 더 보기</button>
        <br>
        
      </ul>
    </div>
    <!-- 검색 아무것도 안했을때 결과   -->
    <div v-else>
      <p style="text-align: center; border-top:1px solid #a6a7a8;">검색 결과가 없거나, 아직 검색을 하지 않았습니다.</p>
    </div>
  </div>
  <!-- 다이얼로그 자세히 버튼 눌렀을 때 나오게 끔 한거 -->
  <v-dialog class="SearchSlectDialog" v-model="dialogOpen" max-width="600">
    <v-card>
      <v-card-title style="">
        <h3>상품 상세 정보</h3>
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
          <button @click="closeSearchDialog" class="close-btn">닫기</button>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { getFirestore, collection, query, orderBy, startAfter, limit, getDocs } from 'firebase/firestore';

export default {
  props: ['isLoggedIn', 'loginInfo'],
  emits: ['login', 'logout', 'selected-products'],
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
        { value: 'Clothes', text: '패션' },
        { value: 'Food', text: '요리' },
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
      lastVisible: null,
      pageSize: 10, // 검색된 상품 갯수, 전체 갯수 보다 적으면 (결과 더보기) 버튼이 나옴
      canLoadMore: false,
    };
  },
  methods: {
    async searchProducts() {
      this.searchResults = [];
      this.lastVisible = null;
      
      await this.loadMoreResults();
    },

    async loadMoreResults() {
      try {
        const db = getFirestore();

        let productsQuery = query(collection(db, 'products'), orderBy('name'), limit(this.pageSize));

        if (this.lastVisible) {
          productsQuery = query(collection(db, 'products'), orderBy('name'), startAfter(this.lastVisible), limit(this.pageSize));
        }

        const querySnapshot = await getDocs(productsQuery);

        this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        const products = querySnapshot.docs.map(doc => doc.data());

        this.searchResults.push(...products.filter(product => {
          const nameIncludesSearchText = product.name.toLowerCase().includes(this.searchText.toLowerCase().trim());
          const categoryMatchesFilter = this.selectedOption === 'All' || product.category === this.selectedOption;
          return nameIncludesSearchText && categoryMatchesFilter;
         }));

         this.canLoadMore = querySnapshot.docs.length >= this.pageSize;
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
      this.$router.push({
        path: '/SearchMap',
        query: { selectedProducts: JSON.stringify(this.selectedResults) }
      });

      console.log('전달한 상품:', this.selectedResults);
      this.$emit('selected-products', this.selectedResults);
    }

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
  margin-right: auto;
  margin-left: auto;
  width: 95%;
  display: flex;
  align-items: center;
  text-align: center;
}
.search{
    margin-top: -22px;
    min-width: 100px;
    height: 55px;
    font-size: 12px;
    background-color: #4285f4;
    color: white;
    border-radius: 10px;
    cursor: pointer;
}
.search-btn {
  display: inline-block;
  margin-left: 10px;
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
  margin-right: 10px;
  min-width: 120px;
  height: 35px;
  font-size: 12px;
  background-color: #4285f4;
  color: white;
  border-radius: 15px;
  cursor: pointer;
}
.category-options {
  margin-bottom: 10px;
}
.category-options h2 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 20px;
  color: #000000;
}
.category-option-list {
  display: flex;
  justify-self: center;
  align-items: center;
  font-size: 10px;
}

.search-result {
  margin-top: 10px;
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
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
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
.close-btn{
  border: 1px solid rgb(250, 114, 114);
  background: rgb(255, 117, 117);
  min-width: 120px;
  color: rgb(255, 255, 255);
  
}
.close-btn:hover{
  background: rgb(247, 107, 107);
}
.view-btn{
  text-align: center;
}
</style>