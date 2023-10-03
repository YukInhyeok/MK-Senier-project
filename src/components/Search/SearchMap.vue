<template>
    <div class = "SearchMap">
      
    </div>
  </template>
  
  <script>
  import { getFirestore, collection, getDocs, } from 'firebase/firestore';
  
  export default {
    name : 'SearchMap',
    emits: ['login', 'logout'],
    props: {isLoggedIn: Boolean,loginInfo: null
    },
    data() {
      return {
        props: ['isLoggedIn', 'loginInfo'],
        emits: ['login', 'logout'],
        product: {
          category: '',
          subCategory: '',
          name: '',
          price: '',
          description: '',
        },
        options: [
          { value: 'All', text: '전체' },
          { value: 'Clothes', text: '의류•패션' },
          { value: 'Food', text: '식품•요리' },
          { value: 'Home', text: '주거•생활' },
          { value: 'Service', text: '근린•서비스' },
        ],
        products: [
          // 상품들의 배열
          // { id, name, price, category, subCategory, ... }
        ],
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
          this.searchResults = querySnapshot.docs
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
      // 검색 결과 출력 형태 
      getProductLabel(product) {
        return ` 상품명 : ${product.name} 가격 : ${product.price}원`;
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
          console.log('선택한 상품:', product);
        }
        this.$emit('selected-products', this.selectedResults);
      },
    },
  };
  </script>
  
  <style scoped>
  /* 필요한 스타일을 추가해주세요 */
  .search-input {
    display: flex;
    align-items: center;
    flex: 1;
  }
  
  .SearchSlectDialog {
    padding: 0 16px;
  }
  
  .search-btn {
    align-items: center;
    margin-left: 8px;
    min-width: 100px;
    height: 48px;
    font-size: 16px;
    padding: 0 16px;
    background-color: aqua;
  }
  
  .category-options {
    display: flex;
  }
  
  .category-options v-checkbox {
    margin-right: 16px;
  }
  </style>
  