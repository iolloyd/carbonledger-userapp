<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img src="../assets/logo.svg" alt="CarbonLedger" class="h-12 mx-auto" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to CarbonLedger
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to monitor your energy usage and reduce your carbon footprint
        </p>
      </div>
      
      <div class="mt-8 space-y-4">
        <button
          v-for="provider in providers"
          :key="provider.name"
          @click="() => handleLogin(provider.id)"
          class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          :disabled="loading"
        >
          <component :is="provider.icon" class="w-5 h-5 mr-3" />
          Sign in with {{ provider.name }}
        </button>

        <div v-if="error" class="mt-2 text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div v-if="loading" class="flex justify-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
      </div>

      <div class="text-center text-sm text-gray-500">
        <p>By signing in, you agree to our</p>
        <div class="space-x-2">
          <a href="#" class="text-green-600 hover:text-green-500">Terms of Service</a>
          <span>&middot;</span>
          <router-link 
            to="/privacy-policy" 
            class="text-green-600 hover:text-green-500"
          >
            Privacy Policy
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Globe } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')

const providers = [
  { id: 'google', name: 'Google', icon: Globe },
  { id: 'email', name: 'Email', icon: Mail }
]

const handleLogin = async (provider: string) => {
  try {
    loading.value = true
    error.value = ''
    await authStore.login(provider)
  } catch (err) {
    error.value = 'Failed to sign in. Please try again.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

// Handle OAuth callback
onMounted(async () => {
  const searchParams = new URLSearchParams(window.location.search)
  const code = searchParams.get('code')
  
  if (code) {
    try {
      console.log('Received OAuth code, attempting callback...')
      loading.value = true
      error.value = ''
      
      // Log the environment variables being used
      console.log('Environment:', {
        apiUrl: import.meta.env.VITE_API_URL,
        appUrl: import.meta.env.VITE_APP_URL,
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID?.substring(0, 10) + '...'
      })
      
      await authStore.handleGoogleCallback(code)
      console.log('Callback successful, redirecting to dashboard...')
      await router.push('/')
    } catch (err) {
      console.error('Detailed OAuth callback error:', {
        error: err,
        message: err.message,
        code: code.substring(0, 10) + '...',
        searchParams: Object.fromEntries(searchParams.entries())
      })
      // Show a more detailed error message to the user during development
      error.value = import.meta.env.DEV 
        ? `Sign in failed: ${err.message}`
        : 'Failed to complete sign in. Please try again.'
    } finally {
      loading.value = false
    }
  } else {
    console.log('No OAuth code found in URL:', window.location.href)
  }
})
</script>