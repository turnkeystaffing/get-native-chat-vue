import { mount } from '@vue/test-utils'
import { defineComponent, h, ref, readonly } from 'vue'
import { VLayout } from 'vuetify/components'
import ChatPanel from '@/components/ChatPanel.vue'
import ChatHeader from '@/components/ChatHeader.vue'
import WelcomeState from '@/components/WelcomeState.vue'
import { CONFIG_KEY, CHAT_STATE_KEY } from '@/keys'
import type { NativeChatApiClient } from '@/types/api'

// VLayout's createLayout uses ResizeObserver which is not available in jsdom
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

function createMockApiClient(): NativeChatApiClient {
  return {
    createConversation: vi.fn(),
    getConversations: vi.fn(),
    getMessages: vi.fn(),
    sendMessage: vi.fn(),
  }
}

function mountChatPanel(options?: { isOpen?: boolean; welcomeMessage?: string }) {
  const config = {
    apiClient: createMockApiClient(),
    welcomeMessage: options?.welcomeMessage,
  }

  const isOpen = ref(options?.isOpen ?? false)
  const closeFn = vi.fn(() => {
    isOpen.value = false
  })
  const openFn = vi.fn(() => {
    isOpen.value = true
  })
  const toggleFn = vi.fn(() => {
    isOpen.value = !isOpen.value
  })

  const chatState = {
    isOpen: readonly(isOpen),
    open: openFn,
    close: closeFn,
    toggle: toggleFn,
  }

  // VNavigationDrawer requires a layout parent — wrap in VLayout
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

  return { wrapper, config, chatState, isOpen, closeFn, openFn }
}

describe('ChatPanel', () => {
  it('renders v-navigation-drawer with location="right"', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })
    const drawer = wrapper.findComponent({ name: 'VNavigationDrawer' })

    expect(drawer.exists()).toBe(true)
    expect(drawer.props('location')).toBe('right')
  })

  it('drawer is visible when isOpen is true', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })
    const drawer = wrapper.findComponent({ name: 'VNavigationDrawer' })

    expect(drawer.props('modelValue')).toBe(true)
  })

  it('drawer is hidden when isOpen is false', () => {
    const { wrapper } = mountChatPanel({ isOpen: false })
    const drawer = wrapper.findComponent({ name: 'VNavigationDrawer' })

    expect(drawer.props('modelValue')).toBe(false)
  })

  it('renders ChatHeader as child', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })

    expect(wrapper.findComponent(ChatHeader).exists()).toBe(true)
  })

  it('renders WelcomeState as child', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })

    expect(wrapper.findComponent(WelcomeState).exists()).toBe(true)
  })

  it('panel has role="complementary" and aria-label="Chat with AI Assistant"', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })
    const nav = wrapper.find('nav.nc-chat-panel')

    expect(nav.exists()).toBe(true)
    expect(nav.attributes('role')).toBe('complementary')
    expect(nav.attributes('aria-label')).toBe('Chat with AI Assistant')
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

  it('scrim is disabled (no click-outside-to-close)', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })
    const drawer = wrapper.findComponent({ name: 'VNavigationDrawer' })

    expect(drawer.props('scrim')).toBe(false)
  })

  it('computed setter ignores Vuetify close attempts (prevents click-outside)', () => {
    const { wrapper, closeFn } = mountChatPanel({ isOpen: true })
    const drawer = wrapper.findComponent({ name: 'VNavigationDrawer' })

    // Simulate Vuetify trying to close via update:modelValue (click-outside)
    drawer.vm.$emit('update:modelValue', false)

    // close() should NOT have been called — setter only forwards opens
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

  it('uses 400px width on desktop (default jsdom viewport)', () => {
    const { wrapper } = mountChatPanel({ isOpen: true })
    const drawer = wrapper.findComponent({ name: 'VNavigationDrawer' })

    // jsdom defaults to 1024px width — above 768px breakpoint
    expect(drawer.props('width')).toBe(400)
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
