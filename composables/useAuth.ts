export const useAuth = () => {
  const userStore = useUserStore()
  const config = useRuntimeConfig()

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await $fetch('/api/admin/login_check', {
        method: 'POST',
        body: credentials,
        baseURL: config.public.apiBase
      })
      
      userStore.setToken(response.token)
      userStore.setUser(response.user)
      
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    userStore.logout()
  }

  const initializeAuth = () => {
    return userStore.initializeAuth()
  }

  return {
    login,
    logout,
    initializeAuth,
    user: computed(() => userStore.user),
    token: computed(() => userStore.token),
    isAuthenticated: computed(() => userStore.isAuthenticated),
    isAdmin: computed(() => userStore.isAdmin),
    isSeller: computed(() => userStore.isSeller),
    isCustomer: computed(() => userStore.isCustomer)
  }
} 