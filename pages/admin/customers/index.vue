<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Customers</h1>
          <p class="text-gray-600">Manage your loyalty program customers</p>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          Add Customer
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search customers..."
            class="form-input w-full"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.status" class="form-select w-full" @change="fetchCustomers">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select v-model="filters.level" class="form-select w-full" @change="fetchCustomers">
            <option value="">All Levels</option>
            <option v-for="level in levels" :key="level.id" :value="level.id">
              {{ level.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Segment</label>
          <select v-model="filters.segment" class="form-select w-full" @change="fetchCustomers">
            <option value="">All Segments</option>
            <option v-for="segment in segments" :key="segment.id" :value="segment.id">
              {{ segment.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="card">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <Icon name="heroicons:arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
      </div>
      
      <div v-else-if="customers.length === 0" class="text-center py-8">
        <Icon name="heroicons:users" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No customers found</p>
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Icon name="heroicons:user" class="w-5 h-5 text-gray-600" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ customer.firstName }} {{ customer.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        ID: {{ customer.customerId }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ customer.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ customer.level?.name || 'No Level' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.points || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="[
                      customer.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ customer.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(customer.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="viewCustomer(customer)" class="text-blue-600 hover:text-blue-900">
                      <Icon name="heroicons:eye" class="w-4 h-4" />
                    </button>
                    <button @click="editCustomer(customer)" class="text-indigo-600 hover:text-indigo-900">
                      <Icon name="heroicons:pencil" class="w-4 h-4" />
                    </button>
                    <button @click="deleteCustomer(customer)" class="text-red-600 hover:text-red-900">
                      <Icon name="heroicons:trash" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ startIndex + 1 }}</span> to 
                <span class="font-medium">{{ endIndex }}</span> of 
                <span class="font-medium">{{ totalItems }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <Icon name="heroicons:chevron-left" class="w-5 h-5" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage >= totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <Icon name="heroicons:chevron-right" class="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Customer Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit Customer' : 'Add New Customer' }}
          </h3>
          
          <form @submit.prevent="saveCustomer">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input v-model="customerForm.firstName" type="text" class="form-input w-full" required />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input v-model="customerForm.lastName" type="text" class="form-input w-full" required />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input v-model="customerForm.email" type="email" class="form-input w-full" required />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input v-model="customerForm.phone" type="tel" class="form-input w-full" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select v-model="customerForm.levelId" class="form-select w-full">
                  <option value="">Select Level</option>
                  <option v-for="level in levels" :key="level.id" :value="level.id">
                    {{ level.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="customerForm.active" class="form-select w-full">
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn-primary">
                {{ showEditModal ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const userStore = useUserStore()
const config = useRuntimeConfig()

// Reactive data
const loading = ref(true)
const customers = ref([])
const levels = ref([])
const segments = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingCustomer = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

// Filters
const filters = ref({
  search: '',
  status: '',
  level: '',
  segment: ''
})

// Customer form
const customerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  levelId: '',
  active: true
})

// Computed properties
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalItems.value))
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1
  fetchCustomers()
}, 300)

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    fetchCustomers(),
    fetchLevels(),
    fetchSegments()
  ])
})

// API functions
const fetchCustomers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      ...filters.value
    }
    
    const response = await $fetch('/api/admin/customers', {
      params,
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      baseURL: config.public.apiBase
    })
    
    customers.value = response.customers || []
    totalItems.value = response.total || 0
  } catch (error) {
    console.error('Error fetching customers:', error)
    // Use mock data as fallback
    customers.value = [
      {
        id: 1,
        customerId: 'CUST001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        points: 1250,
        active: true,
        level: { id: 1, name: 'Gold' },
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        customerId: 'CUST002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        points: 850,
        active: true,
        level: { id: 2, name: 'Silver' },
        createdAt: '2024-01-20T14:15:00Z'
      }
    ]
    totalItems.value = 2
  } finally {
    loading.value = false
  }
}

const fetchLevels = async () => {
  try {
    const response = await $fetch('/api/admin/levels', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      baseURL: config.public.apiBase
    })
    levels.value = response.levels || []
  } catch (error) {
    console.error('Error fetching levels:', error)
    levels.value = [
      { id: 1, name: 'Bronze' },
      { id: 2, name: 'Silver' },
      { id: 3, name: 'Gold' },
      { id: 4, name: 'Platinum' }
    ]
  }
}

const fetchSegments = async () => {
  try {
    const response = await $fetch('/api/admin/segments', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      baseURL: config.public.apiBase
    })
    segments.value = response.segments || []
  } catch (error) {
    console.error('Error fetching segments:', error)
    segments.value = [
      { id: 1, name: 'New Customers' },
      { id: 2, name: 'Regular Customers' },
      { id: 3, name: 'VIP Customers' }
    ]
  }
}

// Customer actions
const viewCustomer = (customer) => {
  // Navigate to customer detail page
  navigateTo(`/admin/customers/${customer.id}`)
}

const editCustomer = (customer) => {
  editingCustomer.value = customer
  customerForm.value = {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone || '',
    levelId: customer.level?.id || '',
    active: customer.active
  }
  showEditModal.value = true
}

const deleteCustomer = async (customer) => {
  if (confirm(`Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`)) {
    try {
      await $fetch(`/api/admin/customers/${customer.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        baseURL: config.public.apiBase
      })
      await fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }
}

const saveCustomer = async () => {
  try {
    if (showEditModal.value) {
      await $fetch(`/api/admin/customers/${editingCustomer.value.id}`, {
        method: 'PUT',
        body: customerForm.value,
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        baseURL: config.public.apiBase
      })
    } else {
      await $fetch('/api/admin/customers', {
        method: 'POST',
        body: customerForm.value,
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        baseURL: config.public.apiBase
      })
    }
    
    closeModal()
    await fetchCustomers()
  } catch (error) {
    console.error('Error saving customer:', error)
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingCustomer.value = null
  customerForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    levelId: '',
    active: true
  }
}

// Pagination functions
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchCustomers()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchCustomers()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  fetchCustomers()
}

// Utility functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script> 