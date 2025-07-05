<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Emails</h1>
          <p class="text-gray-600">Manage email templates and campaigns</p>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          Add Template
        </button>
      </div>
    </div>

    <!-- Email Templates Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="template in emailTemplates" :key="template.id" class="card">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="heroicons:envelope" class="w-5 h-5 text-blue-600" />
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-semibold text-gray-900">{{ template.name }}</h3>
              <p class="text-sm text-gray-500">{{ template.type }}</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <button @click="editTemplate(template)" class="text-indigo-600 hover:text-indigo-900">
              <Icon name="heroicons:pencil" class="w-4 h-4" />
            </button>
            <button @click="deleteTemplate(template)" class="text-red-600 hover:text-red-900">
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div class="space-y-3">
          <div>
            <span class="text-sm font-medium text-gray-700">Subject:</span>
            <span class="ml-2 text-sm text-gray-900">{{ template.subject }}</span>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-700">Status:</span>
            <span 
              class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="[
                template.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ template.active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div v-if="template.description" class="text-sm text-gray-600">
            {{ template.description }}
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit Template' : 'Add New Template' }}
          </h3>
          <form @submit.prevent="saveTemplate">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="form-input w-full"
                  placeholder="Template name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  class="form-input w-full"
                  placeholder="Email subject"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select v-model="form.type" class="form-select w-full">
                  <option value="welcome">Welcome Email</option>
                  <option value="campaign">Campaign</option>
                  <option value="notification">Notification</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  v-model="form.content"
                  rows="6"
                  class="form-textarea w-full"
                  placeholder="Email content..."
                ></textarea>
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
const emailTemplates = ref([])

const form = ref({
  id: null,
  name: '',
  subject: '',
  type: 'welcome',
  content: '',
  active: true
})

// Methods
const fetchTemplates = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/email-templates')
    emailTemplates.value = response.data || []
  } catch (error) {
    console.error('Error fetching templates:', error)
    // Mock data for demo
    emailTemplates.value = [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to OpenLoyalty!',
        type: 'welcome',
        content: 'Welcome to our loyalty program...',
        active: true,
        description: 'Sent to new customers upon registration'
      },
      {
        id: '2',
        name: 'Points Earned',
        subject: 'You earned points!',
        type: 'notification',
        content: 'Congratulations! You earned points...',
        active: true,
        description: 'Sent when customers earn points'
      }
    ]
  } finally {
    loading.value = false
  }
}

const editTemplate = (template) => {
  form.value = { ...template }
  showEditModal.value = true
}

const deleteTemplate = async (template) => {
  if (!confirm(`Are you sure you want to delete "${template.name}"?`)) return
  
  try {
    await $fetch(`/api/admin/email-templates/${template.id}`, {
      method: 'DELETE'
    })
    await fetchTemplates()
  } catch (error) {
    console.error('Error deleting template:', error)
    alert('Failed to delete template')
  }
}

const saveTemplate = async () => {
  saving.value = true
  try {
    if (showEditModal.value) {
      await $fetch(`/api/admin/email-templates/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await $fetch('/api/admin/email-templates', {
        method: 'POST',
        body: form.value
      })
    }
    
    closeModal()
    await fetchTemplates()
  } catch (error) {
    console.error('Error saving template:', error)
    alert('Failed to save template')
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
    subject: '',
    type: 'welcome',
    content: '',
    active: true
  }
}

// Lifecycle
onMounted(() => {
  fetchTemplates()
})
</script> 