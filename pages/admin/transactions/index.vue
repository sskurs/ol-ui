<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Transactions</h1>
          <p class="text-gray-600">Manage customer transactions and points</p>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          New Transaction
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search transactions..."
            class="form-input w-full"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <select v-model="filters.customerId" class="form-select w-full" @change="fetchTransactions">
            <option value="">All Customers</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.firstName }} {{ customer.lastName }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select v-model="filters.type" class="form-select w-full" @change="fetchTransactions">
            <option value="">All Types</option>
            <option value="earning">Earning</option>
            <option value="spending">Spending</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.status" class="form-select w-full" @change="fetchTransactions">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <input
            v-model="filters.dateRange"
            type="date"
            class="form-input w-full"
            @change="fetchTransactions"
          />
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="card">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <Icon name="heroicons:arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
      </div>
      
      <div v-else-if="transactions.length === 0" class="text-center py-8">
        <Icon name="heroicons:credit-card" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No transactions found</p>
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ transaction.transactionId }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Icon name="heroicons:user" class="w-4 h-4 text-gray-600" />
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ transaction.customer?.firstName }} {{ transaction.customer?.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ transaction.customer?.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="[
                      transaction.type === 'earning' ? 'bg-green-100 text-green-800' :
                      transaction.type === 'spending' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    ]"
                  >
                    {{ transaction.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    <span :class="transaction.type === 'earning' ? 'text-green-600' : 'text-red-600'">
                      {{ transaction.type === 'earning' ? '+' : '-' }}{{ transaction.points }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${{ transaction.amount?.toFixed(2) || '0.00' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="[
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ transaction.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(transaction.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="viewTransaction(transaction)" class="text-blue-600 hover:text-blue-900">
                      <Icon name="heroicons:eye" class="w-4 h-4" />
                    </button>
                    <button @click="editTransaction(transaction)" class="text-indigo-600 hover:text-indigo-900">
                      <Icon name="heroicons:pencil" class="w-4 h-4" />
                    </button>
                    <button @click="deleteTransaction(transaction)" class="text-red-600 hover:text-red-900">
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

    <!-- Add/Edit Transaction Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit Transaction' : 'New Transaction' }}
          </h3>
          
          <form @submit.prevent="saveTransaction">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select v-model="transactionForm.customerId" class="form-select w-full" required>
                  <option value="">Select Customer</option>
                  <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                    {{ customer.firstName }} {{ customer.lastName }} ({{ customer.email }})
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                <select v-model="transactionForm.type" class="form-select w-full" required>
                  <option value="earning">Earning</option>
                  <option value="spending">Spending</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Points</label>
                <input v-model.number="transactionForm.points" type="number" class="form-input w-full" required />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input v-model.number="transactionForm.amount" type="number" step="0.01" class="form-input w-full" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea v-model="transactionForm.description" class="form-textarea w-full" rows="3"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="transactionForm.status" class="form-select w-full">
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
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
const transactions = ref([])
const customers = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingTransaction = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

// Filters
const filters = ref({
  search: '',
  customerId: '',
  type: '',
  status: '',
  dateRange: ''
})

// Transaction form
const transactionForm = ref({
  customerId: '',
  type: 'earning',
  points: 0,
  amount: 0,
  description: '',
  status: 'completed'
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
  fetchTransactions()
}, 300)

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    fetchTransactions(),
    fetchCustomers()
  ])
})

// API functions
const fetchTransactions = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      ...filters.value
    }
    
    const response = await $fetch('/api/admin/transactions', {
      params,
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      baseURL: config.public.apiBase
    })
    
    transactions.value = response.transactions || []
    totalItems.value = response.total || 0
  } catch (error) {
    console.error('Error fetching transactions:', error)
    // Use mock data as fallback
    transactions.value = [
      {
        id: 1,
        transactionId: 'TXN001',
        customer: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        },
        type: 'earning',
        points: 150,
        amount: 75.50,
        status: 'completed',
        description: 'Purchase at store',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        transactionId: 'TXN002',
        customer: {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com'
        },
        type: 'spending',
        points: -50,
        amount: 25.00,
        status: 'completed',
        description: 'Reward redemption',
        createdAt: '2024-01-20T14:15:00Z'
      }
    ]
    totalItems.value = 2
  } finally {
    loading.value = false
  }
}

const fetchCustomers = async () => {
  try {
    const response = await $fetch('/api/admin/customers', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      baseURL: config.public.apiBase
    })
    customers.value = response.customers || []
  } catch (error) {
    console.error('Error fetching customers:', error)
    customers.value = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' }
    ]
  }
}

// Transaction actions
const viewTransaction = (transaction) => {
  // Navigate to transaction detail page
  navigateTo(`/admin/transactions/${transaction.id}`)
}

const editTransaction = (transaction) => {
  editingTransaction.value = transaction
  transactionForm.value = {
    customerId: transaction.customer?.id || '',
    type: transaction.type,
    points: transaction.points,
    amount: transaction.amount || 0,
    description: transaction.description || '',
    status: transaction.status
  }
  showEditModal.value = true
}

const deleteTransaction = async (transaction) => {
  if (confirm(`Are you sure you want to delete transaction ${transaction.transactionId}?`)) {
    try {
      await $fetch(`/api/admin/transactions/${transaction.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        baseURL: config.public.apiBase
      })
      await fetchTransactions()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }
}

const saveTransaction = async () => {
  try {
    if (showEditModal.value) {
      await $fetch(`/api/admin/transactions/${editingTransaction.value.id}`, {
        method: 'PUT',
        body: transactionForm.value,
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        baseURL: config.public.apiBase
      })
    } else {
      await $fetch('/api/admin/transactions', {
        method: 'POST',
        body: transactionForm.value,
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        baseURL: config.public.apiBase
      })
    }
    
    closeModal()
    await fetchTransactions()
  } catch (error) {
    console.error('Error saving transaction:', error)
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingTransaction.value = null
  transactionForm.value = {
    customerId: '',
    type: 'earning',
    points: 0,
    amount: 0,
    description: '',
    status: 'completed'
  }
}

// Pagination functions
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchTransactions()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchTransactions()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  fetchTransactions()
}

// Utility functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script> 