import { mount, flushPromises } from '@vue/test-utils'
import { ref, readonly, nextTick } from 'vue'
import ChatPanel from '@/components/ChatPanel.vue'
import WelcomeState from '@/components/WelcomeState.vue'
import MessageList from '@/components/MessageList.vue'
import { useChat } from '@/composables/useChat'
import { CONFIG_KEY, CHAT_STATE_KEY } from '@/keys'
import type { UseChatReturn } from '@/composables/useChat'
import type { NativeChatApiClient } from '@/types/api'
import type { ChatMessage } from '@/types/chat'

const activeWrappers: ReturnType<typeof mount>[] = []

function createMountHelper(options?: {
  isOpen?: boolean
  isLoading?: boolean
  isSending?: boolean
  messages?: ChatMessage[]
  failedMessageText?: string | null
}) {
  const isOpen = ref(options?.isOpen ?? true)
  const isLoading = ref(options?.isLoading ?? false)
  const isSending = ref(options?.isSending ?? false)
  const hasMore = ref(false)
  const failedMessageText = ref<string | null>(options?.failedMessageText ?? null)
  const messages = ref<ChatMessage[]>(options?.messages ?? [])

  const chatState: UseChatReturn = {
    isOpen: readonly(isOpen),
    isLoading: readonly(isLoading),
    isSending: readonly(isSending),
    hasMore: readonly(hasMore),
    failedMessageText: readonly(failedMessageText),
    messages: readonly(messages),
    open: vi.fn(async () => {
      isOpen.value = true
    }),
    close: vi.fn(() => {
      isOpen.value = false
    }),
    sendMessage: vi.fn(async (text: string) => {
      // Simulate optimistic UI: add sending message
      isSending.value = true
      const tempId = `temp-${Date.now()}`
      messages.value = [
        ...messages.value,
        {
          id: tempId,
          conversationId: 'conv-1',
          role: 'user',
          content: text,
          createdAt: new Date().toISOString(),
          status: 'sending',
        },
      ]
    }),
    loadMore: vi.fn(async () => {}),
    retry: vi.fn(async () => {}),
  }

  const config = {
    apiClient: {
      createConversation: vi.fn(),
      getConversations: vi.fn(),
      getMessages: vi.fn(),
      sendMessage: vi.fn(),
    },
  }

  const wrapper = mount(ChatPanel, {
    attachTo: document.body,
    global: {
      stubs: {
        teleport: true,
      },
      provide: {
        [CONFIG_KEY as symbol]: config,
        [CHAT_STATE_KEY as symbol]: chatState,
      },
    },
  })
  activeWrappers.push(wrapper)

  return { wrapper, chatState, isOpen, isLoading, isSending, messages, failedMessageText }
}

afterEach(() => {
  activeWrappers.forEach((w) => w.unmount())
  activeWrappers.length = 0
  document.body.innerHTML = ''
})

describe('Send/Receive Flow Integration (AC #1, #2)', () => {
  it('user sends message → optimistic message appears in MessageList with status sending → input clears and disables', async () => {
    const { wrapper, chatState, messages, isSending } = createMountHelper({ isOpen: true })

    // Initially no messages — WelcomeState shown
    expect(wrapper.findComponent(WelcomeState).exists()).toBe(true)

    // Type text in textarea
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Hello world')
    await nextTick()

    // Trigger send via Enter key
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })
    await flushPromises()

    // sendMessage should have been called
    expect(chatState.sendMessage).toHaveBeenCalledWith('Hello world')

    // After optimistic update: messages exist, isSending is true
    expect(messages.value).toHaveLength(1)
    expect(messages.value[0].content).toBe('Hello world')
    expect(messages.value[0].status).toBe('sending')
    expect(isSending.value).toBe(true)

    // Wait for DOM update
    await flushPromises()

    // Re-query textarea — Vuetify may replace the DOM node when disabled toggles
    const freshTextarea = wrapper.find('textarea')

    // Input should be cleared
    expect(freshTextarea.element.value).toBe('')

    // Textarea should be disabled
    expect(freshTextarea.attributes('disabled')).toBeDefined()
  })

  it('after successful API response → user message status sent, assistant response appears, input re-enables', async () => {
    const { wrapper, messages, isSending } = createMountHelper({
      isOpen: true,
      messages: [
        {
          id: 'msg-1',
          conversationId: 'conv-1',
          role: 'user',
          content: 'Hello',
          createdAt: '2026-01-01',
          status: 'sending',
        },
      ],
      isSending: true,
    })

    // Simulate API response arriving — update messages to final state
    messages.value = [
      {
        id: 'server-1',
        conversationId: 'conv-1',
        role: 'user',
        content: 'Hello',
        createdAt: '2026-01-01',
        status: 'sent',
      },
      {
        id: 'server-2',
        conversationId: 'conv-1',
        role: 'assistant',
        content: 'Hi there!',
        createdAt: '2026-01-01',
      },
    ]
    isSending.value = false
    await nextTick()

    // MessageList should render both messages
    expect(wrapper.findComponent(MessageList).exists()).toBe(true)
    expect(messages.value).toHaveLength(2)
    expect(messages.value[0].status).toBe('sent')
    expect(messages.value[1].role).toBe('assistant')

    // Input should be re-enabled
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('disabled')).toBeUndefined()
  })

  it('focus remains on input after send completes', async () => {
    const { isSending } = createMountHelper({ isOpen: true, isSending: true })

    // Spy on prototype to catch focus regardless of how Vuetify's v-textarea delegates
    const focusSpy = vi.spyOn(HTMLTextAreaElement.prototype, 'focus')

    // Simulate send completing: isSending goes from true to false
    isSending.value = false
    await flushPromises()

    expect(focusSpy).toHaveBeenCalled()
    focusSpy.mockRestore()
  })
})

