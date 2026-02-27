import type { AxiosInstance } from 'axios'
import type {
  NativeChatApiClient,
  RawConversationResponse,
  RawConversationListResponse,
  RawMessageHistoryResponse,
  RawSendMessageResponse,
} from '@/types/api'

export function createNativeChatApiClient(config: {
  axiosInstance: AxiosInstance
}): NativeChatApiClient {
  if (!config?.axiosInstance) {
    throw new Error('[get-native-chat-vue] createNativeChatApiClient requires an axiosInstance')
  }

  const { axiosInstance } = config

  return {
    async createConversation() {
      // Empty body {} ensures Axios sends Content-Type: application/json
      const response = await axiosInstance.post<RawConversationResponse>('/conversations', {})
      const raw = response.data
      return {
        id: raw.conversation_id,
        createdAt: raw.created_at,
      }
    },

    async getConversations(offset: number, limit: number) {
      const response = await axiosInstance.get<RawConversationListResponse>('/conversations', {
        params: { offset, limit },
      })
      const raw = response.data
      return {
        conversations: raw.items.map((item) => ({
          id: item.conversation_id,
          createdAt: item.created_at,
        })),
        hasMore: raw.pagination?.has_more ?? false,
      }
    },

    async getMessages(conversationId: string, offset: number, limit: number) {
      const response = await axiosInstance.get<RawMessageHistoryResponse>(
        `/conversations/${encodeURIComponent(conversationId)}/messages`,
        { params: { offset, limit } },
      )
      const raw = response.data
      return {
        messages: raw.items.map((item) => ({
          id: item.message_id,
          conversationId,
          role: item.sender,
          content: item.content,
          createdAt: item.created_at,
        })),
        hasMore: raw.pagination?.has_more ?? false,
      }
    },

    async sendMessage(conversationId: string, message: string) {
      const response = await axiosInstance.post<RawSendMessageResponse>(
        `/conversations/${encodeURIComponent(conversationId)}/messages`,
        { message },
      )
      const raw = response.data
      // Both messages share the single timestamp returned by the API
      return {
        userMessage: {
          id: raw.user_message_id,
          conversationId: raw.conversation_id,
          role: 'user' as const,
          content: raw.user_message,
          createdAt: raw.timestamp,
        },
        assistantMessage: {
          id: raw.assistant_message_id,
          conversationId: raw.conversation_id,
          role: 'assistant' as const,
          content: raw.assistant_response,
          createdAt: raw.timestamp,
        },
      }
    },
  }
}
