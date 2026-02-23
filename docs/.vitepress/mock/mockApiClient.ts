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

// Older generated message pairs (user + assistant) prepended before the hand-written ones.
// Timestamps count backwards from the first hand-written message.
const olderMessagePairs: [string, string][] = [
  [
    'What is the difference between ref and reactive in Vue?',
    '`ref()` wraps a single value and requires `.value` in script, while `reactive()` wraps an entire object and provides deep reactivity without `.value`. Use `ref` for primitives and `reactive` for objects when you prefer direct property access.',
  ],
  [
    'How do I fetch data on component mount?',
    "Use an `async` function inside `<script setup>` with `onMounted`:\n\n```ts\nonMounted(async () => {\n  const res = await fetch('/api/data')\n  data.value = await res.json()\n})\n```\n\nAlternatively, libraries like VueUse provide `useFetch` for a more declarative approach.",
  ],
  [
    'Can you explain Vue Router basics?',
    "Vue Router maps URL paths to components. Define routes as an array of `{ path, component }` objects, create a router with `createRouter()`, and install it via `app.use(router)`. Use `<RouterView>` to render matched components and `<RouterLink>` for navigation.",
  ],
  [
    'What is Pinia and how does it compare to Vuex?',
    "Pinia is the officially recommended state management library for Vue 3. Compared to Vuex it drops mutations entirely, supports TypeScript out of the box, and has a simpler API with `defineStore()`. It's modular by default — each store is independent.",
  ],
  [
    'How do I create a custom composable?',
    "A composable is just a function that uses Vue's Composition API internally and returns reactive state:\n\n```ts\nexport function useCounter(initial = 0) {\n  const count = ref(initial)\n  const increment = () => count.value++\n  return { count, increment }\n}\n```\n\nCall it inside `<script setup>` like any other function.",
  ],
  [
    'What are slots in Vue?',
    "Slots let a parent component inject template content into a child. The child declares `<slot />` placeholders, and the parent fills them. **Named slots** (`<slot name=\"header\" />`) allow multiple injection points, while **scoped slots** pass data back to the parent.",
  ],
  [
    'How do I use provide/inject?',
    "`provide()` in an ancestor makes a value available to all descendants via `inject()`. It's useful for deeply nested components that need shared state without prop drilling:\n\n```ts\n// parent\nprovide('theme', ref('dark'))\n// child\nconst theme = inject('theme')\n```",
  ],
  [
    'What are watchers and when should I use them?',
    "Watchers run side-effects when reactive data changes. Use `watch()` when you need to perform async work or interact with external systems in response to state changes. For simple derived values, prefer `computed()` instead — it's more efficient.",
  ],
  [
    'How do I lazy-load components?',
    "Use `defineAsyncComponent()` or dynamic `import()` in your route definitions:\n\n```ts\nconst UserProfile = defineAsyncComponent(() =>\n  import('./components/UserProfile.vue')\n)\n```\n\nThis splits the component into a separate chunk that loads on demand, improving initial page load.",
  ],
  [
    'What is the Teleport component used for?',
    "`<Teleport to=\"body\">` renders its children into a different DOM node, outside the component's own tree. It's commonly used for modals, tooltips, and overlays that need to escape parent `overflow: hidden` or stacking contexts while still being part of Vue's reactivity system.",
  ],
  [
    'How do I handle forms in Vue?',
    "Use `v-model` for two-way binding on inputs. For complex forms, create a reactive object with all fields and validate on submit:\n\n```ts\nconst form = reactive({ name: '', email: '' })\nfunction onSubmit() {\n  if (!form.name) errors.value.push('Name is required')\n}\n```\n\nLibraries like VeeValidate or FormKit add schema-based validation.",
  ],
  [
    'Can you explain the Vue lifecycle hooks?',
    "The main hooks in order are: `setup()` (Composition API entry), `onBeforeMount`, `onMounted` (DOM ready), `onBeforeUpdate`, `onUpdated`, `onBeforeUnmount`, and `onUnmounted`. Most day-to-day work uses `onMounted` for data fetching and `onUnmounted` for cleanup.",
  ],
  [
    'What is the difference between v-if and v-show?',
    "`v-if` conditionally **renders** the element — it's removed from the DOM entirely when false. `v-show` toggles CSS `display: none` instead, keeping the element in the DOM. Use `v-show` for frequent toggles (cheaper) and `v-if` when the condition rarely changes or when you want to avoid mounting cost.",
  ],
  [
    'How do transitions and animations work in Vue?',
    "Wrap elements in `<Transition>` to apply enter/leave CSS classes automatically. Vue adds classes like `v-enter-from`, `v-enter-active`, and `v-leave-to` that you style with CSS transitions or animations. For lists, use `<TransitionGroup>` which also handles move animations via FLIP.",
  ],
  [
    'What is SSR in Vue and when should I use it?',
    "Server-Side Rendering generates HTML on the server so the browser shows content immediately. Use it when SEO or first-paint performance matters. Nuxt is the go-to SSR framework for Vue — it handles routing, data fetching, and hydration out of the box.",
  ],
  [
    'How do I test Vue components?',
    "Use **Vitest** as the test runner and **@vue/test-utils** for mounting components:\n\n```ts\ntest('renders message', () => {\n  const wrapper = mount(MyComponent, { props: { msg: 'Hello' } })\n  expect(wrapper.text()).toContain('Hello')\n})\n```\n\nFor end-to-end tests, Playwright or Cypress are popular choices.",
  ],
  [
    'What are directives and how do I create custom ones?',
    "Directives are special attributes that apply low-level DOM manipulations. Built-in ones include `v-if`, `v-for`, and `v-model`. Create custom directives with hooks like `mounted` and `updated`:\n\n```ts\napp.directive('focus', {\n  mounted(el) { el.focus() }\n})\n```\n\nUse them sparingly — composables are usually a better abstraction.",
  ],
  [
    'How do I deploy a Vue app?',
    "Run `npm run build` to produce a static `dist/` folder, then serve it with any static host — Netlify, Vercel, GitHub Pages, or an S3 bucket behind CloudFront. For SSR apps (Nuxt), you'll need a Node.js server or a serverless platform that supports it.",
  ],
  [
    'What are environment variables in Vite?',
    "Vite exposes env vars prefixed with `VITE_` to client code via `import.meta.env.VITE_*`. Store them in `.env` files (`.env.development`, `.env.production`). Never put secrets in `VITE_` vars — they're embedded in the client bundle and visible to anyone.",
  ],
  [
    'How do I set up path aliases in Vite?',
    "Add a `resolve.alias` entry in `vite.config.ts`:\n\n```ts\nresolve: {\n  alias: { '@': path.resolve(__dirname, 'src') }\n}\n```\n\nThen import with `import Foo from '@/components/Foo.vue'`. Make sure your `tsconfig.json` has a matching `paths` entry so TypeScript resolves the same alias.",
  ],
]

