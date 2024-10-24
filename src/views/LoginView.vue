<script setup>
import { ref } from 'vue'
import { googleSdkLoaded } from 'vue3-google-login'
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const userDetails = ref(null)
const router = useRouter()

const login = () => {
  googleSdkLoaded(google => {
    google.accounts.oauth2
      .initCodeClient({
        client_id:
          '26120683714-j7g6jepegd5pn7m0po1d7le0m7nfr6b1.apps.googleusercontent.com',
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
    console.log(accessToken)

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
      // Set the userDetails data property to the userResponse object
      userDetails.value = userResponse.data
      store.dispatch('updateUserDetails', userResponse.data)
      router.push('/')
    } else {
      // Handle the case where userResponse or userResponse.data is undefined
      console.error('Failed to fetch user details.')
    }
    // {
    // "sub": "100217413129864956555",
    // "name": "nuttaya Pensrisirikul",
    // "given_name": "nuttaya",
    // "family_name": "Pensrisirikul",
    // "picture": "https://lh3.googleusercontent.com/a/ACg8ocL7SO1oV855STQ0DVlebBsfD3Gn_FXaHOqiITmTQf8wRPqT2XE=s96-c",
    // "email": "tuk.pensrisirikul@gmail.com",
    // "email_verified": true
    // }
  } catch (error) {
    console.error('Token exchange failed:', error.response.data)
  }
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