<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const userDetails = computed(() => store.getters.getUserDetails)
const isNotFound = computed(() => store.getters.getNotFoundState)
const name = computed(() => userDetails.value?.name || 'Guest')
const title = computed(() =>
  userDetails.value
    ? `Enjoy your stay! We hope you have a great time exploring our website.`
    : `Enjoy your stay! Please signing for get fun.`
)
</script>

<template>
  <header v-if="!isNotFound">
    <img
      alt="Tic Tag Toe logo"
      class="logo"
      src="@/assets/images/logos/logo.png"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld :name="name" :title="title" />

      <nav v-if="userDetails">
        <RouterLink to="/">Play Game</RouterLink>
        <RouterLink to="/manual">Manual</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
