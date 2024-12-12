<template>
  <div class="flex h-screen">
    <!-- Sidebar Navigation -->
    <aside class="w-64 bg-white shadow-lg">
      <div class="flex flex-col h-full">
        <div class="p-4">
          <h1 class="text-xl font-bold text-green-700">CarbonLedger</h1>
        </div>
        
        <nav class="flex-1 p-4">
          <ul class="space-y-2">
            <li v-for="item in navigationItems" :key="item.path">
              <router-link
                :to="item.path"
                class="flex items-center p-2 text-gray-700 hover:bg-green-50 rounded-lg"
                :class="{ 'bg-green-50': currentRoute.path === item.path }"
              >
                <component :is="item.icon" class="w-5 h-5 mr-3" />
                <span>{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
        
        <div class="p-4 border-t">
          <button 
            @click.prevent="handleLogout"
            class="flex items-center w-full p-2 text-gray-700 hover:bg-red-50 rounded-lg"
            :disabled="isLoggingOut"
          >
            <LogOut class="w-5 h-5 mr-3" />
            <span>{{ isLoggingOut ? 'Signing out...' : 'Sign Out' }}</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <header class="bg-white shadow">
        <div class="px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">{{ currentPageTitle }}</h2>
          <div class="text-sm text-gray-600">
            Welcome, {{ authStore.user?.name || 'User' }}
          </div>
        </div>
      </header>

      <main class="p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Home, BarChart2, Settings, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const currentRoute = useRoute()
const authStore = useAuthStore()
const isLoggingOut = ref(false)

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Energy Usage', path: '/energy-usage', icon: BarChart2 },
  { name: 'Settings', path: '/settings', icon: Settings }
]

const currentPageTitle = computed(() => {
  const currentPath = currentRoute.path
  return navigationItems.find(item => item.path === currentPath)?.name || 'Dashboard'
})

const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    console.log('Starting logout process...')
    
    const success = await authStore.logout()
    console.log('Logout result:', success)
    
    if (success) {
      console.log('Navigating to login page...')
      window.location.href = '/login'
    } else {
      console.error('Logout failed')
    }
  } catch (error) {
    console.error('Error during logout:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>