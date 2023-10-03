<template>
  <div style="padding: 50px;">
    <h1>리뷰 작성하기</h1>
    <form @submit.prevent="submitReview">
      <label for="name">이름</label>
      <input v-model="review.name" type="text" id="name" required>
      <label for="comment">리뷰</label>
      <textarea v-model="review.comment" id="comment" required></textarea>
      <label for="rating">별점</label>
      <v-rating v-model="review.rating" :half-increments="true" background-color="#ccc"></v-rating>
      <button type="submit">리뷰 작성</button>
    </form>    
    <h1>리뷰 목록</h1>
    <p>평균 별점: {{ averageRating }}점</p>
    <ul>
      <li v-for="review in filteredReviews" :key="review.id">
        <strong>{{ review.name }}:</strong> {{ review.comment }} ({{ review.rating }}점)
      </li>
    </ul>
    <StoreInfo :averageRating="averageRating" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useRoute } from 'vue-router';
import submitReview from './submitReview.vue';

export default {
  components:{
    submitReview
  },
  setup() {
    const route = useRoute();
    const storeId = ref('');
    const review = ref({
      name: '',
      comment: '',
      rating: null
    });
    const reviews = ref([]);

    const fetchReviews = async () => {
      try {
        const firestore = getFirestore();
        const reviewsRef = collection(firestore, 'reviews');
        const querySnapshot = await getDocs(query(reviewsRef, where('storeId', '==', storeId.value)));
        reviews.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('리뷰 목록 가져오기 실패:', error);
      }
    };

    const submitReview = () => {
      review.value.storeId = storeId.value;

      // Firebase Firestore에 리뷰 데이터 추가
      addDoc(collection(getFirestore(), 'reviews'), review.value)
        .then(() => {
          console.log('리뷰 작성 완료');
          fetchReviews();
        })
        .catch((error) => {
          console.error('리뷰 작성 실패:', error);
        });
    };

    onMounted(() => {
      storeId.value = route.params.storeId;
      fetchReviews();
    });

    const filteredReviews = computed(() => {
      return reviews.value.filter((review) => review.storeId === storeId.value);
    });

    const averageRating = computed(() => {
      if (reviews.value.length === 0) {
        return 0; // 리뷰가 없는 경우 0으로 표시
      }

      const totalRating = reviews.value.reduce((sum, review) => sum + review.rating, 0);
      return (totalRating / reviews.value.length).toFixed(1); // 평균 별점 계산 후 소수점 첫째 자리까지 표시
    });

    return {
      storeId,
      review,
      reviews,
      filteredReviews,
      averageRating,
      fetchReviews,
      submitReview
    };
  }
};
</script>

<style scoped>
/* 리뷰 작성 폼 스타일 */
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto; /* 중앙 정렬을 위한 margin 설정 */
  margin-bottom: 20px;
  justify-content: center; /* 가운데 정렬을 위한 justify-content 설정 */
}

label {
  margin-bottom: 5px;
  font-weight: bold;
 
}

input,
textarea {
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #000000;
}

button[type='submit'] {
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  border: none;
  cursor: pointer;
}

/* 리뷰 목록 스타일 */
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
}

/* 별점 스타일 */
.star-rating {
  margin-bottom: 10px;
  justify-content: center;
}

.v-rating {
  font-size: 24px;
}

.v-rating__selection {
  color: #f0dd00; /* 채워진 별의 색상 */
}

.v-rating__background {
  color: #ccc; /* 빈 별의 색상 */
}

.star-rating label {
  margin-right: 5px;
  font-size: 24px; /* 별 모양의 크기를 조정 */
  cursor: pointer;
  color: #ccc; /* 빈 별의 색상 */
}

.star-rating input[type='radio'] {
  display: none;
}

.star-rating label:before {
  content: '\2606'; /* 빈 별 모양의 유니코드 */
}

.star-rating label:hover:before,
.star-rating label:hover ~ label:before,
.star-rating input[type='radio']:checked ~ label:before {
  content: '\2605'; /* 채워진 별 모양의 유니코드 */
  color: #f0dd00; /* 채워진 별의 색상 */
}
</style>
