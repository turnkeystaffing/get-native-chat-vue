import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MessageBubble from '@/components/MessageBubble.vue'
import { CONFIG_KEY } from '@/keys'
import type { NativeChatPluginOptions } from '@/types/config'
import type { NativeChatApiClient } from '@/types/api'
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

function createMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: 'msg-1',
    conversationId: 'conv-1',
    role: 'user',
    content: 'Hello world',
    createdAt: '2026-02-20T00:00:00Z',
    ...overrides,
  }
}

function createMockApiClient(): NativeChatApiClient {
  return {
    createConversation: vi.fn(),
    getConversations: vi.fn(),
    getMessages: vi.fn(),
    sendMessage: vi.fn(),
  }
}

function mountBubble(message: ChatMessage, animate = false) {
  return mount(MessageBubble, {
    props: { message, animate },
  })
}

function mountBubbleWithConfig(
  message: ChatMessage,
  configOverrides: Partial<NativeChatPluginOptions> = {},
) {
  const config: NativeChatPluginOptions = {
    apiClient: createMockApiClient(),
    ...configOverrides,
  }
  return mount(MessageBubble, {
    props: { message },
    global: {
      provide: {
        [CONFIG_KEY as symbol]: config,
      },
    },
  })
}

describe('MessageBubble', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders user message with right-alignment class and plain text content', () => {
    const wrapper = mountBubble(createMessage({ role: 'user', content: 'Hi there' }))

    expect(wrapper.classes()).toContain('nc-message-bubble--user')
    expect(wrapper.find('.nc-message-bubble__content').text()).toBe('Hi there')
  })

  it('renders assistant message with left-alignment class', () => {
    const wrapper = mountBubble(createMessage({ role: 'assistant', content: 'Hello' }))

    expect(wrapper.classes()).toContain('nc-message-bubble--assistant')
  })

  it('assistant message shows star icon and "AI Assistant" label in header', () => {
    const wrapper = mountBubble(createMessage({ role: 'assistant', content: 'Hello' }))

    expect(wrapper.find('.nc-message-bubble__header').exists()).toBe(true)
    expect(wrapper.find('.v-avatar').exists()).toBe(true)
    expect(wrapper.find('.nc-message-bubble__label').text()).toBe('AI Assistant')
    expect(wrapper.find('.nc-message-bubble__warning-icon').exists()).toBe(false)
  })

  it('assistant message content is rendered through marked + DOMPurify', async () => {
    const { marked } = await import('marked')
    const DOMPurify = (await import('dompurify')).default

    const mockParse = vi.mocked(marked.parse)
    mockParse.mockReturnValue('<p><strong>bold</strong></p>')
    const mockSanitize = vi.mocked(DOMPurify.sanitize)
    mockSanitize.mockReturnValue('<p><strong>bold</strong></p>')

    const wrapper = mountBubble(createMessage({ role: 'assistant', content: '**bold**' }))

    expect(mockParse).toHaveBeenCalledWith('**bold**')
    expect(mockSanitize).toHaveBeenCalledWith('<p><strong>bold</strong></p>')
    expect(wrapper.find('.nc-message-bubble__content').html()).toContain('<strong>bold</strong>')
  })

  it('user message content is rendered as plain text (no markdown parsing)', async () => {
    const { marked } = await import('marked')
    const mockParse = vi.mocked(marked.parse)
    mockParse.mockClear()

    const wrapper = mountBubble(createMessage({ role: 'user', content: '**text**' }))

    expect(wrapper.find('.nc-message-bubble__content').text()).toBe('**text**')
    expect(mockParse).not.toHaveBeenCalled()
  })

  it('error message renders with error class (not assistant class)', () => {
    const wrapper = mountBubble(
      createMessage({
        id: 'error-123',
        role: 'assistant',
        content: 'Something went wrong.',
      }),
    )

    expect(wrapper.classes()).toContain('nc-message-bubble--error')
    expect(wrapper.classes()).not.toContain('nc-message-bubble--assistant')
  })

  it('copy button appears only on assistant messages (not on user or error messages)', () => {
    const userWrapper = mountBubble(createMessage({ role: 'user' }))
    expect(userWrapper.find('[aria-label="Copy message"]').exists()).toBe(false)

    const assistantWrapper = mountBubble(createMessage({ role: 'assistant' }))
    expect(assistantWrapper.find('[aria-label="Copy message"]').exists()).toBe(true)

    const errorWrapper = mountBubble(createMessage({ id: 'error-1', role: 'assistant' }))
    expect(errorWrapper.find('[aria-label="Copy message"]').exists()).toBe(false)
  })

  it('clicking copy button calls navigator.clipboard.writeText() with raw message content', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    })

    const wrapper = mountBubble(createMessage({ role: 'assistant', content: '**raw markdown**' }))

    await wrapper.find('[aria-label="Copy message"]').trigger('click')
    await nextTick()

    expect(writeTextMock).toHaveBeenCalledWith('**raw markdown**')
  })

  it('copy button icon changes to checkmark after successful copy, reverts after 1.5s', async () => {
    vi.useFakeTimers()
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    })

    const wrapper = mountBubble(createMessage({ role: 'assistant', content: 'test' }))

    await wrapper.find('[aria-label="Copy message"]').trigger('click')
    await nextTick()
    // Allow the async handleCopy to resolve
    await Promise.resolve()
    await nextTick()

    expect(wrapper.find('[aria-label="Message copied"]').exists()).toBe(true)

    vi.advanceTimersByTime(1500)
    await nextTick()

    expect(wrapper.find('[aria-label="Copy message"]').exists()).toBe(true)

    vi.useRealTimers()
  })

  it('clipboard failure is handled silently (no error thrown, no UI change)', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'))
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    })

    const wrapper = mountBubble(createMessage({ role: 'assistant', content: 'test' }))

    // Should not throw
    await wrapper.find('[aria-label="Copy message"]').trigger('click')
    await nextTick()
    await Promise.resolve()
    await nextTick()

    expect(wrapper.find('[aria-label="Copy message"]').exists()).toBe(true)
  })

  it('role="listitem" present on root element', () => {
    const wrapper = mountBubble(createMessage())

    expect(wrapper.attributes('role')).toBe('listitem')
  })

  it('aria-label reflects sender role for user message', () => {
    const wrapper = mountBubble(createMessage({ role: 'user' }))

    expect(wrapper.attributes('aria-label')).toBe('Message from you')
  })

  it('aria-label reflects sender role for assistant message', () => {
    const wrapper = mountBubble(createMessage({ role: 'assistant' }))

    expect(wrapper.attributes('aria-label')).toBe('Message from AI Assistant')
  })

  it('sending status shows visual indicator', () => {
    const wrapper = mountBubble(createMessage({ role: 'user', status: 'sending' }))

    expect(wrapper.classes()).toContain('nc-message-bubble--sending')
  })

  it('aria-label reflects sender role for error message', () => {
    const wrapper = mountBubble(createMessage({ id: 'error-1', role: 'assistant' }))

    expect(wrapper.attributes('aria-label')).toBe('Error message')
  })

  it('error message renders as plain text (no markdown parsing)', async () => {
    const { marked } = await import('marked')
    const mockParse = vi.mocked(marked.parse)
    mockParse.mockClear()

    const wrapper = mountBubble(
      createMessage({ id: 'error-1', role: 'assistant', content: '**error text**' }),
    )

    expect(wrapper.find('.nc-message-bubble__content').text()).toBe('**error text**')
    expect(mockParse).not.toHaveBeenCalled()
  })

  describe('error variant', () => {
    it('renders error message left-aligned like assistant messages', () => {
      const wrapper = mountBubble(
        createMessage({ id: 'error-1', role: 'assistant', content: 'Something went wrong.' }),
      )

      expect(wrapper.classes()).toContain('nc-message-bubble--error')
      expect(wrapper.classes()).not.toContain('nc-message-bubble--user')
    })

    it('applies nc-message-bubble--error class for error by id prefix', () => {
      const wrapper = mountBubble(
        createMessage({ id: 'error-123', role: 'assistant', content: 'Error text' }),
      )

      expect(wrapper.classes()).toContain('nc-message-bubble--error')
    })

    it('applies nc-message-bubble--error class for error by status failed', () => {
      const wrapper = mountBubble(
        createMessage({ id: 'msg-1', role: 'assistant', content: 'Error text', status: 'failed' }),
      )

      expect(wrapper.classes()).toContain('nc-message-bubble--error')
    })

    it('shows error header via status failed path (not just error- id prefix)', () => {
      const wrapper = mountBubble(
        createMessage({ id: 'msg-99', role: 'assistant', content: 'Failed', status: 'failed' }),
      )

      expect(wrapper.find('.nc-message-bubble__header').exists()).toBe(true)
      expect(wrapper.find('.nc-message-bubble__warning-icon').exists()).toBe(true)
      expect(wrapper.find('.nc-message-bubble__label').text()).toBe('Error')
      expect(wrapper.find('.v-avatar').exists()).toBe(false)
    })

    it('shows error header with warning icon and "Error" label (not assistant header)', () => {
      const wrapper = mountBubble(
        createMessage({ id: 'error-1', role: 'assistant', content: 'Something went wrong.' }),
      )

      expect(wrapper.find('.nc-message-bubble__header').exists()).toBe(true)
      expect(wrapper.find('.nc-message-bubble__warning-icon').exists()).toBe(true)
      expect(wrapper.find('.nc-message-bubble__label').text()).toBe('Error')
      expect(wrapper.find('.v-avatar').exists()).toBe(false)
    })

    it('renders as li with role="listitem"', () => {
      const wrapper = mountBubble(
        createMessage({ id: 'error-1', role: 'assistant', content: 'Error occurred' }),
      )

      expect(wrapper.element.tagName).toBe('LI')
      expect(wrapper.attributes('role')).toBe('listitem')
    })
  })

  it('clears copyTimeout on unmount to prevent memory leak', async () => {
    vi.useFakeTimers()
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    })

    const wrapper = mountBubble(createMessage({ role: 'assistant', content: 'test' }))

    await wrapper.find('[aria-label="Copy message"]').trigger('click')
    await nextTick()
    await Promise.resolve()
    await nextTick()

    // Timeout is pending (1.5s), unmount before it fires
    wrapper.unmount()

    // Advance past timeout — should not throw or cause Vue warning
    vi.advanceTimersByTime(2000)

    vi.useRealTimers()
  })

  describe('entrance animation', () => {
    it('does not have animate-in class when animate prop is false (default)', () => {
      const wrapper = mountBubble(createMessage({ role: 'user' }))

      expect(wrapper.classes()).not.toContain('nc-message-bubble--animate-in')
    })

    it('has animate-in class when animate prop is true', () => {
      const wrapper = mountBubble(createMessage({ role: 'user' }), true)

      expect(wrapper.classes()).toContain('nc-message-bubble--animate-in')
    })

    it('animate-in class works with assistant messages', () => {
      const wrapper = mountBubble(createMessage({ role: 'assistant' }), true)

      expect(wrapper.classes()).toContain('nc-message-bubble--animate-in')
      expect(wrapper.classes()).toContain('nc-message-bubble--assistant')
    })
  })

  describe('showBubbleHeaders config', () => {
    it('header is rendered by default when no config is provided', () => {
      const wrapper = mountBubble(createMessage({ role: 'assistant' }))

      expect(wrapper.find('.nc-message-bubble__header').exists()).toBe(true)
    })

    it('header is hidden when showBubbleHeaders is false', () => {
      const wrapper = mountBubbleWithConfig(createMessage({ role: 'assistant' }), {
        showBubbleHeaders: false,
      })

      expect(wrapper.find('.nc-message-bubble__header').exists()).toBe(false)
      expect(wrapper.find('.nc-message-bubble__content').exists()).toBe(true)
    })

    it('header is visible when showBubbleHeaders is true', () => {
      const wrapper = mountBubbleWithConfig(createMessage({ role: 'assistant' }), {
        showBubbleHeaders: true,
      })

      expect(wrapper.find('.nc-message-bubble__header').exists()).toBe(true)
    })

    it('header is hidden for user messages when showBubbleHeaders is false', () => {
      const wrapper = mountBubbleWithConfig(createMessage({ role: 'user', content: 'Hi' }), {
        showBubbleHeaders: false,
      })

      expect(wrapper.find('.nc-message-bubble__header').exists()).toBe(false)
      expect(wrapper.find('.nc-message-bubble__content').text()).toBe('Hi')
    })
  })

  describe('assistantBubbleFullWidth config', () => {
    it('does not apply --flat class by default (no config)', () => {
      const wrapper = mountBubble(createMessage({ role: 'assistant', content: 'Hello' }))

      expect(wrapper.classes()).not.toContain('nc-message-bubble--flat')
    })

    it('does not apply --flat class when assistantBubbleFullWidth is false', () => {
      const wrapper = mountBubbleWithConfig(createMessage({ role: 'assistant', content: 'Hello' }), {
        assistantBubbleFullWidth: false,
      })

      expect(wrapper.classes()).not.toContain('nc-message-bubble--flat')
    })

    it('applies --flat class to assistant message when assistantBubbleFullWidth is true', () => {
      const wrapper = mountBubbleWithConfig(createMessage({ role: 'assistant', content: 'Hello' }), {
        assistantBubbleFullWidth: true,
      })

      expect(wrapper.classes()).toContain('nc-message-bubble--flat')
    })

    it('does not apply --flat class to user message when assistantBubbleFullWidth is true', () => {
      const wrapper = mountBubbleWithConfig(createMessage({ role: 'user', content: 'Hi' }), {
        assistantBubbleFullWidth: true,
      })

      expect(wrapper.classes()).not.toContain('nc-message-bubble--flat')
    })

    it('does not apply --flat class to error message when assistantBubbleFullWidth is true', () => {
      const wrapper = mountBubbleWithConfig(
        createMessage({ id: 'error-1', role: 'assistant', content: 'Error' }),
        { assistantBubbleFullWidth: true },
      )

      expect(wrapper.classes()).not.toContain('nc-message-bubble--flat')
    })

    it('copy button is still present when assistantBubbleFullWidth is true', () => {
      const wrapper = mountBubbleWithConfig(createMessage({ role: 'assistant', content: 'Hello' }), {
        assistantBubbleFullWidth: true,
      })

      expect(wrapper.find('[aria-label="Copy message"]').exists()).toBe(true)
    })
  })
})
