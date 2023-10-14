<template>
  <br>
  <div class="password-reset-container">
    <h1 class="title">비밀번호 찾기</h1>
    <form @submit.prevent="sendResetEmail" class="form">
      <div class="input-wrapper">
        <input type="email" id="email" v-model="email" class="input" required placeholder="이메일">
      </div>
      <button type="submit" class="reset-button" @click="showPopup">비밀번호 재설정 이메일 보내기</button>
    </form>
    <div v-if="isPopupVisible" class="popup">
      <div class="popup-content">
        <span class="close" @click="closePopup">&times;</span>
        <p v-if="isEmailEmpty" class="popup-error">이메일을 입력해주세요.</p>
        <p v-else>비밀번호 재설정 이메일이 전송되었습니다.</p>
        <button class="popup-close-button" @click="closePopup">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default {
  name: 'SellerFindPassword',
  data() {
    return {
      email: "",
      isPopupVisible: false,
    };
  },
  computed: {
    isEmailEmpty() {
      return this.email.trim() === "";
    },
  },
  methods: {
    async sendResetEmail() {
      if (this.isEmailEmpty) {
        this.showPopup();
        return;
      }

      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, this.email);
        this.showPopup();
      } catch (error) {
        console.log(error.code, error.message);
        alert('오류가 발생했습니다. 이메일 주소를 확인해주세요.');
      }
    },
    showPopup() {
      this.isPopupVisible = true;
    },
    closePopup() {
      this.isPopupVisible = false;
    },
  },
};
</script>

<style scoped>
.password-reset-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  text-align: center;
}

.title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

.input-wrapper {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
}

.input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.reset-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.reset-button:hover {
  background-color: #0056b3;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: #999;
  cursor: pointer;
}

.popup-close-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.popup-close-button:hover {
  background-color: #0056b3;
}
</style>