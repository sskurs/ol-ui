# Nuxt.js Frontend Test Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- OpenLoyalty backend running on http://localhost:8181

## Quick Test Setup

### 1. Install Dependencies
```bash
cd nuxt-frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access the Application
Open your browser and navigate to: `http://localhost:3000`

## What to Test

### Authentication
1. **Login Page**: Should redirect to `/login` if not authenticated
2. **Demo Credentials**: 
   - Email: `admin@oloy.com`
   - Password: `admin123`
3. **Login Flow**: Should authenticate and redirect to dashboard

### Dashboard
1. **Stats Cards**: Should display mock data for:
   - Total Customers: 1,250
   - Total Transactions: 3,420
   - Total Points: 156,780
   - Active Campaigns: 8

2. **Recent Activity**: Should show mock transactions and customers

### Navigation
1. **Sidebar**: Should have working links to:
   - Dashboard (/)
   - Customers (/customers)
   - Transactions (/transactions)
   - Campaigns (/campaigns)
   - Earning Rules (/earning-rules)
   - Segments (/segments)
   - Settings (/settings)

2. **User Menu**: Should show user info and logout option

### Customer Management
1. **Customer List**: Should display mock customer data
2. **Search**: Should filter customers by name/email
3. **Status Filter**: Should filter by active/inactive status

### Transaction Management
1. **Transaction List**: Should display mock transaction data
2. **Filters**: Should work for date range, type, and customer
3. **Transaction Types**: Should show different colors for earn/spend/transfer

## Expected Features

### ✅ Working Features
- Modern, responsive UI
- Authentication system
- Dashboard with statistics
- Customer management interface
- Transaction management interface
- Navigation and routing
- Mobile-friendly design

### 🔄 Mock Data (Ready for API Integration)
- Customer data
- Transaction data
- Statistics
- User information

### 🚧 Future Enhancements
- Real API integration
- Campaign management
- Earning rules management
- Segment management
- Settings pages
- Advanced filtering and search
- Data export functionality

## Troubleshooting

### Common Issues
1. **Port 3000 in use**: Change port in `nuxt.config.ts`
2. **API connection errors**: Ensure backend is running on port 8181
3. **Build errors**: Check Node.js version (requires 18+)

### Development Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

## Docker Alternative
If you prefer using Docker:
```bash
# Build and run with Docker Compose
docker-compose -f ../docker-compose.nuxt.yml up -d

# Access at http://localhost:3000
```

## API Integration Notes
The frontend is configured to connect to the OpenLoyalty backend API at `http://localhost:8181`. 
Replace mock data with real API calls in the store and page components. 