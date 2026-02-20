import { createApp } from 'vue'
import { mount } from '@vue/test-utils'
import { NativeChatPlugin } from '@/plugin'
import { CONFIG_KEY } from '@/keys'
import NativeChatWidget from '@/components/NativeChatWidget.vue'
import type { NativeChatApiClient } from '@/types/api'

function createMockApiClient(): NativeChatApiClient {
  return {
    createConversation: vi.fn(),
    getConversations: vi.fn(),
    getMessages: vi.fn(),
    sendMessage: vi.fn(),
  }
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
  it('renders placeholder content', () => {
    const wrapper = mount(NativeChatWidget)

    expect(wrapper.find('.nc-widget').exists()).toBe(true)
    expect(wrapper.text()).toContain('NativeChatWidget placeholder')
  })
})
