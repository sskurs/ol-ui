<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Segments</h1>
          <p class="text-gray-600">Manage customer segments for targeted campaigns</p>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          Add Segment
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
            placeholder="Search segments..."
            class="form-input w-full"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.active" class="form-select w-full" @change="fetchSegments">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select v-model="filters.type" class="form-select w-full" @change="fetchSegments">
            <option value="">All Types</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Segments Table -->
    <div class="card">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <Icon name="heroicons:arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
      </div>
      
      <div v-else-if="segments.length === 0" class="text-center py-8">
        <Icon name="heroicons:user-group" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No segments found</p>
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segment
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customers
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
              <tr v-for="segment in segments" :key="segment.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon name="heroicons:user-group" class="w-5 h-5 text-blue-600" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ segment.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ segment.description }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="[
                      segment.automatic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    ]"
                  >
                    {{ segment.automatic ? 'Automatic' : 'Manual' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ segment.customersCount || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="[
                      segment.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ segment.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(segment.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="viewSegment(segment)" class="text-blue-600 hover:text-blue-900">
                      <Icon name="heroicons:eye" class="w-4 h-4" />
                    </button>
                    <button @click="editSegment(segment)" class="text-indigo-600 hover:text-indigo-900">
                      <Icon name="heroicons:pencil" class="w-4 h-4" />
                    </button>
                    <button @click="deleteSegment(segment)" class="text-red-600 hover:text-red-900">
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

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit Segment' : 'Add New Segment' }}
          </h3>
          <form @submit.prevent="saveSegment">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="form-input w-full"
                  placeholder="Enter segment name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="form-textarea w-full"
                  placeholder="Enter segment description"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select v-model="form.automatic" class="form-select w-full">
                  <option value="false">Manual</option>
                  <option value="true">Automatic</option>
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
const segments = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10

const filters = ref({
  search: '',
  active: '',
  type: ''
})

const form = ref({
  id: null,
  name: '',
  description: '',
  automatic: false,
  active: true
})

// Computed properties
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, totalItems.value))
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
  fetchSegments()
}, 300)

// Methods
const fetchSegments = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: itemsPerPage.toString(),
      ...filters.value
    })
    
    const response = await $fetch(`/api/admin/segments?${params}`)
    segments.value = response.data || []
    totalItems.value = response.total || 0
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage)
  } catch (error) {
    console.error('Error fetching segments:', error)
    // For demo purposes, create mock data
    segments.value = [
      {
        id: '1',
        name: 'VIP Customers',
        description: 'High-value customers with premium benefits',
        automatic: true,
        active: true,
        customersCount: 150,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'New Customers',
        description: 'Recently registered customers',
        automatic: true,
        active: true,
        customersCount: 89,
        createdAt: new Date().toISOString()
      }
    ]
    totalItems.value = segments.value.length
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchSegments()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchSegments()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  fetchSegments()
}

const viewSegment = (segment) => {
  // Navigate to segment detail page
  navigateTo(`/admin/segments/${segment.id}`)
}

const editSegment = (segment) => {
  form.value = { ...segment }
  showEditModal.value = true
}

const deleteSegment = async (segment) => {
  if (!confirm(`Are you sure you want to delete "${segment.name}"?`)) return
  
  try {
    await $fetch(`/api/admin/segments/${segment.id}`, {
      method: 'DELETE'
    })
    await fetchSegments()
  } catch (error) {
    console.error('Error deleting segment:', error)
    alert('Failed to delete segment')
  }
}

const saveSegment = async () => {
  saving.value = true
  try {
    if (showEditModal.value) {
      await $fetch(`/api/admin/segments/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await $fetch('/api/admin/segments', {
        method: 'POST',
        body: form.value
      })
    }
    
    closeModal()
    await fetchSegments()
  } catch (error) {
    console.error('Error saving segment:', error)
    alert('Failed to save segment')
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    id: null,
    name: '',
    description: '',
    automatic: false,
    active: true
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  fetchSegments()
})
</script> 