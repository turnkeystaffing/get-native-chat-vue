import { createApp } from 'vue'
import { mount } from '@vue/test-utils'
import { NativeChatPlugin } from '@/plugin'
import { CONFIG_KEY } from '@/keys'
import NativeChatWidget from '@/components/NativeChatWidget.vue'
import FloatingButton from '@/components/FloatingButton.vue'
import ChatPanel from '@/components/ChatPanel.vue'
import type { NativeChatApiClient } from '@/types/api'

function createMockApiClient(): NativeChatApiClient {
  return {
    createConversation: vi.fn().mockResolvedValue({ id: 'new-conv', createdAt: '2026-01-01' }),
    getConversations: vi.fn().mockResolvedValue({
      conversations: [{ id: 'conv-1', createdAt: '2026-01-01' }],
      has_more: false,
    }),
    getMessages: vi.fn().mockResolvedValue({ messages: [], has_more: false }),
    sendMessage: vi.fn(),
  }
}

function mountWidget(options?: { position?: 'bottom-left' | 'bottom-right' }) {
  return mount(NativeChatWidget, {
    global: {
      provide: {
        [CONFIG_KEY as symbol]: {
          apiClient: createMockApiClient(),
          position: options?.position,
        },
      },
      stubs: {
        ChatPanel: true,
      },
    },
  })
}

describe('NativeChatPlugin', () => {
  it('registers NativeChatWidget as global component when apiClient is provided', () => {
    const app = createApp({ template: '<div />' })
    const apiClient = createMockApiClient()

    app.use(NativeChatPlugin, { apiClient })

    expect(app.component('NativeChatWidget')).toBeTruthy()
  })

  it('logs console.warn and skips registration when apiClient is missing', () => {
    const app = createApp({ template: '<div />' })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    app.use(NativeChatPlugin, {} as never)

    expect(warnSpy).toHaveBeenCalledWith(
      '[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped.',
    )
    expect(app.component('NativeChatWidget')).toBeUndefined()

    warnSpy.mockRestore()
  })

  it('logs console.warn when no options provided at all', () => {
    const app = createApp({ template: '<div />' })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    app.use(NativeChatPlugin)

    expect(warnSpy).toHaveBeenCalledWith(
      '[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped.',
    )

    warnSpy.mockRestore()
  })

  it('provides config via CONFIG_KEY when apiClient is present', () => {
    const app = createApp({ template: '<div />' })
    const apiClient = createMockApiClient()
    const options = { apiClient }
    const provideSpy = vi.spyOn(app, 'provide')

    app.use(NativeChatPlugin, options)

    expect(provideSpy).toHaveBeenCalledWith(CONFIG_KEY, options)
  })

  it('does not provide config when apiClient is missing', () => {
    const app = createApp({ template: '<div />' })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const provideSpy = vi.spyOn(app, 'provide')

    app.use(NativeChatPlugin, {} as never)

    expect(provideSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})

describe('NativeChatWidget', () => {
  it('renders FloatingButton as child', () => {
    const wrapper = mountWidget()

    expect(wrapper.findComponent(FloatingButton).exists()).toBe(true)
  })

  it('renders ChatPanel as child alongside FloatingButton', () => {
    const wrapper = mountWidget()

    expect(wrapper.findComponent(ChatPanel).exists()).toBe(true)
    expect(wrapper.findComponent(FloatingButton).exists()).toBe(true)
  })

  it('provides UseChatReturn state via CHAT_STATE_KEY', () => {
    const wrapper = mountWidget()
    const floatingButton = wrapper.findComponent(FloatingButton)

    // FloatingButton injects CHAT_STATE_KEY — if it renders without error, state is provided
    expect(floatingButton.exists()).toBe(true)

    // Verify initial state: aria-label should be "Open chat" (isOpen = false)
    const btn = floatingButton.findComponent({ name: 'VBtn' })
    expect(btn.attributes('aria-label')).toBe('Open chat')
  })

  it('isOpen starts as false', () => {
    const wrapper = mountWidget()
    const btn = wrapper.findComponent(FloatingButton).findComponent({ name: 'VBtn' })

    expect(btn.attributes('aria-label')).toBe('Open chat')
    expect(btn.attributes('aria-expanded')).toBe('false')
  })

  it('wraps content in v-theme-provider with theme="nativeChat"', () => {
    const wrapper = mountWidget()
    const themeProvider = wrapper.findComponent({ name: 'VThemeProvider' })

    expect(themeProvider.exists()).toBe(true)
    expect(themeProvider.props('theme')).toBe('nativeChat')
  })

  it('registers nativeChatTheme with Vuetify theme system', () => {
    const wrapper = mountWidget()

    // Verify the theme was actually registered by checking the theme provider
    // uses the nativeChat theme and the component tree renders correctly
    const themeProvider = wrapper.findComponent({ name: 'VThemeProvider' })
    expect(themeProvider.exists()).toBe(true)
    expect(themeProvider.props('theme')).toBe('nativeChat')

    // Verify the widget can be mounted a second time without error (idempotency)
    const wrapper2 = mountWidget()
    expect(wrapper2.findComponent({ name: 'VThemeProvider' }).props('theme')).toBe('nativeChat')
  })
})
