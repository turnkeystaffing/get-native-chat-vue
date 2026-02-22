<script setup lang="ts">
import { provide, ref, readonly } from 'vue'
import type { DeepReadonly, Ref } from 'vue'
import { CHAT_STATE_KEY, CONFIG_KEY } from '@/keys'
import type { UseChatReturn } from '@/composables/useChat'
import type { NativeChatPluginOptions } from '@/types/config'
import type { ChatMessage } from '@/types/chat'
import MessageBubble from '@/components/MessageBubble.vue'

const messages = ref<ChatMessage[]>([
  {
    id: 'demo-user-1',
    conversationId: 'demo-conv',
    role: 'user',
    content: 'What can you help me with?',
    createdAt: '2026-02-21T10:00:00.000Z',
    status: 'sent',
  },
  {
    id: 'demo-assistant-1',
    conversationId: 'demo-conv',
    role: 'assistant',
    content:
      '**I can help you with:**\n\n' +
      '- Answering questions about various topics\n' +
      '- Writing and editing text, emails, and documents\n' +
      '- Explaining concepts in simple terms\n' +
      '- Brainstorming ideas for projects\n\n' +
      'Feel free to ask me anything!',
    createdAt: '2026-02-21T10:00:05.000Z',
    status: 'sent',
  },
  {
    id: 'error-demo-1',
    conversationId: 'demo-conv',
    role: 'assistant',
    content: 'Something went wrong. You can try sending your message again.',
    createdAt: '2026-02-21T10:01:00.000Z',
    status: 'failed',
  },
])

const mockChatState: UseChatReturn = {
  messages: readonly(messages) as DeepReadonly<Ref<ChatMessage[]>>,
  isOpen: readonly(ref(true)),
  isLoading: readonly(ref(false)),
  isSending: readonly(ref(false)),
  hasMore: readonly(ref(false)),
  failedMessageText: readonly(ref<string | null>(null)),
  open: async () => {},
  close: () => {},
  sendMessage: async () => {},
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
    <div class="nc-message-bubble-demo">
      <h3 class="nc-message-bubble-demo__section-title">User Message</h3>
      <ul class="nc-message-bubble-demo__list">
        <MessageBubble :message="messages[0]" />
      </ul>

      <h3 class="nc-message-bubble-demo__section-title">Assistant Message (with Markdown)</h3>
      <ul class="nc-message-bubble-demo__list">
        <MessageBubble :message="messages[1]" />
      </ul>

      <h3 class="nc-message-bubble-demo__section-title">Error Message</h3>
      <ul class="nc-message-bubble-demo__list">
        <MessageBubble :message="messages[2]" />
      </ul>
    </div>
  </v-theme-provider>
</template>

<style scoped>
@layer native-chat {
  .nc-message-bubble-demo {
    padding: 16px;
  }

  .nc-message-bubble-demo__section-title {
    font-size: 14px;
    font-weight: 600;
    color: rgba(var(--v-theme-on-surface), 0.7);
    margin: 16px 0 8px;
  }

  .nc-message-bubble-demo__section-title:first-child {
    margin-top: 0;
  }

  .nc-message-bubble-demo__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}
</style>
