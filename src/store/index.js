import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      user: null,
      sellerStore : null
    }
  },
  mutations: {
    setUser(state, user, storeData) {
      state.user = user
      state.sellerStore = storeData
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit('setUser', user)
    }
  },
  getters: {
    getUser: state => state.user
  }
})

export default store
