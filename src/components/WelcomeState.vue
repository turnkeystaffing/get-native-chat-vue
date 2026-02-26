<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="nc-welcome-state">
    <p class="nc-welcome-state__text">{{ message ?? 'Hello! How can I help you?' }}</p>
  </div>
</template>

<style scoped>
.nc-welcome-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 24px;
}

.nc-welcome-state__text {
  font-size: 24px;
  font-weight: 400;
  color: rgb(var(--v-theme-welcome-text));
  text-align: center;
}
</style>
