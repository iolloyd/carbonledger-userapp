import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  email: string
  name: string
  picture?: string
  region: string
  address: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>({
    id: 'dev-user',
    email: 'dev@example.com',
    name: 'Development User',
    region: 'North West',
    address: '123 Manchester Business Park, Manchester, M1 1AB'
  })
  const isAuthenticated = ref(true) // Always authenticated in development

  /* PRODUCTION CODE (temporarily disabled)
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  */

  async function requestEmailCode(email: string) {
    // Development mode: skip API call
    return true

    /* PRODUCTION CODE (temporarily disabled)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/email/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send verification code')
    }
    */
  }

  async function verifyEmailCode(email: string, code: string) {
    // Development mode: skip API call
    return true

    /* PRODUCTION CODE (temporarily disabled)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/email/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Invalid verification code')
    }

    const data = await response.json()
    await setToken(data.token)
    */
  }

  async function setToken(token: string) {
    // Development mode: skip API call
    return true

    /* PRODUCTION CODE (temporarily disabled)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Invalid token')
      }

      const data = await response.json()
      
      localStorage.setItem('auth_token', token)
      user.value = data.user
      isAuthenticated.value = true
    } catch (error) {
      localStorage.removeItem('auth_token')
      user.value = null
      isAuthenticated.value = false
      throw error
    }
    */
  }

  async function updateProfile(profileData: Partial<User>) {
    // Development mode: update local state
    if (user.value) {
      user.value = { ...user.value, ...profileData }
      return user.value
    }
    throw new Error('User not authenticated')

    /* PRODUCTION CODE (temporarily disabled)
    const token = localStorage.getItem('auth_token')
    if (!token) throw new Error('Not authenticated')

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update profile')
    }

    const data = await response.json()
    user.value = data.user
    return user.value
    */
  }

  function logout() {
    // Development mode: do nothing
    return

    /* PRODUCTION CODE (temporarily disabled)
    localStorage.removeItem('auth_token')
    user.value = null
    isAuthenticated.value = false
    */
  }

  // Initialize auth state
  async function initAuth() {
    // Development mode: always authenticated
    user.value = {
      id: 'dev-user',
      email: 'dev@example.com',
      name: 'Development User',
      region: 'North West',
      address: '123 Manchester Business Park, Manchester, M1 1AB'
    }
    return

    /* PRODUCTION CODE (temporarily disabled)
    const token = localStorage.getItem('auth_token')
    if (!token) {
      logout()
      return
    }

    try {
      await setToken(token)
    } catch (error) {
      console.error('Failed to restore auth state:', error)
      logout()
    }
    */
  }

  return {
    user,
    isAuthenticated,
    requestEmailCode,
    verifyEmailCode,
    setToken,
    logout,
    initAuth,
    updateProfile
  }
})
