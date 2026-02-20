import type { NativeChatApiClient } from '@/types/api'

export function createNativeChatApiClient(config: {
  baseUrl: string
  getAccessToken: () => string | Promise<string>
}): NativeChatApiClient {
  const { baseUrl, getAccessToken } = config

  async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = await getAccessToken()
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    }
    if (options.body) {
      headers['Content-Type'] = 'application/json'
    }
    const response = await fetch(url, { ...options, headers })

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
      ;(error as Error & { statusCode: number }).statusCode = response.status
      throw error
    }

    return response.json() as Promise<T>
  }

  return {
    createConversation() {
      return request(`${baseUrl}/conversations`, { method: 'POST' })
    },

    getConversations(offset: number, limit: number) {
      return request(`${baseUrl}/conversations?offset=${offset}&limit=${limit}`)
    },

    getMessages(conversationId: string, offset: number, limit: number) {
      return request(
        `${baseUrl}/conversations/${encodeURIComponent(conversationId)}/messages?offset=${offset}&limit=${limit}`,
      )
    },

    sendMessage(conversationId: string, message: string) {
      return request(`${baseUrl}/conversations/${encodeURIComponent(conversationId)}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      })
    },
  }
}