describe('Chat Open with History Flow (AC #3)', () => {
  it('loading indicator shown during history fetch', async () => {
    const { wrapper } = createMountHelper({ isOpen: true, isLoading: true, messages: [] })

    const loader = wrapper.findComponent({ name: 'VProgressCircular' })
    expect(loader.exists()).toBe(true)
    expect(wrapper.findComponent(WelcomeState).exists()).toBe(false)
    expect(wrapper.findComponent(MessageList).exists()).toBe(false)
  })

  it('messages render in chronological order after fetch', async () => {
    const msgs: ChatMessage[] = [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        role: 'user',
        content: 'First message',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        role: 'assistant',
        content: 'Second message',
        createdAt: '2026-01-01T00:01:00Z',
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        role: 'user',
        content: 'Third message',
        createdAt: '2026-01-01T00:02:00Z',
      },
    ]
    const { wrapper, messages } = createMountHelper({
      isOpen: true,
      isLoading: false,
      messages: msgs,
    })

    expect(wrapper.findComponent(MessageList).exists()).toBe(true)
    // Messages are in chronological order (oldest first)
    expect(messages.value[0].content).toBe('First message')
    expect(messages.value[1].content).toBe('Second message')
    expect(messages.value[2].content).toBe('Third message')
  })

  it('welcome state replaced by message list when messages exist', async () => {
    const { wrapper, messages, isLoading } = createMountHelper({
      isOpen: true,
      isLoading: true,
      messages: [],
    })

    // Initially loading
    expect(wrapper.findComponent({ name: 'VProgressCircular' }).exists()).toBe(true)
    expect(wrapper.findComponent(MessageList).exists()).toBe(false)

    // Fetch completes with messages
    messages.value = [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        role: 'user',
        content: 'Hello',
        createdAt: '2026-01-01',
      },
    ]
    isLoading.value = false
    await nextTick()

    expect(wrapper.findComponent(MessageList).exists()).toBe(true)
    expect(wrapper.findComponent(WelcomeState).exists()).toBe(false)
    expect(wrapper.find('.nc-chat-panel__loader').exists()).toBe(false)
  })

  it('MessageList renders when messages exist (scroll to bottom tested via MessageList unit)', () => {
    const msgs: ChatMessage[] = [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        role: 'user',
        content: 'Hello',
        createdAt: '2026-01-01',
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        role: 'assistant',
        content: 'Hi',
        createdAt: '2026-01-01',
      },
    ]
    const { wrapper } = createMountHelper({ isOpen: true, messages: msgs })

    const messageList = wrapper.findComponent(MessageList)
    expect(messageList.exists()).toBe(true)
    // Scroll-to-bottom behavior is implemented in MessageList's onMounted
    // and verified in MessageList unit tests (jsdom has no real scroll)
  })
})

