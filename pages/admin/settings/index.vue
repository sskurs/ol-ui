<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
          <p class="text-gray-600">Configure system settings and preferences</p>
        </div>
        <button @click="saveAllSettings" class="btn-primary" :disabled="saving">
          <Icon v-if="saving" name="heroicons:arrow-path" class="w-5 h-5 mr-2 animate-spin" />
          <Icon v-else name="heroicons:check" class="w-5 h-5 mr-2" />
          Save All Settings
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- General Settings -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              v-model="settings.general.companyName"
              type="text"
              class="form-input w-full"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">System Email</label>
            <input
              v-model="settings.general.systemEmail"
              type="email"
              class="form-input w-full"
              placeholder="Enter system email"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
            <select v-model="settings.general.defaultCurrency" class="form-select w-full">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select v-model="settings.general.timezone" class="form-select w-full">
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loyalty Program Settings -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Loyalty Program</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Points Name</label>
            <input
              v-model="settings.loyalty.pointsName"
              type="text"
              class="form-input w-full"
              placeholder="e.g., Points, Credits, Rewards"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Default Points per Dollar</label>
            <input
              v-model="settings.loyalty.defaultPointsPerDollar"
              type="number"
              min="0"
              step="0.01"
              class="form-input w-full"
              placeholder="1.0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Points Expiry (days)</label>
            <input
              v-model="settings.loyalty.pointsExpiryDays"
              type="number"
              min="0"
              class="form-input w-full"
              placeholder="365"
            />
          </div>
          <div>
            <label class="flex items-center">
              <input
                v-model="settings.loyalty.allowNegativeBalance"
                type="checkbox"
                class="form-checkbox h-4 w-4 text-blue-600"
              />
              <span class="ml-2 text-sm text-gray-700">Allow negative points balance</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Email Settings -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Email Settings</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
            <input
              v-model="settings.email.smtpHost"
              type="text"
              class="form-input w-full"
              placeholder="smtp.gmail.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
            <input
              v-model="settings.email.smtpPort"
              type="number"
              class="form-input w-full"
              placeholder="587"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
            <input
              v-model="settings.email.smtpUsername"
              type="text"
              class="form-input w-full"
              placeholder="your-email@gmail.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
            <input
              v-model="settings.email.smtpPassword"
              type="password"
              class="form-input w-full"
              placeholder="Enter SMTP password"
            />
          </div>
          <div>
            <label class="flex items-center">
              <input
                v-model="settings.email.enableSSL"
                type="checkbox"
                class="form-checkbox h-4 w-4 text-blue-600"
              />
              <span class="ml-2 text-sm text-gray-700">Enable SSL/TLS</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
        <div class="space-y-4">
          <div>
            <label class="flex items-center">
              <input
                v-model="settings.notifications.emailNotifications"
                type="checkbox"
                class="form-checkbox h-4 w-4 text-blue-600"
              />
              <span class="ml-2 text-sm text-gray-700">Enable email notifications</span>
            </label>
          </div>
          <div>
            <label class="flex items-center">
              <input
                v-model="settings.notifications.smsNotifications"
                type="checkbox"
                class="form-checkbox h-4 w-4 text-blue-600"
              />
              <span class="ml-2 text-sm text-gray-700">Enable SMS notifications</span>
            </label>
          </div>
          <div>
            <label class="flex items-center">
              <input
                v-model="settings.notifications.pushNotifications"
                type="checkbox"
                class="form-checkbox h-4 w-4 text-blue-600"
              />
              <span class="ml-2 text-sm text-gray-700">Enable push notifications</span>
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Welcome Email Template</label>
            <textarea
              v-model="settings.notifications.welcomeEmailTemplate"
              rows="4"
              class="form-textarea w-full"
              placeholder="Welcome to our loyalty program..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Security</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
            <input
              v-model="settings.security.sessionTimeout"
              type="number"
              min="5"
              class="form-input w-full"
              placeholder="30"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
            <input
              v-model="settings.security.maxLoginAttempts"
              type="number"
              min="1"
              class="form-input w-full"
              placeholder="5"
            />
          </div>
          <div>
            <label class="flex items-center">
              <input
                v-model="settings.security.requireTwoFactor"
                type="checkbox"
                class="form-checkbox h-4 w-4 text-blue-600"
              />
              <span class="ml-2 text-sm text-gray-700">Require two-factor authentication</span>
            </label>
          </div>
          <div>
            <label class="flex items-center">
              <input
                v-model="settings.security.enableAuditLog"
                type="checkbox"
                class="form-checkbox h-4 w-4 text-blue-600"
              />
              <span class="ml-2 text-sm text-gray-700">Enable audit logging</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Integration Settings -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Integrations</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
            <input
              v-model="settings.integrations.googleAnalyticsId"
              type="text"
              class="form-input w-full"
              placeholder="GA-XXXXXXXXX-X"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
            <input
              v-model="settings.integrations.facebookPixelId"
              type="text"
              class="form-input w-full"
              placeholder="XXXXXXXXXX"
            />
          </div>
          <div>
            <label class="flex items-center">
              <input
                v-model="settings.integrations.enableGoogleAnalytics"
                type="checkbox"
                class="form-checkbox h-4 w-4 text-blue-600"
              />
              <span class="ml-2 text-sm text-gray-700">Enable Google Analytics</span>
            </label>
          </div>
          <div>
            <label class="flex items-center">
              <input
                v-model="settings.integrations.enableFacebookPixel"
                type="checkbox"
                class="form-checkbox h-4 w-4 text-blue-600"
              />
              <span class="ml-2 text-sm text-gray-700">Enable Facebook Pixel</span>
            </label>
          </div>
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
const saving = ref(false)

const settings = ref({
  general: {
    companyName: 'OpenLoyalty',
    systemEmail: 'admin@openloyalty.com',
    defaultCurrency: 'USD',
    timezone: 'UTC'
  },
  loyalty: {
    pointsName: 'Points',
    defaultPointsPerDollar: 1.0,
    pointsExpiryDays: 365,
    allowNegativeBalance: false
  },
  email: {
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    enableSSL: true
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    welcomeEmailTemplate: 'Welcome to our loyalty program!'
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireTwoFactor: false,
    enableAuditLog: true
  },
  integrations: {
    googleAnalyticsId: '',
    facebookPixelId: '',
    enableGoogleAnalytics: false,
    enableFacebookPixel: false
  }
})

// Methods
const fetchSettings = async () => {
  try {
    const response = await $fetch('/api/admin/settings')
    if (response) {
      settings.value = { ...settings.value, ...response }
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    // Use default settings if API fails
  }
}

const saveAllSettings = async () => {
  saving.value = true
  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: settings.value
    })
    alert('Settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Failed to save settings')
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchSettings()
})
</script> 