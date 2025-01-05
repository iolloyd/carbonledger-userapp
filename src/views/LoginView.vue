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
        <div v-if="!showVerification" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="you@example.com"
                :disabled="loading"
              />
            </div>
          </div>
          <button
            @click="handleEmailSubmit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            :disabled="loading || !isValidEmail"
          >
            {{ loading ? 'Sending...' : 'Continue with Email' }}
          </button>
        </div>

        <div v-else class="space-y-4">
          <div>
            <label for="code" class="block text-sm font-medium text-gray-700">Verification code</label>
            <div class="mt-1">
              <input
                id="code"
                v-model="verificationCode"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter code"
                :disabled="loading"
              />
            </div>
            <p class="mt-2 text-sm text-gray-500">
              Enter the verification code sent to {{ email }}
            </p>
          </div>
          <div class="flex space-x-4">
            <button
              @click="handleVerifyCode"
              class="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              :disabled="loading || !verificationCode"
            >
              {{ loading ? 'Verifying...' : 'Verify' }}
            </button>
            <button
              @click="showVerification = false"
              class="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              :disabled="loading"
            >
              Back
            </button>
          </div>
        </div>

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
          <router-link 
            to="/tos" 
            class="text-green-600 hover:text-green-500"
          >
            Terms of Service
          </router-link>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const email = ref('')
const verificationCode = ref('')
const showVerification = ref(false)

const isValidEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})

const handleEmailSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Request verification code
    await authStore.requestEmailCode(email.value)
    showVerification.value = true
  } catch (err) {
    error.value = 'Failed to send verification code. Please try again.'
    console.error('Email submission error:', err)
  } finally {
    loading.value = false
  }
}

const handleVerifyCode = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Verify code and get token
    await authStore.verifyEmailCode(email.value, verificationCode.value)
    
    // Wait for authentication to be confirmed
    if (authStore.isAuthenticated) {
      // Navigate to home (energy usage view)
      router.push('/')
    } else {
      throw new Error('Authentication failed')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Invalid verification code. Please try again.'
    console.error('Code verification error:', err)
  } finally {
    loading.value = false
  }
}
</script>
