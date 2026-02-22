<script setup lang="ts">
import { ref, computed, watch, inject, nextTick, useTemplateRef } from 'vue'
import { CHAT_STATE_KEY } from '@/keys'
import IconSend from '@/icons/IconSend.vue'

const chatState = inject(CHAT_STATE_KEY)!

const inputText = ref('')
const textareaRef = useTemplateRef<{ focus: () => void }>('textareaRef')

const canSend = computed(() => inputText.value.trim().length > 0 && !chatState.isSending.value)

async function handleSend() {
  const text = inputText.value.trim()
  if (!text || chatState.isSending.value) return
  inputText.value = ''
  try {
    await chatState.sendMessage(text)
  } catch {
    // Errors handled in useChat composable
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

watch(
  () => chatState.failedMessageText.value,
  (newText) => {
    if (newText) {
      inputText.value = newText
    }
  },
)

// Focus textarea when chat opens (immediate: true needed because v-if in
// ChatPanel means ChatInput mounts when isOpen is already true)
watch(
  () => chatState.isOpen.value,
  (isOpen) => {
    if (isOpen) {
      nextTick(() => {
        textareaRef.value?.focus()
      })
    }
  },
  { immediate: true },
)

// Restore focus to textarea after send completes
watch(
  () => chatState.isSending.value,
  (sending, wasSending) => {
    if (wasSending && !sending) {
      nextTick(() => {
        textareaRef.value?.focus()
      })
    }
  },
)
</script>

<template>
  <div class="nc-chat-input">
    <v-textarea
      ref="textareaRef"
      v-model="inputText"
      auto-grow
      :rows="1"
      :max-rows="6"
      no-resize
      hide-details
      variant="outlined"
      density="compact"
      placeholder="Type a message"
      aria-label="Type a message"
      :disabled="chatState.isSending.value"
      class="nc-chat-input__textarea"
      @keydown="handleKeydown"
    />
    <v-btn
      icon
      variant="flat"
      color="secondary"
      size="small"
      :disabled="!canSend"
      aria-label="Send message"
      class="nc-chat-input__send-btn"
      @click="handleSend"
    >
      <IconSend />
    </v-btn>
  </div>
</template>

<style scoped>
@layer native-chat {
  .nc-chat-input {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 12px 16px;
    flex-shrink: 0;
  }

  .nc-chat-input__textarea {
    flex: 1;
  }

  .nc-chat-input__textarea :deep(.v-field) {
    border-radius: 24px;
  }

  .nc-chat-input__textarea :deep(textarea) {
    max-height: 120px;
  }

  .nc-chat-input__send-btn {
    flex-shrink: 0;
    margin-bottom: 2px;
  }
}
</style>
