<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  message?: string
}>()

const fullText = computed(() => props.message ?? 'What can I help you with today?')
const displayedText = ref('')
const isTyping = ref(true)

let intervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    displayedText.value = fullText.value
    isTyping.value = false
    return
  }

  let charIndex = 0
  intervalId = setInterval(() => {
    charIndex++
    displayedText.value = fullText.value.slice(0, charIndex)
    if (charIndex >= fullText.value.length) {
      clearInterval(intervalId!)
      intervalId = null
      isTyping.value = false
    }
  }, 70)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
})
</script>

<template>
  <div class="nc-welcome-state">
    <span class="nc-welcome-state__sr-only" role="status" aria-live="polite">{{ fullText }}</span>
    <div class="nc-welcome-state__content" aria-hidden="true">
      <span class="nc-welcome-state__text">{{ displayedText }}</span>
      <span v-if="isTyping" class="nc-welcome-state__cursor"></span>
    </div>
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

.nc-welcome-state__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.nc-welcome-state__content {
  max-width: 80%;
  text-align: center;
}

.nc-welcome-state__text {
  display: inline;
  font-size: 24px;
  font-weight: 400;
  color: rgb(var(--v-theme-welcome-text));
}

.nc-welcome-state__cursor {
  display: inline-block;
  width: 3px;
  height: 1.2em;
  margin-left: 2px;
  vertical-align: baseline;
  background-color: rgb(var(--v-theme-welcome-text));
  border-radius: 2px;
  animation: nc-typewriter-cursor 0.8s step-end infinite;
}

@keyframes nc-typewriter-cursor {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nc-welcome-state__cursor {
    animation: none;
  }
}
</style>
