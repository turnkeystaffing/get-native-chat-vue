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

function mountMessageList(options?: { messages?: ChatMessage[]; hasMore?: boolean }) {
  const messages = ref<ChatMessage[]>(options?.messages ?? [])
  const isOpen = ref(true)
  const isLoading = ref(false)
  const isSending = ref(false)
  const hasMore = ref(options?.hasMore ?? false)
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

  return { wrapper, messages, hasMore, isLoading, chatState }
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

  it('scrolls to bottom when new message appended (send/response)', async () => {
    const msgs = [createMessage('1', 'user')]
    const { wrapper, messages } = mountMessageList({ messages: msgs })

    const scrollContainer = wrapper.find('.v-infinite-scroll').element as HTMLElement

    Object.defineProperty(scrollContainer, 'scrollHeight', {
      value: 500,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'scrollTop', {
      value: 0,
      writable: true,
      configurable: true,
    })

    // Add a new message (simulates send/response)
    messages.value = [...messages.value, createMessage('2', 'assistant')]
    await nextTick()
    await nextTick()

    // scrollTop should have been set to scrollHeight — event-driven, no position gate
    expect(scrollContainer.scrollTop).toBe(scrollContainer.scrollHeight)
  })

  it('scrolls to bottom on send/response even when user has scrolled up', async () => {
    const msgs = [createMessage('1', 'user')]
    const { wrapper, messages } = mountMessageList({ messages: msgs })

    const scrollContainer = wrapper.find('.v-infinite-scroll').element as HTMLElement

    // Mock scroll properties: user has scrolled up (far from bottom)
    Object.defineProperty(scrollContainer, 'scrollHeight', {
      value: 1000,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'scrollTop', {
      value: 100,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'clientHeight', {
      value: 100,
      writable: true,
      configurable: true,
    })

    // Trigger scroll to update isNearBottom (far from bottom)
    scrollContainer.dispatchEvent(new Event('scroll'))
    await nextTick()

    // Add a new message (simulates send/response — NOT loadMore)
    messages.value = [...messages.value, createMessage('2', 'assistant')]
    await nextTick()
    await nextTick()

    // Event-driven policy: scrollTop SHOULD be set to scrollHeight regardless of position
    expect(scrollContainer.scrollTop).toBe(scrollContainer.scrollHeight)
  })

  it('scrolls to bottom on initial render with messages', async () => {
    const msgs = [createMessage('1', 'user'), createMessage('2', 'assistant')]
    const { wrapper } = mountMessageList({ messages: msgs })

    const scrollContainer = wrapper.find('.v-infinite-scroll').element as HTMLElement
    // Mock scrollHeight before the queued nextTick(scrollToBottom) executes
    Object.defineProperty(scrollContainer, 'scrollHeight', {
      value: 500,
      writable: true,
      configurable: true,
    })

    await nextTick()
    await nextTick()

    // scrollToBottom sets scrollTop = scrollHeight
    expect(scrollContainer.scrollTop).toBe(500)
  })

  it('empty messages array renders empty list (no crash)', () => {
    const { wrapper } = mountMessageList({ messages: [] })

    const ul = wrapper.find('ul')
    expect(ul.exists()).toBe(true)
    expect(wrapper.findAllComponents(MessageBubble)).toHaveLength(0)
  })

  it('does NOT scroll to bottom when messages are prepended via loadMore', async () => {
    const msgs = [createMessage('3', 'user'), createMessage('4', 'assistant')]
    const { wrapper, messages, chatState } = mountMessageList({
      messages: msgs,
      hasMore: true,
    })

    const scrollContainer = wrapper.find('.v-infinite-scroll').element as HTMLElement

    // Flush onMounted's deferred scrollToBottom
    await nextTick()
    await nextTick()

    let mockScrollHeight = 400

    Object.defineProperty(scrollContainer, 'scrollHeight', {
      get: () => mockScrollHeight,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'scrollTop', {
      value: 50,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'clientHeight', {
      value: 100,
      writable: true,
      configurable: true,
    })

    // Configure loadMore to prepend older messages
    const loadMoreFn = chatState.loadMore as ReturnType<typeof vi.fn>
    loadMoreFn.mockImplementation(async () => {
      const olderMessages = [createMessage('1', 'user'), createMessage('2', 'assistant')]
      messages.value = [...olderMessages, ...messages.value]
      mockScrollHeight = 600
    })

    const infiniteScroll = wrapper.findComponent({ name: 'VInfiniteScroll' })
    const doneFn = vi.fn()

    await infiniteScroll.vm.$emit('load', { side: 'start', done: doneFn })
    await nextTick()
    await nextTick()
    await nextTick()

    // scrollTop should be adjusted by delta (600 - 400 = 200), not set to scrollHeight
    // Initial scrollTop 50 + delta 200 = 250
    expect(scrollContainer.scrollTop).toBe(250)
    // Should NOT have been set to scrollHeight (600)
    expect(scrollContainer.scrollTop).not.toBe(mockScrollHeight)
  })

  it('scrolls to bottom on assistant response arrival even when scrolled to middle', async () => {
    const msgs = [createMessage('1', 'user'), createMessage('2', 'assistant')]
    const { wrapper, messages } = mountMessageList({ messages: msgs })

    const scrollContainer = wrapper.find('.v-infinite-scroll').element as HTMLElement

    // Flush onMounted's deferred scrollToBottom
    await nextTick()
    await nextTick()

    // Mock: user is in the middle of history
    Object.defineProperty(scrollContainer, 'scrollHeight', {
      value: 2000,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'scrollTop', {
      value: 500,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'clientHeight', {
      value: 100,
      writable: true,
      configurable: true,
    })

    // Trigger scroll to mark user as NOT near bottom
    scrollContainer.dispatchEvent(new Event('scroll'))
    await nextTick()

    // Simulate user sends a message (append)
    messages.value = [...messages.value, createMessage('3', 'user', 'New question')]
    await nextTick()
    await nextTick()

    // Should scroll to bottom despite being in middle
    expect(scrollContainer.scrollTop).toBe(scrollContainer.scrollHeight)

    // Simulate assistant response arrives (another append)
    messages.value = [...messages.value, createMessage('4', 'assistant', 'Response')]
    await nextTick()
    await nextTick()

    // Should scroll to bottom again
    expect(scrollContainer.scrollTop).toBe(scrollContainer.scrollHeight)
  })

  it('scrolls to bottom when response arrives during active loadMore (race condition)', async () => {
    const msgs = [createMessage('3', 'user'), createMessage('4', 'assistant')]
    const { wrapper, messages, chatState } = mountMessageList({
      messages: msgs,
      hasMore: true,
    })

    const scrollContainer = wrapper.find('.v-infinite-scroll').element as HTMLElement

    // Flush onMounted's deferred scrollToBottom
    await nextTick()
    await nextTick()

    let mockScrollHeight = 400

    Object.defineProperty(scrollContainer, 'scrollHeight', {
      get: () => mockScrollHeight,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'scrollTop', {
      value: 50,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'clientHeight', {
      value: 100,
      writable: true,
      configurable: true,
    })

    // Configure loadMore to prepend older messages AND simulate a response arriving mid-load
    const loadMoreFn = chatState.loadMore as ReturnType<typeof vi.fn>
    loadMoreFn.mockImplementation(async () => {
      const olderMessages = [createMessage('1', 'user'), createMessage('2', 'assistant')]
      messages.value = [...olderMessages, ...messages.value]
      mockScrollHeight = 600

      // Simulate assistant response arriving during the loadMore await
      messages.value = [
        ...messages.value,
        createMessage('5', 'assistant', 'Late response'),
      ]
      mockScrollHeight = 800
    })

    const infiniteScroll = wrapper.findComponent({ name: 'VInfiniteScroll' })
    const doneFn = vi.fn()

    await infiniteScroll.vm.$emit('load', { side: 'start', done: doneFn })
    await nextTick()
    await nextTick()
    await nextTick()
    await nextTick()

    // The deferred scroll should fire after handleLoadMore completes position adjustment
    // Final scrollTop should be scrollHeight — the response was not silently suppressed
    expect(scrollContainer.scrollTop).toBe(mockScrollHeight)
  })

  // Task 4: Infinite scroll trigger tests
  describe('infinite scroll', () => {
    it('renders v-infinite-scroll with side="start" when hasMore is true', () => {
      const msgs = [createMessage('1', 'user')]
      const { wrapper } = mountMessageList({ messages: msgs, hasMore: true })

      const infiniteScroll = wrapper.findComponent({ name: 'VInfiniteScroll' })
      expect(infiniteScroll.exists()).toBe(true)
      expect(infiniteScroll.props('side')).toBe('start')
    })

    it('@load event triggers loadMore() on the composable', async () => {
      const msgs = [createMessage('1', 'user')]
      const { wrapper, chatState } = mountMessageList({ messages: msgs, hasMore: true })

      const infiniteScroll = wrapper.findComponent({ name: 'VInfiniteScroll' })
      const doneFn = vi.fn()

      await infiniteScroll.vm.$emit('load', { side: 'start', done: doneFn })
      await nextTick()

      expect(chatState.loadMore).toHaveBeenCalledOnce()
    })

    it('v-infinite-scroll is disabled when hasMore is false', () => {
      const msgs = [createMessage('1', 'user')]
      const { wrapper } = mountMessageList({ messages: msgs, hasMore: false })

      const infiniteScroll = wrapper.findComponent({ name: 'VInfiniteScroll' })
      expect(infiniteScroll.attributes('disabled')).toBe('true')
    })

    it('v-infinite-scroll is not disabled when hasMore is true', () => {
      const msgs = [createMessage('1', 'user')]
      const { wrapper } = mountMessageList({ messages: msgs, hasMore: true })

      const infiniteScroll = wrapper.findComponent({ name: 'VInfiniteScroll' })
      expect(infiniteScroll.attributes('disabled')).toBe('false')
    })

    it('loading indicator renders v-progress-circular in #loading slot', () => {
      const msgs = [createMessage('1', 'user')]
      const { wrapper } = mountMessageList({ messages: msgs, hasMore: true })

      const loader = wrapper.find('.nc-message-list__loader')
      expect(loader.exists()).toBe(true)
      expect(loader.findComponent({ name: 'VProgressCircular' }).exists()).toBe(true)
    })
  })

  // Task 5: Scroll position preservation and error handling tests
  describe('scroll position preservation', () => {
    it('adjusts scrollTop after messages prepend to preserve view position', async () => {
      const msgs = [createMessage('3', 'user'), createMessage('4', 'assistant')]
      const { wrapper, messages, chatState } = mountMessageList({
        messages: msgs,
        hasMore: true,
      })

      const scrollContainer = wrapper.find('.v-infinite-scroll').element as HTMLElement

      // Flush onMounted's deferred scrollToBottom before setting up mocks
      await nextTick()
      await nextTick()

      let mockScrollHeight = 400

      // Mock scroll state: user scrolled up (far from bottom — triggers loadMore)
      Object.defineProperty(scrollContainer, 'scrollHeight', {
        get: () => mockScrollHeight,
        configurable: true,
      })
      Object.defineProperty(scrollContainer, 'scrollTop', {
        value: 10,
        writable: true,
        configurable: true,
      })
      Object.defineProperty(scrollContainer, 'clientHeight', {
        value: 100,
        writable: true,
        configurable: true,
      })

      // Trigger scroll to set isNearBottom = false (user scrolled up)
      scrollContainer.dispatchEvent(new Event('scroll'))
      await nextTick()

      // Configure loadMore to simulate prepending messages and increasing scrollHeight
      const loadMoreFn = chatState.loadMore as ReturnType<typeof vi.fn>
      loadMoreFn.mockImplementation(async () => {
        const olderMessages = [createMessage('1', 'user'), createMessage('2', 'assistant')]
        messages.value = [...olderMessages, ...messages.value]
        // Simulate DOM growing by 200px from prepended messages
        mockScrollHeight = 600
      })

      const infiniteScroll = wrapper.findComponent({ name: 'VInfiniteScroll' })
      const doneFn = vi.fn()

      await infiniteScroll.vm.$emit('load', { side: 'start', done: doneFn })
      await nextTick()
      await nextTick()
      await nextTick()

      expect(loadMoreFn).toHaveBeenCalledOnce()
      expect(doneFn).toHaveBeenCalledWith('ok')
      // scrollTop should be adjusted: initial 10 + delta (600 - 400) = 210
      expect(scrollContainer.scrollTop).toBe(210)
    })

    it('failed fetch calls done with ok status allowing retry', async () => {
      const msgs = [createMessage('1', 'user')]
      const { wrapper, chatState } = mountMessageList({
        messages: msgs,
        hasMore: true,
      })

      // Configure loadMore to simulate failure (silent catch, hasMore stays true)
      const loadMoreFn = chatState.loadMore as ReturnType<typeof vi.fn>
      loadMoreFn.mockImplementation(async () => {
        // Simulate silent error — hasMore stays true, no state changes
      })

      const infiniteScroll = wrapper.findComponent({ name: 'VInfiniteScroll' })
      const doneFn = vi.fn()

      await infiniteScroll.vm.$emit('load', { side: 'start', done: doneFn })
      await nextTick()

      // hasMore is still true → done('ok') allows retry
      expect(doneFn).toHaveBeenCalledWith('ok')
    })

    it('done("empty") called when hasMore becomes false after fetch', async () => {
      const msgs = [createMessage('1', 'user')]
      const { wrapper, hasMore, chatState } = mountMessageList({
        messages: msgs,
        hasMore: true,
      })

      // Configure loadMore to set hasMore to false
      const loadMoreFn = chatState.loadMore as ReturnType<typeof vi.fn>
      loadMoreFn.mockImplementation(async () => {
        hasMore.value = false
      })

      const infiniteScroll = wrapper.findComponent({ name: 'VInfiniteScroll' })
      const doneFn = vi.fn()

      await infiniteScroll.vm.$emit('load', { side: 'start', done: doneFn })
      await nextTick()

      expect(doneFn).toHaveBeenCalledWith('empty')
    })

    it('user can trigger another load after failed fetch', async () => {
      const msgs = [createMessage('1', 'user')]
      const { wrapper, chatState } = mountMessageList({
        messages: msgs,
        hasMore: true,
      })

      const loadMoreFn = chatState.loadMore as ReturnType<typeof vi.fn>
      // First call: failure (no state change)
      loadMoreFn.mockImplementationOnce(async () => {})
      // Second call: success
      loadMoreFn.mockImplementationOnce(async () => {})

      const infiniteScroll = wrapper.findComponent({ name: 'VInfiniteScroll' })
      const doneFn1 = vi.fn()
      const doneFn2 = vi.fn()

      // First trigger (failure)
      await infiniteScroll.vm.$emit('load', { side: 'start', done: doneFn1 })
      await nextTick()
      expect(doneFn1).toHaveBeenCalledWith('ok')

      // Second trigger (retry)
      await infiniteScroll.vm.$emit('load', { side: 'start', done: doneFn2 })
      await nextTick()
      expect(loadMoreFn).toHaveBeenCalledTimes(2)
      expect(doneFn2).toHaveBeenCalledWith('ok')
    })
  })

  describe('message entrance animation', () => {
    it('does not pass animate=true for messages present on initial mount', async () => {
      const msgs = [createMessage('1', 'user'), createMessage('2', 'assistant')]
      const { wrapper } = mountMessageList({ messages: msgs })
      await nextTick()

      const bubbles = wrapper.findAllComponents(MessageBubble)
      bubbles.forEach((bubble) => {
        expect(bubble.props('animate')).toBe(false)
      })
    })

    it('passes animate=true for messages added after initial mount', async () => {
      const msgs = [createMessage('1', 'user')]
      const { wrapper, messages } = mountMessageList({ messages: msgs })
      await nextTick()
      await nextTick() // ensure initialLoadComplete is true

      // Add a new message (simulates sendMessage appending)
      messages.value = [...messages.value, createMessage('2', 'assistant', 'New reply')]
      await nextTick()

      const bubbles = wrapper.findAllComponents(MessageBubble)
      expect(bubbles[0].props('animate')).toBe(false) // existing
      expect(bubbles[1].props('animate')).toBe(true) // new
    })

    it('does not animate messages loaded via loadMore (prepended)', async () => {
      const msgs = [createMessage('3', 'user')]
      const { wrapper, messages, chatState } = mountMessageList({
        messages: msgs,
        hasMore: true,
      })
      await nextTick()
      await nextTick()

      // Configure loadMore to prepend older messages
      const loadMoreFn = chatState.loadMore as ReturnType<typeof vi.fn>
      loadMoreFn.mockImplementation(async () => {
        messages.value = [
          createMessage('1', 'user'),
          createMessage('2', 'assistant'),
          ...messages.value,
        ]
      })

      const infiniteScroll = wrapper.findComponent({ name: 'VInfiniteScroll' })
      const doneFn = vi.fn()
      await infiniteScroll.vm.$emit('load', { side: 'start', done: doneFn })
      await nextTick()
      await nextTick()

      const bubbles = wrapper.findAllComponents(MessageBubble)
      bubbles.forEach((bubble) => {
        expect(bubble.props('animate')).toBe(false)
      })
    })
  })
})
