<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Earning Rules</h1>
          <p class="text-gray-600">Configure how customers earn points</p>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          Create Rule
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search rules..."
            class="form-input w-full"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select v-model="filters.type" class="form-select w-full" @change="fetchRules">
            <option value="">All Types</option>
            <option value="purchase">Purchase</option>
            <option value="referral">Referral</option>
            <option value="birthday">Birthday</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.active" class="form-select w-full" @change="fetchRules">
            <option value="">All Status</option>
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select v-model="filters.levelId" class="form-select w-full" @change="fetchRules">
            <option value="">All Levels</option>
            <option v-for="level in levels" :key="level.id" :value="level.id">
              {{ level.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Rules Table -->
    <div class="card">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <Icon name="heroicons:arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
      </div>
      
      <div v-else-if="rules.length === 0" class="text-center py-8">
        <Icon name="heroicons:gift" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No earning rules found</p>
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rule Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conditions
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="rule in rules" :key="rule.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ rule.name }}</div>
                    <div class="text-sm text-gray-500">{{ rule.description }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="[
                      rule.type === 'purchase' ? 'bg-blue-100 text-blue-800' :
                      rule.type === 'referral' ? 'bg-green-100 text-green-800' :
                      rule.type === 'birthday' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ rule.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    <span class="font-medium">{{ rule.points }}</span>
                    <span class="text-gray-500"> points</span>
                  </div>
                  <div v-if="rule.multiplier" class="text-xs text-gray-500">
                    {{ rule.multiplier }}x multiplier
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">
                    <div v-if="rule.minAmount">Min: ${{ rule.minAmount }}</div>
                    <div v-if="rule.maxAmount">Max: ${{ rule.maxAmount }}</div>
                    <div v-if="rule.levelId">Level: {{ getLevelName(rule.levelId) }}</div>
                    <div v-if="rule.segmentId">Segment: {{ getSegmentName(rule.segmentId) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="rule.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ rule.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ rule.usageCount || 0 }} times
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ rule.usageLimit ? `${rule.usageLimit} limit` : 'No limit' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="viewRule(rule)" class="text-blue-600 hover:text-blue-900">
                      <Icon name="heroicons:eye" class="w-4 h-4" />
                    </button>
                    <button @click="editRule(rule)" class="text-indigo-600 hover:text-indigo-900">
                      <Icon name="heroicons:pencil" class="w-4 h-4" />
                    </button>
                    <button @click="toggleRuleStatus(rule)" class="text-yellow-600 hover:text-yellow-900">
                      <Icon :name="rule.active ? 'heroicons:pause' : 'heroicons:play'" class="w-4 h-4" />
                    </button>
                    <button @click="deleteRule(rule)" class="text-red-600 hover:text-red-900">
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

    <!-- Add/Edit Rule Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit Earning Rule' : 'Create New Earning Rule' }}
          </h3>
          
          <form @submit.prevent="saveRule">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input v-model="ruleForm.name" type="text" class="form-input w-full" required />
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea v-model="ruleForm.description" class="form-textarea w-full" rows="3"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select v-model="ruleForm.type" class="form-select w-full" required>
                  <option value="purchase">Purchase</option>
                  <option value="referral">Referral</option>
                  <option value="birthday">Birthday</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Points</label>
                <input v-model.number="ruleForm.points" type="number" class="form-input w-full" required />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Multiplier</label>
                <input v-model.number="ruleForm.multiplier" type="number" step="0.1" class="form-input w-full" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="ruleForm.active" class="form-select w-full">
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Min Amount ($)</label>
                <input v-model.number="ruleForm.minAmount" type="number" step="0.01" class="form-input w-full" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Max Amount ($)</label>
                <input v-model.number="ruleForm.maxAmount" type="number" step="0.01" class="form-input w-full" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select v-model="ruleForm.levelId" class="form-select w-full">
                  <option value="">Any Level</option>
                  <option v-for="level in levels" :key="level.id" :value="level.id">
                    {{ level.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Segment</label>
                <select v-model="ruleForm.segmentId" class="form-select w-full">
                  <option value="">Any Segment</option>
                  <option v-for="segment in segments" :key="segment.id" :value="segment.id">
                    {{ segment.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                <input v-model.number="ruleForm.usageLimit" type="number" class="form-input w-full" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <input v-model.number="ruleForm.priority" type="number" class="form-input w-full" />
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
const rules = ref([])
const levels = ref([])
const segments = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingRule = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

// Filters
const filters = ref({
  search: '',
  type: '',
  active: '',
  levelId: ''
})

// Rule form
const ruleForm = ref({
  name: '',
  description: '',
  type: 'purchase',
  points: 0,
  multiplier: 1,
  active: true,
  minAmount: null,
  maxAmount: null,
  levelId: '',
  segmentId: '',
  usageLimit: null,
  priority: 0
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
  fetchRules()
}, 300)

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    fetchRules(),
    fetchLevels(),
    fetchSegments()
  ])
})

// API functions
const fetchRules = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      ...filters.value
    }
    
    const response = await $fetch('/api/admin/earning-rules', {
      params,
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      baseURL: config.public.apiBase
    })
    
    rules.value = response.rules || []
    totalItems.value = response.total || 0
  } catch (error) {
    console.error('Error fetching earning rules:', error)
    // Use mock data as fallback
    rules.value = [
      {
        id: 1,
        name: 'Purchase Points',
        description: 'Earn points for every purchase',
        type: 'purchase',
        points: 10,
        multiplier: 1,
        active: true,
        minAmount: 1,
        maxAmount: null,
        levelId: null,
        segmentId: null,
        usageLimit: null,
        priority: 1,
        usageCount: 1250
      },
      {
        id: 2,
        name: 'Referral Bonus',
        description: 'Earn bonus points for referring friends',
        type: 'referral',
        points: 500,
        multiplier: 1,
        active: true,
        minAmount: null,
        maxAmount: null,
        levelId: null,
        segmentId: null,
        usageLimit: 5,
        priority: 2,
        usageCount: 45
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

// Utility functions
const getLevelName = (levelId) => {
  const level = levels.value.find(l => l.id === levelId)
  return level ? level.name : 'Unknown'
}

const getSegmentName = (segmentId) => {
  const segment = segments.value.find(s => s.id === segmentId)
  return segment ? segment.name : 'Unknown'
}

// Rule actions
const viewRule = (rule) => {
  navigateTo(`/admin/earning-rules/${rule.id}`)
}

const editRule = (rule) => {
  editingRule.value = rule
  ruleForm.value = {
    name: rule.name,
    description: rule.description,
    type: rule.type,
    points: rule.points,
    multiplier: rule.multiplier || 1,
    active: rule.active,
    minAmount: rule.minAmount,
    maxAmount: rule.maxAmount,
    levelId: rule.levelId || '',
    segmentId: rule.segmentId || '',
    usageLimit: rule.usageLimit,
    priority: rule.priority || 0
  }
  showEditModal.value = true
}

const toggleRuleStatus = async (rule) => {
  try {
    await $fetch(`/api/admin/earning-rules/${rule.id}/status`, {
      method: 'PUT',
      body: { active: !rule.active },
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      baseURL: config.public.apiBase
    })
    await fetchRules()
  } catch (error) {
    console.error('Error updating rule status:', error)
  }
}

const deleteRule = async (rule) => {
  if (confirm(`Are you sure you want to delete rule "${rule.name}"?`)) {
    try {
      await $fetch(`/api/admin/earning-rules/${rule.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        baseURL: config.public.apiBase
      })
      await fetchRules()
    } catch (error) {
      console.error('Error deleting rule:', error)
    }
  }
}

const saveRule = async () => {
  try {
    if (showEditModal.value) {
      await $fetch(`/api/admin/earning-rules/${editingRule.value.id}`, {
        method: 'PUT',
        body: ruleForm.value,
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        baseURL: config.public.apiBase
      })
    } else {
      await $fetch('/api/admin/earning-rules', {
        method: 'POST',
        body: ruleForm.value,
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        baseURL: config.public.apiBase
      })
    }
    
    closeModal()
    await fetchRules()
  } catch (error) {
    console.error('Error saving rule:', error)
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingRule.value = null
  ruleForm.value = {
    name: '',
    description: '',
    type: 'purchase',
    points: 0,
    multiplier: 1,
    active: true,
    minAmount: null,
    maxAmount: null,
    levelId: '',
    segmentId: '',
    usageLimit: null,
    priority: 0
  }
}

// Pagination functions
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchRules()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchRules()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  fetchRules()
}
</script> 