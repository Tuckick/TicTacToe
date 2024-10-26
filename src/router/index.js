import { createRouter, createWebHistory } from 'vue-router'
import store from '../stores'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/GameView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/manual',
      name: 'manual',
      component: () => import('../views/ManualView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/ErrorView.vue'),
    },
    {
      path: '/:catchAll(.*)',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

function checkTokenExpire(exrpire) {
  if (exrpire) {
    const now = Math.floor(Date.now() / 1000)

    return exrpire < now
  } else {
    return true
  }
}

router.beforeEach((to, from, next) => {
  if (to.matched[0].path == '/:catchAll(.*)') {
    store.dispatch('setNotFound', true)
    next()
  } else {
    store.dispatch('setNotFound', false)
    if (to.matched.some(record => record.meta.requiresAuth)) {
      const userDetails = store.getters.getUserDetails
      const tokenExpire = store.getters.getTokenExpire

      if (!userDetails) {
        next({ name: 'login' })
      } else {
        if (checkTokenExpire(tokenExpire)) {
          alert('Your Session is Expired')
          store.dispatch('clearUserDetails')
          next({ name: 'login' })
        } else {
          next()
        }
        next()
      }
    } else {
      next()
    }
  }
})

export default router
