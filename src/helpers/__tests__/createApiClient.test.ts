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
    ).toThrow('[native-chat-vue] createNativeChatApiClient requires an axiosInstance')
  })

  it('throws a descriptive error when config is null', () => {
    expect(() =>
      createNativeChatApiClient(null as unknown as { axiosInstance: AxiosInstance }),
    ).toThrow('[native-chat-vue] createNativeChatApiClient requires an axiosInstance')
  })

  describe('createConversation', () => {
    it('calls axiosInstance.post with /conversations and empty body, returns response.data', async () => {
      const mockResponse = { id: 'conv-1', createdAt: '2026-01-01T00:00:00Z' }
      ;(mockAxios.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse })

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })
      const result = await client.createConversation()

      expect(mockAxios.post).toHaveBeenCalledWith('/conversations', {})
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getConversations', () => {
    it('calls axiosInstance.get with /conversations and params, returns response.data', async () => {
      const mockResponse = { conversations: [], has_more: false }
      ;(mockAxios.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse })

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })
      const result = await client.getConversations(10, 20)

      expect(mockAxios.get).toHaveBeenCalledWith('/conversations', {
        params: { offset: 10, limit: 20 },
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getMessages', () => {
    it('calls axiosInstance.get with encoded conversationId path and params, returns response.data', async () => {
      const mockResponse = { messages: [], has_more: false }
      ;(mockAxios.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse })

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })
      const result = await client.getMessages('conv-42', 0, 20)

      expect(mockAxios.get).toHaveBeenCalledWith('/conversations/conv-42/messages', {
        params: { offset: 0, limit: 20 },
      })
      expect(result).toEqual(mockResponse)
    })

    it('encodes special characters in conversationId', async () => {
      const mockResponse = { messages: [], has_more: false }
      ;(mockAxios.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse })

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })
      await client.getMessages('abc/def 123', 0, 10)

      expect(mockAxios.get).toHaveBeenCalledWith('/conversations/abc%2Fdef%20123/messages', {
        params: { offset: 0, limit: 10 },
      })
    })
  })

  describe('sendMessage', () => {
    it('calls axiosInstance.post with encoded conversationId path and message body, returns response.data', async () => {
      const mockResponse = {
        userMessage: {
          id: 'msg-1',
          conversationId: 'conv-1',
          role: 'user',
          content: 'hello',
          createdAt: '',
        },
        assistantMessage: {
          id: 'msg-2',
          conversationId: 'conv-1',
          role: 'assistant',
          content: 'hi',
          createdAt: '',
        },
      }
      ;(mockAxios.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse })

      const client = createNativeChatApiClient({ axiosInstance: mockAxios })
      const result = await client.sendMessage('conv-1', 'hello')

      expect(mockAxios.post).toHaveBeenCalledWith('/conversations/conv-1/messages', {
        message: 'hello',
      })
      expect(result).toEqual(mockResponse)
    })

    it('encodes special characters in conversationId', async () => {
      const mockResponse = {
        userMessage: {
          id: 'msg-1',
          conversationId: 'abc/def 123',
          role: 'user',
          content: 'test',
          createdAt: '',
        },
        assistantMessage: {
          id: 'msg-2',
          conversationId: 'abc/def 123',
          role: 'assistant',
          content: 'reply',
          createdAt: '',
        },
      }
      ;(mockAxios.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse })

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
