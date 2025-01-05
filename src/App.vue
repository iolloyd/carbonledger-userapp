<template>
  <RouterView v-if="isReady" />
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { onMounted, ref } from 'vue'

const authStore = useAuthStore()
const isReady = ref(false)

onMounted(async () => {
  await authStore.initAuth()
  isReady.value = true
})
</script>