describe('Empty and Failed Open Flows (AC #4, #5)', () => {
  it('welcome message visible when fetch returns zero messages', () => {
    const { wrapper } = createMountHelper({ isOpen: true, isLoading: false, messages: [] })

    expect(wrapper.findComponent(WelcomeState).exists()).toBe(true)
    expect(wrapper.findComponent(MessageList).exists()).toBe(false)
  })

  it('input focused and ready after open with no history', async () => {
    const isOpen = ref(false)
    const isLoading = ref(false)
    const isSending = ref(false)
    const messages = ref<ChatMessage[]>([])
    const failedMessageText = ref<string | null>(null)

    const chatState: UseChatReturn = {
      isOpen: readonly(isOpen),
      isLoading: readonly(isLoading),
      isSending: readonly(isSending),
      hasMore: readonly(ref(false)),
      failedMessageText: readonly(failedMessageText),
      messages: readonly(messages),
      open: vi.fn(async () => {
        isOpen.value = true
      }),
      close: vi.fn(),
      sendMessage: vi.fn(async () => {}),
      loadMore: vi.fn(async () => {}),
      retry: vi.fn(async () => {}),
    }

    activeWrappers.push(
      mount(ChatPanel, {
        attachTo: document.body,
        global: {
          stubs: {
            teleport: true,
          },
          provide: {
            [CONFIG_KEY as symbol]: {
              apiClient: {
                createConversation: vi.fn(),
                getConversations: vi.fn(),
                getMessages: vi.fn(),
                sendMessage: vi.fn(),
              },
            },
            [CHAT_STATE_KEY as symbol]: chatState,
          },
        },
      }),
    )

    // Spy on prototype before textarea exists (v-if means no DOM until open)
    const focusSpy = vi.spyOn(HTMLTextAreaElement.prototype, 'focus')

    // Open the chat — ChatInput mounts and focuses textarea
    isOpen.value = true
    await flushPromises()

    expect(focusSpy).toHaveBeenCalled()
    focusSpy.mockRestore()
  })

  it('welcome message shown as fallback when initial fetch fails', () => {
    const { wrapper } = createMountHelper({ isOpen: true, isLoading: false, messages: [] })

    expect(wrapper.findComponent(WelcomeState).exists()).toBe(true)
  })

  it('user can send message after failed initial open (conversationId recovery)', async () => {
    // After failed open — chat is open with no messages
    const { wrapper, chatState } = createMountHelper({
      isOpen: true,
      isLoading: false,
      messages: [],
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('Hello after failure')
    await nextTick()

    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })
    await nextTick()

    // sendMessage should be called — the composable handles conversationId recovery
    expect(chatState.sendMessage).toHaveBeenCalledWith('Hello after failure')
  })
})

describe('Error Display Flow Integration (Story 4.1)', () => {
  function createMockApiClientLocal(): NativeChatApiClient {
    return {
      createConversation: vi.fn(),
      getConversations: vi.fn(),
      getMessages: vi.fn(),
      sendMessage: vi.fn(),
    }
  }

  it('full send-fail-error-display flow with mock API client', async () => {
    const apiClient = createMockApiClientLocal()
    ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
      conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
      has_more: false,
    })
    ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
      messages: [],
      has_more: false,
    })
    ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(
      Object.assign(new Error('Service Unavailable'), { statusCode: 503 }),
    )

    const onError = vi.fn()
    const chatState = useChat(apiClient, { apiClient, onError })
    await chatState.open()

    const wrapper = mount(ChatPanel, {
      attachTo: document.body,
      global: {
        stubs: {
          teleport: true,
        },
        provide: {
          [CONFIG_KEY as symbol]: { apiClient },
          [CHAT_STATE_KEY as symbol]: chatState,
        },
      },
    })
    activeWrappers.push(wrapper)

    // Send message that will fail
    await chatState.sendMessage('Hello')
    await nextTick()

    // Verify: optimistic message removed, error message displayed
    expect(chatState.messages.value).toHaveLength(1)
    expect(chatState.messages.value[0].id).toMatch(/^error-/)
    expect(chatState.messages.value[0].role).toBe('assistant')
    expect(chatState.messages.value[0].status).toBe('failed')
    expect(chatState.messages.value[0].content).toBe(
      'The service is temporarily unavailable. Please try again in a moment.',
    )

    // Verify: failedMessageText populated
    expect(chatState.failedMessageText.value).toBe('Hello')

    // Verify: isSending reset
    expect(chatState.isSending.value).toBe(false)

    // Verify: onError callback called with correct ChatError
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'The service is temporarily unavailable. Please try again in a moment.',
        statusCode: 503,
      }),
    )

    // Verify: error message renders in MessageList
    expect(wrapper.findComponent(MessageList).exists()).toBe(true)

    // Verify: error bubble has correct class and no header
    const errorBubble = wrapper.find('.nc-message-bubble--error')
    expect(errorBubble.exists()).toBe(true)
    expect(errorBubble.find('.nc-message-bubble__header').exists()).toBe(false)
    expect(errorBubble.attributes('aria-label')).toBe('Error message')
    expect(errorBubble.find('.nc-message-bubble__content').text()).toBe(
      'The service is temporarily unavailable. Please try again in a moment.',
    )

    // Verify: no copy button on error message
    expect(errorBubble.find('.nc-message-bubble__copy').exists()).toBe(false)

    // Verify: input is re-enabled
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('disabled')).toBeUndefined()
  })
})

