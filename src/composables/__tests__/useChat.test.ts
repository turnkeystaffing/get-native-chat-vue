import { useChat } from '@/composables/useChat'
import type { NativeChatApiClient } from '@/types/api'
import type { NativeChatPluginOptions } from '@/types/config'
import { isReadonly, isRef } from 'vue'

function createMockApiClient(): NativeChatApiClient {
  return {
    createConversation: vi.fn(),
    getConversations: vi.fn(),
    getMessages: vi.fn(),
    sendMessage: vi.fn(),
  }
}

function createConfig(overrides?: Partial<NativeChatPluginOptions>): NativeChatPluginOptions {
  return {
    apiClient: createMockApiClient(),
    ...overrides,
  }
}

function setup(configOverrides?: Partial<NativeChatPluginOptions>) {
  const apiClient = createMockApiClient()
  const config = createConfig({ apiClient, ...configOverrides })
  const chat = useChat(apiClient, config)
  return { apiClient, config, chat }
}

describe('useChat', () => {
  describe('open()', () => {
    it('calls getConversations(0, 1) and getMessages() with existing conversation', async () => {
      const { apiClient, chat } = setup()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [
          {
            id: 'msg-2',
            conversationId: 'conv-1',
            role: 'assistant',
            content: 'Hi',
            createdAt: '2026-01-01T00:01',
          },
          {
            id: 'msg-1',
            conversationId: 'conv-1',
            role: 'user',
            content: 'Hello',
            createdAt: '2026-01-01T00:00',
          },
        ],
        has_more: false,
      })

      await chat.open()

      expect(apiClient.getConversations).toHaveBeenCalledWith(0, 1)
      expect(apiClient.getMessages).toHaveBeenCalledWith('conv-1', 0, 20)
    })

    it('calls createConversation() when no conversations exist', async () => {
      const { apiClient, chat } = setup()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [],
        has_more: false,
      })
      ;(apiClient.createConversation as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'new-conv-1',
        createdAt: '2026-01-01',
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })

      await chat.open()

      expect(apiClient.createConversation).toHaveBeenCalled()
      expect(apiClient.getMessages).toHaveBeenCalledWith('new-conv-1', 0, 20)
    })

    it('uses config.conversationId directly when provided (skips getConversations)', async () => {
      const { apiClient, chat } = setup({ conversationId: 'provided-conv' })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })

      await chat.open()

      expect(apiClient.getConversations).not.toHaveBeenCalled()
      expect(apiClient.getMessages).toHaveBeenCalledWith('provided-conv', 0, 20)
    })

    it('reverses messages from newest-first to chronological order', async () => {
      const { apiClient, chat } = setup()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [
          {
            id: 'msg-3',
            conversationId: 'conv-1',
            role: 'assistant',
            content: 'Third',
            createdAt: '2026-01-01T00:02',
          },
          {
            id: 'msg-2',
            conversationId: 'conv-1',
            role: 'user',
            content: 'Second',
            createdAt: '2026-01-01T00:01',
          },
          {
            id: 'msg-1',
            conversationId: 'conv-1',
            role: 'user',
            content: 'First',
            createdAt: '2026-01-01T00:00',
          },
        ],
        has_more: false,
      })

      await chat.open()

      expect(chat.messages.value[0].content).toBe('First')
      expect(chat.messages.value[1].content).toBe('Second')
      expect(chat.messages.value[2].content).toBe('Third')
    })

    it('sets isLoading to true during fetch, false after', async () => {
      const { apiClient, chat } = setup()
      let resolveMessages!: (value: unknown) => void
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockReturnValue(
        new Promise((resolve) => {
          resolveMessages = resolve
        }),
      )

      const openPromise = chat.open()

      // Wait for getConversations microtask to resolve so isLoading = true is reached
      await Promise.resolve()
      await Promise.resolve()
      expect(chat.isLoading.value).toBe(true)

      resolveMessages({ messages: [], has_more: false })
      await openPromise

      expect(chat.isLoading.value).toBe(false)
    })

    it('sets hasMore from API response', async () => {
      const { apiClient, chat } = setup()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: true,
      })

      await chat.open()

      expect(chat.hasMore.value).toBe(true)
    })

    it('sets isOpen to true after successful initialization', async () => {
      const { apiClient, chat } = setup()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })

      expect(chat.isOpen.value).toBe(false)
      await chat.open()
      expect(chat.isOpen.value).toBe(true)
    })

    it('opens chat with empty state when getConversations fails', async () => {
      const { apiClient, chat } = setup()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network error'),
      )

      await chat.open()

      expect(chat.isOpen.value).toBe(true)
      expect(chat.isLoading.value).toBe(false)
      expect(chat.messages.value).toHaveLength(0)
    })

    it('opens chat with empty state when createConversation fails', async () => {
      const { apiClient, chat } = setup()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [],
        has_more: false,
      })
      ;(apiClient.createConversation as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Server error'),
      )

      await chat.open()

      expect(chat.isOpen.value).toBe(true)
      expect(chat.isLoading.value).toBe(false)
      expect(chat.messages.value).toHaveLength(0)
    })

    it('guards against re-entrance when already open', async () => {
      const { apiClient, chat } = setup()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })

      await chat.open()
      expect(chat.isOpen.value).toBe(true)

      // Clear mock call counts
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockClear()
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockClear()

      // Second open() should be a no-op
      await chat.open()
      expect(apiClient.getConversations).not.toHaveBeenCalled()
      expect(apiClient.getMessages).not.toHaveBeenCalled()
    })

    it('guards against concurrent open() calls', async () => {
      const { apiClient, chat } = setup()
      let resolveConversations!: (value: unknown) => void
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockReturnValue(
        new Promise((resolve) => {
          resolveConversations = resolve
        }),
      )
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })

      // Start first open
      const firstOpen = chat.open()

      // Second open should be no-op (isLoading is true)
      const secondOpen = chat.open()

      resolveConversations({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })

      await firstOpen
      await secondOpen

      // getConversations should only be called once
      expect(apiClient.getConversations).toHaveBeenCalledTimes(1)
    })
  })

  describe('close()', () => {
    it('sets isOpen to false', async () => {
      const { apiClient, chat } = setup()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })

      await chat.open()
      expect(chat.isOpen.value).toBe(true)

      chat.close()
      expect(chat.isOpen.value).toBe(false)
    })
  })

  describe('sendMessage()', () => {
    async function setupWithOpenChat() {
      const { apiClient, config, chat } = setup()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })
      await chat.open()
      return { apiClient, config, chat }
    }

    it('adds optimistic message with status sending', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      let resolveSend!: (value: unknown) => void
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockReturnValue(
        new Promise((resolve) => {
          resolveSend = resolve
        }),
      )

      const sendPromise = chat.sendMessage('Hello')

      // Check optimistic message exists
      expect(chat.messages.value).toHaveLength(1)
      expect(chat.messages.value[0].content).toBe('Hello')
      expect(chat.messages.value[0].role).toBe('user')
      expect(chat.messages.value[0].status).toBe('sending')

      resolveSend({
        userMessage: {
          id: 'server-1',
          conversationId: 'conv-1',
          role: 'user',
          content: 'Hello',
          createdAt: '2026-01-01',
        },
        assistantMessage: {
          id: 'server-2',
          conversationId: 'conv-1',
          role: 'assistant',
          content: 'Hi there',
          createdAt: '2026-01-01',
        },
      })
      await sendPromise
    })

    it('on success updates message status to sent and adds assistant response', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockResolvedValue({
        userMessage: {
          id: 'server-1',
          conversationId: 'conv-1',
          role: 'user',
          content: 'Hello',
          createdAt: '2026-01-01',
        },
        assistantMessage: {
          id: 'server-2',
          conversationId: 'conv-1',
          role: 'assistant',
          content: 'Hi there',
          createdAt: '2026-01-01',
        },
      })

      await chat.sendMessage('Hello')

      expect(chat.messages.value).toHaveLength(2)
      expect(chat.messages.value[0].status).toBe('sent')
      expect(chat.messages.value[0].id).toBe('server-1')
      expect(chat.messages.value[1].role).toBe('assistant')
      expect(chat.messages.value[1].content).toBe('Hi there')
    })

    it('on failure removes optimistic message, sets failedMessageText, adds error message', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network error'),
      )

      await chat.sendMessage('Hello')

      // Optimistic message removed, error message added
      expect(chat.messages.value).toHaveLength(1)
      expect(chat.messages.value[0].role).toBe('assistant')
      expect(chat.messages.value[0].content).toBe(
        'Something went wrong. You can try sending your message again.',
      )
      expect(chat.failedMessageText.value).toBe('Hello')
    })

    it('cleans up previous error messages on successful send', async () => {
      const { apiClient, chat } = await setupWithOpenChat()

      // First send fails — adds error message
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('fail'))
      await chat.sendMessage('Hello')
      expect(chat.messages.value).toHaveLength(1)
      expect(chat.messages.value[0].id).toMatch(/^error-/)

      // Second send succeeds — error message should be cleaned up
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockResolvedValue({
        userMessage: {
          id: 's-1',
          conversationId: 'conv-1',
          role: 'user',
          content: 'Hello',
          createdAt: '2026-01-01',
        },
        assistantMessage: {
          id: 's-2',
          conversationId: 'conv-1',
          role: 'assistant',
          content: 'Hi',
          createdAt: '2026-01-01',
        },
      })
      await chat.sendMessage('Hello again')

      // Should have 2 messages (user + assistant), no error messages
      expect(chat.messages.value).toHaveLength(2)
      expect(chat.messages.value.every((m) => !m.id.startsWith('error-'))).toBe(true)
    })

    it('replaces previous error message on subsequent failure', async () => {
      const { apiClient, chat } = await setupWithOpenChat()

      // First failure
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))
      await chat.sendMessage('First')
      expect(chat.messages.value).toHaveLength(1)

      // Second failure — should still have only 1 error message (old one cleaned up)
      await chat.sendMessage('Second')
      expect(chat.messages.value).toHaveLength(1)
      expect(chat.messages.value[0].id).toMatch(/^error-/)
    })

    it('calls config.onError on failure if defined', async () => {
      const onError = vi.fn()
      const apiClientWithError = createMockApiClient()
      ;(apiClientWithError.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClientWithError.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })
      ;(apiClientWithError.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('fail'),
      )

      const chatWithError = useChat(apiClientWithError, { apiClient: apiClientWithError, onError })
      await chatWithError.open()
      await chatWithError.sendMessage('Hello')

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Something went wrong. You can try sending your message again.',
        }),
      )
    })

    it('guards against empty text and concurrent sends', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      let resolveSend!: (value: unknown) => void
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockReturnValue(
        new Promise((resolve) => {
          resolveSend = resolve
        }),
      )

      // Empty text should return early
      await chat.sendMessage('')
      await chat.sendMessage('   ')
      expect(apiClient.sendMessage).not.toHaveBeenCalled()

      // First send
      const firstSend = chat.sendMessage('Hello')
      expect(chat.isSending.value).toBe(true)

      // Concurrent send should be ignored
      await chat.sendMessage('World')
      expect(apiClient.sendMessage).toHaveBeenCalledTimes(1)

      resolveSend({
        userMessage: {
          id: 's-1',
          conversationId: 'conv-1',
          role: 'user',
          content: 'Hello',
          createdAt: '2026-01-01',
        },
        assistantMessage: {
          id: 's-2',
          conversationId: 'conv-1',
          role: 'assistant',
          content: 'Hi',
          createdAt: '2026-01-01',
        },
      })
      await firstSend
    })
  })

  describe('loadMore()', () => {
    async function setupWithOpenChatAndMessages() {
      const apiClient = createMockApiClient()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [
          {
            id: 'msg-2',
            conversationId: 'conv-1',
            role: 'assistant',
            content: 'Response',
            createdAt: '2026-01-01T00:01',
          },
          {
            id: 'msg-1',
            conversationId: 'conv-1',
            role: 'user',
            content: 'Hello',
            createdAt: '2026-01-01T00:00',
          },
        ],
        has_more: true,
      })

      const chat = useChat(apiClient, { apiClient })
      await chat.open()

      // Reset mock for loadMore calls
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockClear()

      return { apiClient, chat }
    }

    it('fetches next batch with correct offset', async () => {
      const { apiClient, chat } = await setupWithOpenChatAndMessages()
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [
          {
            id: 'msg-4',
            conversationId: 'conv-1',
            role: 'assistant',
            content: 'Older2',
            createdAt: '2025-12-31T00:01',
          },
          {
            id: 'msg-3',
            conversationId: 'conv-1',
            role: 'user',
            content: 'Older1',
            createdAt: '2025-12-31T00:00',
          },
        ],
        has_more: false,
      })

      await chat.loadMore()

      expect(apiClient.getMessages).toHaveBeenCalledWith('conv-1', 2, 20)
    })

    it('prepends messages and updates hasMore', async () => {
      const { apiClient, chat } = await setupWithOpenChatAndMessages()
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [
          {
            id: 'msg-4',
            conversationId: 'conv-1',
            role: 'assistant',
            content: 'Older2',
            createdAt: '2025-12-31T00:01',
          },
          {
            id: 'msg-3',
            conversationId: 'conv-1',
            role: 'user',
            content: 'Older1',
            createdAt: '2025-12-31T00:00',
          },
        ],
        has_more: false,
      })

      await chat.loadMore()

      // Should have 4 messages total: 2 older prepended + 2 original
      expect(chat.messages.value).toHaveLength(4)
      // Older messages are reversed and prepended
      expect(chat.messages.value[0].content).toBe('Older1')
      expect(chat.messages.value[1].content).toBe('Older2')
      expect(chat.messages.value[2].content).toBe('Hello')
      expect(chat.messages.value[3].content).toBe('Response')
      expect(chat.hasMore.value).toBe(false)
    })

    it('fails silently (no error in messages)', async () => {
      const { apiClient, chat } = await setupWithOpenChatAndMessages()
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network'))

      const messagesBefore = chat.messages.value.length
      await chat.loadMore()

      // Messages should not change
      expect(chat.messages.value).toHaveLength(messagesBefore)
      expect(chat.isLoading.value).toBe(false)
    })

    it('guards against no-more and concurrent loads', async () => {
      const apiClient = createMockApiClient()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false, // No more messages
      })

      const chat = useChat(apiClient, { apiClient })
      await chat.open()
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockClear()

      // hasMore is false, should not fetch
      await chat.loadMore()
      expect(apiClient.getMessages).not.toHaveBeenCalled()
    })
  })

  describe('retry()', () => {
    it('resends failed message text via sendMessage()', async () => {
      const apiClient = createMockApiClient()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })

      const chat = useChat(apiClient, { apiClient })
      await chat.open()

      // Cause a failure first
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('fail'))
      await chat.sendMessage('Hello')
      expect(chat.failedMessageText.value).toBe('Hello')

      // Now retry - make it succeed
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockResolvedValue({
        userMessage: {
          id: 's-1',
          conversationId: 'conv-1',
          role: 'user',
          content: 'Hello',
          createdAt: '2026-01-01',
        },
        assistantMessage: {
          id: 's-2',
          conversationId: 'conv-1',
          role: 'assistant',
          content: 'Hi',
          createdAt: '2026-01-01',
        },
      })

      await chat.retry()

      expect(apiClient.sendMessage).toHaveBeenCalledWith('conv-1', 'Hello')
    })

    it('clears failedMessageText', async () => {
      const apiClient = createMockApiClient()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })

      const chat = useChat(apiClient, { apiClient })
      await chat.open()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('fail'))
      await chat.sendMessage('Hello')
      expect(chat.failedMessageText.value).toBe('Hello')
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockResolvedValue({
        userMessage: {
          id: 's-1',
          conversationId: 'conv-1',
          role: 'user',
          content: 'Hello',
          createdAt: '2026-01-01',
        },
        assistantMessage: {
          id: 's-2',
          conversationId: 'conv-1',
          role: 'assistant',
          content: 'Hi',
          createdAt: '2026-01-01',
        },
      })

      await chat.retry()

      // failedMessageText should be null after successful retry
      expect(chat.failedMessageText.value).toBeNull()
    })
  })

  describe('sendMessage() with null conversationId', () => {
    it('creates conversation when conversationId is null and sends message', async () => {
      const { apiClient, chat } = setup()

      // Simulate failed open — conversationId stays null
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network'),
      )
      await chat.open()
      expect(chat.isOpen.value).toBe(true)
      expect(chat.messages.value).toHaveLength(0)

      // Now send — should create conversation first
      ;(apiClient.createConversation as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'recovered-conv',
        createdAt: '2026-01-01',
      })
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockResolvedValue({
        userMessage: {
          id: 's-1',
          conversationId: 'recovered-conv',
          role: 'user',
          content: 'Hello',
          createdAt: '2026-01-01',
        },
        assistantMessage: {
          id: 's-2',
          conversationId: 'recovered-conv',
          role: 'assistant',
          content: 'Hi',
          createdAt: '2026-01-01',
        },
      })

      await chat.sendMessage('Hello')

      expect(apiClient.createConversation).toHaveBeenCalled()
      expect(apiClient.sendMessage).toHaveBeenCalledWith('recovered-conv', 'Hello')
      expect(chat.messages.value).toHaveLength(2) // user + assistant
    })

    it('shows error message when conversation creation fails during send', async () => {
      const { apiClient, chat } = setup()

      // Simulate failed open
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network'),
      )
      await chat.open()

      // Conversation creation also fails
      ;(apiClient.createConversation as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Server error'),
      )

      await chat.sendMessage('Hello')

      // Should show error message and set failedMessageText
      expect(chat.messages.value).toHaveLength(1)
      expect(chat.messages.value[0].id).toMatch(/^error-/)
      expect(chat.messages.value[0].role).toBe('assistant')
      expect(chat.failedMessageText.value).toBe('Hello')
    })

    it('calls config.onError when conversation creation fails during send', async () => {
      const onError = vi.fn()
      const apiClient = createMockApiClient()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network'),
      )

      const chat = useChat(apiClient, { apiClient, onError })
      await chat.open()
      ;(apiClient.createConversation as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Server error'),
      )

      await chat.sendMessage('Hello')

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Something went wrong. You can try sending your message again.',
        }),
      )
    })

    it('shows optimistic message immediately before conversation creation completes', async () => {
      const { apiClient, chat } = setup()

      // Simulate failed open — conversationId stays null
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network'),
      )
      await chat.open()

      let messagesDuringCreation: number | undefined
      let isSendingDuringCreation: boolean | undefined
      ;(apiClient.createConversation as ReturnType<typeof vi.fn>).mockImplementation(async () => {
        // At this point, optimistic message should already exist
        messagesDuringCreation = chat.messages.value.length
        isSendingDuringCreation = chat.isSending.value
        return { id: 'recovered-conv', createdAt: '2026-01-01' }
      })
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockResolvedValue({
        userMessage: {
          id: 's-1',
          conversationId: 'recovered-conv',
          role: 'user',
          content: 'Hello',
          createdAt: '2026-01-01',
        },
        assistantMessage: {
          id: 's-2',
          conversationId: 'recovered-conv',
          role: 'assistant',
          content: 'Hi',
          createdAt: '2026-01-01',
        },
      })

      await chat.sendMessage('Hello')

      // Verify optimistic message existed before conversation creation
      expect(messagesDuringCreation).toBe(1)
      expect(isSendingDuringCreation).toBe(true)
    })
  })

  describe('readonly state', () => {
    it('all returned state refs are readonly', () => {
      const { chat } = setup()

      expect(isReadonly(chat.messages)).toBe(true)
      expect(isReadonly(chat.isOpen)).toBe(true)
      expect(isReadonly(chat.isLoading)).toBe(true)
      expect(isReadonly(chat.isSending)).toBe(true)
      expect(isReadonly(chat.hasMore)).toBe(true)
      expect(isReadonly(chat.failedMessageText)).toBe(true)
    })

    it('all returned state values are refs', () => {
      const { chat } = setup()

      expect(isRef(chat.messages)).toBe(true)
      expect(isRef(chat.isOpen)).toBe(true)
      expect(isRef(chat.isLoading)).toBe(true)
      expect(isRef(chat.isSending)).toBe(true)
      expect(isRef(chat.hasMore)).toBe(true)
      expect(isRef(chat.failedMessageText)).toBe(true)
    })
  })

  describe('error display as chat messages', () => {
    async function setupWithOpenChat(configOverrides?: Partial<NativeChatPluginOptions>) {
      const apiClient = createMockApiClient()
      const config = createConfig({ apiClient, ...configOverrides })
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })
      const chat = useChat(apiClient, config)
      await chat.open()
      return { apiClient, config, chat }
    }

    // AC#1: Error message creation
    it('error message has role assistant and id starting with error-', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

      await chat.sendMessage('Hello')

      const errorMsg = chat.messages.value[0]
      expect(errorMsg.role).toBe('assistant')
      expect(errorMsg.id).toMatch(/^error-/)
    })

    it('error message has status failed', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

      await chat.sendMessage('Hello')

      expect(chat.messages.value[0].status).toBe('failed')
    })

    it('populates failedMessageText with original message on failure', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

      await chat.sendMessage('My important message')

      expect(chat.failedMessageText.value).toBe('My important message')
    })

    it('resets isSending to false after error', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

      await chat.sendMessage('Hello')

      expect(chat.isSending.value).toBe(false)
    })

    // AC#2: HTTP status code mapping
    it('maps 429 error to rate-limit message', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(
        Object.assign(new Error('Too Many Requests'), { statusCode: 429 }),
      )

      await chat.sendMessage('Hello')

      expect(chat.messages.value[0].content).toBe(
        "You're sending messages too quickly. Please wait a moment and try again.",
      )
    })

    it('maps 503 error to service unavailable message', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(
        Object.assign(new Error('Service Unavailable'), { statusCode: 503 }),
      )

      await chat.sendMessage('Hello')

      expect(chat.messages.value[0].content).toBe(
        'The service is temporarily unavailable. Please try again in a moment.',
      )
    })

    it('maps 504 error to service unavailable message', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(
        Object.assign(new Error('Gateway Timeout'), { statusCode: 504 }),
      )

      await chat.sendMessage('Hello')

      expect(chat.messages.value[0].content).toBe(
        'The service is temporarily unavailable. Please try again in a moment.',
      )
    })

    it('maps unknown error to generic error message', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(
        Object.assign(new Error('Internal Server Error'), { statusCode: 500 }),
      )

      await chat.sendMessage('Hello')

      expect(chat.messages.value[0].content).toBe(
        'Something went wrong. You can try sending your message again.',
      )
    })

    it('maps network error (no status code) to generic error message', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network error'),
      )

      await chat.sendMessage('Hello')

      expect(chat.messages.value[0].content).toBe(
        'Something went wrong. You can try sending your message again.',
      )
    })

    // AC#3: onError callback
    it('calls onError callback with ChatError containing message, statusCode, and originalError', async () => {
      const onError = vi.fn()
      const { apiClient, chat } = await setupWithOpenChat({ onError })
      const originalError = Object.assign(new Error('Too Many Requests'), { statusCode: 429 })
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(originalError)

      await chat.sendMessage('Hello')

      expect(onError).toHaveBeenCalledWith({
        message: "You're sending messages too quickly. Please wait a moment and try again.",
        statusCode: 429,
        originalError,
      })
    })

    it('displays inline error even when onError is not configured', async () => {
      const { apiClient, chat } = await setupWithOpenChat()
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

      await chat.sendMessage('Hello')

      expect(chat.messages.value).toHaveLength(1)
      expect(chat.messages.value[0].id).toMatch(/^error-/)
    })

    it('survives onError callback throwing an error', async () => {
      const onError = vi.fn().mockImplementation(() => {
        throw new Error('callback crashed')
      })
      const { apiClient, chat } = await setupWithOpenChat({ onError })
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

      await chat.sendMessage('Hello')

      // Chat should still function — error message displayed, failedMessageText set
      expect(chat.messages.value).toHaveLength(1)
      expect(chat.messages.value[0].id).toMatch(/^error-/)
      expect(chat.failedMessageText.value).toBe('Hello')
      expect(chat.isSending.value).toBe(false)
      expect(onError).toHaveBeenCalled()
    })

    it('survives onError callback returning a rejected promise', async () => {
      const onError = vi.fn().mockImplementation(() => Promise.reject(new Error('async crash')))
      const { apiClient, chat } = await setupWithOpenChat({ onError })
      ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'))

      await chat.sendMessage('Hello')

      // Chat should still function despite async callback rejection
      expect(chat.messages.value).toHaveLength(1)
      expect(chat.messages.value[0].id).toMatch(/^error-/)
      expect(chat.failedMessageText.value).toBe('Hello')
      expect(chat.isSending.value).toBe(false)
      expect(onError).toHaveBeenCalled()
    })
  })

  describe('batchSize', () => {
    it('default batchSize is 20 when not configured', async () => {
      const { apiClient, chat } = setup()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })

      await chat.open()

      expect(apiClient.getMessages).toHaveBeenCalledWith('conv-1', 0, 20)
    })

    it('uses configured batchSize', async () => {
      const apiClient = createMockApiClient()
      ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
        conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
        has_more: false,
      })
      ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
        messages: [],
        has_more: false,
      })

      const chat = useChat(apiClient, { apiClient, batchSize: 50 })
      await chat.open()

      expect(apiClient.getMessages).toHaveBeenCalledWith('conv-1', 0, 50)
    })
  })
})
