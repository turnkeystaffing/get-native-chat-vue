import { createNativeChatApiClient } from '@/helpers/createApiClient'
import type { NativeChatApiClient } from '@/types/api'

const BASE_URL = 'https://api.example.com'
const TOKEN = 'test-token-123'

function createClient(overrides?: {
  getAccessToken?: () => string | Promise<string>
}): NativeChatApiClient {
  return createNativeChatApiClient({
    baseUrl: BASE_URL,
    getAccessToken: overrides?.getAccessToken ?? (() => TOKEN),
  })
}

describe('createNativeChatApiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns an object with all 4 NativeChatApiClient methods', () => {
    const client = createClient()

    expect(typeof client.createConversation).toBe('function')
    expect(typeof client.getConversations).toBe('function')
    expect(typeof client.getMessages).toBe('function')
    expect(typeof client.sendMessage).toBe('function')
  })

  describe('createConversation', () => {
    it('calls POST /conversations with auth header', async () => {
      const mockResponse = { id: 'conv-1', createdAt: '2026-01-01T00:00:00Z' }
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockResponse), { status: 200 }))

      const client = createClient()
      const result = await client.createConversation()

      expect(fetchSpy).toHaveBeenCalledWith(`${BASE_URL}/conversations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getConversations', () => {
    it('calls GET /conversations with offset and limit query params', async () => {
      const mockResponse = { conversations: [], has_more: false }
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockResponse), { status: 200 }))

      const client = createClient()
      const result = await client.getConversations(10, 20)

      expect(fetchSpy).toHaveBeenCalledWith(`${BASE_URL}/conversations?offset=10&limit=20`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getMessages', () => {
    it('calls GET /conversations/:id/messages with offset and limit', async () => {
      const mockResponse = { messages: [], has_more: false }
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockResponse), { status: 200 }))

      const client = createClient()
      const result = await client.getMessages('conv-42', 0, 20)

      expect(fetchSpy).toHaveBeenCalledWith(
        `${BASE_URL}/conversations/conv-42/messages?offset=0&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      )
      expect(result).toEqual(mockResponse)
    })

    it('encodes conversationId in URL path', async () => {
      const mockResponse = { messages: [], has_more: false }
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      )

      const client = createClient()
      await client.getMessages('id/with/slashes', 0, 10)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/conversations/id%2Fwith%2Fslashes/messages?offset=0&limit=10`,
        expect.any(Object),
      )
    })
  })

  describe('sendMessage', () => {
    it('calls POST /conversations/:id/messages with message body and Content-Type', async () => {
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
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockResponse), { status: 200 }))

      const client = createClient()
      const result = await client.sendMessage('conv-1', 'hello')

      expect(fetchSpy).toHaveBeenCalledWith(`${BASE_URL}/conversations/conv-1/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'hello' }),
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('async getAccessToken support', () => {
    it('supports async getAccessToken callback', async () => {
      const asyncToken = 'async-token-456'
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ id: 'conv-1', createdAt: '' }), { status: 200 }),
      )

      const client = createClient({
        getAccessToken: async () => asyncToken,
      })
      await client.createConversation()

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${asyncToken}`,
          }),
        }),
      )
    })
  })

  describe('error handling', () => {
    it('throws on non-ok HTTP responses', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('Not Found', { status: 404, statusText: 'Not Found' }),
      )

      const client = createClient()

      await expect(client.getConversations(0, 20)).rejects.toThrow('HTTP 404: Not Found')
    })

    it('includes statusCode on thrown error', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('Server Error', { status: 500, statusText: 'Internal Server Error' }),
      )

      const client = createClient()

      try {
        await client.createConversation()
        expect.fail('Should have thrown')
      } catch (error) {
        expect((error as Error & { statusCode: number }).statusCode).toBe(500)
      }
    })

    it('propagates network-level fetch errors', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))

      const client = createClient()

      await expect(client.getConversations(0, 20)).rejects.toThrow('Failed to fetch')
    })
  })
})
