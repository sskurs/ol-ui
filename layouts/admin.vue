<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Screen -->
    <div v-if="loading" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon name="heroicons:gift" class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">OpenLoyalty</h2>
        <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>

    <!-- Main Layout -->
    <div v-else class="flex">
      <!-- Left Navigation -->
      <aside class="w-64 bg-white shadow-sm min-h-screen fixed left-0 top-0 z-40">
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:gift" class="w-5 h-5 text-white" />
            </div>
            <h1 class="ml-3 text-lg font-bold text-gray-900">OpenLoyalty</h1>
          </div>
        </div>
        
        <nav class="mt-4 px-2">
          <div class="space-y-1">
            <!-- Dashboard -->
            <a
              href="/admin"
              @click="navigateToPage('/admin', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path === '/admin' 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:home" class="mr-3 h-6 w-6" />
              Dashboard
            </a>
            
            <!-- Customers -->
            <a
              href="/admin/customers"
              @click="navigateToPage('/admin/customers', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/customers') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:users" class="mr-3 h-6 w-6" />
              Customers
            </a>
            
            <!-- Transactions -->
            <a
              href="/admin/transactions"
              @click="navigateToPage('/admin/transactions', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/transactions') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:credit-card" class="mr-3 h-6 w-6" />
              Transactions
            </a>
            
            <!-- Campaigns -->
            <a
              href="/admin/campaigns"
              @click="navigateToPage('/admin/campaigns', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/campaigns') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:megaphone" class="mr-3 h-6 w-6" />
              Campaigns
            </a>
            
            <!-- Earning Rules -->
            <a
              href="/admin/earning-rules"
              @click="navigateToPage('/admin/earning-rules', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/earning-rules') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:gift" class="mr-3 h-6 w-6" />
              Earning Rules
            </a>
            
            <!-- Segments -->
            <a
              href="/admin/segments"
              @click="navigateToPage('/admin/segments', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/segments') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:user-group" class="mr-3 h-6 w-6" />
              Segments
            </a>
            
            <!-- Levels -->
            <a
              href="/admin/levels"
              @click="navigateToPage('/admin/levels', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/levels') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:star" class="mr-3 h-6 w-6" />
              Levels
            </a>
            
            <!-- POS -->
            <a
              href="/admin/pos"
              @click="navigateToPage('/admin/pos', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/pos') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:computer-desktop" class="mr-3 h-6 w-6" />
              POS
            </a>
            
            <!-- Sellers -->
            <a
              href="/admin/sellers"
              @click="navigateToPage('/admin/sellers', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/sellers') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:user" class="mr-3 h-6 w-6" />
              Sellers
            </a>
            
            <!-- Transfers -->
            <a
              href="/admin/transfers"
              @click="navigateToPage('/admin/transfers', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/transfers') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:arrow-path" class="mr-3 h-6 w-6" />
              Transfers
            </a>
            
            <!-- Users -->
            <a
              href="/admin/users"
              @click="navigateToPage('/admin/users', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/users') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:user-circle" class="mr-3 h-6 w-6" />
              Users
            </a>
            
            <!-- Emails -->
            <a
              href="/admin/emails"
              @click="navigateToPage('/admin/emails', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/emails') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:envelope" class="mr-3 h-6 w-6" />
              Emails
            </a>
            
            <!-- Settings -->
            <a
              href="/admin/settings"
              @click="navigateToPage('/admin/settings', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/settings') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:cog-6-tooth" class="mr-3 h-6 w-6" />
              Settings
            </a>
            
            <!-- Logs -->
            <a
              href="/admin/logs"
              @click="navigateToPage('/admin/logs', $event)"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              :class="[
                $route.path.startsWith('/admin/logs') 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:document-text" class="mr-3 h-6 w-6" />
              Logs
            </a>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 ml-64">
        <!-- Top Navigation -->
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="flex justify-between items-center px-6 py-4">
            <div class="flex items-center">
              <h2 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h2>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button class="relative p-2 text-gray-400 hover:text-gray-500">
                <Icon name="heroicons:bell" class="w-6 h-6" />
                <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              
              <!-- User Menu -->
              <div class="relative">
                <button
                  @click="toggleUserMenu"
                  class="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:user" class="w-5 h-5 text-gray-600" />
                  </div>
                  <span>{{ user?.value?.email || 'Admin' }}</span>
                  <Icon name="heroicons:chevron-down" class="w-4 h-4" />
                </button>
                
                <!-- User dropdown menu -->
                <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <hr class="my-1">
                  <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-6">
          <slot />
        </main>
      </div>
    </div>

    <!-- Flash Messages -->
    <div v-if="flashMessage" class="fixed top-4 right-4 z-50">
      <div class="bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-400" />
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{{ flashMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, logout: authLogout } = useAuth()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const showUserMenu = ref(false)
const flashMessage = ref('')

// Computed page title based on current route
const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin') return 'Dashboard'
  if (path.startsWith('/admin/customers')) return 'Customers'
  if (path.startsWith('/admin/transactions')) return 'Transactions'
  if (path.startsWith('/admin/campaigns')) return 'Campaigns'
  if (path.startsWith('/admin/earning-rules')) return 'Earning Rules'
  if (path.startsWith('/admin/segments')) return 'Segments'
  if (path.startsWith('/admin/levels')) return 'Levels'
  if (path.startsWith('/admin/pos')) return 'POS'
  if (path.startsWith('/admin/sellers')) return 'Sellers'
  if (path.startsWith('/admin/transfers')) return 'Transfers'
  if (path.startsWith('/admin/users')) return 'Users'
  if (path.startsWith('/admin/emails')) return 'Emails'
  if (path.startsWith('/admin/settings')) return 'Settings'
  if (path.startsWith('/admin/logs')) return 'Logs'
  return 'Admin Panel'
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  authLogout()
  router.push('/login')
}

// Close user menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})

// Check authentication
onMounted(() => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated.value) {
    router.push('/login')
  }
})

const navigateToPage = (page, event) => {
  if (event) {
    event.preventDefault()
  }
  console.log('Navigating to:', page)
  console.log('Current route:', route.path)
  router.push(page)
}
</script> 