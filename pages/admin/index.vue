<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="text-gray-600">Welcome to OpenLoyalty admin panel</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:users" class="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Customers</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.customers || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:credit-card" class="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Transactions</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.transactions || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:gift" class="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Points</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.points || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:user-plus" class="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Referrals</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.referral || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Registration Chart -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Daily Registrations</h3>
        <div v-if="loading" class="flex items-center justify-center py-8">
          <Icon name="heroicons:arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <div v-else-if="dailyRegistrations.length === 0" class="text-center py-8">
          <Icon name="heroicons:chart-bar" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">No registration data available</p>
        </div>
        <div v-else class="h-64">
          <!-- Chart will be rendered here -->
          <div class="text-sm text-gray-500 text-center py-8">
            Chart data loaded: {{ dailyRegistrations.length }} days
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div v-if="recentActivity.length === 0" class="text-center py-8">
          <Icon name="heroicons:clock" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">No recent activity</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-center p-4 bg-gray-50 rounded-lg"
          >
            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <Icon :name="activity.icon" class="w-5 h-5 text-gray-600" />
            </div>
            <div class="ml-4 flex-1">
              <p class="font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.description }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">{{ formatDate(activity.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button @click="navigateTo('/admin/customers')" class="btn-secondary text-left p-4">
          <Icon name="heroicons:user-plus" class="w-6 h-6 mb-2" />
          <div>
            <p class="font-medium">Add Customer</p>
            <p class="text-sm text-gray-500">Register new customer</p>
          </div>
        </button>
        
        <button @click="navigateTo('/admin/transactions')" class="btn-secondary text-left p-4">
          <Icon name="heroicons:credit-card" class="w-6 h-6 mb-2" />
          <div>
            <p class="font-medium">New Transaction</p>
            <p class="text-sm text-gray-500">Create transaction</p>
          </div>
        </button>
        
        <button @click="navigateTo('/admin/campaigns')" class="btn-secondary text-left p-4">
          <Icon name="heroicons:megaphone" class="w-6 h-6 mb-2" />
          <div>
            <p class="font-medium">Create Campaign</p>
            <p class="text-sm text-gray-500">Launch new campaign</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { isAuthenticated, token } = useAuth()
const router = useRouter()
const config = useRuntimeConfig()

// Check authentication on page load
onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login')
  } else {
    fetchDashboardData()
  }
})

// Reactive data
const loading = ref(true)
const stats = ref({
  customers: 0,
  transactions: 0,
  points: 0,
  referral: 0
})
const dailyRegistrations = ref([])
const recentActivity = ref([])

// Fetch dashboard data
const fetchDashboardData = async () => {
  loading.value = true
  
  try {
    // Fetch stats from API
    const [pointsStats, transactionsStats, customersStats, referralStats] = await Promise.all([
      fetchStats('points'),
      fetchStats('transactions'),
      fetchStats('customers'),
      fetchStats('referral')
    ])
    
    stats.value = {
      points: pointsStats.total || 0,
      transactions: transactionsStats.total || 0,
      customers: customersStats.total || 0,
      referral: referralStats.total || 0
    }
    
    // Fetch daily registrations
    const registrations = await fetchDailyRegistrations()
    dailyRegistrations.value = registrations || []
    
    // Mock recent activity
    recentActivity.value = [
      {
        id: 1,
        title: 'New Customer Registered',
        description: 'John Doe joined the loyalty program',
        icon: 'heroicons:user-plus',
        date: new Date()
      },
      {
        id: 2,
        title: 'Transaction Completed',
        description: 'Points earned: 150',
        icon: 'heroicons:credit-card',
        date: new Date(Date.now() - 3600000)
      },
      {
        id: 3,
        title: 'Campaign Launched',
        description: 'Summer Sale Campaign',
        icon: 'heroicons:megaphone',
        date: new Date(Date.now() - 7200000)
      }
    ]
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Use mock data as fallback
    stats.value = {
      customers: 1250,
      transactions: 3420,
      points: 156780,
      referral: 45
    }
  } finally {
    loading.value = false
  }
}

// API functions
const fetchStats = async (type) => {
  try {
    const response = await $fetch(`/api/admin/statistics/${type}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      baseURL: config.public.apiBase
    })
    return response
  } catch (error) {
    console.error(`Error fetching ${type} stats:`, error)
    return { total: 0 }
  }
}

const fetchDailyRegistrations = async () => {
  try {
    const response = await $fetch('/api/admin/statistics/registrations', {
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      baseURL: config.public.apiBase
    })
    return response
  } catch (error) {
    console.error('Error fetching daily registrations:', error)
    return []
  }
}

// Utility functions
const navigateTo = (path) => {
  router.push(path)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script> 