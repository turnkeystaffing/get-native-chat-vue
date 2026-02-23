import { mount } from '@vue/test-utils'
import { ref, readonly } from 'vue'
import FloatingButton from '@/components/FloatingButton.vue'
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

function createState(isOpenValue = false) {
  const isOpen = ref(isOpenValue)
  const isLoading = ref(false)
  const isSending = ref(false)
  const hasMore = ref(false)
  const failedMessageText = ref<string | null>(null)
  const messages = ref<ChatMessage[]>([])

  const state: UseChatReturn = {
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
    sendMessage: vi.fn(),
    loadMore: vi.fn(),
    retry: vi.fn(),
  }

  return state
}

function mountFloatingButton(options?: {
  isOpen?: boolean
  position?: 'bottom-left' | 'bottom-right'
  hideToggleWhenOpen?: boolean
}) {
  const state = createState(options?.isOpen ?? false)
  const config = {
    apiClient: createMockApiClient(),
    position: options?.position,
    hideToggleWhenOpen: options?.hideToggleWhenOpen,
  }

  const wrapper = mount(FloatingButton, {
    global: {
      provide: {
        [CONFIG_KEY as symbol]: config,
        [CHAT_STATE_KEY as symbol]: state,
      },
    },
  })

  return { wrapper, state, config }
}

describe('FloatingButton', () => {
  it('renders a circular button with correct size (56px)', () => {
    const { wrapper } = mountFloatingButton()
    const btn = wrapper.findComponent({ name: 'VBtn' })

    expect(btn.exists()).toBe(true)
    expect(btn.props('icon')).toBe(true)
    expect(String(btn.props('size'))).toBe('56')
  })

  it('button uses secondary color from theme', () => {
    const { wrapper } = mountFloatingButton()
    const btn = wrapper.findComponent({ name: 'VBtn' })

    expect(btn.props('color')).toBe('secondary')
  })

  it('renders star icon inside the button', () => {
    const { wrapper } = mountFloatingButton()
    const icon = wrapper.findComponent({ name: 'VIcon' })

    expect(icon.exists()).toBe(true)
  })

  it('clicking button calls open() when closed', async () => {
    const { wrapper, state } = mountFloatingButton({ isOpen: false })
    const btn = wrapper.findComponent({ name: 'VBtn' })

    await btn.trigger('click')

    expect(state.open).toHaveBeenCalled()
    expect(state.close).not.toHaveBeenCalled()
  })

  it('clicking button calls close() when open', async () => {
    const { wrapper, state } = mountFloatingButton({ isOpen: true })
    const btn = wrapper.findComponent({ name: 'VBtn' })

    await btn.trigger('click')

    expect(state.close).toHaveBeenCalled()
    expect(state.open).not.toHaveBeenCalled()
  })

  it('aria-label is "Open chat" when isOpen is false', () => {
    const { wrapper } = mountFloatingButton({ isOpen: false })
    const btn = wrapper.findComponent({ name: 'VBtn' })

    expect(btn.attributes('aria-label')).toBe('Open chat')
  })

  it('aria-label is "Close chat" when isOpen is true', () => {
    const { wrapper } = mountFloatingButton({ isOpen: true })
    const btn = wrapper.findComponent({ name: 'VBtn' })

    expect(btn.attributes('aria-label')).toBe('Close chat')
  })

  it('aria-expanded reflects isOpen state', () => {
    const { wrapper: closedWrapper } = mountFloatingButton({ isOpen: false })
    expect(closedWrapper.findComponent({ name: 'VBtn' }).attributes('aria-expanded')).toBe('false')

    const { wrapper: openWrapper } = mountFloatingButton({ isOpen: true })
    expect(openWrapper.findComponent({ name: 'VBtn' }).attributes('aria-expanded')).toBe('true')
  })

  it('default position is bottom-right (right: 24px)', () => {
    const { wrapper } = mountFloatingButton()
    const wrapperDiv = wrapper.find('.nc-floating-button-wrapper')

    expect(wrapperDiv.classes()).toContain('nc-floating-button-wrapper--right')
  })

  it('position: bottom-left config places button at left', () => {
    const { wrapper } = mountFloatingButton({ position: 'bottom-left' })
    const wrapperDiv = wrapper.find('.nc-floating-button-wrapper')

    expect(wrapperDiv.classes()).toContain('nc-floating-button-wrapper--left')
  })

  it('is visible when open and hideToggleWhenOpen is false (default)', () => {
    const { wrapper } = mountFloatingButton({ isOpen: true })
    const wrapperDiv = wrapper.find('.nc-floating-button-wrapper')

    expect(wrapperDiv.element.style.display).not.toBe('none')
  })

  it('is hidden when open and hideToggleWhenOpen is true', () => {
    const { wrapper } = mountFloatingButton({ isOpen: true, hideToggleWhenOpen: true })
    const wrapperDiv = wrapper.find('.nc-floating-button-wrapper')

    expect(wrapperDiv.element.style.display).toBe('none')
  })

  it('is visible when closed and hideToggleWhenOpen is true', () => {
    const { wrapper } = mountFloatingButton({ isOpen: false, hideToggleWhenOpen: true })
    const wrapperDiv = wrapper.find('.nc-floating-button-wrapper')

    expect(wrapperDiv.element.style.display).not.toBe('none')
  })

  it('button has elevation 4', () => {
    const { wrapper } = mountFloatingButton()
    const btn = wrapper.findComponent({ name: 'VBtn' })

    expect(String(btn.props('elevation'))).toBe('4')
  })

  it('renders wrapper div with fixed-positioning class', () => {
    const { wrapper } = mountFloatingButton()
    const wrapperDiv = wrapper.find('.nc-floating-button-wrapper')

    expect(wrapperDiv.exists()).toBe(true)
    expect(wrapperDiv.classes()).toContain('nc-floating-button-wrapper')
    expect(wrapperDiv.classes()).toContain('nc-floating-button-wrapper--right')
  })
})
