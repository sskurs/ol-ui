export const useApi = () => {
  const { token } = useAuth()
  const config = useRuntimeConfig()

  const apiCall = async (endpoint: string, options: any = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    // Add authorization header if token exists
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    return await $fetch(endpoint, {
      ...options,
      headers,
      baseURL: config.public.apiBase
    })
  }

  return { apiCall }
} 