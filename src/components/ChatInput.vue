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
      :max-rows="10"
      no-resize
      hide-details
      variant="solo"
      density="compact"
      flat
      rounded="lg"
      placeholder="How can I help you? Ask me anything..."
      aria-label="Type a message"
      :disabled="chatState.isSending.value"
      class="nc-chat-input__textarea"
      @keydown="handleKeydown"
    >
      <template #append-inner>
        <v-btn
          icon
          variant="text"
          density="comfortable"
          :color="canSend || chatState.isSending.value ? 'primary' : undefined"
          :disabled="!canSend"
          aria-label="Send message"
          @click="handleSend"
        >
          <v-progress-circular
            v-if="chatState.isSending.value"
            indeterminate
            :size="16"
            :width="2"
            color="primary"
          />
          <v-icon v-else :icon="IconSend" color="secondary"></v-icon>
        </v-btn>
      </template>
    </v-textarea>
  </div>
</template>

<style scoped>
@layer native-chat {
  .nc-chat-input {
    padding: 8px 16px 16px;
    flex-shrink: 0;
  }

  .nc-chat-input__textarea :deep(textarea) {
    max-height: 120px;
  }

  .nc-chat-input__textarea :deep(.v-field__append-inner) {
    align-self: flex-end;
    padding-bottom: 2px;
  }
}
</style>
