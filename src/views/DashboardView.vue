<template>
  <default-layout>
    <div class="space-y-6">
      <!-- Welcome Message -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold text-gray-900">Welcome back, {{ user?.name || 'User' }}! 👋</h2>
        <p class="mt-2 text-gray-600">Here's your energy insights for today. We've noticed some interesting trends in your usage patterns.</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="metric in metrics" :key="metric.title" 
          class="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform duration-200">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ metric.title }}</h3>
              <p class="mt-2 text-3xl font-semibold text-gray-900">{{ metric.value }}</p>
            </div>
            <span class="text-2xl" v-html="metric.icon"></span>
          </div>
          <p :class="['mt-2 text-sm', metric.trend.color]">
            {{ metric.trend.direction }} {{ metric.trend.value }} {{ metric.trend.comparison }}
          </p>
          <p class="mt-1 text-xs text-gray-500">{{ metric.description }}</p>
        </div>
      </div>

      <!-- Usage Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Energy Usage Trends</h3>
            <p class="text-sm text-gray-500">Track your consumption patterns over time</p>
          </div>
          <select v-model="timeRange" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 p-2.5">
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
        <div class="h-64">
          <line-chart :chart-data="chartData" :options="chartOptions" />
        </div>
        <div class="mt-4 text-sm text-gray-500">
          <p>💡 Tip: Your usage peaks between 6-8 PM. Consider shifting some activities to off-peak hours for better rates.</p>
        </div>
      </div>

      <!-- Market Comparison -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Market Rate Analysis</h3>
            <p class="text-sm text-gray-500">See how your rates compare to the market</p>
          </div>
          <button class="text-green-600 hover:text-green-700 text-sm font-medium">View Details →</button>
        </div>
        <div class="space-y-4">
          <div v-for="rate in marketRates" :key="rate.label" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span class="text-sm font-medium text-gray-900">{{ rate.label }}</span>
              <p class="text-xs text-gray-500">{{ rate.description }}</p>
            </div>
            <span :class="['text-sm font-medium', rate.valueClass]">{{ rate.value }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Sustainability Goals</h3>
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-green-600 h-2.5 rounded-full" style="width: 45%"></div>
              </div>
              <span class="ml-4 text-sm font-medium text-gray-500">45%</span>
            </div>
            <p class="text-sm text-gray-600">You're making progress! Reduce your carbon footprint by 20% more to reach your monthly goal.</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Smart Recommendations</h3>
          <ul class="space-y-3">
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <p class="text-sm text-gray-600">Switch to LED bulbs in your living room to save up to 15% on lighting costs.</p>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <p class="text-sm text-gray-600">Your solar panel efficiency could be improved by 10% with a scheduled cleaning.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { Line as LineChart } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const user = authStore.user
const timeRange = ref('day')

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const metrics = ref([
  {
    title: "Today's Usage",
    value: '320 kWh',
    icon: '⚡',
    description: 'Total energy consumed since midnight',
    trend: {
      direction: '↓',
      value: '12%',
      comparison: 'from yesterday',
      color: 'text-green-600'
    }
  },
  {
    title: 'Current Cost',
    value: '$64.00',
    icon: '💰',
    description: 'Projected cost based on current usage',
    trend: {
      direction: '↑',
      value: '8%',
      comparison: 'from market average',
      color: 'text-red-600'
    }
  },
  {
    title: 'Carbon Footprint',
    value: '156 kg',
    icon: '🌱',
    description: 'Your environmental impact today',
    trend: {
      direction: '↓',
      value: '5%',
      comparison: 'better than last week',
      color: 'text-green-600'
    }
  }
])

const marketRates = ref([
  { 
    label: 'Your Rate', 
    value: '$0.20/kWh', 
    valueClass: 'text-gray-900',
    description: 'Current rate based on your plan'
  },
  { 
    label: 'Market Average', 
    value: '$0.185/kWh', 
    valueClass: 'text-gray-900',
    description: 'Average rate in your area'
  },
  { 
    label: 'Best Available', 
    value: '$0.175/kWh', 
    valueClass: 'text-green-600',
    description: 'Switch to save up to $45/month'
  }
])

// Chart configuration
const chartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Energy Usage (kWh)',
    data: [320, 280, 300, 340, 360, 400],
    borderColor: '#10B981',
    tension: 0.4
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

onMounted(async () => {
  // Fetch real data from your API
  try {
    // const response = await fetch('your-api-endpoint')
    // const data = await response.json()
    // Update metrics, chart data, and market rates with real data
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
})
</script>