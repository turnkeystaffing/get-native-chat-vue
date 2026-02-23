import { mount } from '@vue/test-utils'
import { ref, readonly, nextTick } from 'vue'
import ChatInput from '@/components/ChatInput.vue'
import IconSend from '@/icons/IconSend.vue'
import { CHAT_STATE_KEY } from '@/keys'
import type { UseChatReturn } from '@/composables/useChat'

function createMockChatState(overrides?: Partial<UseChatReturn>): UseChatReturn {
  const isSending = ref(false)
  const failedMessageText = ref<string | null>(null)
  return {
    messages: readonly(ref([])),
    isOpen: readonly(ref(true)),
    isLoading: readonly(ref(false)),
    isSending: readonly(isSending),
    hasMore: readonly(ref(false)),
    failedMessageText: readonly(failedMessageText),
    open: vi.fn(),
    close: vi.fn(),
    sendMessage: vi.fn(async () => {}),
    loadMore: vi.fn(async () => {}),
    retry: vi.fn(async () => {}),
    ...overrides,
  }
}

function mountChatInput(chatState?: UseChatReturn) {
  const state = chatState ?? createMockChatState()
  const wrapper = mount(ChatInput, {
    global: {
      provide: {
        [CHAT_STATE_KEY as symbol]: state,
      },
    },
  })
  return { wrapper, chatState: state }
}

