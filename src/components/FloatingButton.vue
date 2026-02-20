<script setup lang="ts">
import { computed, inject } from 'vue'
import { CONFIG_KEY, CHAT_STATE_KEY } from '@/keys'
import IconStar from '@/icons/IconStar.vue'

const config = inject(CONFIG_KEY)
const state = inject(CHAT_STATE_KEY) as
  | { isOpen: { value: boolean }; open: () => void; close: () => void; toggle: () => void }
  | undefined

if (!state) {
  throw new Error('[NativeChat] FloatingButton must be used inside NativeChatWidget')
}

const isOpen = computed(() => state.isOpen.value)
const position = computed(() => config?.position ?? 'bottom-right')
const positionClass = computed(
  () => `nc-floating-button-wrapper--${position.value === 'bottom-left' ? 'left' : 'right'}`,
)
</script>

<template>
  <div class="nc-floating-button-wrapper" :class="positionClass">
    <v-btn
      icon
      size="56"
      color="secondary"
      elevation="4"
      :aria-label="isOpen ? 'Close chat' : 'Open chat'"
      :aria-expanded="isOpen.toString()"
      @click="state.toggle"
    >
      <v-icon :icon="IconStar" color="white" />
    </v-btn>
  </div>
</template>

<style scoped>
@layer native-chat {
  .nc-floating-button-wrapper {
    position: fixed;
    z-index: 9999;
    bottom: 24px;
  }

  .nc-floating-button-wrapper--right {
    right: 24px;
  }

  .nc-floating-button-wrapper--left {
    left: 24px;
  }
}
</style>
