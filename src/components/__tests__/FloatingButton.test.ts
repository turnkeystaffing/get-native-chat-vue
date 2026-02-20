import { mount } from '@vue/test-utils'
import { ref, readonly } from 'vue'
import FloatingButton from '@/components/FloatingButton.vue'
import { CONFIG_KEY, CHAT_STATE_KEY } from '@/keys'
import type { NativeChatApiClient } from '@/types/api'

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
  return {
    isOpen: readonly(isOpen),
    open: () => {
      isOpen.value = true
    },
    close: () => {
      isOpen.value = false
    },
    toggle: vi.fn(() => {
      isOpen.value = !isOpen.value
    }),
  }
}

function mountFloatingButton(options?: {
  isOpen?: boolean
  position?: 'bottom-left' | 'bottom-right'
}) {
  const state = createState(options?.isOpen ?? false)
  const config = {
    apiClient: createMockApiClient(),
    position: options?.position,
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

  it('clicking button calls toggle() from injected state', async () => {
    const { wrapper, state } = mountFloatingButton()
    const btn = wrapper.findComponent({ name: 'VBtn' })

    await btn.trigger('click')

    expect(state.toggle).toHaveBeenCalled()
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

  it('renders wrapper div with fixed-positioning class', () => {
    const { wrapper } = mountFloatingButton()
    const wrapperDiv = wrapper.find('.nc-floating-button-wrapper')

    expect(wrapperDiv.exists()).toBe(true)
    expect(wrapperDiv.classes()).toContain('nc-floating-button-wrapper')
    expect(wrapperDiv.classes()).toContain('nc-floating-button-wrapper--right')
  })
})
