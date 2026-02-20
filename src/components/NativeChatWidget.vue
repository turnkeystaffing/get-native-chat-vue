<script setup lang="ts">
import { ref, readonly, provide } from 'vue'
import { useTheme } from 'vuetify'
import { CHAT_STATE_KEY } from '@/keys'
import { nativeChatTheme } from '@/theme/nativeChatTheme'
import FloatingButton from '@/components/FloatingButton.vue'

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
</script>

<template>
  <v-theme-provider theme="nativeChat">
    <FloatingButton />
  </v-theme-provider>
</template>

<style scoped>
/* Styles will be added in future stories as needed */
</style>
