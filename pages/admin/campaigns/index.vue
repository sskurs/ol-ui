<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p class="text-gray-600">Manage marketing campaigns and promotions</p>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          Create Campaign
        </button>
      </div>
    </div>

    <!-- Campaign Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:megaphone" class="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active Campaigns</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.active || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:users" class="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Participants</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.participants || 0 }}</p>
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
            <p class="text-sm font-medium text-gray-500">Rewards Given</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.rewards || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:chart-bar" class="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Conversion Rate</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.conversion || 0 }}%</p>
          </div>
        </div>
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
            placeholder="Search campaigns..."
            class="form-input w-full"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.status" class="form-select w-full" @change="fetchCampaigns">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select v-model="filters.type" class="form-select w-full" @change="fetchCampaigns">
            <option value="">All Types</option>
            <option value="referral">Referral</option>
            <option value="birthday">Birthday</option>
            <option value="seasonal">Seasonal</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <input
            v-model="filters.dateRange"
            type="date"
            class="form-input w-full"
            @change="fetchCampaigns"
          />
        </div>
      </div>
    </div>

    <!-- Campaigns Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="loading" class="col-span-full flex items-center justify-center py-8">
        <Icon name="heroicons:arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
      </div>
      
      <div v-else-if="campaigns.length === 0" class="col-span-full text-center py-8">
        <Icon name="heroicons:megaphone" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No campaigns found</p>
      </div>
      
      <div
        v-for="campaign in campaigns"
        :key="campaign.id"
        class="card hover:shadow-lg transition-shadow duration-200"
      >
        <!-- Campaign Header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ campaign.name }}</h3>
            <p class="text-sm text-gray-500">{{ campaign.description }}</p>
          </div>
          <div class="flex space-x-2">
            <button @click="editCampaign(campaign)" class="text-indigo-600 hover:text-indigo-900">
              <Icon name="heroicons:pencil" class="w-4 h-4" />
            </button>
            <button @click="deleteCampaign(campaign)" class="text-red-600 hover:text-red-900">
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Campaign Status -->
        <div class="mb-4">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="[
              campaign.status === 'active' ? 'bg-green-100 text-green-800' :
              campaign.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
              campaign.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            ]"
          >
            {{ campaign.status }}
          </span>
          <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {{ campaign.type }}
          </span>
        </div>

        <!-- Campaign Details -->
        <div class="space-y-3 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Start Date:</span>
            <span class="text-gray-900">{{ formatDate(campaign.startDate) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">End Date:</span>
            <span class="text-gray-900">{{ formatDate(campaign.endDate) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Participants:</span>
            <span class="text-gray-900">{{ campaign.participants || 0 }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Rewards:</span>
            <span class="text-gray-900">{{ campaign.rewards || 0 }}</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="flex justify-between text-sm text-gray-500 mb-1">
            <span>Progress</span>
            <span>{{ campaign.progress || 0 }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${campaign.progress || 0}%` }"
            ></div>
          </div>
        </div>

        <!-- Campaign Actions -->
        <div class="flex space-x-2">
          <button @click="viewCampaign(campaign)" class="btn-secondary flex-1">
            <Icon name="heroicons:eye" class="w-4 h-4 mr-1" />
            View
          </button>
          <button 
            @click="toggleCampaignStatus(campaign)"
            :class="[
              'flex-1 px-3 py-2 text-sm font-medium rounded-md',
              campaign.status === 'active'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            ]"
          >
            <Icon 
              :name="campaign.status === 'active' ? 'heroicons:pause' : 'heroicons:play'" 
              class="w-4 h-4 mr-1" 
            />
            {{ campaign.status === 'active' ? 'Pause' : 'Activate' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="campaigns.length > 0" class="mt-8">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }} results
        </div>
        <div class="flex space-x-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage >= totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Campaign Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit Campaign' : 'Create New Campaign' }}
          </h3>
          
          <form @submit.prevent="saveCampaign">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input v-model="campaignForm.name" type="text" class="form-input w-full" required />
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea v-model="campaignForm.description" class="form-textarea w-full" rows="3"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
                <select v-model="campaignForm.type" class="form-select w-full" required>
                  <option value="referral">Referral</option>
                  <option value="birthday">Birthday</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="campaignForm.status" class="form-select w-full">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input v-model="campaignForm.startDate" type="date" class="form-input w-full" required />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input v-model="campaignForm.endDate" type="date" class="form-input w-full" required />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Reward Points</label>
                <input v-model.number="campaignForm.rewardPoints" type="number" class="form-input w-full" required />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                <input v-model.number="campaignForm.maxParticipants" type="number" class="form-input w-full" />
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
const campaigns = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingCampaign = ref(null)

// Stats
const stats = ref({
  active: 0,
  participants: 0,
  rewards: 0,
  conversion: 0
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(12)
const totalItems = ref(0)

// Filters
const filters = ref({
  search: '',
  status: '',
  type: '',
  dateRange: ''
})

// Campaign form
const campaignForm = ref({
  name: '',
  description: '',
  type: 'referral',
  status: 'draft',
  startDate: '',
  endDate: '',
  rewardPoints: 0,
  maxParticipants: null
})

// Computed properties
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalItems.value))

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1
  fetchCampaigns()
}, 300)

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    fetchCampaigns(),
    fetchStats()
  ])
})

// API functions
const fetchCampaigns = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      ...filters.value
    }
    
    const response = await $fetch('/api/admin/campaigns', {
      params,
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      baseURL: config.public.apiBase
    })
    
    campaigns.value = response.campaigns || []
    totalItems.value = response.total || 0
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    // Use mock data as fallback
    campaigns.value = [
      {
        id: 1,
        name: 'Summer Referral Campaign',
        description: 'Earn points for referring friends this summer',
        type: 'referral',
        status: 'active',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        participants: 150,
        rewards: 75,
        progress: 60,
        rewardPoints: 500,
        maxParticipants: 250
      },
      {
        id: 2,
        name: 'Birthday Bonanza',
        description: 'Special rewards for birthday celebrations',
        type: 'birthday',
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        participants: 89,
        rewards: 45,
        progress: 45,
        rewardPoints: 200,
        maxParticipants: 200
      }
    ]
    totalItems.value = 2
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const response = await $fetch('/api/admin/campaigns/stats', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      baseURL: config.public.apiBase
    })
    stats.value = response
  } catch (error) {
    console.error('Error fetching campaign stats:', error)
    stats.value = {
      active: 2,
      participants: 239,
      rewards: 120,
      conversion: 15.5
    }
  }
}

// Campaign actions
const viewCampaign = (campaign) => {
  navigateTo(`/admin/campaigns/${campaign.id}`)
}

const editCampaign = (campaign) => {
  editingCampaign.value = campaign
  campaignForm.value = {
    name: campaign.name,
    description: campaign.description,
    type: campaign.type,
    status: campaign.status,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    rewardPoints: campaign.rewardPoints,
    maxParticipants: campaign.maxParticipants
  }
  showEditModal.value = true
}

const deleteCampaign = async (campaign) => {
  if (confirm(`Are you sure you want to delete campaign "${campaign.name}"?`)) {
    try {
      await $fetch(`/api/admin/campaigns/${campaign.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        baseURL: config.public.apiBase
      })
      await fetchCampaigns()
      await fetchStats()
    } catch (error) {
      console.error('Error deleting campaign:', error)
    }
  }
}

const toggleCampaignStatus = async (campaign) => {
  try {
    const newStatus = campaign.status === 'active' ? 'inactive' : 'active'
    await $fetch(`/api/admin/campaigns/${campaign.id}/status`, {
      method: 'PUT',
      body: { status: newStatus },
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      baseURL: config.public.apiBase
    })
    await fetchCampaigns()
    await fetchStats()
  } catch (error) {
    console.error('Error updating campaign status:', error)
  }
}

const saveCampaign = async () => {
  try {
    if (showEditModal.value) {
      await $fetch(`/api/admin/campaigns/${editingCampaign.value.id}`, {
        method: 'PUT',
        body: campaignForm.value,
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        baseURL: config.public.apiBase
      })
    } else {
      await $fetch('/api/admin/campaigns', {
        method: 'POST',
        body: campaignForm.value,
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        baseURL: config.public.apiBase
      })
    }
    
    closeModal()
    await fetchCampaigns()
    await fetchStats()
  } catch (error) {
    console.error('Error saving campaign:', error)
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingCampaign.value = null
  campaignForm.value = {
    name: '',
    description: '',
    type: 'referral',
    status: 'draft',
    startDate: '',
    endDate: '',
    rewardPoints: 0,
    maxParticipants: null
  }
}

// Pagination functions
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchCampaigns()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchCampaigns()
  }
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