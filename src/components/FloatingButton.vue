<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue'
import type { VBtn } from 'vuetify/components'
import { CONFIG_KEY, CHAT_STATE_KEY } from '@/keys'
import IconStar from '@/icons/IconStar.vue'
import IconClose from '@/icons/IconClose.vue'

const config = inject(CONFIG_KEY)
const chatState = inject(CHAT_STATE_KEY)!

const isOpen = computed(() => chatState.isOpen.value)
const isLoading = computed(() => chatState.isLoading.value)
const isHidden = computed(() => isOpen.value && (config?.hideToggleWhenOpen ?? false))
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

const triggerBtn = useTemplateRef<InstanceType<typeof VBtn>>('triggerBtn')

function focus() {
  triggerBtn.value?.$el?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div v-show="!isHidden" class="nc-floating-button-wrapper" :class="positionClass">
    <v-btn
      ref="triggerBtn"
      icon
      size="56"
      color="secondary"
      elevation="4"
      :loading="isLoading"
      :aria-label="isLoading ? 'Loading chat' : isOpen ? 'Close chat' : 'Open chat'"
      :aria-expanded="isOpen.toString()"
      @click="toggle"
    >
      <Transition name="nc-fab-icon" mode="out-in">
        <span :key="isOpen ? 'close' : 'star'" class="nc-floating-button__icon-wrap">
          <v-icon :icon="isOpen ? IconClose : IconStar" color="white" />
        </span>
      </Transition>
    </v-btn>
  </div>
</template>

<style scoped>
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

.nc-floating-button__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nc-fab-icon-enter-active,
.nc-fab-icon-leave-active {
  transition:
    opacity 120ms ease,
    transform 120ms ease;
}

.nc-fab-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}

.nc-fab-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}

@media (prefers-reduced-motion: reduce) {
  .nc-fab-icon-enter-active,
  .nc-fab-icon-leave-active {
    transition-duration: 0ms;
  }
}
</style>
