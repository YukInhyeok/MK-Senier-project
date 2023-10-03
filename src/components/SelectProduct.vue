<template>
    <div>
      <label for="category">상품 분류:</label>
      <select v-model="selectedCategory" id="category">
        <option value="">선택하세요</option>
        <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
      </select>
      <p>선택한 상품 분류: {{ selectedCategory }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedCategory: '',
        options: [
          { value: 'food', text: '식품' },
          { value: 'electronics', text: '전자제품' },
          { value: 'clothing', text: '의류' }
        ]
      }
    }
  }
  </script>
  