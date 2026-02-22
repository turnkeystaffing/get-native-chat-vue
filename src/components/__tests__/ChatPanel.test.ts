import { mount } from '@vue/test-utils'
import { ref, readonly } from 'vue'
import ChatPanel from '@/components/ChatPanel.vue'
import ChatHeader from '@/components/ChatHeader.vue'
import WelcomeState from '@/components/WelcomeState.vue'
import MessageList from '@/components/MessageList.vue'
import ChatInput from '@/components/ChatInput.vue'
import { CONFIG_KEY, CHAT_STATE_KEY } from '@/keys'
import type { NativeChatApiClient } from '@/types/api'
import type { UseChatReturn } from '@/composables/useChat'
import type { ChatMessage } from '@/types/chat'

function createMockApiClient(): NativeChatApiClient {
  return {
    createConversation: vi.fn(),
    getConversations: vi.fn(),
    getMessages: vi.fn(),
    sendMessage: vi.fn(),
  }
}

function mountChatPanel(options?: {
  isOpen?: boolean
  welcomeMessage?: string
  isLoading?: boolean
  messages?: ChatMessage[]
}) {
  const config = {
    apiClient: createMockApiClient(),
    welcomeMessage: options?.welcomeMessage,
  }

  const isOpen = ref(options?.isOpen ?? false)
  const isLoading = ref(options?.isLoading ?? false)
  const isSending = ref(false)
  const hasMore = ref(false)
  const failedMessageText = ref<string | null>(null)
  const messages = ref<ChatMessage[]>(options?.messages ?? [])

  const closeFn = vi.fn(() => {
    isOpen.value = false
  })
  const openFn = vi.fn(async () => {
    isOpen.value = true
  })

  const chatState: UseChatReturn = {
    isOpen: readonly(isOpen),
    isLoading: readonly(isLoading),
    isSending: readonly(isSending),
    hasMore: readonly(hasMore),
    failedMessageText: readonly(failedMessageText),
    messages: readonly(messages),
    open: openFn,
    close: closeFn,
    sendMessage: vi.fn(),
    loadMore: vi.fn(),
    retry: vi.fn(),
  }

  const wrapper = mount(ChatPanel, {
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

  return { wrapper, config, chatState, isOpen, isLoading, messages, closeFn, openFn }
}

describe('ChatPanel', () => {
  it('renders panel div when isOpen is true', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })

    expect(wrapper.find('.nc-chat-panel').exists()).toBe(true)
  })

  it('does not render panel div when isOpen is false', () => {
    const { wrapper } = mountChatPanel({ isOpen: false })

    expect(wrapper.find('.nc-chat-panel').exists()).toBe(false)
  })

  it('panel renders inside Teleport to body when open', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })
    const panel = wrapper.find('[role="complementary"]')

    expect(panel.exists()).toBe(true)
    expect(panel.classes()).toContain('nc-chat-panel')
  })

  it('panel has floating CSS class and proper structure', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })
    const panel = wrapper.find('.nc-chat-panel')

    expect(panel.exists()).toBe(true)
    expect(panel.find('.nc-chat-panel__body').exists()).toBe(true)
  })

  it('renders ChatHeader as child', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })

    expect(wrapper.findComponent(ChatHeader).exists()).toBe(true)
  })

  it('renders WelcomeState when messages are empty and not loading', () => {
    const { wrapper } = mountChatPanel({ isOpen: true, messages: [], isLoading: false })

    expect(wrapper.findComponent(WelcomeState).exists()).toBe(true)
    expect(wrapper.findComponent(MessageList).exists()).toBe(false)
  })

  it('renders MessageList when messages exist', () => {
    const msgs: ChatMessage[] = [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        role: 'user',
        content: 'Hello',
        createdAt: '2026-02-20T00:00:00Z',
      },
    ]
    const { wrapper } = mountChatPanel({ isOpen: true, messages: msgs, isLoading: false })

    expect(wrapper.findComponent(MessageList).exists()).toBe(true)
    expect(wrapper.findComponent(WelcomeState).exists()).toBe(false)
  })

  it('renders loading indicator when isLoading is true and no messages', () => {
    const { wrapper } = mountChatPanel({ isOpen: true, isLoading: true, messages: [] })

    const loader = wrapper.findComponent({ name: 'VProgressCircular' })
    expect(loader.exists()).toBe(true)
    // WelcomeState should NOT be rendered when loading
    expect(wrapper.findComponent(WelcomeState).exists()).toBe(false)
  })

  it('renders MessageList (not spinner) when isLoading is true but messages exist', () => {
    const msgs: ChatMessage[] = [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        role: 'user',
        content: 'Hello',
        createdAt: '2026-02-20T00:00:00Z',
      },
    ]
    const { wrapper } = mountChatPanel({ isOpen: true, isLoading: true, messages: msgs })

    expect(wrapper.findComponent(MessageList).exists()).toBe(true)
    expect(wrapper.find('.nc-chat-panel__loader').exists()).toBe(false)
  })

  it('panel has role="complementary" and aria-label="Chat with AI Assistant"', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })
    const panel = wrapper.find('[role="complementary"]')

    expect(panel.exists()).toBe(true)
    expect(panel.attributes('role')).toBe('complementary')
    expect(panel.attributes('aria-label')).toBe('Chat with AI Assistant')
  })

  it('global Escape key calls close() regardless of focus location', () => {
    const { closeFn } = mountChatPanel({ isOpen: true })

    // Dispatch Escape on window — simulates pressing Escape with focus anywhere
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(closeFn).toHaveBeenCalledOnce()
  })

  it('Escape key does not call close() when panel is closed', () => {
    const { closeFn } = mountChatPanel({ isOpen: false })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(closeFn).not.toHaveBeenCalled()
  })

  it('passes welcomeMessage from config to WelcomeState', () => {
    const { wrapper } = mountChatPanel({
      isOpen: true,
      welcomeMessage: 'Custom welcome!',
    })
    const welcomeState = wrapper.findComponent(WelcomeState)

    expect(welcomeState.props('message')).toBe('Custom welcome!')
  })

  it('renders ChatInput component when panel is open', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })

    expect(wrapper.findComponent(ChatInput).exists()).toBe(true)
  })

  it('cleans up Escape listener on unmount', () => {
    const { wrapper, closeFn } = mountChatPanel({ isOpen: true })
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    wrapper.unmount()

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    // After unmount, Escape should not call close
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(closeFn).not.toHaveBeenCalled()

    removeSpy.mockRestore()
  })
})
