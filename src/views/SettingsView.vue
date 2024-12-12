<template>
  <default-layout>
    <div class="space-y-6">
      <!-- Profile Settings -->
      <form @submit.prevent="saveProfile" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Profile Settings</h3>
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              v-model="profile.name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model="profile.email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="your.email@example.com"
            />
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              :disabled="saving"
            >
              {{ saving ? 'Saving...' : 'Save Profile' }}
            </button>
          </div>
        </div>
      </form>

      <!-- Device Settings -->
      <form @submit.prevent="saveDeviceSettings" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Energy Monitor Device</h3>
        <div class="space-y-4">
          <div>
            <label for="device-id" class="block text-sm font-medium text-gray-700">Device ID</label>
            <input
              type="text"
              id="device-id"
              v-model="deviceSettings.deviceId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Enter device ID"
            />
          </div>

          <div>
            <label for="location" class="block text-sm font-medium text-gray-700">
              Installation Location
            </label>
            <input
              type="text"
              id="location"
              v-model="deviceSettings.location"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="e.g., Main Building"
            />
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              :disabled="saving"
            >
              {{ saving ? 'Saving...' : 'Save Device Settings' }}
            </button>
          </div>
        </div>
      </form>

      <!-- Notifications -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div class="space-y-4">
          <div v-for="(preference, key) in notificationPreferences" :key="key">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="preference.enabled"
                class="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span class="ml-2 text-sm text-gray-700">{{ preference.label }}</span>
            </label>
            <p class="mt-1 text-sm text-gray-500 ml-6">{{ preference.description }}</p>
          </div>

          <div class="flex justify-end">
            <button
              @click="saveNotificationPreferences"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              :disabled="saving"
            >
              {{ saving ? 'Saving...' : 'Save Preferences' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { useToast } from '../composables/useToast'

const { showToast } = useToast()
const saving = ref(false)

// Profile state
const profile = ref({
  name: '',
  email: ''
})

// Device settings state
const deviceSettings = ref({
  deviceId: '',
  location: ''
})

// Notification preferences state
const notificationPreferences = ref({
  usageAlerts: {
    enabled: true,
    label: 'Usage Alerts',
    description: 'Receive notifications when your energy usage exceeds normal patterns'
  },
  costAlerts: {
    enabled: true,
    label: 'Cost Alerts',
    description: 'Get notified about significant changes in energy costs'
  },
  weeklyReport: {
    enabled: true,
    label: 'Weekly Report',
    description: 'Receive a weekly summary of your energy consumption and costs'
  },
  marketUpdates: {
    enabled: false,
    label: 'Market Updates',
    description: 'Stay informed about changes in energy market rates'
  }
})

// Save handlers
const saveProfile = async () => {
  try {
    saving.value = true
    // Implement API call to save profile
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API delay
    showToast('Profile updated successfully', 'success')
  } catch (error) {
    console.error('Failed to save profile:', error)
    showToast('Failed to update profile', 'error')
  } finally {
    saving.value = false
  }
}

const saveDeviceSettings = async () => {
  try {
    saving.value = true
    // Implement API call to save device settings
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API delay
    showToast('Device settings updated successfully', 'success')
  } catch (error) {
    console.error('Failed to save device settings:', error)
    showToast('Failed to update device settings', 'error')
  } finally {
    saving.value = false
  }
}

const saveNotificationPreferences = async () => {
  try {
    saving.value = true
    // Implement API call to save notification preferences
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API delay
    showToast('Notification preferences updated successfully', 'success')
  } catch (error) {
    console.error('Failed to save notification preferences:', error)
    showToast('Failed to update notification preferences', 'error')
  } finally {
    saving.value = false
  }
}

// Load initial data
const loadSettings = async () => {
  try {
    // Implement API calls to fetch user settings
    // Update profile, deviceSettings, and notificationPreferences refs with the fetched data
  } catch (error) {
    console.error('Failed to load settings:', error)
    showToast('Failed to load settings', 'error')
  }
}

onMounted(loadSettings)
</script>