<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-900">OpenLoyalty</h1>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="relative">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Icon name="heroicons:user" class="w-5 h-5 text-gray-600" />
                </div>
                <span>{{ userStore.user?.email || 'User' }}</span>
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
      </div>
    </nav>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-sm min-h-screen">
        <nav class="mt-5 px-2">
          <div class="space-y-1">
            <NuxtLink
              to="/"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path === '/' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:home" class="mr-3 h-6 w-6" />
              Dashboard
            </NuxtLink>
            
            <NuxtLink
              to="/customers"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path.startsWith('/customers') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:users" class="mr-3 h-6 w-6" />
              Customers
            </NuxtLink>
            
            <NuxtLink
              to="/transactions"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path.startsWith('/transactions') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:credit-card" class="mr-3 h-6 w-6" />
              Transactions
            </NuxtLink>
            
            <NuxtLink
              to="/campaigns"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path.startsWith('/campaigns') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:megaphone" class="mr-3 h-6 w-6" />
              Campaigns
            </NuxtLink>
            
            <NuxtLink
              to="/earning-rules"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path.startsWith('/earning-rules') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:gift" class="mr-3 h-6 w-6" />
              Earning Rules
            </NuxtLink>
            
            <NuxtLink
              to="/segments"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path.startsWith('/segments') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:user-group" class="mr-3 h-6 w-6" />
              Segments
            </NuxtLink>
            
            <NuxtLink
              to="/settings"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path.startsWith('/settings') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Icon name="heroicons:cog-6-tooth" class="mr-3 h-6 w-6" />
              Settings
            </NuxtLink>
          </div>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const userStore = useUserStore()
const router = useRouter()
const showUserMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  userStore.logout()
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
</script> 