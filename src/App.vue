<template>
  <v-app @click="closeMenu">
    <v-app-bar app color="#00000" dense fixed height="80">
  <v-btn icon v-if="isLoggedIn" class="mr-2" @click="logout">
    <v-avatar size="32" :tile="false">
      <img :src="user.photoURL" :alt="user.displayName">
    </v-avatar>
  </v-btn>
  <v-btn icon v-else @click="buttonClick('/')">
    <div class="icon-text">
      <v-icon>mdi-home</v-icon>
      <p>메인</p>
    </div>
  </v-btn>
  <v-btn icon @click="buttonClick('/map')">
    <div class="icon-text">
      <v-icon>mdi-map</v-icon>
      <p>내위치</p>
    </div>
  </v-btn>
  <v-btn icon v-if="!isLoggedIn" @click="buttonClick('/StoreInfo')">
    <div class="icon-text">
      <v-icon>mdi-store</v-icon>
      <p>상점목록</p>
    </div>
  </v-btn>
  <v-btn icon @click="buttonClick('/Search')">
    <div class="icon-text">
      <v-icon>mdi-magnify</v-icon>
      <p>검색</p>
    </div>
  </v-btn>
  <v-btn icon @click="button4Click">
    <div class="icon-text">
      <v-icon>mdi-account-circle</v-icon>
      <p>판매자</p>
    </div>
  </v-btn>
</v-app-bar>
    <v-main>
      <v-content>
        <router-view :isLoggedIn="isLoggedIn" :loginInfo="loginInfo" @login="login" @logout="logout" />
      </v-content>
    </v-main>
  </v-app>
  <FooterView></FooterView>
</template>

<script>
import ProductRegistration from './components/Seller/ProductRegistration.vue';
import FooterView from './components/common/FooterView.vue';

export default {
  components: {
    ProductRegistration,
    FooterView
  },
  data() {  
    return {
      menu: false,
      isLoggedIn: false,
      user: null,
      loginInfo: null
    }
  },
  methods: {
    buttonClick(route) {
      this.$router.push(route);
    },
    button4Click() {
      if (this.isLoggedIn) {
        this.$router.push('/SellerSelect');
      } else {
        this.$router.push('/SellerLogin');
      }
    },
    login(user) {
      this.isLoggedIn = true;
      this.user = user;
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null;
      this.$router.push('/');
    },
    closeMenu() {
      if (this.menu) {
        this.menu = false;
      }
    },
    openSearchDialog() {
      this.dialog = true;
    },
  }
}
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.hide-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.hide-scrollbar::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.title-text {
  white-space: normal;
}

.v-navigation-drawer {
  width: 60px;
  overflow: hidden;
  transition: width 0.3s ease;
}

.v-navigation-drawer .v-list-item {
  justify-content: flex-end;
}

.v-btn {
  margin-left: auto;
}
</style>