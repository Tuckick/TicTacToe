<script setup>
import { ref } from 'vue'
import { googleSdkLoaded } from 'vue3-google-login'
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import config from '@/helper/config.json'

const store = useStore()
const userDetails = ref(null)
const router = useRouter()
const login = () => {
  googleSdkLoaded(google => {
    google.accounts.oauth2
      .initCodeClient({
        client_id: config.client_id,
        client_secret: config.client_secret,
        scope: 'email profile openid',
        redirect_uri: 'http://localhost:3000/login',
        callback: response => {
          if (response.code) {
            sendCodeToBackend(response.code)
          }
        },
      })
      .requestCode()
  })
}

const sendCodeToBackend = async code => {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id:
        '26120683714-j7g6jepegd5pn7m0po1d7le0m7nfr6b1.apps.googleusercontent.com',
      client_secret: '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',
      redirect_uri: 'postmessage',
      grant_type: 'authorization_code',
    })

    const accessToken = response.data.access_token
    const expires_in = response.data.expires_in

    // Fetch user details using the access token
    const userResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (userResponse && userResponse.data) {
      userDetails.value = userResponse.data
      store.dispatch('updateUserDetails', userResponse.data)
      store.dispatch('updateExpired', getExpireTimestamp(expires_in))
      router.push('/')
    } else {
      console.error('Failed to fetch user details.')
    }
  } catch (error) {
    console.error('Token exchange failed:', error.response.data)
  }
}
const getExpireTimestamp = milli => {
  const now = Math.floor(Date.now() / 1000)
  const expirationTime = now + milli
  return expirationTime
}
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>
    <button id="google-signin-button" @click="login">
      <img
        src="../assets/images/logos/google.svg"
        alt="logo google"
        class="login-btn-img"
      />
      {{ 'Signin With Google' }}
    </button>
  </div>
</template>
  
<style scoped>
.login-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  align-self: center;
}

h1 {
  text-align: center;
}

.form-group {
  margin: 1rem auto;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  background-color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 16px;
}
.login-btn-img {
  width: 30px;
  height: 30px;
}

button:hover {
  color: hsla(160, 100%, 37%, 1);
}
</style>