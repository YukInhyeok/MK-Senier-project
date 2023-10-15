<template>
<br/>
  <div>
  <div class="signup-container">
    <h3>판매자 회원가입</h3>
    <form @submit.prevent="register" class="form">
      <div class="form-group">
        
      <p class="join_caution">회원가입 시 상점을 등록하여 어플 이용자가 상점을 확인할 수 있습니다.</p>
      <p class="join_caution" style="margin-bottom: 15px;">어플 이용자는 별도의 회원가입 없이 상점 및 상품 정보를 리뷰할 수 있습니다.</p>
        <input type="text" id="username" v-model="username" class="form-input" required placeholder="이름">
      </div>
      <div class="form-group">
        <input type="email" id="email" v-model="email" class="form-input" required placeholder="이메일">
      </div>
      <div class="form-group">
        <input type="password" id="password" v-model="password" class="form-input" required placeholder="비밀번호">
      </div>
      <div class="form-group">
        <input type="tel" id="phone" v-model="phone" class="form-input" required placeholder="전화번호">
      </div>
      <p class="join_caution"><input type="checkbox" style="margin-top:10px;width: 12px; height: 12px;">&nbsp;회원가입 시 개인정보 수집에 동의하고 가입합니다. (필수)</p> 
      
      <button type="submit" class="form-button">회원가입</button>
    </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
  </div>
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
  width: 95%;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  margin-top: 160px;
}

h3 {

  text-align: center;
}

.form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  max-width: 100px;
  text-align: center;
  border: 1px solid;
  margin-left: 12px;
  margin-bottom: 8px;
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
  margin-top: 12px;
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
.join_caution{
  text-align: center;
  font-size: 12px;
}


</style>
