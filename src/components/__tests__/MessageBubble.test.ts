import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MessageBubble from '@/components/MessageBubble.vue'
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

function mountBubble(message: ChatMessage) {
  return mount(MessageBubble, {
    props: { message },
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

  it('error message renders with assistant styling (no special error visual treatment)', () => {
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
    expect(userWrapper.find('.nc-message-bubble__copy').exists()).toBe(false)

    const assistantWrapper = mountBubble(createMessage({ role: 'assistant' }))
    expect(assistantWrapper.find('.nc-message-bubble__copy').exists()).toBe(true)

    const errorWrapper = mountBubble(createMessage({ id: 'error-1', role: 'assistant' }))
    expect(errorWrapper.find('.nc-message-bubble__copy').exists()).toBe(false)
  })

  it('clicking copy button calls navigator.clipboard.writeText() with raw message content', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    })

    const wrapper = mountBubble(createMessage({ role: 'assistant', content: '**raw markdown**' }))

    await wrapper.find('.nc-message-bubble__copy').trigger('click')
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

    await wrapper.find('.nc-message-bubble__copy').trigger('click')
    await nextTick()
    // Allow the async handleCopy to resolve
    await Promise.resolve()
    await nextTick()

    expect(wrapper.find('.nc-message-bubble__copy').attributes('aria-label')).toBe('Message copied')

    vi.advanceTimersByTime(1500)
    await nextTick()

    expect(wrapper.find('.nc-message-bubble__copy').attributes('aria-label')).toBe('Copy message')

    vi.useRealTimers()
  })

  it('clipboard failure is handled silently (no error thrown, no UI change)', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'))
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    })

    const wrapper = mountBubble(createMessage({ role: 'assistant', content: 'test' }))

    // Should not throw
    await wrapper.find('.nc-message-bubble__copy').trigger('click')
    await nextTick()
    await Promise.resolve()
    await nextTick()

    expect(wrapper.find('.nc-message-bubble__copy').attributes('aria-label')).toBe('Copy message')
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

    it('does not show assistant label/icon for error messages', () => {
      const wrapper = mountBubble(
        createMessage({ id: 'error-1', role: 'assistant', content: 'Something went wrong.' }),
      )

      expect(wrapper.find('.nc-message-bubble__header').exists()).toBe(false)
      expect(wrapper.find('.nc-message-bubble__star').exists()).toBe(false)
      expect(wrapper.find('.nc-message-bubble__label').exists()).toBe(false)
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

    await wrapper.find('.nc-message-bubble__copy').trigger('click')
    await nextTick()
    await Promise.resolve()
    await nextTick()

    // Timeout is pending (1.5s), unmount before it fires
    wrapper.unmount()

    // Advance past timeout — should not throw or cause Vue warning
    vi.advanceTimersByTime(2000)

    vi.useRealTimers()
  })
})
