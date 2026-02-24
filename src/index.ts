export { NativeChatPlugin } from '@/plugin'
export { NativeChatPlugin as default } from '@/plugin'
export { default as NativeChatWidget } from '@/components/NativeChatWidget.vue'
export { createNativeChatApiClient } from '@/helpers/createApiClient'

export type {
  NativeChatApiClient,
  ConversationResponse,
  ConversationListResponse,
  MessageResponse,
  MessageHistoryResponse,
  SendMessageResponse,
  ChatMessage,
  MessageStatus,
  ChatError,
  NativeChatPluginOptions,
} from '@/types'
