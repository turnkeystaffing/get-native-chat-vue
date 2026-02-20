# Story 2.1: useChat Composable & Conversation Lifecycle

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want the chat to automatically find or create my conversation when I open it,
so that I can start chatting immediately without any setup.

## Acceptance Criteria

1. **Given** the user opens the chat for the first time (no conversations exist) **When** `useChat()` initializes via `open()` **Then** it calls `apiClient.getConversations(0, 1)` **And** when no conversations are returned, it calls `apiClient.createConversation()` **And** the new conversation ID is stored in state

2. **Given** the user opens the chat with existing conversations **When** `useChat()` initializes via `open()` **Then** it calls `apiClient.getConversations(0, 1)` and uses the most recent conversation **And** it calls `apiClient.getMessages(conversationId, 0, batchSize)` to fetch the latest messages **And** messages are reversed from newest-first (API order) to chronological (display order)

3. **Given** the plugin config includes `conversationId` **When** `useChat()` initializes **Then** it skips `getConversations()` and uses the provided conversation ID directly

4. **Given** `useChat()` is created **When** any component in the tree calls `inject(CHAT_STATE_KEY)` **Then** it receives the full `UseChatReturn` interface: `messages`, `isOpen`, `isLoading`, `isSending`, `hasMore`, `failedMessageText` (readonly refs) and `open()`, `close()`, `sendMessage()`, `loadMore()`, `retry()` (actions)

5. **Given** `useChat()` state is exposed **When** a component reads any state ref **Then** the ref is `Readonly<Ref<T>>` -- components cannot mutate state directly

## Tasks / Subtasks