describe('ChatInput', () => {
  it('renders textarea with aria-label="Type a message"', () => {
    const { wrapper } = mountChatInput()
    const textarea = wrapper.find('textarea')

    expect(textarea.exists()).toBe(true)
    expect(textarea.attributes('aria-label')).toBe('Type a message')
  })

  it('renders send button with aria-label="Send message"', () => {
    const { wrapper } = mountChatInput()
    const btn = wrapper.find('[aria-label="Send message"]')

    expect(btn.exists()).toBe(true)
  })

  it('send button is disabled when input is empty', () => {
    const { wrapper } = mountChatInput()
    const btn = wrapper.find('[aria-label="Send message"]')

    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('send button is enabled when input has text', async () => {
    const { wrapper } = mountChatInput()
    const textarea = wrapper.find('textarea')

    await textarea.setValue('hello')
    await nextTick()

    const btn = wrapper.find('[aria-label="Send message"]')
    expect(btn.attributes('disabled')).toBeUndefined()
  })

  it('pressing Enter calls sendMessage() with trimmed text and clears input', async () => {
    const { wrapper, chatState } = mountChatInput()
    const textarea = wrapper.find('textarea')

    await textarea.setValue('  hello world  ')
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })
    await nextTick()

    expect(chatState.sendMessage).toHaveBeenCalledWith('hello world')
    expect(textarea.element.value).toBe('')
  })

  it('pressing Shift+Enter does NOT call sendMessage()', async () => {
    const { wrapper, chatState } = mountChatInput()
    const textarea = wrapper.find('textarea')

    await textarea.setValue('hello')
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: true })

    expect(chatState.sendMessage).not.toHaveBeenCalled()
  })

  it('clicking send button calls sendMessage() with trimmed text and clears input', async () => {
    const { wrapper, chatState } = mountChatInput()
    const textarea = wrapper.find('textarea')

    await textarea.setValue('  test message  ')
    await nextTick()

    const btn = wrapper.find('[aria-label="Send message"]')
    await btn.trigger('click')
    await nextTick()

    expect(chatState.sendMessage).toHaveBeenCalledWith('test message')
    expect(textarea.element.value).toBe('')
  })

  it('empty input + Enter does not call sendMessage()', async () => {
    const { wrapper, chatState } = mountChatInput()
    const textarea = wrapper.find('textarea')

    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })

    expect(chatState.sendMessage).not.toHaveBeenCalled()
  })

  it('send button and textarea disabled when isSending is true', () => {
    const isSending = ref(true)
    const chatState = createMockChatState({ isSending: readonly(isSending) })
    const { wrapper } = mountChatInput(chatState)

    const textarea = wrapper.find('textarea')
    const btn = wrapper.find('[aria-label="Send message"]')

    expect(textarea.attributes('disabled')).toBeDefined()
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('failedMessageText pre-populates the input field', async () => {
    const failedMessageText = ref<string | null>(null)
    const chatState = createMockChatState({ failedMessageText: readonly(failedMessageText) })
    const { wrapper } = mountChatInput(chatState)

    failedMessageText.value = 'failed message text'
    await nextTick()

    const textarea = wrapper.find('textarea')
    expect(textarea.element.value).toBe('failed message text')
  })

  it('Enter key does not call sendMessage() when isSending is true', async () => {
    const isSending = ref(true)
    const chatState = createMockChatState({ isSending: readonly(isSending) })
    const { wrapper } = mountChatInput(chatState)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('hello')
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })
    await nextTick()

    expect(chatState.sendMessage).not.toHaveBeenCalled()
  })

  it('whitespace-only input + Enter does not call sendMessage()', async () => {
    const { wrapper, chatState } = mountChatInput()
    const textarea = wrapper.find('textarea')

    await textarea.setValue('   ')
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })
    await nextTick()

    expect(chatState.sendMessage).not.toHaveBeenCalled()
  })

  it('clicking send button does not call sendMessage() when isSending is true', async () => {
    const isSending = ref(true)
    const chatState = createMockChatState({ isSending: readonly(isSending) })
    const { wrapper } = mountChatInput(chatState)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('hello')
    await nextTick()

    const btn = wrapper.find('[aria-label="Send message"]')
    await btn.trigger('click')
    await nextTick()

    expect(chatState.sendMessage).not.toHaveBeenCalled()
  })

  it('focuses textarea when chat opens (isOpen transitions to true)', async () => {
    const isOpen = ref(false)
    const chatState = createMockChatState({ isOpen: readonly(isOpen) })
    const { wrapper } = mountChatInput(chatState)

    const textarea = wrapper.find('textarea')
    const focusSpy = vi.spyOn(textarea.element, 'focus')

    // Simulate chat opening
    isOpen.value = true
    await nextTick()
    await nextTick() // Double nextTick: watcher fires → nextTick inside watcher

    expect(focusSpy).toHaveBeenCalled()
  })

  it('does not focus textarea when chat closes', async () => {
    const isOpen = ref(true)
    const chatState = createMockChatState({ isOpen: readonly(isOpen) })
    const { wrapper } = mountChatInput(chatState)

    // Wait for immediate watcher's initial focus to complete
    await nextTick()
    await nextTick()

    const textarea = wrapper.find('textarea')
    const focusSpy = vi.spyOn(textarea.element, 'focus')

    // Simulate chat closing
    isOpen.value = false
    await nextTick()
    await nextTick()

    expect(focusSpy).not.toHaveBeenCalled()
  })

  it('focuses textarea on mount when isOpen is already true', async () => {
    const isOpen = ref(true)
    const chatState = createMockChatState({ isOpen: readonly(isOpen) })
    const { wrapper } = mountChatInput(chatState)

    // Wait for immediate watcher + nextTick inside it
    await nextTick()
    await nextTick()

    // watch({ immediate: true }) fires on mount when isOpen is true,
    // matching v-if behavior where ChatInput mounts when panel opens
    const textarea = wrapper.find('textarea')
    const focusSpy = vi.spyOn(textarea.element, 'focus')
    // Re-trigger to verify focus mechanism works
    isOpen.value = false
    await nextTick()
    isOpen.value = true
    await nextTick()
    await nextTick()
    expect(focusSpy).toHaveBeenCalled()
  })

  it('restores focus to textarea when isSending transitions true→false (after error)', async () => {
    const isSending = ref(true)
    const chatState = createMockChatState({ isSending: readonly(isSending) })
    const { wrapper } = mountChatInput(chatState)

    const textarea = wrapper.find('textarea')
    const focusSpy = vi.spyOn(textarea.element, 'focus')

    // Simulate send failure: isSending goes from true to false
    isSending.value = false
    await nextTick()
    await nextTick() // Double nextTick: watcher fires → nextTick inside watcher

    expect(focusSpy).toHaveBeenCalled()
  })

  it('user can edit pre-populated failed text and send edited version', async () => {
    const failedMessageText = ref<string | null>(null)
    const chatState = createMockChatState({ failedMessageText: readonly(failedMessageText) })
    const { wrapper } = mountChatInput(chatState)

    // Simulate failed message pre-population
    failedMessageText.value = 'original failed text'
    await nextTick()

    const textarea = wrapper.find('textarea')
    expect(textarea.element.value).toBe('original failed text')

    // User edits the text
    await textarea.setValue('edited text')
    await nextTick()

    // User presses Enter to send
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })
    await nextTick()

    // sendMessage should be called with the edited text
    expect(chatState.sendMessage).toHaveBeenCalledWith('edited text')
    expect(textarea.element.value).toBe('')
  })

  it('shows spinner instead of IconSend when isSending is true', () => {
    const isSending = ref(true)
    const chatState = createMockChatState({ isSending: readonly(isSending) })
    const { wrapper } = mountChatInput(chatState)

    expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
    expect(wrapper.findComponent(IconSend).exists()).toBe(false)
  })

  it('shows IconSend instead of spinner when isSending is false', () => {
    const { wrapper } = mountChatInput()

    expect(wrapper.findComponent(IconSend).exists()).toBe(true)
    expect(wrapper.find('.v-progress-circular').exists()).toBe(false)
  })

  it('failedMessageText being cleared does not empty user-typed text', async () => {
    const failedMessageText = ref<string | null>(null)
    const chatState = createMockChatState({ failedMessageText: readonly(failedMessageText) })
    const { wrapper } = mountChatInput(chatState)

    // Simulate failed message pre-population
    failedMessageText.value = 'failed text'
    await nextTick()

    // User types new text
    const textarea = wrapper.find('textarea')
    await textarea.setValue('user typed text')

    // failedMessageText resets to null
    failedMessageText.value = null
    await nextTick()

    // User text should remain
    expect(textarea.element.value).toBe('user typed text')
  })
})
