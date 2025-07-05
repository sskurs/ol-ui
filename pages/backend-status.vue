<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Backend Status Check
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Testing connection to OpenLoyalty backend
        </p>
      </div>
      
      <div class="card">
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Backend URL</h3>
            <p class="text-sm text-gray-600">{{ config.public.apiBase }}</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900">Status</h3>
            <div v-if="loading" class="flex items-center">
              <Icon name="heroicons:arrow-path" class="w-5 h-5 text-blue-500 animate-spin mr-2" />
              <span class="text-blue-600">Checking...</span>
            </div>
            <div v-else-if="status === 'connected'" class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              <span class="text-green-600">Connected</span>
            </div>
            <div v-else class="flex items-center">
              <Icon name="heroicons:x-circle" class="w-5 h-5 text-red-500 mr-2" />
              <span class="text-red-600">{{ error || 'Not connected' }}</span>
            </div>
          </div>
          
          <div v-if="status === 'connected'">
            <h3 class="text-lg font-medium text-gray-900">Available Endpoints</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• /api/admin/login_check</li>
              <li>• /api/customer/login_check</li>
              <li>• /api/seller/login_check</li>
            </ul>
          </div>
          
          <div v-if="error" class="bg-red-50 p-4 rounded-md">
            <h3 class="text-sm font-medium text-red-800">Troubleshooting</h3>
            <ul class="text-sm text-red-700 mt-2 space-y-1">
              <li>• Ensure backend Docker containers are running</li>
              <li>• Check if port 8181 is accessible</li>
              <li>• Verify database connection</li>
              <li>• Check backend logs for errors</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="flex space-x-4">
        <button @click="checkBackend" class="btn-primary flex-1">
          <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
          Test Again
        </button>
        <button @click="goToLogin" class="btn-secondary flex-1">
          Go to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const config = useRuntimeConfig()
const router = useRouter()

const loading = ref(true)
const status = ref('')
const error = ref('')

onMounted(() => {
  checkBackend()
})

const checkBackend = async () => {
  loading.value = true
  error.value = ''
  status.value = ''
  
  try {
    // Test basic connectivity
    const response = await $fetch('/api/admin/login_check', {
      method: 'POST',
      body: {
        username: 'test',
        password: 'test'
      },
      baseURL: config.public.apiBase
    })
    
    status.value = 'connected'
  } catch (err) {
    console.error('Backend check error:', err)
    
    if (err.status === 404) {
      error.value = 'API endpoint not found (404)'
    } else if (err.status === 0) {
      error.value = 'Cannot connect to backend (Connection refused)'
    } else if (err.status === 401) {
      // 401 is expected for invalid credentials, but means the API is working
      status.value = 'connected'
    } else {
      error.value = `Error: ${err.status} - ${err.message}`
    }
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script> 