const BASE_TIME = new Date('2026-02-20T10:00:00.000Z').getTime()

function generateOlderMessages(): MessageResponse[] {
  const msgs: MessageResponse[] = []
  for (let i = olderMessagePairs.length - 1; i >= 0; i--) {
    const [userContent, assistantContent] = olderMessagePairs[i]
    // Each pair is 1 minute apart, counting backwards from BASE_TIME
    const pairOffset = (i + 1) * 60_000
    const userTime = new Date(BASE_TIME - pairOffset).toISOString()
    const assistantTime = new Date(BASE_TIME - pairOffset + 8_000).toISOString()
    const idx = i + 1
    msgs.push(
      {
        id: `mock-msg-old-${idx}-user`,
        conversationId: MOCK_CONVERSATION_ID,
        role: 'user',
        content: userContent,
        createdAt: userTime,
      },
      {
        id: `mock-msg-old-${idx}-asst`,
        conversationId: MOCK_CONVERSATION_ID,
        role: 'assistant',
        content: assistantContent,
        createdAt: assistantTime,
      },
    )
  }
  return msgs
}

const handWrittenMessages: MessageResponse[] = [
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

// Combine: older generated messages first, then the 10 hand-written ones
const cannedMessages: MessageResponse[] = [
  ...generateOlderMessages(),
  ...handWrittenMessages,
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
    // Simulate 300ms–1s network latency
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700))
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
