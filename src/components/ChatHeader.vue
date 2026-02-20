<script setup lang="ts">
import { inject } from 'vue'
import { CHAT_STATE_KEY } from '@/keys'
import IconStar from '@/icons/IconStar.vue'
import IconClose from '@/icons/IconClose.vue'

const chatState = inject(CHAT_STATE_KEY) as {
  isOpen: { value: boolean }
  open: () => void
  close: () => void
  toggle: () => void
}

if (!chatState) {
  throw new Error('[NativeChat] ChatHeader must be used inside NativeChatWidget')
}
</script>

<template>
  <div class="nc-chat-header">
    <div class="nc-chat-header__left">
      <v-icon :icon="IconStar" color="secondary" size="20" />
      <span class="nc-chat-header__title">AI Assistant</span>
    </div>
    <v-btn icon variant="text" size="small" aria-label="Close chat" @click="chatState.close()">
      <v-icon :icon="IconClose" size="18" />
    </v-btn>
  </div>
</template>

<style scoped>
@layer native-chat {
  .nc-chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
  }

  .nc-chat-header__left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nc-chat-header__title {
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
