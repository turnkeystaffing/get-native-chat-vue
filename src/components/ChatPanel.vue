<script setup lang="ts">
import { inject, computed, onUnmounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { CONFIG_KEY, CHAT_STATE_KEY } from '@/keys'
import ChatHeader from '@/components/ChatHeader.vue'
import WelcomeState from '@/components/WelcomeState.vue'
import MessageList from '@/components/MessageList.vue'
import ChatInput from '@/components/ChatInput.vue'

const chatState = inject(CHAT_STATE_KEY)!

const config = inject(CONFIG_KEY)
const welcomeMessage = computed(() => config?.welcomeMessage)

const display = useDisplay()
const isMobile = computed(() => display.width.value < 768)

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
  <Teleport to="body">
    <div
      v-if="chatState.isOpen.value"
      class="nc-chat-panel"
      :class="{ 'nc-chat-panel--mobile': isMobile }"
      role="complementary"
      aria-label="Chat with AI Assistant"
    >
      <ChatHeader />
      <div class="nc-chat-panel__body">
        <v-progress-circular
          v-if="chatState.isLoading.value && chatState.messages.value.length === 0"
          indeterminate
          size="24"
          class="nc-chat-panel__loader"
        />
        <WelcomeState
          v-else-if="chatState.messages.value.length === 0 && !chatState.isSending.value"
          :message="welcomeMessage"
        />
        <MessageList v-else />
      </div>
      <ChatInput />
    </div>
  </Teleport>
</template>

<style scoped>
@layer native-chat {
  .nc-chat-panel {
    position: fixed;
    right: 24px;
    bottom: 24px;
    top: 24px;
    width: 420px;
    border-radius: 20px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 10000;
    background: rgb(var(--v-theme-surface));
  }

  .nc-chat-panel--mobile {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100dvh;
    border-radius: 0;
    box-shadow: none;
  }

  .nc-chat-panel__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .nc-chat-panel__loader {
    align-self: center;
    margin-top: 32px;
  }
}
</style>
