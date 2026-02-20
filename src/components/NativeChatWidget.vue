<script setup lang="ts">
import { ref, readonly, provide, watch, nextTick } from 'vue'
import { useTheme } from 'vuetify'
import { CHAT_STATE_KEY } from '@/keys'
import { nativeChatTheme } from '@/theme/nativeChatTheme'
import FloatingButton from '@/components/FloatingButton.vue'
import ChatPanel from '@/components/ChatPanel.vue'

const theme = useTheme()
if (!theme.themes.value.nativeChat) {
  const light = theme.themes.value.light
  theme.themes.value.nativeChat = {
    ...light,
    ...nativeChatTheme,
    colors: {
      ...light.colors,
      ...nativeChatTheme.colors,
    },
    variables: {
      ...light.variables,
      ...nativeChatTheme.variables,
    },
  }
}

const floatingButtonRef = ref<InstanceType<typeof FloatingButton> | null>(null)
const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}
const close = () => {
  isOpen.value = false
}
const toggle = () => {
  isOpen.value = !isOpen.value
}

provide(CHAT_STATE_KEY, {
  isOpen: readonly(isOpen),
  open,
  close,
  toggle,
})

// Return focus to floating button on close
watch(isOpen, (val) => {
  if (!val) {
    nextTick(() => {
      floatingButtonRef.value?.focus()
    })
  }
})
</script>

<template>
  <v-theme-provider theme="nativeChat">
    <FloatingButton ref="floatingButtonRef" />
    <ChatPanel />
  </v-theme-provider>
</template>

<style scoped>
/* Styles will be added in future stories as needed */
</style>
