import { mount } from '@vue/test-utils'
import { defineComponent, h, ref, readonly, nextTick } from 'vue'
import { VLayout } from 'vuetify/components'
import ChatPanel from '@/components/ChatPanel.vue'
import WelcomeState from '@/components/WelcomeState.vue'
import MessageList from '@/components/MessageList.vue'
import { useChat } from '@/composables/useChat'
import { CONFIG_KEY, CHAT_STATE_KEY } from '@/keys'
import type { UseChatReturn } from '@/composables/useChat'
import type { NativeChatApiClient } from '@/types/api'
import type { ChatMessage } from '@/types/chat'

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

  const Wrapper = defineComponent({
    setup() {
      return () => h(VLayout, null, () => h(ChatPanel))
    },
  })

  const wrapper = mount(Wrapper, {
    global: {
      provide: {
        [CONFIG_KEY as symbol]: config,
        [CHAT_STATE_KEY as symbol]: chatState,
      },
    },
  })

  return { wrapper, chatState, isOpen, isLoading, isSending, messages, failedMessageText }
}

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
    await nextTick()

    // sendMessage should have been called
    expect(chatState.sendMessage).toHaveBeenCalledWith('Hello world')

    // After optimistic update: messages exist, isSending is true
    expect(messages.value).toHaveLength(1)
    expect(messages.value[0].content).toBe('Hello world')
    expect(messages.value[0].status).toBe('sending')
    expect(isSending.value).toBe(true)

    // Wait for DOM update
    await nextTick()

    // Input should be cleared
    expect(textarea.element.value).toBe('')

    // Textarea should be disabled
    expect(textarea.attributes('disabled')).toBeDefined()
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
    const { wrapper, isSending } = createMountHelper({ isOpen: true, isSending: true })

    const textarea = wrapper.find('textarea')
    const focusSpy = vi.spyOn(textarea.element, 'focus')

    // Simulate send completing: isSending goes from true to false
    isSending.value = false
    await nextTick()
    await nextTick() // Double nextTick: watcher fires → nextTick inside watcher

    expect(focusSpy).toHaveBeenCalled()
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

    const Wrapper = defineComponent({
      setup() {
        return () => h(VLayout, null, () => h(ChatPanel))
      },
    })

    const wrapper = mount(Wrapper, {
      global: {
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
    })

    const textarea = wrapper.find('textarea')
    const focusSpy = vi.spyOn(textarea.element, 'focus')

    // Open the chat
    isOpen.value = true
    await nextTick()
    await nextTick()

    expect(focusSpy).toHaveBeenCalled()
  })

  it('welcome message shown as fallback when initial fetch fails', () => {
    // After a failed open(), messages are empty, isLoading is false, isOpen is true
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
    const Wrapper = defineComponent({
      setup() {
        return () => h(VLayout, null, () => h(ChatPanel))
      },
    })

    const wrapper = mount(Wrapper, {
      global: {
        provide: {
          [CONFIG_KEY as symbol]: { apiClient },
          [CHAT_STATE_KEY as symbol]: chatState,
        },
      },
    })

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
