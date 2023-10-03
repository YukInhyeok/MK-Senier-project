<template>
  <br>
  <div class="signup-container">
    <h1>판매자 회원가입</h1>
    <form @submit.prevent="register" class="form">
      <div class="form-group">
        <label for="username" class="form-label">이름</label>
        <input type="text" id="username" v-model="username" class="form-input" required placeholder="이름을 입력하세요.">
      </div>
      <div class="form-group">
        <label for="email" class="form-label">이메일</label>
        <input type="email" id="email" v-model="email" class="form-input" required placeholder="이메일을 입력하세요.">
      </div>
      <div class="form-group">
        <label for="password" class="form-label">비밀번호</label>
        <input type="password" id="password" v-model="password" class="form-input" required placeholder="비밀번호를 입력하세요.">
      </div>
      <div class="form-group">
        <label for="phone" class="form-label">전화번호</label>
        <input type="tel" id="phone" v-model="phone" class="form-input" required placeholder="전화번호를 입력하세요.">
      </div>
      <button type="submit" class="form-button">가입하기</button>
    </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase configuration goes here
  apiKey: "AIzaSyAjh-tLB9jHUFxtvf1OlFTN4TU9p0u-VTQ",
  authDomain: "tdmk-595a3.firebaseapp.com",
  databaseURL: "https://tdmk-595a3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tdmk-595a3",
  storageBucket: "tdmk-595a3.appspot.com",
  messagingSenderId: "849130639775",
  appId: "1:849130639775:web:e4d64bda00fd4a4d89adaa",
  measurementId: "G-QXH609W16C",
};

initializeApp(firebaseConfig);

export default {
  name: 'SellerSignup',
  setup() {
    const email = ref('');
    const password = ref('');
    const username = ref('');
    const phone = ref('');
    const errorMessage = ref(null);
    const successMessage = ref(null);

    const register = async () => {
      const auth = getAuth();
      const db = getFirestore();

      try {
        const result = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = result.user;
        const userInfo = result.additionalUserInfo;
        if (userInfo && userInfo.isNewUser) {
          await updateProfile(user, {
            displayName: username.value,
          });
        }

        // 전화번호에 하이픈 추가
        const processedPhone = phone.value.replace(/-/g, ''); // 기존에 입력된 하이픈 제거
        const formattedPhone = `${processedPhone.slice(0, 3)}-${processedPhone.slice(3, 7)}-${processedPhone.slice(7)}`;

        const userDoc = {
          uid: user.uid,
          email: email.value,
          name: username.value,
          phone: formattedPhone,
        };

        await addDoc(collection(db, 'users'), userDoc);

        successMessage.value = '회원가입이 완료되었습니다.';
        email.value = '';
        password.value = '';
        username.value = '';
        phone.value = '';
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    return {
      email,
      password,
      username,
      phone,
      errorMessage,
      successMessage,
      register,
    };
  },
};
</script>

<style>
.signup-container {
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

.form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.form-button {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 5px;
  background-color: #4285f4;
  color: #fff;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
}

.error-message,
.success-message {
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.error-message {
  background-color: #f44336;
  color: #fff;
}

.success-message {
  background-color: #4caf50;
  color: #fff;
}
</style>
