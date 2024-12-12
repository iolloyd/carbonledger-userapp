<template>
  <div class="min-h-screen bg-gray-100">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Check authentication status on app mount
  authStore.checkAuth()
})
</script>