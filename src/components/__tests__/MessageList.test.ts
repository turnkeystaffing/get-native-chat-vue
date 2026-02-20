import { mount } from '@vue/test-utils'
import { ref, readonly, nextTick } from 'vue'
import MessageList from '@/components/MessageList.vue'
import MessageBubble from '@/components/MessageBubble.vue'
import { CHAT_STATE_KEY } from '@/keys'
import type { UseChatReturn } from '@/composables/useChat'
import type { ChatMessage } from '@/types/chat'

vi.mock('marked', () => ({
  marked: {
    parse: vi.fn((content: string) => `<p>${content}</p>`),
  },
}))

vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((html: string) => html),
  },
}))

function createMessage(
  id: string,
  role: 'user' | 'assistant' = 'user',
  content = 'Hello',
): ChatMessage {
  return {
    id,
    conversationId: 'conv-1',
    role,
    content,
    createdAt: '2026-02-20T00:00:00Z',
  }
}

function mountMessageList(options?: { messages?: ChatMessage[] }) {
  const messages = ref<ChatMessage[]>(options?.messages ?? [])
  const isOpen = ref(true)
  const isLoading = ref(false)
  const isSending = ref(false)
  const hasMore = ref(false)
  const failedMessageText = ref<string | null>(null)

  const chatState: UseChatReturn = {
    messages: readonly(messages),
    isOpen: readonly(isOpen),
    isLoading: readonly(isLoading),
    isSending: readonly(isSending),
    hasMore: readonly(hasMore),
    failedMessageText: readonly(failedMessageText),
    open: vi.fn(),
    close: vi.fn(),
    sendMessage: vi.fn(),
    loadMore: vi.fn(),
    retry: vi.fn(),
  }

  const wrapper = mount(MessageList, {
    global: {
      provide: {
        [CHAT_STATE_KEY as symbol]: chatState,
      },
    },
  })

  return { wrapper, messages, chatState }
}

describe('MessageList', () => {
  it('renders <ul> with role="list" and aria-live="polite"', () => {
    const { wrapper } = mountMessageList()

    const ul = wrapper.find('ul')
    expect(ul.exists()).toBe(true)
    expect(ul.attributes('role')).toBe('list')
    expect(ul.attributes('aria-live')).toBe('polite')
  })

  it('renders one MessageBubble per message in chatState.messages', () => {
    const msgs = [
      createMessage('1', 'user'),
      createMessage('2', 'assistant'),
      createMessage('3', 'user'),
    ]
    const { wrapper } = mountMessageList({ messages: msgs })

    const bubbles = wrapper.findAllComponents(MessageBubble)
    expect(bubbles).toHaveLength(3)
  })

  it('messages render in chronological order (first message at top, last at bottom)', () => {
    const msgs = [
      createMessage('1', 'user', 'First'),
      createMessage('2', 'assistant', 'Second'),
      createMessage('3', 'user', 'Third'),
    ]
    const { wrapper } = mountMessageList({ messages: msgs })

    const bubbles = wrapper.findAllComponents(MessageBubble)
    expect(bubbles[0].props('message').content).toBe('First')
    expect(bubbles[1].props('message').content).toBe('Second')
    expect(bubbles[2].props('message').content).toBe('Third')
  })

  it('auto-scrolls to bottom when new message added and user is near bottom', async () => {
    const msgs = [createMessage('1', 'user')]
    const { wrapper, messages } = mountMessageList({ messages: msgs })

    const ul = wrapper.find('ul').element as HTMLUListElement

    // Mock scroll properties: user is near bottom
    Object.defineProperty(ul, 'scrollHeight', { value: 500, writable: true, configurable: true })
    Object.defineProperty(ul, 'scrollTop', { value: 450, writable: true, configurable: true })
    Object.defineProperty(ul, 'clientHeight', { value: 100, writable: true, configurable: true })

    // Trigger scroll to update isNearBottom
    await wrapper.find('ul').trigger('scroll')

    // Add a new message
    messages.value = [...messages.value, createMessage('2', 'assistant')]
    await nextTick()
    await nextTick()

    // scrollTop should have been set to scrollHeight
    expect(ul.scrollTop).toBe(ul.scrollHeight)
  })

  it('does NOT auto-scroll when user has scrolled up (not near bottom)', async () => {
    const msgs = [createMessage('1', 'user')]
    const { wrapper, messages } = mountMessageList({ messages: msgs })

    const ul = wrapper.find('ul').element as HTMLUListElement

    // Mock scroll properties: user has scrolled up (far from bottom)
    Object.defineProperty(ul, 'scrollHeight', { value: 1000, writable: true, configurable: true })
    Object.defineProperty(ul, 'scrollTop', { value: 100, writable: true, configurable: true })
    Object.defineProperty(ul, 'clientHeight', { value: 100, writable: true, configurable: true })

    // Trigger scroll to update isNearBottom
    await wrapper.find('ul').trigger('scroll')

    const scrollTopBefore = ul.scrollTop

    // Add a new message
    messages.value = [...messages.value, createMessage('2', 'assistant')]
    await nextTick()
    await nextTick()

    // scrollTop should NOT have changed
    expect(ul.scrollTop).toBe(scrollTopBefore)
  })

  it('scrolls to bottom on initial render with messages', async () => {
    const msgs = [createMessage('1', 'user'), createMessage('2', 'assistant')]
    const { wrapper } = mountMessageList({ messages: msgs })

    const ul = wrapper.find('ul').element as HTMLUListElement
    // Mock scrollHeight before the queued nextTick(scrollToBottom) executes
    Object.defineProperty(ul, 'scrollHeight', { value: 500, writable: true, configurable: true })

    await nextTick()
    await nextTick()

    // scrollToBottom sets scrollTop = scrollHeight
    expect(ul.scrollTop).toBe(500)
  })

  it('empty messages array renders empty list (no crash)', () => {
    const { wrapper } = mountMessageList({ messages: [] })

    const ul = wrapper.find('ul')
    expect(ul.exists()).toBe(true)
    expect(wrapper.findAllComponents(MessageBubble)).toHaveLength(0)
  })
})
