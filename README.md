# 🚀 OpenLoyalty Nuxt.js Frontend

A modern, responsive frontend for the OpenLoyalty loyalty program management system, built with Nuxt.js 3, Vue 3, and Tailwind CSS.

## ✨ Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Admin Dashboard**: Comprehensive admin interface with statistics and quick actions
- **Customer Management**: Full CRUD operations for customer data
- **Transaction Tracking**: Complete transaction management system
- **Campaign Management**: Create and manage marketing campaigns
- **Earning Rules**: Configure points earning rules and conditions
- **Authentication**: Secure JWT-based authentication
- **Mobile Responsive**: Optimized for all device sizes
- **Real-time Updates**: Live data updates and notifications

## 🛠️ Tech Stack

- **Framework**: Nuxt.js 3
- **Frontend**: Vue 3 with Composition API
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Icons**: Heroicons
- **Build Tool**: Vite
- **TypeScript**: Full TypeScript support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenLoyalty backend running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nuxt-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   # API Configuration
   API_BASE_URL=http://localhost:8000
   
   # App Configuration
   APP_NAME=OpenLoyalty
   APP_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
nuxt-frontend/
├── assets/                 # Static assets
│   └── css/
│       └── main.css       # Global styles
├── components/            # Reusable Vue components
├── composables/           # Composable functions
├── layouts/               # Layout components
│   ├── default.vue        # Default layout
│   └── admin.vue          # Admin layout
├── pages/                 # Application pages
│   ├── admin/             # Admin pages
│   │   ├── index.vue      # Dashboard
│   │   ├── customers/     # Customer management
│   │   ├── transactions/  # Transaction management
│   │   ├── campaigns/     # Campaign management
│   │   └── earning-rules/ # Earning rules
│   ├── login.vue          # Login page
│   └── index.vue          # Home page
├── stores/                # Pinia stores
│   └── user.ts            # User authentication store
├── public/                # Public static files
├── nuxt.config.ts         # Nuxt configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration

### Nuxt Configuration

The main configuration is in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  // Enable TypeScript
  typescript: {
    strict: true
  },
  
  // CSS Framework
  css: ['~/assets/css/main.css'],
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-icon'
  ],
  
  // Runtime config
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8000'
    }
  }
})
```

### Tailwind Configuration

Customize the design system in `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      }
    }
  }
}
```

## 🎨 UI Components

### Button Components

```vue
<!-- Primary button -->
<button class="btn-primary">
  Create New
</button>

<!-- Secondary button -->
<button class="btn-secondary">
  Cancel
</button>

<!-- Danger button -->
<button class="btn-danger">
  Delete
</button>
```

### Card Component

```vue
<div class="card">
  <h3 class="text-lg font-medium text-gray-900 mb-4">Card Title</h3>
  <p class="text-gray-600">Card content goes here...</p>
</div>
```

### Form Components

```vue
<!-- Input field -->
<input type="text" class="form-input" placeholder="Enter text..." />

<!-- Select dropdown -->
<select class="form-select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Textarea -->
<textarea class="form-textarea" rows="3"></textarea>
```

## 🔐 Authentication

### Login Flow

```vue
<script setup>
const userStore = useUserStore()

const login = async (credentials) => {
  try {
    await userStore.login(credentials)
    // Redirect to admin dashboard
    navigateTo('/admin')
  } catch (error) {
    // Handle login error
  }
}
</script>
```

### Protected Routes

```vue
<script setup>
definePageMeta({
  layout: 'admin'
})

// Check authentication on page load
onMounted(() => {
  if (!userStore.isAuthenticated) {
    navigateTo('/login')
  }
})
</script>
```

## 📊 API Integration

### Making API Calls

```vue
<script setup>
const { apiCall } = useApi()

// Fetch customers
const customers = await apiCall('/api/admin/customers')

// Create customer
const newCustomer = await apiCall('/api/admin/customers', {
  method: 'POST',
  body: customerData
})

// Update customer
const updatedCustomer = await apiCall(`/api/admin/customers/${id}`, {
  method: 'PUT',
  body: customerData
})

// Delete customer
await apiCall(`/api/admin/customers/${id}`, {
  method: 'DELETE'
})
</script>
```

## 🎯 Available Pages

### Admin Pages

- **Dashboard** (`/admin`) - Overview with statistics and quick actions
- **Customers** (`/admin/customers`) - Customer management with search and filters
- **Transactions** (`/admin/transactions`) - Transaction tracking and management
- **Campaigns** (`/admin/campaigns`) - Marketing campaign creation and management
- **Earning Rules** (`/admin/earning-rules`) - Points earning configuration

### Public Pages

- **Login** (`/login`) - Authentication page
- **Backend Status** (`/backend-status`) - API connectivity check

## 🚀 Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Environment Variables

```env
# Production
API_BASE_URL=https://api.openloyalty.com
APP_ENV=production
NODE_ENV=production
```

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e
```

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:

- **Touch-friendly**: Large touch targets and swipe gestures
- **Responsive Design**: Adapts to all screen sizes
- **Offline Support**: Service worker for offline functionality
- **PWA Ready**: Progressive Web App capabilities

## 🔧 Development

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

### Code Style

The project uses ESLint and Prettier for code formatting:

```bash
# Format code
npm run format

# Check code style
npm run lint:check
```

## 📚 Documentation

- [Migration Guide](../MIGRATION_GUIDE.md) - Complete migration documentation
- [API Documentation](https://api.openloyalty.com/docs) - Backend API reference
- [Vue 3 Documentation](https://vuejs.org/) - Vue.js framework docs
- [Nuxt.js Documentation](https://nuxt.com/) - Nuxt.js framework docs
- [Tailwind CSS Documentation](https://tailwindcss.com/) - CSS framework docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the documentation first
- **Issues**: Report bugs and feature requests on GitHub
- **Discussions**: Join community discussions
- **Email**: Contact support@openloyalty.com

---

## 🎉 Getting Started

Ready to get started? Follow the quick start guide above to set up your development environment and start building with the new OpenLoyalty frontend!

For more information, check out the [Migration Guide](../MIGRATION_GUIDE.md) for a complete overview of the migration from AngularJS to Nuxt.js. 