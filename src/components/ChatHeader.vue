<script setup lang="ts">
import { inject } from 'vue'
import { CHAT_STATE_KEY } from '@/keys'
import IconStar from '@/icons/IconStar.vue'
import IconClose from '@/icons/IconClose.vue'

const chatState = inject(CHAT_STATE_KEY)!
</script>

<template>
  <div class="nc-chat-header">
    <div class="nc-chat-header__left">
      <v-avatar color="secondary" size="44">
        <v-icon :icon="IconStar" color="white" size="20"></v-icon>
      </v-avatar>
      <span class="nc-chat-header__title">AI Assistant</span>
    </div>
    <v-btn icon variant="text" size="default" aria-label="Close chat" @click="chatState.close()">
      <v-icon :icon="IconClose" size="22" />
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
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
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
