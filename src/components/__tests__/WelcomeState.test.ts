import { mount } from '@vue/test-utils'
import WelcomeState from '@/components/WelcomeState.vue'

describe('WelcomeState', () => {
  it('renders default welcome message "Hello! How can I help you?"', () => {
    const wrapper = mount(WelcomeState)

    expect(wrapper.text()).toContain('Hello! How can I help you?')
  })

  it('renders custom welcome message when message prop is provided', () => {
    const wrapper = mount(WelcomeState, {
      props: {
        message: 'Welcome to our chat!',
      },
    })

    expect(wrapper.text()).toContain('Welcome to our chat!')
  })

  it('text is styled with large font size class', () => {
    const wrapper = mount(WelcomeState)
    const textEl = wrapper.find('.nc-welcome-state__text')

    expect(textEl.exists()).toBe(true)
  })
})
