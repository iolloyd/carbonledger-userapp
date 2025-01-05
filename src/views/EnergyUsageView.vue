<template>
  <default-layout>
    <div class="space-y-6">
      <!-- Region Header -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Energy Usage Dashboard</h2>
            <div class="mt-2 text-sm text-gray-600">
              <p class="flex items-center">
                <span class="font-medium mr-2">Customer:</span> 
                {{ authStore.user?.name }}
              </p>
              <p class="flex items-center mt-1">
                <span class="font-medium mr-2">Building Address:</span>
                {{ authStore.user?.address }}
              </p>
              <p class="flex items-center mt-1">
                <span class="font-medium mr-2">Region:</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ authStore.user?.region || 'Not Set' }}
                </span>
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Last Updated</p>
            <p class="text-sm font-medium text-gray-900">{{ new Date().toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500">Carbon Intensity</h3>
          <div class="mt-2 flex items-baseline justify-between">
            <div>
              <p class="text-2xl font-semibold text-gray-900">
                {{ customerData.carbon_intensity }}
              </p>
              <p class="text-sm text-gray-500">Your Building</p>
            </div>
            <div class="text-right">
              <p class="text-xl font-medium text-gray-700">
                {{ regionData.carbon_intensity }}
              </p>
              <p class="text-sm text-gray-500">{{ authStore.user?.region }} Average</p>
            </div>
          </div>
          <p class="mt-1 text-sm" :class="customerData.carbon_intensity <= regionData.carbon_intensity ? 'text-green-600' : 'text-red-600'">
            {{ customerData.carbon_intensity <= regionData.carbon_intensity 
              ? `${Math.round((regionData.carbon_intensity - customerData.carbon_intensity) / regionData.carbon_intensity * 100)}% below ${authStore.user?.region} average`
              : `${Math.round((customerData.carbon_intensity - regionData.carbon_intensity) / regionData.carbon_intensity * 100)}% above ${authStore.user?.region} average`
            }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500">Renewable Energy</h3>
          <div class="mt-2 flex items-baseline justify-between">
            <div>
              <p class="text-2xl font-semibold text-gray-900">
                {{ customerData.renewable_percentage }}%
              </p>
              <p class="text-sm text-gray-500">Your Building</p>
            </div>
            <div class="text-right">
              <p class="text-xl font-medium text-gray-700">
                {{ regionData.renewable_percentage }}%
              </p>
              <p class="text-sm text-gray-500">{{ authStore.user?.region }} Average</p>
            </div>
          </div>
          <p class="mt-1 text-sm" :class="customerData.renewable_percentage >= regionData.renewable_percentage ? 'text-green-600' : 'text-red-600'">
            {{ customerData.renewable_percentage >= regionData.renewable_percentage 
              ? `${Math.round((customerData.renewable_percentage - regionData.renewable_percentage) / regionData.renewable_percentage * 100)}% above ${authStore.user?.region} average`
              : `${Math.round((regionData.renewable_percentage - customerData.renewable_percentage) / regionData.renewable_percentage * 100)}% below ${authStore.user?.region} average`
            }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500">Energy Demand</h3>
          <div class="mt-2 flex items-baseline justify-between">
            <div>
              <p class="text-2xl font-semibold text-gray-900">
                {{ customerData.demand_actual }}
              </p>
              <p class="text-sm text-gray-500">Your Building</p>
            </div>
            <div class="text-right">
              <p class="text-xl font-medium text-gray-700">
                {{ regionData.demand_actual }}
              </p>
              <p class="text-sm text-gray-500">{{ authStore.user?.region }} Average</p>
            </div>
          </div>
          <p class="mt-1 text-sm" :class="customerData.demand_actual <= regionData.demand_actual ? 'text-green-600' : 'text-red-600'">
            {{ customerData.demand_actual <= regionData.demand_actual 
              ? `${Math.round((regionData.demand_actual - customerData.demand_actual) / regionData.demand_actual * 100)}% below ${authStore.user?.region} average`
              : `${Math.round((customerData.demand_actual - regionData.demand_actual) / regionData.demand_actual * 100)}% above ${authStore.user?.region} average`
            }}
          </p>
        </div>
      </div>

      <!-- Time Range Selector -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex space-x-4">
          <select 
            v-model="timeframe" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 p-2.5"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>

      <!-- Usage Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Energy Usage Comparison</h3>
        </div>
        <div v-if="loading" class="flex justify-center items-center h-96">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        <div v-else-if="error" class="flex justify-center items-center h-96 text-red-600">
          {{ error }}
        </div>
        <div v-else class="h-[600px]">
          <Line 
            :data="timeSeriesData" 
            :options="timeSeriesOptions" 
            class="h-full w-full"
          />
        </div>
        <div class="mt-4 space-y-2 text-sm text-gray-600">
          <p>
            <span class="font-medium">📊 Your Current Usage:</span> 
            {{ customerData.carbon_intensity }} gCO2/kWh carbon intensity, 
            {{ customerData.renewable_percentage }}% renewable energy
          </p>
          <p>
            <span class="font-medium">🏘️ Regional Average:</span> 
            {{ regionData.carbon_intensity }} gCO2/kWh carbon intensity, 
            {{ regionData.renewable_percentage }}% renewable energy
          </p>
          <p>💡 Tip: Try to schedule high-energy activities during times of high renewable energy percentage.</p>
        </div>
      </div>

      <!-- Historical Trends -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Historical Trends</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500">Weekly Average</h4>
            <p class="mt-2 text-2xl font-semibold text-gray-900">
              {{ historicalData.weeklyAverage }} <span class="text-sm text-gray-500">gCO2/kWh</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Solar Panel Analysis -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Solar Panel Analysis</h3>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            ☀️ Recommendation
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Savings Estimates -->
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-700">Potential Annual Savings</h4>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Financial</p>
                  <p class="text-2xl font-semibold text-gray-900">£{{ solarData.annualSavings.toLocaleString() }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Carbon Reduction</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ solarData.carbonReduction }}%</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-700">Installation Details</h4>
              <div class="mt-2">
                <div class="flex justify-between items-center mb-2">
                  <p class="text-sm text-gray-500">Recommended System Size</p>
                  <p class="text-sm font-medium text-gray-900">{{ solarData.systemSize }} kW</p>
                </div>
                <div class="flex justify-between items-center mb-2">
                  <p class="text-sm text-gray-500">Estimated Installation Cost</p>
                  <p class="text-sm font-medium text-gray-900">£{{ solarData.installationCost.toLocaleString() }}</p>
                </div>
                <div class="flex justify-between items-center">
                  <p class="text-sm text-gray-500">Payback Period</p>
                  <p class="text-sm font-medium text-gray-900">{{ solarData.paybackPeriod }} years</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ROI Graph -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-gray-700">Financial Impact Over Time</h4>
            <div class="space-y-3">
              <div class="relative h-[80px] bg-gray-50 rounded-lg p-4 flex items-center">
                <div class="absolute bottom-0 left-0 w-full h-full bg-green-50 rounded-lg"></div>
                <div class="absolute bottom-0 left-0" :style="`width: ${(solarData.fiveYearSavings / solarData.lifetimeSavings) * 100}%; height: 100%; bg-green-100 rounded-lg`"></div>
                <div class="relative flex justify-between items-center w-full">
                  <div>
                    <p class="text-sm font-medium text-gray-900">5 Year Impact</p>
                    <p class="text-lg font-bold text-green-600">£{{ solarData.fiveYearSavings.toLocaleString() }}</p>
                  </div>
                  <p class="text-sm text-gray-500">ROI: {{ Math.round((solarData.fiveYearSavings / solarData.installationCost - 1) * 100) }}%</p>
                </div>
              </div>

              <div class="relative h-[80px] bg-gray-50 rounded-lg p-4 flex items-center">
                <div class="absolute bottom-0 left-0 w-full h-full bg-green-50 rounded-lg"></div>
                <div class="absolute bottom-0 left-0" :style="`width: ${(solarData.tenYearSavings / solarData.lifetimeSavings) * 100}%; height: 100%; bg-green-100 rounded-lg`"></div>
                <div class="relative flex justify-between items-center w-full">
                  <div>
                    <p class="text-sm font-medium text-gray-900">10 Year Impact</p>
                    <p class="text-lg font-bold text-green-600">£{{ solarData.tenYearSavings.toLocaleString() }}</p>
                  </div>
                  <p class="text-sm text-gray-500">ROI: {{ Math.round((solarData.tenYearSavings / solarData.installationCost - 1) * 100) }}%</p>
                </div>
              </div>

              <div class="relative h-[80px] bg-gray-50 rounded-lg p-4 flex items-center">
                <div class="absolute bottom-0 left-0 w-full h-full bg-green-50 rounded-lg"></div>
                <div class="absolute bottom-0 left-0" :style="`width: 100%; height: 100%; bg-green-100 rounded-lg`"></div>
                <div class="relative flex justify-between items-center w-full">
                  <div>
                    <p class="text-sm font-medium text-gray-900">25 Year Impact</p>
                    <p class="text-lg font-bold text-green-600">£{{ solarData.lifetimeSavings.toLocaleString() }}</p>
                  </div>
                  <p class="text-sm text-gray-500">ROI: {{ Math.round((solarData.lifetimeSavings / solarData.installationCost - 1) * 100) }}%</p>
                </div>
              </div>
            </div>
            <p class="text-sm text-gray-500">
              Based on {{ authStore.user?.region }} solar irradiance data and current electricity rates
            </p>
          </div>
        </div>

        <div class="mt-6 space-y-3">
          <h4 class="text-sm font-medium text-gray-700">Key Benefits</h4>
          <ul class="space-y-2">
            <li class="flex items-start">
              <span class="flex-shrink-0 h-5 w-5 text-green-500">✓</span>
              <span class="ml-2 text-sm text-gray-600">
                Reduce carbon emissions by {{ solarData.carbonReduction }}% based on your current usage
              </span>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 h-5 w-5 text-green-500">✓</span>
              <span class="ml-2 text-sm text-gray-600">
                Protection against rising energy costs with fixed solar generation
              </span>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 h-5 w-5 text-green-500">✓</span>
              <span class="ml-2 text-sm text-gray-600">
                Smart Export Guarantee (SEG) payments for excess energy
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const authStore = useAuthStore()
const timeframe = ref('day')
const loading = ref(false)
const error = ref(null)

const customerData = ref({
  carbon_intensity: 165,
  renewable_percentage: 52,
  demand_actual: 780
})

const regionData = ref({
  carbon_intensity: 181,
  renewable_percentage: 48,
  demand_actual: 850
})

const historicalData = ref({
  weeklyAverage: 175
})

// Solar panel analysis data
const solarData = ref({
  annualSavings: 4800,  // Based on North West commercial rates and typical generation
  carbonReduction: 35,  // Percentage reduction in carbon emissions
  systemSize: 50,      // Recommended system size in kW
  installationCost: 45000,  // Estimated installation cost
  paybackPeriod: 9.4,  // Years until investment is recovered
  fiveYearSavings: 24000,  // 5-year savings projection
  tenYearSavings: 48000,  // 10-year savings projection
  lifetimeSavings: 120000  // 25-year savings projection
})

async function fetchRegionData() {
  loading.value = true
  error.value = null
  
  try {
    // In development mode, generate mock data based on timeframe
    const dataPoints = timeframe.value === 'day' ? 24 : 
                      timeframe.value === 'week' ? 7 : 30
    
    // Generate North West regional average data
    // Base values adjusted for North West characteristics:
    // - Lower carbon intensity due to nuclear power stations
    // - Higher renewable percentage due to offshore wind
    // - More variable due to weather patterns
    const regionalMockData = Array.from({ length: dataPoints }, (_, i) => {
      const baseIntensity = 181  // North West average
      const timeOfDay = (i % 24) / 24  // 0-1 representing time of day
      
      // More variation during daytime (0.25-0.75)
      const dayFactor = timeOfDay > 0.25 && timeOfDay < 0.75 ? 1.2 : 0.8
      
      // Add seasonal variation for week/month views
      const seasonalFactor = timeframe.value !== 'day' 
        ? Math.sin(i / dataPoints * Math.PI) * 15 
        : 0
      
      const variation = Math.sin(i / (dataPoints / 2) * Math.PI) * 25 * dayFactor
      return Math.round(baseIntensity + variation + seasonalFactor + (Math.random() * 15 - 7.5))
    })

    // Generate customer data (more efficient than regional average due to modern building systems)
    const customerMockData = regionalMockData.map(value => 
      Math.round(value * (0.85 + Math.random() * 0.1)) // 5-15% better than regional
    )

    const labels = Array.from({ length: dataPoints }, (_, i) => {
      if (timeframe.value === 'day') {
        return `${String(i).padStart(2, '0')}:00`
      } else if (timeframe.value === 'week') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return days[i % 7]
      } else {
        return `Day ${i + 1}`
      }
    })

    timeSeriesData.value = {
      labels,
      datasets: [
        {
          label: 'Your Building',
          data: customerMockData,
          borderColor: '#10B981',
          backgroundColor: '#10B98120',
          tension: 0.4,
          fill: true
        },
        {
          label: 'North West Average',
          data: regionalMockData,
          borderColor: '#6B7280',
          backgroundColor: '#6B728020',
          tension: 0.4,
          fill: true
        }
      ]
    }

    // Update current values based on most recent data point
    customerData.value = {
      carbon_intensity: customerMockData[customerMockData.length - 1],
      renewable_percentage: Math.round(52 + (Math.random() * 8 - 4)),
      demand_actual: Math.round(780 + (Math.random() * 80 - 40))
    }

    regionData.value = {
      carbon_intensity: regionalMockData[regionalMockData.length - 1],
      renewable_percentage: Math.round(48 + (Math.random() * 8 - 4)),
      demand_actual: Math.round(850 + (Math.random() * 100 - 50))
    }

    // Update historical average
    historicalData.value = {
      weeklyAverage: Math.round(customerMockData.reduce((a, b) => a + b, 0) / customerMockData.length)
    }

    /* PRODUCTION CODE (temporarily disabled)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/energy-usage/${authStore.user?.region}/${timeframe.value}`)
    if (!response.ok) throw new Error('Failed to fetch region data')
    const data = await response.json()
    
    timeSeriesData.value = data.timeSeriesData
    customerData.value = data.currentData
    regionData.value = data.regionData
    historicalData.value = data.historicalData
    */
  } catch (err) {
    console.error('Error fetching region data:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Watch for timeframe changes
watch(timeframe, () => {
  fetchRegionData()
})

// Initial data fetch
onMounted(async () => {
  await authStore.initAuth()
  fetchRegionData()
})

const timeSeriesData = ref({
  labels: [],
  datasets: [{
    label: 'Carbon Intensity',
    data: [],
    borderColor: '#10B981',
    tension: 0.4
  }]
})

const timeSeriesOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Carbon Intensity (gCO2/kWh)'
      }
    }
  }
}

function getPerformanceText(value, type) {
  if (type === 'carbon') {
    return value < 150 ? 'Excellent low carbon usage' : 
           value < 200 ? 'Average carbon usage' : 'Higher than average carbon usage'
  }
  return value > 50 ? 'Great renewable usage' : 
         value > 30 ? 'Average renewable usage' : 'Below average renewable usage'
}

// Calculate solar savings based on usage and region
function calculateSolarSavings() {
  // North West specific factors
  const nwSolarIrradiance = 925  // kWh/m2/year for North West
  const commercialRate = 0.24    // £/kWh for commercial properties in NW
  const systemEfficiency = 0.85  // Typical system efficiency
  const annualDegradation = 0.007 // Panel efficiency loss per year (0.7%)
  
  // Calculate first year generation
  const firstYearGeneration = solarData.value.systemSize * nwSolarIrradiance * systemEfficiency
  const firstYearSavings = firstYearGeneration * commercialRate

  // Calculate cumulative savings for different periods
  function calculateCumulativeSavings(years) {
    let total = 0
    for (let year = 0; year < years; year++) {
      // Apply degradation factor for each year
      const yearlyGeneration = firstYearGeneration * Math.pow(1 - annualDegradation, year)
      total += yearlyGeneration * commercialRate
    }
    return Math.round(total)
  }
  
  solarData.value = {
    ...solarData.value,
    annualSavings: Math.round(firstYearSavings),
    fiveYearSavings: calculateCumulativeSavings(5),
    tenYearSavings: calculateCumulativeSavings(10),
    lifetimeSavings: calculateCumulativeSavings(25),
    paybackPeriod: Number((solarData.value.installationCost / firstYearSavings).toFixed(1))
  }
}

// Update solar calculations when component mounts
onMounted(() => {
  calculateSolarSavings()
})
</script>
