import type {
  NativeChatApiClient,
  ConversationResponse,
  ConversationListResponse,
  MessageResponse,
  MessageHistoryResponse,
  SendMessageResponse,
  ChatMessage,
  MessageStatus,
  ChatError,
  NativeChatPluginOptions,
} from '@/types'

describe('Type definitions compile-time checks', () => {
  it('NativeChatApiClient has required method signatures', () => {
    const client: NativeChatApiClient = {
      createConversation: () => Promise.resolve({ id: '1', createdAt: '' }),
      getConversations: () => Promise.resolve({ conversations: [], has_more: false }),
      getMessages: () => Promise.resolve({ messages: [], has_more: false }),
      sendMessage: () =>
        Promise.resolve({
          userMessage: { id: '1', conversationId: '1', role: 'user', content: '', createdAt: '' },
          assistantMessage: {
            id: '2',
            conversationId: '1',
            role: 'assistant',
            content: '',
            createdAt: '',
          },
        }),
    }
    expect(client).toBeTruthy()
  })

  it('ConversationResponse shape is correct', () => {
    const conv: ConversationResponse = { id: '1', createdAt: '2026-01-01' }
    expect(conv.id).toBe('1')
  })

  it('ConversationListResponse shape is correct', () => {
    const list: ConversationListResponse = { conversations: [], has_more: false }
    expect(list.has_more).toBe(false)
  })

  it('MessageResponse shape is correct', () => {
    const msg: MessageResponse = {
      id: '1',
      conversationId: 'c1',
      role: 'user',
      content: 'hello',
      createdAt: '',
    }
    expect(msg.role).toBe('user')
  })

  it('MessageHistoryResponse shape is correct', () => {
    const history: MessageHistoryResponse = { messages: [], has_more: true }
    expect(history.has_more).toBe(true)
  })

  it('SendMessageResponse shape is correct', () => {
    const resp: SendMessageResponse = {
      userMessage: { id: '1', conversationId: 'c1', role: 'user', content: '', createdAt: '' },
      assistantMessage: {
        id: '2',
        conversationId: 'c1',
        role: 'assistant',
        content: '',
        createdAt: '',
      },
    }
    expect(resp.userMessage.role).toBe('user')
    expect(resp.assistantMessage.role).toBe('assistant')
  })

  it('ChatMessage supports optional status field', () => {
    const msg: ChatMessage = {
      id: '1',
      conversationId: 'c1',
      role: 'user',
      content: 'test',
      createdAt: '',
    }
    expect(msg.status).toBeUndefined()

    const msgWithStatus: ChatMessage = { ...msg, status: 'sending' }
    expect(msgWithStatus.status).toBe('sending')
  })

  it('MessageStatus allows only valid values', () => {
    const statuses: MessageStatus[] = ['sending', 'sent', 'failed']
    expect(statuses).toHaveLength(3)
  })

  it('ChatError has required and optional fields', () => {
    const minimal: ChatError = { message: 'error' }
    expect(minimal.statusCode).toBeUndefined()

    const full: ChatError = { message: 'error', statusCode: 500, originalError: new Error() }
    expect(full.statusCode).toBe(500)
  })

  it('NativeChatPluginOptions requires apiClient', () => {
    const opts: NativeChatPluginOptions = {
      apiClient: {
        createConversation: () => Promise.resolve({ id: '', createdAt: '' }),
        getConversations: () => Promise.resolve({ conversations: [], has_more: false }),
        getMessages: () => Promise.resolve({ messages: [], has_more: false }),
        sendMessage: () =>
          Promise.resolve({
            userMessage: { id: '', conversationId: '', role: 'user', content: '', createdAt: '' },
            assistantMessage: {
              id: '',
              conversationId: '',
              role: 'assistant',
              content: '',
              createdAt: '',
            },
          }),
      },
    }
    expect(opts.position).toBeUndefined()
    expect(opts.welcomeMessage).toBeUndefined()
    expect(opts.batchSize).toBeUndefined()
  })
})
