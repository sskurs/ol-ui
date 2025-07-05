import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  roles: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useUserStore = defineStore('user', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    isAdmin: (state) => state.user?.roles.includes('ROLE_ADMIN') || false,
    isSeller: (state) => state.user?.roles.includes('ROLE_SELLER') || false,
    isCustomer: (state) => state.user?.roles.includes('ROLE_CUSTOMER') || false,
  },

  actions: {
    setToken(token: string) {
      this.token = token
      this.isAuthenticated = true
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
      }
    },

    setUser(user: User) {
      this.user = user
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(user))
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    },

    async initializeAuth() {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('auth_user')
        
        if (token) {
          this.token = token
          this.isAuthenticated = true
          
          if (userStr) {
            try {
              this.user = JSON.parse(userStr)
            } catch (error) {
              console.error('Error parsing user data:', error)
              localStorage.removeItem('auth_user')
            }
          }
        }
      }
    },

    // Alias for initializeAuth for backward compatibility
    initializeFromStorage() {
      return this.initializeAuth()
    }
  }
}) 