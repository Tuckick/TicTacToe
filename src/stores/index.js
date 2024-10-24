import { createStore } from 'vuex'

const store = createStore({
  state: {
    userDetails: null,
  },
  mutations: {
    setUserDetails(state, userDetails) {
      state.userDetails = userDetails
    },
  },
  actions: {
    updateUserDetails({ commit }, userDetails) {
      commit('setUserDetails', userDetails)
    },
  },
  getters: {
    getUserDetails: state => state.userDetails,
  },
})

export default store
