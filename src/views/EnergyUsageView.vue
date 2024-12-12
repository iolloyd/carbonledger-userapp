<template>
  <default-layout>
    <div class="space-y-6">
      <!-- Time Range Selector -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex space-x-4">
          <button
            v-for="period in timePeriods"
            :key="period"
            @click="setTimeframe(period)"
            :class="[
              'px-4 py-2 rounded-md',
              timeframe === period
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            {{ period }}
          </button>
        </div>
      </div>

      <!-- Usage Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Energy Consumption</h3>
        <div class="h-96">
          <bar-chart :chart-data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Usage Analysis -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Usage Analysis</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Peak Usage Times -->
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">Peak Usage Times</h4>
            <div class="space-y-2">
              <div
                v-for="(period, index) in peakUsagePeriods"
                :key="index"
                class="flex justify-between items-center"
              >
                <span class="text-sm text-gray-600">{{ period.time }}</span>
                <span class="text-sm font-medium text-gray-900">{{ period.usage }} kWh</span>
              </div>
            </div>
          </div>

          <!-- Efficiency Recommendations -->
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">Efficiency Opportunities</h4>
            <ul class="space-y-2">
              <li
                v-for="(recommendation, index) in recommendations"
                :key="index"
                class="text-sm text-gray-600"
              >
                • {{ recommendation }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { Bar as BarChart } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const timeframe = ref('Daily')
const timePeriods = ['Daily', 'Weekly', 'Monthly']

const usageData = ref({
  Daily: [
    { time: '00:00', usage: 120 },
    { time: '04:00', usage: 80 },
    { time: '08:00', usage: 200 },
    { time: '12:00', usage: 280 },
    { time: '16:00', usage: 240 },
    { time: '20:00', usage: 180 }
  ],
  Weekly: [
    { time: 'Mon', usage: 1200 },
    { time: 'Tue', usage: 1400 },
    { time: 'Wed', usage: 1100 },
    { time: 'Thu', usage: 1300 },
    { time: 'Fri', usage: 1500 },
    { time: 'Sat', usage: 900 },
    { time: 'Sun', usage: 800 }
  ],
  Monthly: [
    { time: 'Jan', usage: 32000 },
    { time: 'Feb', usage: 28000 },
    { time: 'Mar', usage: 30000 },
    { time: 'Apr', usage: 34000 },
    { time: 'May', usage: 36000 },
    { time: 'Jun', usage: 40000 }
  ]
})

const chartData = computed(() => ({
  labels: usageData.value[timeframe.value].map(d => d.time),
  datasets: [{
    label: 'Energy Usage (kWh)',
    data: usageData.value[timeframe.value].map(d => d.usage),
    backgroundColor: '#10B981'
  }]
}))

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

const peakUsagePeriods = computed(() => 
  [...usageData.value[timeframe.value]]
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 3)
)

const recommendations = [
  'Reduce peak consumption during 12:00-16:00',
  'Consider time-of-use pricing for better rates',
  'Optimize nighttime base load'
]

const setTimeframe = (period: string) => {
  timeframe.value = period
}

// Fetch initial data
onMounted(async () => {
  try {
    // const response = await fetch('your-api-endpoint')
    // const data = await response.json()
    // Update usageData with real data
  } catch (error) {
    console.error('Failed to fetch usage data:', error)
  }
})
</script>