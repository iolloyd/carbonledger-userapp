import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  email: string
  name: string
  picture?: string
}

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_APP_URL + '/login'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        // Validate token with backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/validate`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          isAuthenticated.value = true
          user.value = data.user
        } else {
          await logout()
        }
      } else {
        isAuthenticated.value = false
        user.value = null
      }
    } catch (error) {
      console.error('Authentication check failed:', error)
      await logout()
    }
  }

  const initializeGoogleLogin = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: 'email profile',
      prompt: 'select_account'
    })

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  const handleGoogleCallback = async (code: string) => {
    try {
      console.log('Sending code to backend for token exchange...')
      
      // Log the request configuration (without sensitive data)
      console.log('Request config:', {
        url: `${import.meta.env.VITE_API_URL}/auth/google/callback`,
        codeLength: code.length,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Exchange code for tokens using backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })

      // First try to get the response as text
      const responseText = await response.text()
      console.log('Raw response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '')
      })

      if (!response.ok) {
        let errorMessage = 'Authentication failed'
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          console.error('Failed to parse error response:', e)
        }
        throw new Error(errorMessage)
      }

      // Try to parse the successful response
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse success response:', e)
        throw new Error('Invalid response from server')
      }

      if (!data.user || !data.token) {
        console.error('Invalid response structure:', data)
        throw new Error('Invalid response structure from server')
      }

      console.log('Successfully processed response')
      user.value = data.user
      isAuthenticated.value = true
      localStorage.setItem('auth_token', data.token)
      
      return true
    } catch (error) {
      console.error('Google callback failed:', {
        error,
        message: error.message,
        apiUrl: import.meta.env.VITE_API_URL
      })
      throw error
    }
  }

  const login = async (provider: string) => {
    try {
      if (provider === 'google') {
        initializeGoogleLogin()
      }
      return true
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      
      if (token) {
        // Logout through backend
        await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }

      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('auth_token')
      localStorage.clear()
      sessionStorage.clear()

      return true
    } catch (error) {
      console.error('Logout failed:', error)
      return false
    }
  }

  // Initialize auth state
  checkAuth()

  return {
    user,
    isAuthenticated,
    checkAuth,
    login,
    logout,
    handleGoogleCallback
  }
})