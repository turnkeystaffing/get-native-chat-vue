import type { AxiosInstance } from 'axios'
import type {
  NativeChatApiClient,
  ConversationResponse,
  ConversationListResponse,
  MessageHistoryResponse,
  SendMessageResponse,
} from '@/types/api'

export function createNativeChatApiClient(config: {
  axiosInstance: AxiosInstance
}): NativeChatApiClient {
  if (!config?.axiosInstance) {
    throw new Error('[native-chat-vue] createNativeChatApiClient requires an axiosInstance')
  }

  const { axiosInstance } = config

  return {
    async createConversation() {
      // Empty body {} ensures Axios sends Content-Type: application/json
      const response = await axiosInstance.post<ConversationResponse>('/conversations', {})
      return response.data
    },

    async getConversations(offset: number, limit: number) {
      const response = await axiosInstance.get<ConversationListResponse>('/conversations', {
        params: { offset, limit },
      })
      return response.data
    },

    async getMessages(conversationId: string, offset: number, limit: number) {
      const response = await axiosInstance.get<MessageHistoryResponse>(
        `/conversations/${encodeURIComponent(conversationId)}/messages`,
        { params: { offset, limit } },
      )
      return response.data
    },

    async sendMessage(conversationId: string, message: string) {
      const response = await axiosInstance.post<SendMessageResponse>(
        `/conversations/${encodeURIComponent(conversationId)}/messages`,
        { message },
      )
      return response.data
    },
  }
}
