import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/EnergyUsageView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/tos',
      name: 'tos',
      component: () => import('../views/TermsOfServiceView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/privacy-policy',
      name: 'privacy',
      component: () => import('../views/PrivacyPolicyView.vue'),
      meta: { requiresAuth: false }
    }
  ]
})

// Navigation guard
router.beforeEach((to) => {
  // DEVELOPMENT: Authentication check disabled
  return true

  /* PRODUCTION CODE (temporarily disabled)
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth ?? true // Default to requiring auth

  // If route requires auth and user is not authenticated
  if (requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  // If user is authenticated and trying to access login page
  if (authStore.isAuthenticated && to.name === 'login') {
    return { name: 'home' }
  }
  */
})

export default router 
