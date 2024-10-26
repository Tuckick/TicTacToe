<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const gotoLogin = () => {
  store.dispatch('clearUserDetails')
  router.push('/login')
}
</script>

<template>
  <div class="error-container">
    <img src="@/assets/images/error.svg" alt="login error" class="error-img" />
    <h1>Something went wrong</h1>
    <h2>You can not signin with google</h2>
    <button class="try-again-btn" @click="gotoLogin">Back to Login</button>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.error-img {
  width: 50%;
  min-width: 200px;
  max-width: 500px;
}

.try-again-btn {
  width: 100%;
  max-width: 300px;
  height: 40px;
  padding: 0.5rem;
  margin-top: 1rem;
  background-color: hsla(160, 100%, 37%, 1);
  border: 1px solid hsla(160, 100%, 37%, 1);
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 16px;
}
.try-again-btn:hover {
  background-color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 6px;
  color: hsla(160, 100%, 37%, 1);
}
</style>