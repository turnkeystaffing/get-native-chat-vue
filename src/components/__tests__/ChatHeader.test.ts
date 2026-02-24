import { mount } from '@vue/test-utils'
import { ref, readonly } from 'vue'
import ChatHeader from '@/components/ChatHeader.vue'
import { CHAT_STATE_KEY } from '@/keys'
import type { UseChatReturn } from '@/composables/useChat'
import type { ChatMessage } from '@/types/chat'

function mountChatHeader() {
  const isOpen = ref(true)
  const closeFn = vi.fn(() => {
    isOpen.value = false
  })

  const chatState: UseChatReturn = {
    isOpen: readonly(isOpen),
    isLoading: readonly(ref(false)),
    isSending: readonly(ref(false)),
    hasMore: readonly(ref(false)),
    failedMessageText: readonly(ref<string | null>(null)),
    messages: readonly(ref<ChatMessage[]>([])),
    open: vi.fn(),
    close: closeFn,
    sendMessage: vi.fn(),
    loadMore: vi.fn(),
    retry: vi.fn(),
  }

  const wrapper = mount(ChatHeader, {
    global: {
      provide: {
        [CHAT_STATE_KEY as symbol]: chatState,
      },
    },
  })

  return { wrapper, closeFn, chatState }
}

describe('ChatHeader', () => {
  it('renders star icon and "AI Assistant" title', () => {
    const { wrapper } = mountChatHeader()

    expect(wrapper.find('.nc-chat-header__title').text()).toBe('AI Assistant')
    const icons = wrapper.findAllComponents({ name: 'VIcon' })
    expect(icons.length).toBeGreaterThanOrEqual(1)
  })

  it('renders close (X) button', () => {
    const { wrapper } = mountChatHeader()
    const closeBtn = wrapper.findComponent({ name: 'VBtn' })

    expect(closeBtn.exists()).toBe(true)
  })

  it('close button has aria-label="Close chat"', () => {
    const { wrapper } = mountChatHeader()
    const closeBtn = wrapper.findComponent({ name: 'VBtn' })

    expect(closeBtn.attributes('aria-label')).toBe('Close chat')
  })

  it('clicking close button calls close() from injected state', async () => {
    const { wrapper, closeFn } = mountChatHeader()
    const closeBtn = wrapper.findComponent({ name: 'VBtn' })

    await closeBtn.trigger('click')

    expect(closeFn).toHaveBeenCalledOnce()
  })

  it('close button uses variant="text" (opacity-only hover)', () => {
    const { wrapper } = mountChatHeader()
    const closeBtn = wrapper.findComponent({ name: 'VBtn' })

    expect(closeBtn.props('variant')).toBe('text')
  })

  it('close button uses size="default" (meets 44px tap target)', () => {
    const { wrapper } = mountChatHeader()
    const closeBtn = wrapper.findComponent({ name: 'VBtn' })

    expect(closeBtn.props('size')).toBe('default')
  })

  it('close icon uses size="22"', () => {
    const { wrapper } = mountChatHeader()
    const closeBtn = wrapper.findComponent({ name: 'VBtn' })
    const closeIcon = closeBtn.findComponent({ name: 'VIcon' })

    expect(String(closeIcon.props('size'))).toBe('22')
  })

  it('close button is keyboard accessible via v-btn', () => {
    const { wrapper } = mountChatHeader()
    const closeBtn = wrapper.findComponent({ name: 'VBtn' })

    // v-btn handles Enter/Space keyboard events natively
    expect(closeBtn.exists()).toBe(true)
    expect(closeBtn.attributes('aria-label')).toBe('Close chat')
  })
})
