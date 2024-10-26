import { createStore } from 'vuex'

const store = createStore({
  state: {
    exrpire: null,
    userDetails: null,
    isNotFound: false,
  },
  mutations: {
    setNotFound(state, isNotFound) {
      state.isNotFound = isNotFound
    },
    setUserDetails(state, userDetails) {
      state.userDetails = userDetails
    },
    setExpired(state, timestampt) {
      state.exrpire = timestampt
    },
    clearUserDetails(state) {
      state.userDetails = null
    },
    clearExpire(state) {
      state.exrpire = null
    },
  },
  actions: {
    setNotFound({ commit }, bool) {
      commit('setNotFound', bool)
    },
    updateUserDetails({ commit }, userDetails) {
      commit('setUserDetails', userDetails)
    },
    updateExpired({ commit }, timestampt) {
      commit('setExpired', timestampt)
    },
    clearUserDetails({ commit }) {
      commit('clearUserDetails')
      commit('clearExpire')
    },
  },
  getters: {
    getUserDetails: state => state.userDetails,
    getTokenExpire: state => state.exrpire,
    getNotFoundState: state => state.isNotFound,
  },
})

export default store
