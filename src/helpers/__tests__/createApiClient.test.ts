import type { AxiosInstance } from 'axios'
import { createNativeChatApiClient } from '@/helpers/createApiClient'

function createMockAxiosInstance() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  } as unknown as AxiosInstance
}

describe('createNativeChatApiClient', () => {
  let mockAxios: AxiosInstance

  beforeEach(() => {
    mockAxios = createMockAxiosInstance()
  })

  it('returns an object with all 4 NativeChatApiClient methods', () => {
    const client = createNativeChatApiClient({ axiosInstance: mockAxios })

    expect(typeof client.createConversation).toBe('function')
    expect(typeof client.getConversations).toBe('function')
    expect(typeof client.getMessages).toBe('function')
    expect(typeof client.sendMessage).toBe('function')
  })

  it('throws a descriptive error when axiosInstance is undefined', () => {
    expect(() =>
      createNativeChatApiClient({ axiosInstance: undefined as unknown as AxiosInstance }),
    ).toThrow('[get-native-chat-vue] createNativeChatApiClient requires an axiosInstance')
  })

  it('throws a descriptive error when config is null', () => {
    expect(() =>
      createNativeChatApiClient(null as unknown as { axiosInstance: AxiosInstance }),
    ).toThrow('[get-native-chat-vue] createNativeChatApiClient requires an axiosInstance')
  })

  describe('createConversation', () => {
    it('maps raw API response to internal format', async () => {
      const rawResponse = {
        conversation_id: 'conv-1',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      }
      ;(mockAxios.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: rawResponse })

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })
      const result = await client.createConversation()

      expect(mockAxios.post).toHaveBeenCalledWith('/conversations', {})
      expect(result).toEqual({ id: 'conv-1', createdAt: '2026-01-01T00:00:00Z' })
    })
  })

  describe('getConversations', () => {
    it('maps raw API list response to internal format', async () => {
      const rawResponse = {
        items: [
          { conversation_id: 'conv-1', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
          { conversation_id: 'conv-2', created_at: '2026-01-02T00:00:00Z', updated_at: '2026-01-02T00:00:00Z' },
        ],
        pagination: { has_more: true, offset: 0, limit: 20 },
      }
      ;(mockAxios.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: rawResponse })

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })
      const result = await client.getConversations(0, 20)

      expect(mockAxios.get).toHaveBeenCalledWith('/conversations', {
        params: { offset: 0, limit: 20 },
      })
      expect(result).toEqual({
        conversations: [
          { id: 'conv-1', createdAt: '2026-01-01T00:00:00Z' },
          { id: 'conv-2', createdAt: '2026-01-02T00:00:00Z' },
        ],
        hasMore: true,
      })
    })
  })

  describe('getMessages', () => {
    it('maps raw API message history to internal format and injects conversationId', async () => {
      const rawResponse = {
        items: [
          { message_id: 'msg-1', content: 'hello', sender: 'user' as const, created_at: '2026-01-01T00:00:00Z', sequence: 1 },
          { message_id: 'msg-2', content: 'hi there', sender: 'assistant' as const, created_at: '2026-01-01T00:00:01Z', sequence: 2 },
        ],
        pagination: { has_more: false, offset: 0, limit: 20 },
      }
      ;(mockAxios.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: rawResponse })

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })
      const result = await client.getMessages('conv-42', 0, 20)

      expect(mockAxios.get).toHaveBeenCalledWith('/conversations/conv-42/messages', {
        params: { offset: 0, limit: 20 },
      })
      expect(result).toEqual({
        messages: [
          { id: 'msg-1', conversationId: 'conv-42', role: 'user', content: 'hello', createdAt: '2026-01-01T00:00:00Z' },
          { id: 'msg-2', conversationId: 'conv-42', role: 'assistant', content: 'hi there', createdAt: '2026-01-01T00:00:01Z' },
        ],
        hasMore: false,
      })
    })

    it('injects conversationId from method parameter into each message', async () => {
      const rawResponse = {
        items: [
          { message_id: 'msg-10', content: 'test', sender: 'user' as const, created_at: '2026-01-01T00:00:00Z', sequence: 1 },
        ],
        pagination: { has_more: false, offset: 0, limit: 20 },
      }
      ;(mockAxios.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: rawResponse })

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })
      const result = await client.getMessages('my-conv-id', 0, 20)

      expect(result.messages[0].conversationId).toBe('my-conv-id')
    })

    it('encodes special characters in conversationId', async () => {
      const rawResponse = {
        items: [],
        pagination: { has_more: false, offset: 0, limit: 10 },
      }
      ;(mockAxios.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: rawResponse })

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })
      await client.getMessages('abc/def 123', 0, 10)

      expect(mockAxios.get).toHaveBeenCalledWith('/conversations/abc%2Fdef%20123/messages', {
        params: { offset: 0, limit: 10 },
      })
    })
  })

  describe('sendMessage', () => {
    it('maps raw flat response to nested userMessage/assistantMessage format', async () => {
      const rawResponse = {
        user_message_id: 'msg-1',
        user_message: 'hello',
        assistant_message_id: 'msg-2',
        assistant_response: 'hi',
        conversation_id: 'conv-1',
        timestamp: '2026-01-01T00:00:00Z',
      }
      ;(mockAxios.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: rawResponse })

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })
      const result = await client.sendMessage('conv-1', 'hello')

      expect(mockAxios.post).toHaveBeenCalledWith('/conversations/conv-1/messages', {
        message: 'hello',
      })
      expect(result).toEqual({
        userMessage: {
          id: 'msg-1',
          conversationId: 'conv-1',
          role: 'user',
          content: 'hello',
          createdAt: '2026-01-01T00:00:00Z',
        },
        assistantMessage: {
          id: 'msg-2',
          conversationId: 'conv-1',
          role: 'assistant',
          content: 'hi',
          createdAt: '2026-01-01T00:00:00Z',
        },
      })
    })

    it('encodes special characters in conversationId', async () => {
      const rawResponse = {
        user_message_id: 'msg-1',
        user_message: 'test',
        assistant_message_id: 'msg-2',
        assistant_response: 'reply',
        conversation_id: 'abc/def 123',
        timestamp: '2026-01-01T00:00:00Z',
      }
      ;(mockAxios.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: rawResponse })

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })
      await client.sendMessage('abc/def 123', 'test')

      expect(mockAxios.post).toHaveBeenCalledWith('/conversations/abc%2Fdef%20123/messages', {
        message: 'test',
      })
    })
  })

  describe('error propagation', () => {
    it('propagates Axios errors without modification', async () => {
      const axiosError = Object.assign(new Error('Request failed'), {
        response: { status: 429, data: {} },
      })
      ;(mockAxios.post as ReturnType<typeof vi.fn>).mockRejectedValue(axiosError)

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })

      await expect(client.createConversation()).rejects.toBe(axiosError)
    })

    it('propagates network errors without modification', async () => {
      const networkError = new TypeError('Network Error')
      ;(mockAxios.get as ReturnType<typeof vi.fn>).mockRejectedValue(networkError)

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })

      await expect(client.getConversations(0, 20)).rejects.toBe(networkError)
    })
  })
})
