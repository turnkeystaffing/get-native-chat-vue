<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { VBtn } from 'vuetify/components'
import { CONFIG_KEY, CHAT_STATE_KEY } from '@/keys'
import IconStar from '@/icons/IconStar.vue'

const config = inject(CONFIG_KEY)
const chatState = inject(CHAT_STATE_KEY)!

const isOpen = computed(() => chatState.isOpen.value)
const position = computed(() => config?.position ?? 'bottom-right')
const positionClass = computed(
  () => `nc-floating-button-wrapper--${position.value === 'bottom-left' ? 'left' : 'right'}`,
)

function toggle() {
  if (chatState.isOpen.value) {
    chatState.close()
  } else {
    chatState.open()
  }
}

const triggerBtn = ref<InstanceType<typeof VBtn> | null>(null)

function focus() {
  triggerBtn.value?.$el?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="nc-floating-button-wrapper" :class="positionClass">
    <v-btn
      ref="triggerBtn"
      icon
      size="56"
      color="secondary"
      elevation="4"
      :aria-label="isOpen ? 'Close chat' : 'Open chat'"
      :aria-expanded="isOpen.toString()"
      @click="toggle"
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
