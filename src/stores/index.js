import { createStore } from 'vuex'

const store = createStore({
  state: {
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
    clearUserDetails(state) {
      state.userDetails = null
    },
  },
  actions: {
    setNotFound({ commit }, bool) {
      commit('setNotFound', bool)
    },
    updateUserDetails({ commit }, userDetails) {
      commit('setUserDetails', userDetails)
    },
    clearUserDetails({ commit }) {
      commit('clearUserDetails')
    },
  },
  getters: {
    getUserDetails: state => state.userDetails,
    getNotFoundState: state => state.isNotFound,
  },
})

export default store
