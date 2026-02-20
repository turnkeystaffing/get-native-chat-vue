<script setup lang="ts">
import { provide, watch, nextTick, inject, useTemplateRef } from 'vue'
import { useTheme } from 'vuetify'
import { CONFIG_KEY, CHAT_STATE_KEY } from '@/keys'
import { useChat } from '@/composables/useChat'
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

const config = inject(CONFIG_KEY)!
const chatState = useChat(config.apiClient, config)

provide(CHAT_STATE_KEY, chatState)

const floatingButtonRef = useTemplateRef<InstanceType<typeof FloatingButton>>('floatingButtonRef')

// Return focus to floating button on close
watch(
  () => chatState.isOpen.value,
  (val) => {
    if (!val) {
      nextTick(() => {
        floatingButtonRef.value?.focus()
      })
    }
  },
)
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
