<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-4">POS</h1>
    <p class="text-gray-600 mb-8">Manage Point of Sale systems</p>
    
    <div class="card">
      <div class="text-center py-8">
        <Icon name="heroicons:computer-desktop" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">POS Management</h3>
        <p class="text-gray-500">This feature is coming soon.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})
</script> 