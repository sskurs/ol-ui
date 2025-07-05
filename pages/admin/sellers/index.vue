<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Sellers</h1>
          <p class="text-gray-600">Manage sales representatives and sellers</p>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          Add Seller
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search sellers..."
            class="form-input w-full"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.active" class="form-select w-full" @change="fetchSellers">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select v-model="filters.role" class="form-select w-full" @change="fetchSellers">
            <option value="">All Roles</option>
            <option value="ROLE_SELLER">Seller</option>
            <option value="ROLE_MANAGER">Manager</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Sellers Table -->
    <div class="card">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <Icon name="heroicons:arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
      </div>
      
      <div v-else-if="sellers.length === 0" class="text-center py-8">
        <Icon name="heroicons:user" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No sellers found</p>
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="seller in sellers" :key="seller.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Icon name="heroicons:user" class="w-5 h-5 text-gray-600" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ seller.firstName }} {{ seller.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        ID: {{ seller.sellerId }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ seller.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ seller.roles?.includes('ROLE_MANAGER') ? 'Manager' : 'Seller' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="[
                      seller.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ seller.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(seller.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="viewSeller(seller)" class="text-blue-600 hover:text-blue-900">
                      <Icon name="heroicons:eye" class="w-4 h-4" />
                    </button>
                    <button @click="editSeller(seller)" class="text-indigo-600 hover:text-indigo-900">
                      <Icon name="heroicons:pencil" class="w-4 h-4" />
                    </button>
                    <button @click="deleteSeller(seller)" class="text-red-600 hover:text-red-900">
                      <Icon name="heroicons:trash" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit Seller' : 'Add New Seller' }}
          </h3>
          <form @submit.prevent="saveSeller">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="form-input w-full"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="form-input w-full"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="form-input w-full"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select v-model="form.role" class="form-select w-full">
                  <option value="ROLE_SELLER">Seller</option>
                  <option value="ROLE_MANAGER">Manager</option>
                </select>
              </div>
              <div>
                <label class="flex items-center">
                  <input
                    v-model="form.active"
                    type="checkbox"
                    class="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span class="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="closeModal"
                class="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
                :disabled="saving"
              >
                <Icon v-if="saving" name="heroicons:arrow-path" class="w-4 h-4 mr-2 animate-spin" />
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
  layout: 'admin',
  middleware: 'auth'
})

// Reactive data
const loading = ref(false)
const saving = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const sellers = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10

const filters = ref({
  search: '',
  active: '',
  role: ''
})

const form = ref({
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  role: 'ROLE_SELLER',
  active: true
})

// Computed properties
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, totalItems.value))

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1
  fetchSellers()
}, 300)

// Methods
const fetchSellers = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: itemsPerPage.toString(),
      ...filters.value
    })
    
    const response = await $fetch(`/api/admin/sellers?${params}`)
    sellers.value = response.data || []
    totalItems.value = response.total || 0
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage)
  } catch (error) {
    console.error('Error fetching sellers:', error)
    // Mock data for demo
    sellers.value = [
      {
        id: '1',
        sellerId: 'SELLER001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        roles: ['ROLE_SELLER'],
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        sellerId: 'SELLER002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        roles: ['ROLE_MANAGER'],
        active: true,
        createdAt: new Date().toISOString()
      }
    ]
    totalItems.value = sellers.value.length
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const viewSeller = (seller) => {
  // Navigate to seller detail page
  navigateTo(`/admin/sellers/${seller.id}`)
}

const editSeller = (seller) => {
  form.value = { 
    ...seller,
    role: seller.roles?.includes('ROLE_MANAGER') ? 'ROLE_MANAGER' : 'ROLE_SELLER'
  }
  showEditModal.value = true
}

const deleteSeller = async (seller) => {
  if (!confirm(`Are you sure you want to delete "${seller.firstName} ${seller.lastName}"?`)) return
  
  try {
    await $fetch(`/api/admin/sellers/${seller.id}`, {
      method: 'DELETE'
    })
    await fetchSellers()
  } catch (error) {
    console.error('Error deleting seller:', error)
    alert('Failed to delete seller')
  }
}

const saveSeller = async () => {
  saving.value = true
  try {
    const sellerData = {
      ...form.value,
      roles: [form.value.role]
    }
    
    if (showEditModal.value) {
      await $fetch(`/api/admin/sellers/${form.value.id}`, {
        method: 'PUT',
        body: sellerData
      })
    } else {
      await $fetch('/api/admin/sellers', {
        method: 'POST',
        body: sellerData
      })
    }
    
    closeModal()
    await fetchSellers()
  } catch (error) {
    console.error('Error saving seller:', error)
    alert('Failed to save seller')
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    role: 'ROLE_SELLER',
    active: true
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  fetchSellers()
})
</script> 