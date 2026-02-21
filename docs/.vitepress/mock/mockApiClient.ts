import type {
  NativeChatApiClient,
  ConversationResponse,
  ConversationListResponse,
  MessageHistoryResponse,
  MessageResponse,
  SendMessageResponse,
} from '@/types/api'

// ====== Error Simulation ======

export let simulateErrorCode: number | null = null

export function setSimulateError(code: number | null) {
  simulateErrorCode = code
}

function checkError() {
  if (simulateErrorCode) {
    const error = new Error('Simulated error')
    ;(error as Record<string, unknown>).statusCode = simulateErrorCode
    throw error
  }
}

// ====== Canned Data ======

const MOCK_CONVERSATION_ID = 'mock-conv-1'

const cannedMessages: MessageResponse[] = [
  {
    id: 'mock-msg-1',
    conversationId: MOCK_CONVERSATION_ID,
    role: 'user',
    content: 'What can you help me with?',
    createdAt: '2026-02-20T10:00:00.000Z',
  },
  {
    id: 'mock-msg-2',
    conversationId: MOCK_CONVERSATION_ID,
    role: 'assistant',
    content:
      "I can help you with a wide range of tasks! Here are some things I'm great at:\n\n" +
      '- **Answering questions** about various topics\n' +
      '- **Writing and editing** text, emails, and documents\n' +
      '- **Explaining concepts** in simple terms\n' +
      '- **Brainstorming ideas** for projects or creative work\n\n' +
      'Feel free to ask me anything!',
    createdAt: '2026-02-20T10:00:05.000Z',
  },
  {
    id: 'mock-msg-3',
    conversationId: MOCK_CONVERSATION_ID,
    role: 'user',
    content: 'Can you show me an example of a Vue component?',
    createdAt: '2026-02-20T10:01:00.000Z',
  },
  {
    id: 'mock-msg-4',
    conversationId: MOCK_CONVERSATION_ID,
    role: 'assistant',
    content:
      '## Vue 3 Component Example\n\n' +
      'Here is a simple counter component using the Composition API:\n\n' +
      '```vue\n' +
      '<script setup lang="ts">\n' +
      "import { ref } from 'vue'\n" +
      '\n' +
      'const count = ref(0)\n' +
      '</script>\n' +
      '\n' +
      '<template>\n' +
      '  <button @click="count++">Count: {{ count }}</button>\n' +
      '</template>\n' +
      '```\n\n' +
      '### Key Points\n\n' +
      '1. **`<script setup>`** is the recommended syntax for Vue 3 components\n' +
      '2. **`ref()`** creates a reactive reference that auto-unwraps in templates\n' +
      '3. The template uses **`@click`** shorthand for `v-on:click`\n\n' +
      'This pattern is the foundation for building more complex components with props, emits, and composables.',
    createdAt: '2026-02-20T10:01:10.000Z',
  },
  {
    id: 'mock-msg-5',
    conversationId: MOCK_CONVERSATION_ID,
    role: 'user',
    content: 'What about TypeScript support?',
    createdAt: '2026-02-20T10:02:00.000Z',
  },
  {
    id: 'mock-msg-6',
    conversationId: MOCK_CONVERSATION_ID,
    role: 'assistant',
    content:
      'Vue 3 has **excellent TypeScript support** built in. When you use `<script setup lang="ts">`, you get:\n\n' +
      '- Full type inference for props and emits\n' +
      '- Auto-completion in your IDE\n' +
      '- Compile-time type checking\n\n' +
      "It's one of the best TypeScript integrations among frontend frameworks.",
    createdAt: '2026-02-20T10:02:08.000Z',
  },
  {
    id: 'mock-msg-7',
    conversationId: MOCK_CONVERSATION_ID,
    role: 'user',
    content: 'How do I handle errors in async operations?',
    createdAt: '2026-02-20T10:03:00.000Z',
  },
  {
    id: 'mock-msg-8',
    conversationId: MOCK_CONVERSATION_ID,
    role: 'assistant',
    content:
      'Great question! There are several approaches to error handling in Vue:\n\n' +
      '- **try/catch** in `async` functions inside `<script setup>`\n' +
      '- **`.catch()`** chained on promises\n' +
      '- **`onErrorCaptured`** lifecycle hook for component-level error boundaries\n\n' +
      'For API calls, a common pattern is to centralize error handling in your composables and expose error state to components.',
    createdAt: '2026-02-20T10:03:12.000Z',
  },
  {
    id: 'mock-msg-9',
    conversationId: MOCK_CONVERSATION_ID,
    role: 'user',
    content: 'Thanks, that was very helpful!',
    createdAt: '2026-02-20T10:04:00.000Z',
  },
  {
    id: 'mock-msg-10',
    conversationId: MOCK_CONVERSATION_ID,
    role: 'assistant',
    content:
      "You're welcome! If you have more questions about Vue, TypeScript, or anything else, just ask. Happy coding!",
    createdAt: '2026-02-20T10:04:05.000Z',
  },
]

// Canned replies for sendMessage — cycled through
const cannedReplies = [
  "That's an interesting question! Let me think about it...\n\nBased on my understanding, the best approach would be to start with a clear plan and iterate from there.",
  'Here are a few suggestions:\n\n- **Option A**: A straightforward approach\n- **Option B**: More flexible but complex\n- **Option C**: Best for long-term scalability\n\nI recommend starting with Option A for simplicity.',
  'Great point! In my experience, this is a common challenge. The key is to **break the problem down** into smaller pieces and tackle them one at a time.\n\nWould you like me to elaborate on any specific part?',
]

let replyIndex = 0

// ====== Mock API Client ======

// Messages stored newest-first (matching real API contract)
const messagesNewestFirst = [...cannedMessages].reverse()

export const mockApiClient: NativeChatApiClient = {
  async createConversation(): Promise<ConversationResponse> {
    checkError()
    replyIndex = 0
    return {
      id: MOCK_CONVERSATION_ID,
      createdAt: '2026-02-20T10:00:00.000Z',
    }
  },

  async getConversations(offset: number, limit: number): Promise<ConversationListResponse> {
    checkError()
    const allConversations = [
      {
        id: MOCK_CONVERSATION_ID,
        createdAt: '2026-02-20T10:00:00.000Z',
      },
    ]
    return {
      conversations: allConversations.slice(offset, offset + limit),
      has_more: offset + limit < allConversations.length,
    }
  },

  async getMessages(
    _conversationId: string,
    offset: number,
    limit: number,
  ): Promise<MessageHistoryResponse> {
    checkError()
    const page = messagesNewestFirst.slice(offset, offset + limit)
    return {
      messages: page,
      has_more: offset + limit < messagesNewestFirst.length,
    }
  },

  async sendMessage(_conversationId: string, message: string): Promise<SendMessageResponse> {
    checkError()
    // Simulate realistic delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const now = new Date().toISOString()
    const reply = cannedReplies[replyIndex % cannedReplies.length]
    replyIndex++

    return {
      userMessage: {
        id: `mock-msg-user-${Date.now()}`,
        conversationId: MOCK_CONVERSATION_ID,
        role: 'user',
        content: message,
        createdAt: now,
      },
      assistantMessage: {
        id: `mock-msg-asst-${Date.now()}`,
        conversationId: MOCK_CONVERSATION_ID,
        role: 'assistant',
        content: reply,
        createdAt: new Date(Date.now() + 1000).toISOString(),
      },
    }
  },
}