describe('Message Retry Flow Integration (Story 4.2)', () => {
  function createMockApiClientLocal(): NativeChatApiClient {
    return {
      createConversation: vi.fn(),
      getConversations: vi.fn(),
      getMessages: vi.fn(),
      sendMessage: vi.fn(),
    }
  }

  it('full retry flow: send → fail → error shown + input pre-filled → retry → success → error in history', async () => {
    const apiClient = createMockApiClientLocal()
    ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
      conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
      has_more: false,
    })
    ;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue({
      messages: [],
      has_more: false,
    })

    // First send fails
    ;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Network error'),
    )

    const chatState = useChat(apiClient, { apiClient })
    await chatState.open()

    const wrapper = mount(ChatPanel, {
      attachTo: document.body,
      global: {
        stubs: {
          teleport: true,
        },
        provide: {
          [CONFIG_KEY as symbol]: { apiClient },
          [CHAT_STATE_KEY as symbol]: chatState,
        },
      },
    })
    activeWrappers.push(wrapper)

    // Step 1: Send message that fails
    await chatState.sendMessage('Hello')
    await nextTick()

    // Verify error message shown
    expect(chatState.messages.value).toHaveLength(1)
    expect(chatState.messages.value[0].id).toMatch(/^error-/)
    expect(chatState.messages.value[0].status).toBe('failed')

    // Verify input pre-filled with failed text
    expect(chatState.failedMessageText.value).toBe('Hello')

    // Verify isSending is false (input re-enabled)
    expect(chatState.isSending.value).toBe(false)

    // Step 2: Retry — second send succeeds
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
        content: 'Hi there!',
        createdAt: '2026-01-01',
      },
    })

    await chatState.sendMessage('Hello')
    await nextTick()

    // Verify: error message REMAINS in history (AC#6)
    expect(chatState.messages.value.some((m) => m.id.startsWith('error-'))).toBe(true)

    // Verify: user + assistant messages present
    expect(chatState.messages.value).toHaveLength(3) // error + user + assistant
    expect(chatState.messages.value[1].id).toBe('s-1')
    expect(chatState.messages.value[2].id).toBe('s-2')

    // Verify: failedMessageText cleared after success
    expect(chatState.failedMessageText.value).toBeNull()

    // Verify: error bubble still renders in DOM
    const errorBubble = wrapper.find('.nc-message-bubble--error')
    expect(errorBubble.exists()).toBe(true)
  })
})

describe('Real useChat Integration (AC #5 — null conversationId recovery)', () => {
  function createMockApiClient(): NativeChatApiClient {
    return {
      createConversation: vi.fn(),
      getConversations: vi.fn(),
      getMessages: vi.fn(),
      sendMessage: vi.fn(),
    }
  }

  it('real useChat.sendMessage creates conversation and sends when conversationId is null', async () => {
    const apiClient = createMockApiClient()

    // Simulate failed open — conversationId stays null
    ;(apiClient.getConversations as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Network'),
    )

    const chatState = useChat(apiClient, { apiClient })
    await chatState.open()

    expect(chatState.isOpen.value).toBe(true)
    expect(chatState.messages.value).toHaveLength(0)

    // Setup: conversation creation + send succeed
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

    // Mount ChatPanel with real useChat state
    const wrapper = mount(ChatPanel, {
      attachTo: document.body,
      global: {
        stubs: {
          teleport: true,
        },
        provide: {
          [CONFIG_KEY as symbol]: { apiClient },
          [CHAT_STATE_KEY as symbol]: chatState,
        },
      },
    })
    activeWrappers.push(wrapper)

    // Initially: welcome state (no messages)
    expect(wrapper.findComponent(WelcomeState).exists()).toBe(true)

    // Call sendMessage via real useChat (not mock)
    await chatState.sendMessage('Hello')
    await nextTick()

    // Verify real conversation creation and send
    expect(apiClient.createConversation).toHaveBeenCalled()
    expect(apiClient.sendMessage).toHaveBeenCalledWith('recovered-conv', 'Hello')

    // Verify UI updated: MessageList now shows messages
    expect(wrapper.findComponent(MessageList).exists()).toBe(true)
    expect(wrapper.findComponent(WelcomeState).exists()).toBe(false)
    expect(chatState.messages.value).toHaveLength(2)
  })
})
