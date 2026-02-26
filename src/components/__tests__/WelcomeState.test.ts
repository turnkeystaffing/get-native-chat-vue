import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import WelcomeState from '@/components/WelcomeState.vue'

function mountWelcomeState(props?: { message?: string }) {
  return mount(WelcomeState, { props })
}

describe('WelcomeState', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('renders default welcome message "What can I help you with today?"', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    const wrapper = mountWelcomeState()
    await nextTick()

    expect(wrapper.text()).toContain('What can I help you with today?')
  })

  it('renders custom welcome message when message prop is provided', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    const wrapper = mountWelcomeState({ message: 'Welcome to our chat!' })
    await nextTick()

    expect(wrapper.text()).toContain('Welcome to our chat!')
  })

  it('text element has the nc-welcome-state__text class', () => {
    const wrapper = mountWelcomeState()
    const textEl = wrapper.find('.nc-welcome-state__text')

    expect(textEl.exists()).toBe(true)
  })

  it('displays full message immediately when prefers-reduced-motion is reduce', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    const wrapper = mountWelcomeState()
    await nextTick()

    const textEl = wrapper.find('.nc-welcome-state__text')
    expect(textEl.text()).toBe('What can I help you with today?')

    // Cursor should not be visible
    expect(wrapper.find('.nc-welcome-state__cursor').exists()).toBe(false)
  })

  it('reveals text character by character with typewriter animation', async () => {
    vi.useFakeTimers()

    const defaultMessage = 'What can I help you with today?'
    const wrapper = mountWelcomeState()
    await vi.advanceTimersByTimeAsync(0)
    const textEl = wrapper.find('.nc-welcome-state__text')

    // Initially empty
    expect(textEl.text()).toBe('')

    // Cursor should be visible during typing
    expect(wrapper.find('.nc-welcome-state__cursor').exists()).toBe(true)

    // Advance a few characters — check partial progress
    await vi.advanceTimersByTimeAsync(70 * 6)
    expect(textEl.text()).toBe(defaultMessage.slice(0, 6))

    // Advance to completion
    await vi.advanceTimersByTimeAsync(70 * (defaultMessage.length - 6))
    expect(textEl.text()).toBe(defaultMessage)

    // Cursor should disappear after completion
    expect(wrapper.find('.nc-welcome-state__cursor').exists()).toBe(false)
  })

  it('typewriter works with custom message prop', async () => {
    vi.useFakeTimers()

    const wrapper = mountWelcomeState({ message: 'Hi!' })
    await vi.advanceTimersByTimeAsync(0)
    const textEl = wrapper.find('.nc-welcome-state__text')

    expect(textEl.text()).toBe('')

    await vi.advanceTimersByTimeAsync(70 * 3)
    expect(textEl.text()).toBe('Hi!')

    expect(wrapper.find('.nc-welcome-state__cursor').exists()).toBe(false)
  })

  it('cleans up interval on unmount', async () => {
    vi.useFakeTimers()

    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')

    const wrapper = mountWelcomeState()
    await vi.advanceTimersByTimeAsync(0)

    // Advance partially (not complete)
    await vi.advanceTimersByTimeAsync(70 * 3)

    wrapper.unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('provides full text to screen readers via sr-only element', () => {
    const wrapper = mountWelcomeState()
    const srOnly = wrapper.find('.nc-welcome-state__sr-only')

    expect(srOnly.exists()).toBe(true)
    expect(srOnly.text()).toBe('What can I help you with today?')
    expect(srOnly.attributes('role')).toBe('status')
    expect(srOnly.attributes('aria-live')).toBe('polite')
  })
})
