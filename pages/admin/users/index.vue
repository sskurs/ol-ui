<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Users</h1>
          <p class="text-gray-600">Manage system users and administrators</p>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          Add User
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
            placeholder="Search users..."
            class="form-input w-full"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select v-model="filters.role" class="form-select w-full" @change="fetchUsers">
            <option value="">All Roles</option>
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_SELLER">Seller</option>
            <option value="ROLE_CUSTOMER">Customer</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.active" class="form-select w-full" @change="fetchUsers">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <Icon name="heroicons:arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
      </div>
      
      <div v-else-if="users.length === 0" class="text-center py-8">
        <Icon name="heroicons:user-circle" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No users found</p>
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
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
                  Last Login
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Icon name="heroicons:user-circle" class="w-5 h-5 text-gray-600" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        ID: {{ user.id }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="[
                      user.roles?.includes('ROLE_ADMIN') 
                        ? 'bg-red-100 text-red-800'
                        : user.roles?.includes('ROLE_SELLER')
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ user.roles?.includes('ROLE_ADMIN') ? 'Admin' : 
                       user.roles?.includes('ROLE_SELLER') ? 'Seller' : 'Customer' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="[
                      user.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ user.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.lastLogin ? formatDate(user.lastLogin) : 'Never' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="viewUser(user)" class="text-blue-600 hover:text-blue-900">
                      <Icon name="heroicons:eye" class="w-4 h-4" />
                    </button>
                    <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900">
                      <Icon name="heroicons:pencil" class="w-4 h-4" />
                    </button>
                    <button @click="deleteUser(user)" class="text-red-600 hover:text-red-900">
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
            {{ showEditModal ? 'Edit User' : 'Add New User' }}
          </h3>
          <form @submit.prevent="saveUser">
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
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_SELLER">Seller</option>
                  <option value="ROLE_CUSTOMER">Customer</option>
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
const users = ref([])

const filters = ref({
  search: '',
  role: '',
  active: ''
})

const form = ref({
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  role: 'ROLE_CUSTOMER',
  active: true
})

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  fetchUsers()
}, 300)

// Methods
const fetchUsers = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      ...filters.value
    })
    
    const response = await $fetch(`/api/admin/users?${params}`)
    users.value = response.data || []
  } catch (error) {
    console.error('Error fetching users:', error)
    // Mock data for demo
    users.value = [
      {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@openloyalty.com',
        roles: ['ROLE_ADMIN'],
        active: true,
        lastLogin: new Date().toISOString()
      },
      {
        id: '2',
        firstName: 'John',
        lastName: 'Seller',
        email: 'john.seller@example.com',
        roles: ['ROLE_SELLER'],
        active: true,
        lastLogin: new Date().toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
}

const viewUser = (user) => {
  // Navigate to user detail page
  navigateTo(`/admin/users/${user.id}`)
}

const editUser = (user) => {
  form.value = { 
    ...user,
    role: user.roles?.[0] || 'ROLE_CUSTOMER'
  }
  showEditModal.value = true
}

const deleteUser = async (user) => {
  if (!confirm(`Are you sure you want to delete "${user.firstName} ${user.lastName}"?`)) return
  
  try {
    await $fetch(`/api/admin/users/${user.id}`, {
      method: 'DELETE'
    })
    await fetchUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('Failed to delete user')
  }
}

const saveUser = async () => {
  saving.value = true
  try {
    const userData = {
      ...form.value,
      roles: [form.value.role]
    }
    
    if (showEditModal.value) {
      await $fetch(`/api/admin/users/${form.value.id}`, {
        method: 'PUT',
        body: userData
      })
    } else {
      await $fetch('/api/admin/users', {
        method: 'POST',
        body: userData
      })
    }
    
    closeModal()
    await fetchUsers()
  } catch (error) {
    console.error('Error saving user:', error)
    alert('Failed to save user')
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
    role: 'ROLE_CUSTOMER',
    active: true
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script> 