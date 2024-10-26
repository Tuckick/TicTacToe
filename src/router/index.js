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

router.beforeEach((to, from, next) => {
  if (to.matched[0].path == '/:catchAll(.*)') {
    store.dispatch('setNotFound', true)
    next()
  } else {
    store.dispatch('setNotFound', false)

    if (to.matched.some(record => record.meta.requiresAuth)) {
      const userDetails = store.getters.getUserDetails
      if (!userDetails) {
        next({ name: 'login' })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default router
