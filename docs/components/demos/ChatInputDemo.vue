<script setup lang="ts">
import { provide, ref, readonly } from 'vue'
import type { DeepReadonly, Ref } from 'vue'
import { CHAT_STATE_KEY, CONFIG_KEY } from '@/keys'
import type { UseChatReturn } from '@/composables/useChat'
import type { NativeChatPluginOptions } from '@/types/config'
import type { ChatMessage } from '@/types/chat'
import ChatInput from '@/components/ChatInput.vue'

const isSendingState = ref(false)
const lastSent = ref<string | null>(null)

async function handleSend(text: string) {
  lastSent.value = text
  isSendingState.value = true
  await new Promise((r) => setTimeout(r, 1500))
  isSendingState.value = false
}

const mockChatState: UseChatReturn = {
  messages: readonly(ref<ChatMessage[]>([])) as DeepReadonly<Ref<ChatMessage[]>>,
  isOpen: readonly(ref(true)),
  isLoading: readonly(ref(false)),
  isSending: readonly(isSendingState),
  hasMore: readonly(ref(false)),
  failedMessageText: readonly(ref<string | null>(null)),
  open: async () => {},
  close: () => {},
  sendMessage: handleSend,
  loadMore: async () => {},
  retry: async () => {},
}

provide(CHAT_STATE_KEY, mockChatState)
provide(CONFIG_KEY, {
  apiClient: {
    createConversation: async () => ({ id: '', createdAt: '' }),
    getConversations: async () => ({ conversations: [], has_more: false }),
    getMessages: async () => ({ messages: [], has_more: false }),
    sendMessage: async () => ({
      userMessage: {
        id: '',
        conversationId: '',
        role: 'user' as const,
        content: '',
        createdAt: '',
      },
      assistantMessage: {
        id: '',
        conversationId: '',
        role: 'assistant' as const,
        content: '',
        createdAt: '',
      },
    }),
  },
} satisfies NativeChatPluginOptions)
</script>

<template>
  <v-theme-provider theme="nativeChat">
    <div class="nc-chat-input-demo">
      <p class="nc-chat-input-demo__hint">
        Type a message and press <strong>Enter</strong> to send. Use
        <strong>Shift+Enter</strong> for a new line. The textarea auto-expands up to 6 lines.
      </p>

      <div class="nc-chat-input-demo__container">
        <ChatInput />
      </div>

      <p v-if="isSendingState" class="nc-chat-input-demo__status">
        Sending... (input disabled for 1.5s)
      </p>
      <p v-if="lastSent && !isSendingState" class="nc-chat-input-demo__status">
        Last sent: "{{ lastSent }}"
      </p>
    </div>
  </v-theme-provider>
</template>

<style scoped>
@layer native-chat {
  .nc-chat-input-demo {
    padding: 16px;
  }

  .nc-chat-input-demo__hint {
    font-size: 14px;
    color: rgba(var(--v-theme-on-surface), 0.7);
    margin-bottom: 12px;
  }

  .nc-chat-input-demo__container {
    border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
    border-radius: 8px;
    overflow: hidden;
  }

  .nc-chat-input-demo__status {
    margin-top: 8px;
    font-size: 13px;
    color: rgba(var(--v-theme-on-surface), 0.6);
  }
}
</style>
