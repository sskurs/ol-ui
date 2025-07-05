export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()
  
  // Skip middleware on server-side
  if (process.server) return
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/backend-status']
  
  // If route is public, allow access
  if (publicRoutes.includes(to.path)) {
    return
  }
  
  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated.value && to.path.startsWith('/admin')) {
    return navigateTo('/login')
  }
  
  // If user is authenticated and trying to access login page
  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/admin')
  }
}) 