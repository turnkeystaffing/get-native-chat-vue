<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { setSimulateError } from '../../.vitepress/mock/mockApiClient'

const activeError = ref<number | null>(null)

function toggleError(code: number) {
  if (activeError.value === code) {
    activeError.value = null
    setSimulateError(null)
  } else {
    activeError.value = code
    setSimulateError(code)
  }
}

function resetErrors() {
  activeError.value = null
  setSimulateError(null)
}

onBeforeUnmount(() => setSimulateError(null))
</script>

<template>
  <v-theme-provider theme="nativeChat">
    <div class="nc-error-demo">
      <p class="nc-error-demo__description">
        Toggle an error mode below, then send a message in the chat widget to see how errors are
        handled.
      </p>
      <div class="nc-error-demo__buttons">
        <v-btn
          size="small"
          :variant="activeError === 429 ? 'flat' : 'outlined'"
          :color="activeError === 429 ? 'error' : 'default'"
          @click="toggleError(429)"
        >
          429 Rate Limit
        </v-btn>
        <v-btn
          size="small"
          :variant="activeError === 503 ? 'flat' : 'outlined'"
          :color="activeError === 503 ? 'error' : 'default'"
          @click="toggleError(503)"
        >
          503 Unavailable
        </v-btn>
        <v-btn
          size="small"
          :variant="activeError === 500 ? 'flat' : 'outlined'"
          :color="activeError === 500 ? 'error' : 'default'"
          @click="toggleError(500)"
        >
          500 Server Error
        </v-btn>
        <v-btn size="small" variant="tonal" @click="resetErrors"> Reset </v-btn>
      </div>
      <p v-if="activeError" class="nc-error-demo__status">
        Error mode active: <strong>{{ activeError }}</strong> — send a message to trigger
      </p>
    </div>
  </v-theme-provider>
</template>

<style scoped>
.nc-error-demo {
  padding: 16px;
}

.nc-error-demo__description {
  margin-bottom: 12px;
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.nc-error-demo__buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.nc-error-demo__status {
  margin-top: 12px;
  font-size: 13px;
  color: rgb(var(--v-theme-error));
}
</style>
