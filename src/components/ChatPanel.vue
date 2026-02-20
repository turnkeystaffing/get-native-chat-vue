<script setup lang="ts">
import { inject, computed, onUnmounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { CONFIG_KEY, CHAT_STATE_KEY } from '@/keys'
import ChatHeader from '@/components/ChatHeader.vue'
import WelcomeState from '@/components/WelcomeState.vue'

const chatState = inject(CHAT_STATE_KEY)!

// Computed proxy: reads isOpen state, ignores all Vuetify-initiated changes
// (prevents click-outside-to-close per UX spec; open/close managed by composable actions)
const drawerModel = computed({
  get: () => chatState.isOpen.value,
  set: () => {
    // Intentional no-op: drawer state is managed exclusively via chatState.open()/close()
  },
})

const config = inject(CONFIG_KEY)
const welcomeMessage = computed(() => config?.welcomeMessage)

const display = useDisplay()
const isMobile = computed(() => display.width.value < 768)
const panelWidth = computed(() => (isMobile.value ? '100%' : 400))

// Global Escape key handler — works regardless of focus location
const onEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && chatState.isOpen.value) {
    chatState.close()
  }
}

// Register/unregister based on open state to avoid unnecessary listeners
watch(
  () => chatState.isOpen.value,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', onEscapeKey)
    } else {
      window.removeEventListener('keydown', onEscapeKey)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  window.removeEventListener('keydown', onEscapeKey)
})
</script>

<template>
  <v-navigation-drawer
    v-model="drawerModel"
    location="right"
    temporary
    :scrim="false"
    :width="panelWidth"
    role="complementary"
    aria-label="Chat with AI Assistant"
    class="nc-chat-panel"
    :class="{ 'nc-chat-panel--mobile': isMobile }"
  >
    <ChatHeader />
    <div class="nc-chat-panel__body">
      <v-progress-circular
        v-if="chatState.isLoading.value"
        indeterminate
        size="24"
        class="nc-chat-panel__loader"
      />
      <WelcomeState v-else-if="chatState.messages.value.length === 0" :message="welcomeMessage" />
      <!-- MessageList slot for Story 2.2 -->
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
@layer native-chat {
  .nc-chat-panel__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
  }

  .nc-chat-panel__loader {
    align-self: center;
    margin-top: 32px;
  }

  .nc-chat-panel--mobile {
    height: 100dvh;
  }

  @media (min-width: 768px) {
    .nc-chat-panel {
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
    }
  }
}
</style>
