<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Global app setup
const { initializeAuth } = useAuth()

// Check authentication on app load
onMounted(() => {
  // Initialize user store from localStorage
  initializeAuth()
})
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style> 