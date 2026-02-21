# Story 4.2: Message Retry & Error Recovery

Status: done

Epic: 4 — Error Handling & Recovery
Date: 2026-02-20
Depends on: Story 4.1 (Error Display as Chat Messages — done)

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want my failed message text to reappear in the input so I can retry easily,
so that I don't have to retype my question after a failure.

## Acceptance Criteria

1. **Given** a message send has failed **When** the error is displayed **Then** the input field re-enables immediately **And** the input is pre-populated with the failed message text (via `failedMessageText` state) **And** focus remains on the input field

2. **Given** the input is pre-populated with failed text **When** the user presses Enter **Then** the message is re-sent (same send flow: optimistic UI → API call) **And** `failedMessageText` is cleared on success

3. **Given** the input is pre-populated with failed text **When** the user edits the text and sends **Then** the edited message is sent as a new message **And** `failedMessageText` is cleared on success

4. **Given** an error has occurred **When** the user scrolls through history, closes and reopens the chat, or performs any other action **Then** the chat remains fully functional — no page reload needed **And** the input stays enabled and usable **And** scroll and panel toggle continue to work normally

5. **Given** a network failure occurs during message history loading (infinite scroll) **When** the fetch fails **Then** the loading indicator disappears silently **And** no error message is shown in the chat **And** the user can retry by scrolling up again

6. **Given** the chat is in an error state **When** the user successfully sends a new message **Then** the previous error message remains in the chat history (as a record) **And** the new message flow proceeds normally

## Tasks / Subtasks