- [x] Task 1: Create `src/composables/useChat.ts` composable (AC: #1, #2, #3, #4, #5)
  - [x] 1.1 Create `src/composables/useChat.ts` with `<script setup lang="ts">` pattern -- export a single `useChat(apiClient, config)` factory function
  - [x] 1.2 Define internal state as individual `ref()` values: `messages` (`ChatMessage[]`), `isOpen` (`boolean`), `isLoading` (`boolean`), `isSending` (`boolean`), `hasMore` (`boolean`), `failedMessageText` (`string | null`), `conversationId` (`string | null`), `messageOffset` (`number`)
  - [x] 1.3 Implement `open()` action:
    - If `config.conversationId` provided, use it directly (skip getConversations)
    - Otherwise call `apiClient.getConversations(0, 1)`:
      - If conversations returned, use the most recent (`conversations[0]`)
      - If no conversations, call `apiClient.createConversation()` and use new ID
    - Set `isLoading = true`, call `apiClient.getMessages(conversationId, 0, batchSize)`
    - Reverse messages from newest-first to chronological order
    - Set `messages`, `hasMore` from response, `messageOffset` = messages.length
    - Set `isOpen = true`, `isLoading = false`
  - [x] 1.4 Implement `close()` action: set `isOpen = false`
  - [x] 1.5 Implement `sendMessage(text)` action (stub for Story 2.4):
    - Guard: if `!text.trim()` or `isSending`, return early
    - Set `isSending = true`
    - Create optimistic user message with `status: 'sending'`, temporary ID (`temp-{Date.now()}`), add to `messages`
    - Call `apiClient.sendMessage(conversationId, text)`
    - On success: replace optimistic message with server response (status: 'sent'), add assistant message, set `isSending = false`
    - On failure: remove optimistic message, set `failedMessageText = text`, create error ChatMessage with `role: 'assistant'` and error content, add to messages, invoke `config.onError` if defined, set `isSending = false`
  - [x] 1.6 Implement `loadMore()` action (stub for Story 3.1):
    - Guard: if `!hasMore` or `isLoading`, return early
    - Set `isLoading = true`
    - Call `apiClient.getMessages(conversationId, messageOffset, batchSize)`
    - Reverse returned messages, prepend to `messages` array
    - Update `messageOffset`, `hasMore` from response
    - Set `isLoading = false`
    - On failure: set `isLoading = false` silently (no error display per UX spec)
  - [x] 1.7 Implement `retry()` action:
    - Guard: if `!failedMessageText`, return early
    - Store text from `failedMessageText`, clear `failedMessageText`
    - Call `sendMessage(storedText)`
  - [x] 1.8 Return `UseChatReturn` object: all state refs wrapped in `readonly()`, all action functions exposed
  - [x] 1.9 Default `batchSize` to `config.batchSize ?? 20`

- [x] Task 2: Define `UseChatReturn` type and update `keys.ts` (AC: #4, #5)
  - [x] 2.1 Create `UseChatReturn` interface in `src/composables/useChat.ts` (or `src/types/chat.ts`):
    ```typescript
    interface UseChatReturn {
      messages: Readonly<Ref<ChatMessage[]>>
      isOpen: Readonly<Ref<boolean>>
      isLoading: Readonly<Ref<boolean>>
      isSending: Readonly<Ref<boolean>>
      hasMore: Readonly<Ref<boolean>>
      failedMessageText: Readonly<Ref<string | null>>
      open(): Promise<void>
      close(): void
      sendMessage(text: string): Promise<void>
      loadMore(): Promise<void>
      retry(): Promise<void>
    }
    ```
  - [x] 2.2 Update `src/keys.ts`: change `CHAT_STATE_KEY` from untyped `Symbol` to `InjectionKey<UseChatReturn>` -- this fulfills the TODO from Story 1.2
  - [x] 2.3 Export `UseChatReturn` type from `src/types/index.ts` for consumer access

- [x] Task 3: Refactor `NativeChatWidget.vue` to use `useChat()` (AC: #4)
  - [x] 3.1 Replace inline `isOpen`, `open`, `close`, `toggle` state with `useChat(apiClient, config)` call
  - [x] 3.2 Inject `CONFIG_KEY` to get `apiClient` and config options
  - [x] 3.3 Provide the full `UseChatReturn` object via `provide(CHAT_STATE_KEY, chatState)`
  - [x] 3.4 Keep `floatingButtonRef` and focus-return-on-close watch (existing behavior)
  - [x] 3.5 Keep theme registration logic (unchanged)
  - [x] 3.6 Add `toggle()` as a convenience that calls `open()` or `close()` based on `isOpen` value -- maintains FloatingButton compatibility

- [x] Task 4: Update `ChatPanel.vue` to work with typed `UseChatReturn` (AC: #4)
  - [x] 4.1 Remove the `as { isOpen, open, close, toggle }` type cast -- use proper `inject(CHAT_STATE_KEY)!` with typed InjectionKey
  - [x] 4.2 Conditionally render WelcomeState vs future MessageList based on `messages.length === 0 && !isLoading` (placeholder for Story 2.2)
  - [x] 4.3 Show loading indicator when `isLoading` is true (simple `v-progress-circular` placeholder)

- [x] Task 5: Update `FloatingButton.vue` to work with typed `UseChatReturn` (AC: #4)
  - [x] 5.1 Remove any untyped cast for injected state -- use `inject(CHAT_STATE_KEY)!` directly
  - [x] 5.2 Update toggle logic: call `chatState.open()` when closed (triggers conversation init), `chatState.close()` when open

- [x] Task 6: Write tests (AC: #1, #2, #3, #4, #5)
  - [x] 6.1 Create `src/composables/__tests__/useChat.test.ts`:
    - Test: `open()` calls `getConversations(0, 1)` and `getMessages()` with existing conversation
    - Test: `open()` calls `createConversation()` when no conversations exist
    - Test: `open()` uses `config.conversationId` directly when provided (skips getConversations)
    - Test: `open()` reverses messages from newest-first to chronological order
    - Test: `open()` sets `isLoading` to true during fetch, false after
    - Test: `open()` sets `hasMore` from API response
    - Test: `open()` sets `isOpen` to true after successful initialization
    - Test: `close()` sets `isOpen` to false
    - Test: `sendMessage()` adds optimistic message with status 'sending'
    - Test: `sendMessage()` on success updates message status to 'sent' and adds assistant response
    - Test: `sendMessage()` on failure removes optimistic message, sets failedMessageText, adds error message
    - Test: `sendMessage()` calls `config.onError` on failure if defined
    - Test: `sendMessage()` guards against empty text and concurrent sends
    - Test: `loadMore()` fetches next batch with correct offset
    - Test: `loadMore()` prepends messages and updates hasMore
    - Test: `loadMore()` fails silently (no error in messages)
    - Test: `loadMore()` guards against no-more and concurrent loads
    - Test: `retry()` resends failed message text via `sendMessage()`
    - Test: `retry()` clears `failedMessageText`
    - Test: all returned state refs are readonly
    - Test: default batchSize is 20 when not configured
  - [x] 6.2 Update `src/components/__tests__/NativeChatWidget.test.ts`:
    - Update mock provide to match new `UseChatReturn` shape
    - Test: provides `UseChatReturn` state via `CHAT_STATE_KEY`
    - Verify existing tests still pass with refactored state
  - [x] 6.3 Update `src/components/__tests__/ChatPanel.test.ts`:
    - Update mock state shape to `UseChatReturn`
    - Test: renders loading indicator when `isLoading` is true
    - Test: renders WelcomeState when messages are empty and not loading
  - [x] 6.4 Update `src/components/__tests__/FloatingButton.test.ts`:
    - Update mock state shape to `UseChatReturn`
    - Verify existing tests pass with new state shape
  - [x] 6.5 Run `yarn test` -- all tests pass
  - [x] 6.6 Run `yarn build` -- verify build succeeds
  - [x] 6.7 Run `yarn lint` -- verify no new lint errors (7 pre-existing warnings acceptable)

## Dev Notes

### Critical Architecture Constraints

- **TypeScript strict mode** -- all files compile under `"strict": true`. Use `defineProps<T>()` and `defineEmits<T>()` for component interfaces
- **Symbol-based provide/inject** -- import `CONFIG_KEY` and `CHAT_STATE_KEY` from `@/keys`. Never use string keys
- **No reactive() for top-level state** -- use individual `ref()` values per architecture mandate
- **No hardcoded colors** -- use Vuetify theme tokens
- **No !important in CSS** -- use wrapper elements for overrides
- **@layer native-chat** -- wrap all `<style scoped>` content in `@layer native-chat { }`
- **v-theme-provider** -- all plugin content already wrapped at NativeChatWidget root
- **ESM-only** -- all imports/exports use ES modules
- **No icon font dependency** -- self-contained SVG components in `src/icons/`
- **CRITICAL: `open()` must be async** -- conversation initialization involves API calls. The FloatingButton must call `open()` when toggling open (not the synchronous `toggle()` from before)

### useChat() Composable Architecture

The `useChat()` composable is the central state management layer for the entire plugin. It follows Vue 3 Composition API patterns:

```typescript
// src/composables/useChat.ts
import { ref, readonly } from 'vue'
import type { Ref, Readonly } from 'vue'
import type { NativeChatApiClient } from '@/types/api'
import type { NativeChatPluginOptions } from '@/types/config'
import type { ChatMessage, ChatError } from '@/types/chat'

export interface UseChatReturn {
  // Readonly state
  messages: Readonly<Ref<ChatMessage[]>>
  isOpen: Readonly<Ref<boolean>>
  isLoading: Readonly<Ref<boolean>>
  isSending: Readonly<Ref<boolean>>
  hasMore: Readonly<Ref<boolean>>
  failedMessageText: Readonly<Ref<string | null>>

  // Actions
  open(): Promise<void>
  close(): void
  sendMessage(text: string): Promise<void>
  loadMore(): Promise<void>
  retry(): Promise<void>
}

export function useChat(
  apiClient: NativeChatApiClient,
  config: NativeChatPluginOptions,
): UseChatReturn {
  const messages = ref<ChatMessage[]>([])
  const isOpen = ref(false)
  const isLoading = ref(false)
  const isSending = ref(false)
  const hasMore = ref(false)
  const failedMessageText = ref<string | null>(null)
  const conversationId = ref<string | null>(null)
  const messageOffset = ref(0)
  const batchSize = config.batchSize ?? 20

  // ... action implementations

  return {
    messages: readonly(messages),
    isOpen: readonly(isOpen),
    isLoading: readonly(isLoading),
    isSending: readonly(isSending),
    hasMore: readonly(hasMore),
    failedMessageText: readonly(failedMessageText),
    open,
    close,
    sendMessage,
    loadMore,
    retry,
  }
}
```

### Conversation Lifecycle Flow

```
open() called
  |
  ├── config.conversationId provided?
  |     ├── YES: use directly, skip getConversations
  |     └── NO: call apiClient.getConversations(0, 1)
  |               ├── conversations.length > 0: use conversations[0].id
  |               └── conversations.length === 0: call apiClient.createConversation()
  |
  ├── Set isLoading = true
  ├── Call apiClient.getMessages(conversationId, 0, batchSize)
  ├── Reverse messages (newest-first -> chronological)
  ├── Set messages, hasMore, messageOffset = messages.length
  ├── Set isOpen = true, isLoading = false
  |
  └── On error: set isLoading = false, set isOpen = true (chat opens with empty state)
```

### Message Ordering

**API returns newest-first, plugin displays chronological:**

```typescript
// API response: [newest, ..., oldest]
const response = await apiClient.getMessages(convId, 0, batchSize)
// Plugin display: [oldest, ..., newest]
const chronological = [...response.messages].reverse()
messages.value = chronological
```

This applies to both initial fetch and loadMore(). For loadMore(), reversed messages are *prepended* to the existing array.

### Optimistic UI Pattern (sendMessage)

```
sendMessage("hello")
  |
  ├── Create temp message: { id: 'temp-{timestamp}', role: 'user', content: 'hello', status: 'sending' }
  ├── Push to messages[]
  ├── Set isSending = true
  ├── Call apiClient.sendMessage(convId, "hello")
  |
  ├── SUCCESS:
  |     ├── Replace temp message with server userMessage (status: 'sent')
  |     ├── Add assistantMessage to messages[]
  |     └── Set isSending = false
  |
  └── FAILURE:
        ├── Remove temp message from messages[]
        ├── Add error ChatMessage (role: 'assistant', error content)
        ├── Set failedMessageText = "hello"
        ├── Call config.onError(chatError) if defined
        └── Set isSending = false
```

### Error Handling Strategy

- **Send failure:** Remove optimistic message, add calm error message inline, re-populate input with `failedMessageText`
- **History fetch failure (open):** Set isOpen = true anyway, show welcome state as fallback (chat remains usable)
- **History fetch failure (loadMore):** Silent -- set isLoading = false, no error message. User can retry by scrolling up
- **Error message tone:** Calm and neutral per UX spec -- "Something went wrong. You can try sending your message again."
- **HTTP status mapping:**
  - 429 -> "You're sending messages too quickly. Please wait a moment and try again."
  - 503/504 -> "The service is temporarily unavailable. Please try again in a moment."
  - Other -> "Something went wrong. You can try sending your message again."

### NativeChatWidget Refactoring

**Current state (inline refs):**
```typescript
const isOpen = ref(false)
const open = () => { isOpen.value = true }
const close = () => { isOpen.value = false }
const toggle = () => { isOpen.value = !isOpen.value }
provide(CHAT_STATE_KEY, { isOpen: readonly(isOpen), open, close, toggle })
```

**New state (useChat composable):**
```typescript
const config = inject(CONFIG_KEY)!
const chatState = useChat(config.apiClient, config)
provide(CHAT_STATE_KEY, chatState)
```

The `toggle()` function is still needed for FloatingButton compatibility. Add it as a wrapper:
```typescript
const toggle = () => {
  if (chatState.isOpen.value) {
    chatState.close()
  } else {
    chatState.open()
  }
}
```

The `toggle` function should be provided alongside the UseChatReturn, or the FloatingButton should call `open()`/`close()` directly based on current state.

**Decision:** Do NOT add `toggle` to UseChatReturn. Instead, update FloatingButton to call `chatState.open()` or `chatState.close()` directly based on `chatState.isOpen.value`. This keeps the composable API clean per architecture spec.

### Focus Management (Existing Pattern -- Preserve)

The focus-return-on-close behavior established in Story 1.4 must be preserved:

```typescript
// In NativeChatWidget.vue
const floatingButtonRef = ref<InstanceType<typeof FloatingButton> | null>(null)

watch(() => chatState.isOpen.value, (val) => {
  if (!val) {
    nextTick(() => {
      floatingButtonRef.value?.focus()
    })
  }
})
```

This watch uses `chatState.isOpen` from the composable instead of the old inline ref.

### ChatPanel Updates

**Current inject pattern (untyped):**
```typescript
const chatState = inject(CHAT_STATE_KEY) as {
  isOpen: { value: boolean }
  open: () => void
  close: () => void
  toggle: () => void
}
```

**New inject pattern (typed via InjectionKey):**
```typescript
import type { UseChatReturn } from '@/composables/useChat'
const chatState = inject(CHAT_STATE_KEY)!
// TypeScript now knows the full UseChatReturn shape
```

**Conditional rendering update:**
```vue
<div class="nc-chat-panel__body">
  <v-progress-circular v-if="chatState.isLoading.value" indeterminate size="24" class="nc-chat-panel__loader" />
  <WelcomeState v-else-if="chatState.messages.value.length === 0" :message="welcomeMessage" />
  <!-- MessageList slot for Story 2.2 -->
</div>
```

### Project Structure Notes

- `src/composables/useChat.ts` -- new file, primary composable
- `src/composables/__tests__/useChat.test.ts` -- new test file
- `src/composables/__tests__/` -- new directory (first composable test)
- All existing component files remain in `src/components/` (flat structure)
- Aligns with architecture project structure: composables in `src/composables/`

### Existing Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `src/keys.ts` | **Update** | Type CHAT_STATE_KEY as `InjectionKey<UseChatReturn>` |
| `src/components/NativeChatWidget.vue` | **Refactor** | Replace inline state with `useChat()` composable |
| `src/components/ChatPanel.vue` | **Update** | Remove untyped cast, add loading/empty state rendering |
| `src/components/FloatingButton.vue` | **Update** | Remove untyped cast, use `open()`/`close()` instead of `toggle()` |
| `src/components/__tests__/NativeChatWidget.test.ts` | **Update** | Mock UseChatReturn shape, verify composable integration |
| `src/components/__tests__/ChatPanel.test.ts` | **Update** | Mock UseChatReturn, test loading/empty states |
| `src/components/__tests__/FloatingButton.test.ts` | **Update** | Mock UseChatReturn shape |
| `src/types/index.ts` | **Update** | Re-export UseChatReturn type |

### New Files to Create

| File | Purpose |
|------|---------|
| `src/composables/useChat.ts` | Central state management composable |
| `src/composables/__tests__/useChat.test.ts` | Composable unit tests |

### Testing Strategy

**useChat.test.ts (primary -- most critical tests):**
- Test composable in isolation -- no component mounting needed
- Mock `apiClient` with `vi.fn()` for each method
- Test conversation initialization flow (getConversations + getMessages)
- Test conversation creation flow (no existing conversations)
- Test config.conversationId bypass
- Test message reversal (newest-first -> chronological)
- Test sendMessage optimistic UI pattern
- Test sendMessage success/failure flows
- Test loadMore with offset tracking
- Test retry mechanism
- Test readonly state enforcement
- Test batchSize default

**Component test updates:**
- Update all mock state objects to match `UseChatReturn` shape
- All existing behavior tests should still pass
- New tests for loading/empty state rendering in ChatPanel

### Verified Package Versions (from Story 1.4)

| Package | Version | Relevance to Story |
|---------|---------|-------------------|
| Vue | 3.5.28 | `ref()`, `readonly()`, `provide()`, `inject()`, `watch()`, `computed()` |
| Vuetify | 3.11.8 | `v-progress-circular` for loading indicator |
| Vitest | 4.0.x | Test runner |
| @vue/test-utils | 2.4.6 | Component mounting |

### Previous Story (1.4) Learnings

- **CHAT_STATE_KEY is untyped Symbol** -- this story resolves the TODO by typing it as `InjectionKey<UseChatReturn>`
- **VNavigationDrawer requires vuetify:layout injection** -- test setup must wrap ChatPanel in VLayout (already established)
- **Template ref on Vue component returns component instance** -- `floatingButtonRef.value?.focus()` already works (FloatingButton exposes `focus()`)
- **58 tests pass, build succeeds, lint clean** -- baseline for regression testing
- **dist/ tracked in git** -- run `yarn build` and commit dist/ after implementation
- **Yarn v4 Berry** -- use `yarn` exclusively
- **@/* path alias** -- configured everywhere
- **ESLint 10 flat config** -- eslint.config.ts
- **7 pre-existing lint warnings** -- don't try to fix

### Naming Conventions (Enforce)

- **Composable file:** camelCase with `use` prefix (`useChat.ts`)
- **Type names:** PascalCase, no prefix (`UseChatReturn`, not `IUseChatReturn`)
- **Internal state:** camelCase (`conversationId`, `messageOffset`, `failedMessageText`)
- **Boolean refs:** `is`/`has` prefix (`isOpen`, `isLoading`, `isSending`, `hasMore`)
- **Action functions:** camelCase verbs (`open`, `close`, `sendMessage`, `loadMore`, `retry`)
- **CSS classes:** kebab-case with `nc-` prefix (e.g., `nc-chat-panel__loader`)
- **Tests:** `.test.ts` suffix, co-located `__tests__/` folder
- **Imports:** Use `@/` path alias

### References

- [Source: architecture.md#State Patterns] -- useChat() composable structure, UseChatReturn interface shape
- [Source: architecture.md#Error & Loading Patterns] -- Error handling strategy, loading state management
- [Source: architecture.md#Component Patterns] -- Provide/inject with Symbol keys, readonly state
- [Source: architecture.md#Core Architectural Decisions] -- API client interface, conversation management, message ordering
- [Source: architecture.md#Data Flow] -- NativeChatWidget creates useChat, provides state, data flow diagram
- [Source: architecture.md#Implementation Patterns & Consistency Rules] -- Naming, anti-patterns, enforcement guidelines
- [Source: epics.md#Story 2.1] -- Acceptance criteria, FR coverage (FR22, FR23)
- [Source: epics.md#Epic 2] -- Core Messaging Experience overview, FR9-FR23
- [Source: prd.md#FR22] -- Fetch and display existing conversation history on open
- [Source: prd.md#FR23] -- Multi-turn conversations (server-managed context)
- [Source: ux-design-specification.md#Loading & Empty States] -- Loading indicator during fetch, welcome state after empty fetch
- [Source: ux-design-specification.md#Error Feedback] -- Calm inline error messages, no red backgrounds
- [Source: ux-design-specification.md#Journey 1] -- Open chat flow with history fetch
- [Source: ux-design-specification.md#Journey 2] -- Error recovery and history browsing
- [Source: 1-4-chat-panel-with-header-welcome-state.md] -- Previous story learnings, package versions, debug log
- [Source: 1-4-chat-panel-with-header-welcome-state.md#Previous Story (1.3) Learnings] -- Vuetify test setup, theme registration, icon pattern

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- One test failure during development: `isLoading` assertion needed microtask flushing (`await Promise.resolve()` x2) because `getConversations` resolves asynchronously before `isLoading = true` is reached
- ChatHeader.vue also had untyped `CHAT_STATE_KEY` cast (not listed in story tasks) — fixed as part of build compilation

### Completion Notes List

- Created `useChat()` composable as central state management layer with full conversation lifecycle
- Implemented all 5 actions: `open()`, `close()`, `sendMessage()`, `loadMore()`, `retry()`
- `open()` handles 3 paths: config.conversationId bypass, existing conversation, new conversation creation
- Message ordering: API returns newest-first, composable reverses to chronological for display
- Optimistic UI pattern for sendMessage with proper rollback on failure
- Error messages follow UX spec tone (calm, neutral) with HTTP status-specific messages (429, 503/504)
- `loadMore()` fails silently per UX spec; `open()` error opens chat with empty state as fallback
- All state refs returned as `readonly()` — components cannot mutate state directly
- `CHAT_STATE_KEY` upgraded from untyped Symbol to `InjectionKey<UseChatReturn>`
- NativeChatWidget refactored: inline state replaced with `useChat()` composable
- FloatingButton updated: `toggle()` removed, now calls `open()`/`close()` directly
- ChatPanel updated: typed inject, conditional loading indicator and welcome state rendering
- ChatHeader updated: removed untyped cast (not in original task list but required for build)
- 23 new composable unit tests + 2 new ChatPanel tests (loading, welcome state) + updated all component test mocks
- Total: 87 tests pass (29 new/updated), build succeeds, lint clean

### File List

**New files:**
- `src/composables/useChat.ts` — Central state management composable
- `src/composables/__tests__/useChat.test.ts` — 23 composable unit tests

**Modified files:**
- `src/keys.ts` — Typed CHAT_STATE_KEY as InjectionKey<UseChatReturn>
- `src/types/index.ts` — Re-export UseChatReturn type
- `src/components/NativeChatWidget.vue` — Refactored to use useChat() composable
- `src/components/ChatPanel.vue` — Typed inject, loading indicator, conditional welcome state
- `src/components/FloatingButton.vue` — Typed inject, open()/close() instead of toggle()
- `src/components/ChatHeader.vue` — Typed inject (removed untyped cast)
- `src/components/__tests__/NativeChatWidget.test.ts` — Updated mocks to UseChatReturn shape
- `src/components/__tests__/ChatPanel.test.ts` — Updated mocks, added loading/welcome tests
- `src/components/__tests__/FloatingButton.test.ts` — Updated mocks to UseChatReturn shape
- `src/components/__tests__/ChatHeader.test.ts` — Updated mocks to UseChatReturn shape
- `dist/native-chat-vue.es.js` — Rebuilt
- `dist/native-chat-vue.css` — Rebuilt

## Change Log

- 2026-02-20: Story 2.1 implemented — useChat composable with conversation lifecycle, optimistic messaging, typed provide/inject, all components refactored, 87 tests pass
- 2026-02-20: Code review (Gemini 3 Pro + Claude Opus 4.6) — 10 issues found (3 HIGH, 5 MEDIUM, 2 LOW), all fixed:
  - [HIGH] Added re-entrance guard to open() preventing race conditions
  - [HIGH] Moved conversation resolution (getConversations/createConversation) inside try/catch
  - [HIGH] Added tests for open() error handling and re-entrance guard (5 new tests)
  - [MEDIUM] Removed dead code: inject non-null guards after `!` assertion in 3 components
  - [MEDIUM] Error messages now cleaned up on retry/success (no accumulation)
  - [MEDIUM] ChatPanel drawerModel setter changed to no-op (prevents accidental API calls)
  - [MEDIUM] Added test for ChatPanel setter ignoring Vuetify open attempts
  - [LOW] Extracted getErrorContent to local variable (no duplicate calls)
  - [LOW] Added conversationId null guard in sendMessage/loadMore
  - Total: 94 tests pass (7 new), build succeeds, lint clean
