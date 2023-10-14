<template>
  <div class ="container">
    <br>
    <div class="login-container">
      <h1>판매자 로그인</h1>
      <br>
      <div v-if="!user">
        <!-- if user is not logged in -->
        <form @submit.prevent="login" class="form">
          <div class="form-group">

            <input type="email" id="email" v-model="email" class="form-input" required placeholder="이메일">
          </div>
          <div class="form-group">

            <input type="password" id="password" v-model="password" class="form-input" required placeholder="비밀번호">
          </div>
          <br>
          <button type="submit" class="form-button">로그인</button>
          <div class="link-group">
            <span class="link-item"><router-link to="/SellerSignup">회원가입</router-link></span>
            <span class="link-item"><router-link to="/Findpassword">비밀번호찾기</router-link></span>
          </div>
        </form>
      </div>
      <div v-else class="logged-in-container">
        <!-- if the user is logged in -->
        <div class="greeting">
          <p>
            <span>안녕하세요, </span>
            <span class="username">{{ user.email }}</span>
            <span>님!</span>
            <br><br>
          </p>
        </div>
        <button class="main-button" @click="goToSellerInfo">내 상점</button>
        <button class="main-button" @click="goToStoreRegistration">상점 등록</button>
        <button class="main-button" @click="goToProductRegistration">상품 등록</button>
        <button class="button-row" color="red" @click="logout">
          <v-icon left>mdi-logout</v-icon>
            logout
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default {
  name: 'SellerLogin',
  data() {
    return {
      email: "",
      password: "",
      user: null, // 기본값 변경
      errorMessage: null,
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  },
  methods: {
    async login() {
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$store.commit("setUser", userCredential.user);
        alert('로그인에 성공하였습니다.');
        this.$router.push(`/SellerLogin`); // 수정
      } catch (error) {
        console.log(error.code, error.message);
        this.errorMessage = "Please sign up to use various services!";
        alert('Passwords do not match');
      }
    },
    async logout() {
      const auth = getAuth();
      try {
        await auth.signOut();
        alert('로그아웃이 완료되었습니다.');
      } catch (error) {
        console.error(error);
      }
    },
    goToSellerInfo() {
    const path = `/SellerInfo/${this.user.uid}`;
    this.$router.push(path);
    },
    goToStoreRegistration() {
    const path = `/StoreRegistration`;
    this.$router.push(path);
    },
    goToProductRegistration() {
    const path = `/ProductRegistration/${this.user.uid}`;
    this.$router.push(path);
    }

  },
};
</script>

<style>
.login-container {
  margin-bottom: -200px;
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  text-align: center;
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

.logged-in-container {
  margin-top: 20px;
}

.greeting {
  font-size: 18px;
  margin-bottom: 10px;
}

.button-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

.v-btn {
  margin: 5px;
}

.main-button {
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4285f4;
  color: #ffffff;
  font-size: 16px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 20px;
}

.button-row {
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: #FA5858;
  color: #ffffff;
  font-size: 16px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.link-group {
  justify-content: center;
  align-items: center;
  display: flex;
  padding-top: 25px;

}

.link-item {
  font-size: 12px;
  width: 100%;
  margin-left: 15px;
  margin-right: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

a {
  text-decoration: none;
  color: black;
}

</style>