- [x] Task 1: Fix error message cleanup on successful send (AC: #6)
  - [x] 1.1 In `useChat.ts` `sendMessage()` success path (line ~157): remove the `!m.id.startsWith('error-')` filter so error messages are preserved in history as records when a subsequent send succeeds
  - [x] 1.2 Keep the error cleanup in `handleSendFailure()` (line ~49) — old errors SHOULD be replaced when a new error occurs (one error message at a time)
  - [x] 1.3 Verify `handleSendFailure()` still correctly replaces old error with new error on consecutive failures

- [x] Task 2: Verify existing retry and recovery infrastructure (AC: #1, #2, #3, #4)
  - [x] 2.1 Verify `ChatInput.vue` watches `failedMessageText` and pre-populates input when it changes to a truthy value
  - [x] 2.2 Verify `ChatInput.vue` does NOT clear user-typed text when `failedMessageText` goes null
  - [x] 2.3 Verify input re-enables immediately after error (`isSending` set to `false` in `finally` block)
  - [x] 2.4 Verify focus restores to input after error (isSending watcher in ChatInput triggers `textareaRef.value?.focus()`)
  - [x] 2.5 Verify `ChatInput.handleSend()` calls `chatState.sendMessage(text)` with the current input value (supports both retry of same text and edited text)
  - [x] 2.6 Verify `retry()` method exists and correctly clears `failedMessageText` before calling `sendMessage()`
  - [x] 2.7 Verify chat remains fully functional after error: scroll works (MessageList unaffected), close/reopen works (open() re-fetches from server), input stays enabled

- [x] Task 3: Verify silent history loading failure (AC: #5)
  - [x] 3.1 Verify `useChat.loadMore()` catch block is silent (no error messages added to chat)
  - [x] 3.2 Verify `hasMore` is NOT changed on loadMore failure (stays `true`, enabling retry)
  - [x] 3.3 Verify `isLoading` is reset to `false` in `finally` block (loading indicator disappears)
  - [x] 3.4 Verify `MessageList.handleLoadMore()` calls `done('ok')` even after silent failure in `chatState.loadMore()` (useChat catches internally, so MessageList always reaches success path)

- [x] Task 4: Write tests for retry and recovery (AC: #1–#6)
  - [x] 4.1 Test in useChat.test.ts: error message REMAINS in history after successful resend (modify existing "cleans up previous error messages" test)
  - [x] 4.2 Test in useChat.test.ts: error message is replaced by new error on consecutive failures (verify existing behavior still works)
  - [x] 4.3 Test in useChat.test.ts: user can edit failed text and send as new message (different text succeeds, failedMessageText cleared)
  - [x] 4.4 Test in useChat.test.ts: chat functional after error — can send new message, messages array includes error + new messages
  - [x] 4.5 Test in useChat.test.ts: loadMore fails silently, hasMore stays true, user can retry
  - [x] 4.6 Test in useChat.test.ts: retry() calls sendMessage with stored failedMessageText (verify existing test still passes)
  - [x] 4.7 Test in ChatInput.test.ts: focus restores to textarea after send failure (isSending transitions true→false)
  - [x] 4.8 Test in ChatInput.test.ts: user can edit pre-populated failed text and send edited version
  - [x] 4.9 Integration test in SendReceiveFlow.test.ts: full retry flow — send → fail → error shown + input pre-filled → retry → success → error remains in history

- [x] Task 5: Run full test suite and build (AC: all)
  - [x] 5.1 Run `yarn test` — all 189 tests pass (181 existing + 8 new)
  - [x] 5.2 Run `yarn build` — build succeeds, 29.34 kB gzip (within 50KB budget)
  - [x] 5.3 Run `yarn lint` — no lint errors

## Dev Notes

### CRITICAL: Most Retry/Recovery Infrastructure Already Exists

**This story has ONE code change and is primarily a VERIFICATION and TESTING story.**

The retry and recovery mechanisms were built during Stories 2.4 and 4.1. Here is what already works:

**In `src/composables/useChat.ts`:**
- `failedMessageText` ref (line ~43) — populated with original message text on send failure via `handleSendFailure()`
- `retry()` method (lines ~190-195) — clears failedMessageText, calls sendMessage with stored text
- `handleSendFailure()` helper (lines ~48-81) — removes optimistic message, creates error ChatMessage, sets failedMessageText, calls onError callback
- `loadMore()` (lines ~169-188) — silent catch block, isLoading reset in finally, hasMore unchanged on failure
- `sendMessage()` success path (line ~157) — **NEEDS FIX**: currently removes error messages (`!m.id.startsWith('error-')`), must preserve them per AC#6

**In `src/components/ChatInput.vue`:**
- Watch on `failedMessageText` (lines ~31-38) — pre-populates inputText when failedMessageText becomes truthy
- Watch does NOT clear user text when failedMessageText goes null (guard: `if (newText)`)
- `handleSend()` (lines ~13-22) — captures inputText, clears input, calls `chatState.sendMessage(text)` — works for both retry and edited retry
- isSending watcher (lines ~53-62) — restores focus to textarea when isSending transitions true→false
- Input disabled by `chatState.isSending.value` — re-enables when isSending=false

**In `src/components/MessageList.vue`:**
- `handleLoadMore()` (lines ~55-71) — catches exceptions from `chatState.loadMore()`, but `loadMore()` catches internally, so the catch block in handleLoadMore is a safety net only
- After silent failure: `done(!chatState.hasMore.value ? 'empty' : 'ok')` → `done('ok')` (hasMore stays true after failure) → loading indicator disappears, user can scroll again

### THE ONE CODE CHANGE

**File: `src/composables/useChat.ts`, line ~156-160**

Current (removes error messages on success):
```typescript
messages.value = [
  ...messages.value.filter((m) => m.id !== tempId && !m.id.startsWith('error-')),
  serverUserMessage,
  assistantMessage,
]
```

Required (preserves error messages as historical records):
```typescript
messages.value = [
  ...messages.value.filter((m) => m.id !== tempId),
  serverUserMessage,
  assistantMessage,
]
```

**Why:** AC#6 requires error messages to remain in chat history when a subsequent send succeeds. Error messages serve as a record of what happened. The `handleSendFailure()` method still replaces old errors with new ones on consecutive failures (correct — only one error message at a time during a failure sequence).

**Existing test to modify:** `src/composables/__tests__/useChat.test.ts` — the test "cleans up previous error messages on successful send" currently asserts error messages are removed. Must be changed to assert error messages REMAIN.

### Critical Architecture Constraints

- **TypeScript strict mode** — all files compile under `"strict": true`. Use `defineProps<T>()` for component interfaces
- **Symbol-based provide/inject** — import `CHAT_STATE_KEY` from `@/keys`. Never use string keys. `inject(CHAT_STATE_KEY)!` returns typed `UseChatReturn`
- **No reactive() for top-level state** — use individual `ref()` values per architecture mandate
- **No hardcoded colors** — use Vuetify theme tokens via `rgb(var(--v-theme-{name}))`. Colors defined in `src/theme/nativeChatTheme.ts`
- **No !important in CSS** — use wrapper elements or specificity
- **@layer native-chat** — wrap ALL `<style scoped>` content in `@layer native-chat { }`
- **v-theme-provider** — all plugin content already wrapped at NativeChatWidget root level
- **ESM-only** — all imports/exports use ES modules
- **No icon font dependency** — self-contained SVG components in `src/icons/`
- **State access via inject only** — components inject `CHAT_STATE_KEY` for state. Never call `apiClient` directly from components
- **No direct state mutation** — components read readonly refs from `UseChatReturn`. Actions go through `useChat()` action functions
- **Yarn v4 Berry** — use `yarn` exclusively (not npm)
- **@/* path alias** — configured in tsconfig, vite, and vitest. Use `@/keys`, `@/types/chat`, etc.
- **ESLint 10 flat config** — `eslint.config.ts` (not `.eslintrc.cjs`)

### Error Recovery Architecture (from architecture.md + ux-design-specification.md)

**Retry mechanism flow:**
1. Send fails → `handleSendFailure()` removes optimistic message, adds error ChatMessage, sets `failedMessageText = text`
2. `ChatInput` watches `failedMessageText` → pre-populates input field
3. `isSending` resets to `false` → input re-enables, focus restores to textarea
4. User presses Enter (same or edited text) → `handleSend()` → `chatState.sendMessage(text)` → normal send flow
5. If success: `failedMessageText = null`, error message REMAINS in history
6. If fails again: `handleSendFailure()` replaces old error with new error

**History loading failure flow:**
1. User scrolls up → v-infinite-scroll triggers `handleLoadMore()`
2. `chatState.loadMore()` calls API → API fails → `catch { }` (silent)
3. `isLoading = false` in `finally` block → loading indicator disappears
4. `hasMore` stays `true` (not modified on failure)
5. `handleLoadMore()` calls `done('ok')` (since `chatState.loadMore()` never throws)
6. User scrolls up again → cycle repeats

**Post-error chat state:**
- `isOpen` remains `true` — chat is still open and usable
- `isSending` is `false` — input is enabled
- `messages` array contains the error message + any previous messages
- `failedMessageText` contains the failed text — available for pre-population
- `hasMore` unchanged — history scrolling still works
- All components render normally — no crash, no frozen state

### Architecture Compliance Checklist

**Retry Mechanism (architecture.md#Error & Loading Patterns):**
- [ ] On send failure: optimistic message removed → error shown inline → input re-populated via `failedMessageText`
- [ ] `failedMessageText` is a `Readonly<Ref<string | null>>` — components read only, useChat mutates
- [ ] Error messages preserved in history on successful resend (AC#6 — NEW behavior)
- [ ] Error messages replaced on consecutive failures (existing behavior preserved)
- [ ] `retry()` method clears failedMessageText before calling sendMessage

**Input Recovery (architecture.md#Component Boundaries):**
- [ ] `ChatInput` watches `failedMessageText` — pre-populates on change
- [ ] `ChatInput` calls `sendMessage()` directly (not `retry()`) — supports edited text
- [ ] Input disabled via `isSending` ref — automatically re-enables after error
- [ ] Focus restored via isSending watcher — transition from true→false triggers focus

**History Loading Resilience (architecture.md#Error & Loading Patterns):**
- [ ] `loadMore()` failure is silent — catch block empty, no error messages
- [ ] `hasMore` unchanged on failure — user can retry by scrolling
- [ ] `isLoading` reset in `finally` — loading indicator always clears
- [ ] No crash, no frozen state — all components continue rendering

**No-Reload Recovery (architecture.md#State Patterns):**
- [ ] All state managed in `useChat()` — no component-local error state
- [ ] Error doesn't corrupt state — messages array valid, pagination state intact
- [ ] Close/reopen works — `open()` re-fetches from server, local error messages naturally replaced
- [ ] No global side effects — error handling confined to useChat composable

### Library & Framework Requirements

**No new dependencies for this story.** All required libraries are already installed.

**Vue 3.5+ Patterns Used:**
- `ref()`, `readonly()`, `computed()` for reactive error state
- `watch()` for `failedMessageText` and `isSending` transitions
- `nextTick()` for focus restoration after state changes
- `provide/inject` with `InjectionKey<T>` for typed state distribution

**Vuetify 3.11+ Patterns Used:**
- `v-infinite-scroll` with `side="start"` for history loading — `done('ok')` / `done('empty')` / `done('error')` status callbacks
- `v-textarea` with `:disabled` bound to `chatState.isSending.value`

**Vitest 4.0+ / @vue/test-utils 2.4+ Testing Patterns:**
- `vi.fn().mockRejectedValue(...)` for API failure simulation
- `vi.fn().mockRejectedValueOnce(...)` for one-shot errors followed by success
- `await flushPromises()` or `await nextTick()` for async error flow completion
- Globals enabled: `describe`, `it`, `expect`, `vi` available without imports
- Mount helper pattern: `mount{ComponentName}()` encapsulates Vuetify + provide setup
- Inject keys cast: `{ [CHAT_STATE_KEY as symbol]: chatState }` — `as symbol` required

**Key Test Pattern — Retry After Failure:**
```typescript
// First send fails
;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('fail'))
await chat.sendMessage('Hello')
expect(chat.failedMessageText.value).toBe('Hello')
expect(chat.messages.value.some((m) => m.id.startsWith('error-'))).toBe(true)

// Second send succeeds (retry with same or edited text)
;(apiClient.sendMessage as ReturnType<typeof vi.fn>).mockResolvedValue({
  userMessage: { id: 's-1', conversationId: 'conv-1', role: 'user', content: 'Hello', createdAt: '...' },
  assistantMessage: { id: 's-2', conversationId: 'conv-1', role: 'assistant', content: 'Hi', createdAt: '...' },
})
await chat.sendMessage('Hello')

// Error message should REMAIN in history (AC#6)
expect(chat.messages.value.some((m) => m.id.startsWith('error-'))).toBe(true)
// User + assistant messages also present
expect(chat.messages.value.filter((m) => !m.id.startsWith('error-'))).toHaveLength(2)
```

**Key Test Pattern — hasMore After loadMore Failure:**
```typescript
// Setup with hasMore = true
await chat.open()
expect(chat.hasMore.value).toBe(true)

// loadMore fails
;(apiClient.getMessages as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network'))
await chat.loadMore()

// hasMore should still be true (user can retry)
expect(chat.hasMore.value).toBe(true)
expect(chat.isLoading.value).toBe(false)
```

### File Structure Requirements

**Files to modify:**

| File | Action | Purpose |
|------|--------|---------|
| `src/composables/useChat.ts` | **Modify** | Remove `!m.id.startsWith('error-')` from sendMessage success filter (line ~157) — preserve error messages in history |

**Files to update with new/modified tests:**

| File | Action | Purpose |
|------|--------|---------|
| `src/composables/__tests__/useChat.test.ts` | **Modify** | Change "cleans up previous error messages" test to verify errors REMAIN; add retry/recovery tests |
| `src/components/__tests__/ChatInput.test.ts` | **Verify** | Add focus restoration after error test, edited retry test |
| `src/components/__tests__/SendReceiveFlow.test.ts` | **Modify** | Add full retry flow integration test |

**Files that should NOT be modified:**

| File | Reason |
|------|--------|
| `src/components/ChatInput.vue` | Already handles failedMessageText watch, focus restoration, and send flow correctly |
| `src/components/MessageList.vue` | Already renders all messages including errors; handleLoadMore works correctly |
| `src/components/MessageBubble.vue` | Pure display component, no retry logic needed |
| `src/components/ChatPanel.vue` | No error recovery behavior needed |
| `src/plugin.ts` | Plugin install unchanged |
| `src/keys.ts` | No new injection keys |
| `src/types/` | No type changes needed |

**No new files to create.**

**No new dependencies to add.**

### Component Interaction Map

```
NativeChatWidget (root — provides CHAT_STATE_KEY)
  ├── FloatingButton (toggle open/close — unaffected by errors)
  └── ChatPanel (v-navigation-drawer — remains functional during error state)
       ├── ChatHeader (close button — works normally during error state)
       ├── .nc-chat-panel__body
       │    ├── Loading spinner (when isLoading)
       │    ├── WelcomeState (when messages empty && !isLoading)
       │    └── MessageList (renders error messages + normal messages)
       │         └── v-infinite-scroll
       │              └── <ul> message list
       │                   ├── MessageBubble (role="user")
       │                   ├── MessageBubble (variant="error") ← REMAINS IN HISTORY
       │                   ├── MessageBubble (role="user") ← RETRY/NEW MESSAGE
       │                   └── MessageBubble (role="assistant") ← RESPONSE
       └── ChatInput ← THIS STORY VERIFIES RETRY FLOW
            ├── watches failedMessageText → pre-populates input
            ├── isSending watcher → restores focus after error
            └── handleSend() → calls sendMessage() with current text
```

**Retry Data Flow:**
```
1. sendMessage("Hello") fails
   └── handleSendFailure()
       ├── removes optimistic message (temp-*)
       ├── removes old error messages (error-*)
       ├── adds new error ChatMessage (error-*)
       ├── sets failedMessageText = "Hello"
       └── calls onError callback (if configured)

2. ChatInput reacts
   ├── failedMessageText watcher fires → inputText = "Hello"
   ├── isSending watcher fires (true→false) → textarea.focus()
   └── input re-enables (isSending = false)

3. User presses Enter (same or edited text)
   └── handleSend()
       ├── captures inputText ("Hello" or edited)
       ├── clears inputText
       └── calls chatState.sendMessage(text)

4. sendMessage succeeds
   ├── filters out tempId only (NOT error-*)  ← CHANGED
   ├── adds serverUserMessage + assistantMessage
   ├── failedMessageText = null
   └── error message REMAINS in history
```

### Naming Conventions (Enforce)

- **Component files:** PascalCase (`MessageBubble.vue`)
- **CSS classes:** BEM with `nc-` prefix (`nc-message-bubble`, `nc-message-bubble--error`)
- **Event handlers:** `handle` prefix (`handleSend`)
- **Boolean computeds:** `is`/`has` prefix (`isError`, `isSending`)
- **Tests:** `.test.ts` suffix, co-located `__tests__/` folder
- **Imports:** Use `@/` path alias — never relative paths

### Testing Requirements

**Baseline: 181 existing tests must continue to pass** (except the one test being intentionally modified for AC#6).

**Test Strategy: One code change + verify existing behavior + add missing test coverage.**

**Required Test Modifications in `src/composables/__tests__/useChat.test.ts`:**

```
// MODIFY existing test:
it('preserves error messages in history on successful send')
// Was: 'cleans up previous error messages on successful send'
// Change: verify error message REMAINS, not removed
```

**Required New Tests in `src/composables/__tests__/useChat.test.ts`:**

```
describe('message retry and error recovery', () => {
  // AC#2: Retry with same text
  it('retry succeeds and clears failedMessageText')

  // AC#3: Edited retry
  it('user can send edited text after failure — treated as new message')

  // AC#4: Chat functional after error
  it('chat remains functional after error — can send new messages')
  it('close and reopen after error works normally')

  // AC#5: History loading resilience
  it('hasMore stays true after loadMore failure — user can retry')

  // AC#6: Error messages preserved
  it('error message remains in history after successful resend')
  it('multiple errors followed by success — only last error remains, plus success messages')
})
```

**Required New Tests in `src/components/__tests__/ChatInput.test.ts`:**

```
describe('retry and error recovery', () => {
  // AC#1: Focus restoration
  it('restores focus to textarea when isSending transitions true→false')

  // AC#3: Edited retry
  it('user can edit pre-populated failed text and send edited version')
})
```

**Required New Tests in `src/components/__tests__/SendReceiveFlow.test.ts`:**

```
describe('Message Retry Flow Integration', () => {
  it('full retry flow: send → fail → error shown → input pre-filled → retry → success → error in history')
})
```

**Test Utilities Available:**
- `createMockApiClient()` — returns `vi.fn()` for each API method
- `createMockChatState()` — manual construction of `UseChatReturn` mock
- `mountChatInput()` — encapsulates Vuetify + provide setup
- `flushPromises()` from `@vue/test-utils` for async assertion

### Previous Story Intelligence

**From Story 4.1 (Error Display as Chat Messages) — immediately preceding story:**
- 181 Vitest tests pass, build succeeds (29.35 kB gzip), lint clean
- Error infrastructure fully operational: `getErrorContent()`, `handleSendFailure()`, error ChatMessage with `status: 'failed'`
- `handleSendFailure()` extracted as DRY helper — handles both conversation-creation failure and sendMessage failure
- `onError` callback wrapped in `Promise.resolve().catch()` for async safety
- Error messages hide "AI Assistant" header (star icon + label) via `v-if="!isError"` in MessageBubble
- Error messages use theme token for border color: `rgba(var(--v-theme-on-surface), 0.12)`
- 7 pre-existing lint warnings — **don't try to fix them**
- `dist/` is tracked in git — run `yarn build` and commit dist/ changes if source changes

**From Story 3.1 (Infinite Scroll):**
- ResizeObserver polyfill in `vitest.setup.ts` required for Vuetify components in jsdom
- Inject keys cast: `{ [CHAT_STATE_KEY as symbol]: chatState }` — `as symbol` required
- Scroll container is `v-infinite-scroll`'s root `$el`
- loadMore() test: mock getMessages after open to avoid call count interference

**Key Learnings for This Story:**
1. **Read existing tests first** — many retry/recovery tests already exist from Stories 2.4 and 4.1
2. **Only ONE code change** — remove `!m.id.startsWith('error-')` from sendMessage success filter
3. **Modify ONE existing test** — change error cleanup assertion to error preservation assertion
4. **Use `mockRejectedValueOnce()` then `mockResolvedValue()`** for fail-then-succeed retry tests
5. **Run `yarn build` and commit dist/` if source changes** — dist/ is tracked

### Git Intelligence

Recent commits follow `feat: {description} (Story X.Y)` convention. This story's commit should be:
```
feat: add message retry and error recovery with error history preservation (Story 4.2)
```

Last 5 commits:
- `9e57a4f` feat: add error display as chat messages with status code mapping and tests (Story 4.1)
- `cfaf9c4` chore: add test-results to gitignore
- `a79c2f5` feat: add 1000-message scroll performance benchmark with Playwright (Story 3.2)
- `06ebf77` feat: add infinite scroll with history loading and scroll position preservation (Story 3.1)
- `18c2388` feat: add send/receive message flow with optimistic UI and focus management (Story 2.4)

Clean linear history on master branch.

### Latest Tech Information

**No new libraries or APIs required for this story.** All technologies are already in use and stable.

**No web research needed** — this story exercises existing infrastructure with one minor behavior change.

### Project Context Reference

**Read `_bmad-output/project-context.md` before implementing.** Key rules relevant to this story:

- **Error handling:** Errors are `ChatMessage` objects (id: `error-*`), not separate UI. Send failure: remove optimistic msg → error inline → `failedMessageText` repopulates input
- **Error preservation (NEW in this story):** Error messages remain in chat history after successful resend — they serve as a record
- **History failure:** Silent, user retries by scrolling
- **CSS isolation:** All four layers required: `@layer native-chat`, `<style scoped>`, `nc-` prefix, `<v-theme-provider>`
- **Testing:** Co-located `__tests__/` folder, `.test.ts` suffix, globals enabled, mount helper pattern
- **Never do:** `reactive()` for state, `<style>` without scoped, hardcoded colors, string inject keys, direct API calls from components

### References

- [Source: architecture.md#Error & Loading Patterns] — Error-as-message pattern, failedMessageText retry, onError callback, silent history failure
- [Source: architecture.md#State Patterns] — useChat() composable structure, readonly refs, message lifecycle state machine ('sending' → 'sent' | 'failed')
- [Source: architecture.md#Component Boundaries] — MessageBubble is pure display, ChatInput reads failedMessageText, useChat centralizes error handling
- [Source: architecture.md#CSS Patterns] — @layer native-chat, no !important, scoped styles, theme tokens
- [Source: epics.md#Story 4.2] — Acceptance criteria, FR25/FR26/FR27 coverage
- [Source: epics.md#Epic 4] — Error Handling & Recovery overview, failedMessageText mechanism, no-reload recovery
- [Source: prd.md#FR25] — System can handle network failures during message history loading without crashing
- [Source: prd.md#FR26] — User can retry sending a failed message or compose a new message after failure
- [Source: prd.md#FR27] — System can recover from errors without page reload — input re-enables, user can compose new messages
- [Source: ux-design-specification.md#Journey 2] — Error Recovery flow: optimistic message removed, error inline, input pre-filled, retry via Enter
- [Source: ux-design-specification.md#Error Recovery Pattern] — On send failure: input re-populated, errors as chat messages not system UI
- [Source: ux-design-specification.md#Emotional Design] — "Errors are conversations, not crises", calm patience, no dead ends
- [Source: project-context.md#Error handling] — Errors are ChatMessage objects (id: error-*), send failure removes optimistic msg
- [Source: project-context.md#Critical Don't-Miss Rules] — CSS isolation layers, no hardcoded colors, no direct API calls from components
- [Source: 4-1-error-display-as-chat-messages.md] — 181 tests baseline, handleSendFailure helper, async-safe onError, error border uses theme token
- [Source: 4-1-error-display-as-chat-messages.md#File List] — useChat.ts modified (handleSendFailure), MessageBubble.vue modified (header hiding, theme token)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

No issues encountered. Single code change applied cleanly, all existing tests continued to pass after modification.

### Completion Notes List

- Task 1: Removed `!m.id.startsWith('error-')` from `sendMessage()` success filter in `useChat.ts` (line 157). Error messages now persist in history as records after successful resend (AC#6). Existing `handleSendFailure()` still replaces old errors on consecutive failures — verified by existing test.
- Task 2: All retry/recovery infrastructure verified in `ChatInput.vue` and `useChat.ts` — failedMessageText watch, input re-enable via isSending, focus restoration via isSending watcher, handleSend() supporting both retry and edited text, retry() method clearing failedMessageText before calling sendMessage.
- Task 3: Silent history loading failure verified in `useChat.ts` loadMore() — empty catch block, hasMore unchanged on failure, isLoading reset in finally block. MessageList calls `done('ok')` after silent failure since loadMore() never throws.
- Task 4: Added 8 new tests across 3 test files — 5 in useChat.test.ts (edited retry, functional after error, loadMore resilience, error preservation, multiple errors), 2 in ChatInput.test.ts (focus restoration, edited retry), 1 integration test in SendReceiveFlow.test.ts (full retry flow).
- Task 5: 189 tests pass (181 existing + 8 new), build succeeds at 29.34 kB gzip, lint clean.

### Change Log

- 2026-02-21: Implemented Story 4.2 — preserved error messages in chat history on successful resend, verified retry/recovery infrastructure, added 8 tests covering all ACs
- 2026-02-21: Code review fixes — fixed consecutive same-text failure bug in handleSendFailure (failedMessageText watcher not firing), fixed stale comment, replaced duplicate test with same-text consecutive failure test

### File List

- `src/composables/useChat.ts` — Modified: removed `!m.id.startsWith('error-')` from sendMessage success filter; fixed handleSendFailure to reset failedMessageText before re-setting (ensures watcher fires on same-text consecutive failures); fixed stale comment
- `src/composables/__tests__/useChat.test.ts` — Modified: renamed/updated existing error cleanup test, added 5 new retry/recovery tests (replaced duplicate error-preservation test with same-text consecutive failure test)
- `src/components/__tests__/ChatInput.test.ts` — Modified: added 2 new tests (focus restoration after error, edited retry send)
- `src/components/__tests__/SendReceiveFlow.test.ts` — Modified: added 1 integration test (full retry flow)
- `dist/native-chat-vue.es.js` — Regenerated by build
