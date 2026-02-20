# Story 4.1: Error Display as Chat Messages

Status: done

Epic: 4 — Error Handling & Recovery
Date: 2026-02-20
Depends on: Stories 2.1–2.4 (useChat composable, MessageBubble, ChatInput — all complete)

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want errors to appear as calm messages in the chat stream,
so that I understand something went wrong without feeling alarmed or losing my place.

## Acceptance Criteria

1. **Given** the user sends a message and the API request fails (network error, HTTP 4xx/5xx) **When** the error is caught in `useChat()` **Then** the optimistic user message is removed from the message list **And** an error message appears inline in the chat as a `MessageBubble` with `variant="error"` **And** the error message is left-aligned, using the same visual container as assistant messages **And** the error text is calm and informational (e.g., "Something went wrong. You can try sending your message again.") **And** there are no red backgrounds, alert icons, or exclamation marks

2. **Given** the API returns specific HTTP status codes **When** the error is mapped in `useChat()` **Then** 429 maps to a rate-limit message **And** 503/504 maps to a service unavailable message **And** other errors map to a generic error message

3. **Given** the `onError` callback is configured in plugin options **When** any API error occurs **Then** the `onError(error: ChatError)` callback is invoked with the error details **And** the inline error message still displays regardless of the callback

4. **Given** an error message is rendered **When** a screen reader encounters it **Then** the error message is announced via the existing `aria-live="polite"` region **And** the message has an appropriate `aria-label` indicating it is an error

## Tasks / Subtasks

- [x] Task 1: Verify and harden error message creation in useChat.ts (AC: #1, #2)
  - [x] 1.1 Verify `getErrorContent()` maps status codes correctly: 429 → rate-limit message, 503/504 → service unavailable, others → generic "Something went wrong. You can try sending your message again."
  - [x] 1.2 Verify error messages are created as `ChatMessage` objects with `role: 'assistant'`, ID pattern `error-${Date.now()}`, and the translated error text content
  - [x] 1.3 Verify optimistic user message is removed from the messages array before the error message is added
  - [x] 1.4 Verify `failedMessageText` is populated with the original user message text on send failure
  - [x] 1.5 Verify `isSending` resets to `false` and input re-enables after error

- [x] Task 2: Verify and harden onError callback invocation (AC: #3)
  - [x] 2.1 Verify `config.onError(chatError)` is called with a `ChatError` object containing `message`, `statusCode`, and `originalError` when an API error occurs
  - [x] 2.2 Verify the inline error message displays regardless of whether `onError` is configured
  - [x] 2.3 Verify `onError` callback errors are caught silently (callback failure must not break the chat)

- [x] Task 3: Verify MessageBubble error variant rendering (AC: #1, #4)
  - [x] 3.1 Verify MessageBubble detects error messages via `isError` computed (`status === 'failed'` OR `id.startsWith('error-')`)
  - [x] 3.2 Verify error messages render left-aligned with the same visual container as assistant messages (no red backgrounds, no alert icons, no exclamation marks)
  - [x] 3.3 Verify error messages render as plain text (no markdown parsing)
  - [x] 3.4 Verify error messages do NOT show the copy button (copy is assistant-only)
  - [x] 3.5 Verify error messages have `aria-label="Error message"` for screen reader accessibility
  - [x] 3.6 Verify error messages are announced via the existing `aria-live="polite"` region on the `<ul>` in MessageList

- [x] Task 4: Write tests for error display flow (AC: #1, #2, #3, #4)
  - [x] 4.1 Test in useChat.test.ts: sendMessage failure removes optimistic message and adds error message to messages array
  - [x] 4.2 Test in useChat.test.ts: error message has correct content for different HTTP status codes (429, 503, 504, generic)
  - [x] 4.3 Test in useChat.test.ts: failedMessageText is populated with original message text on failure
  - [x] 4.4 Test in useChat.test.ts: onError callback is invoked with ChatError details
  - [x] 4.5 Test in useChat.test.ts: onError callback failure does not break error flow
  - [x] 4.6 Test in MessageBubble.test.ts: error variant renders left-aligned, plain text, no copy button, correct aria-label
  - [x] 4.7 Test in MessageBubble.test.ts: error variant has `nc-message-bubble--error` class
  - [x] 4.8 Integration test: full send-fail-error-display flow with mock API client

- [x] Task 5: Run full test suite and build (AC: all)
  - [x] 5.1 Run `yarn test` — all 162 existing tests + 18 new tests pass (180 total)
  - [x] 5.2 Run `yarn build` — build succeeds, bundle size 29.37 kB gzip (within 50KB budget)
  - [x] 5.3 Run `yarn lint` — no new lint errors

## Dev Notes

### CRITICAL: Most Error Infrastructure Already Exists

**This story is primarily a VERIFICATION and TESTING story, not a greenfield implementation.**

The error-as-chat-message pattern was implemented during Story 2.4 (Send & Receive Message Flow). Here is what already exists in the codebase:

**In `src/composables/useChat.ts`:**
- `getErrorContent(error)` function (lines ~21-32) — already maps HTTP status codes to user-friendly messages
- `sendMessage()` catch block (lines ~149-176) — already removes optimistic message, creates error ChatMessage, populates `failedMessageText`, calls `config.onError`
- Error messages created with `role: 'assistant'`, `id: error-${Date.now()}`
- `retry()` method already exists and calls `sendMessage()` with stored `failedMessageText`

**In `src/components/MessageBubble.vue`:**
- `isError` computed already detects error messages via dual check (`status === 'failed'` OR `id.startsWith('error-')`)
- Error messages already render left-aligned (same as assistant) with `nc-message-bubble--error` class
- Error messages already render as plain text (no markdown)
- Copy button already excluded for error messages
- `aria-label="Error message"` already set for error variant

**In `src/types/chat.ts`:**
- `ChatError` type already defined with `message`, `statusCode?`, `originalError?`
- `MessageStatus` includes `'failed'`

**What the dev agent must do:**
1. **Read the existing implementation** carefully — do NOT rewrite what already works
2. **Verify** each acceptance criterion against the existing code
3. **Fix any gaps** found during verification (e.g., if error messages lack `status: 'failed'` field)
4. **Write comprehensive tests** for all error display behavior — this is the primary deliverable
5. **Ensure the onError callback** is properly guarded against callback errors

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

### Error Handling Architecture (from architecture.md)

- **Errors are NOT separate UI** — error messages are `ChatMessage` objects rendered as `MessageBubble` with `variant="error"`. They live in the messages array alongside user and assistant messages
- **Error message lifecycle:** API error caught in `useChat()` → optimistic message removed → error ChatMessage created with `role: 'assistant'` and `id: error-*` → `failedMessageText` populated → `onError` callback invoked
- **Error message tone:** Calm, informational, neutral. No red backgrounds, no alert icons, no exclamation marks. Same visual container as assistant messages
- **HTTP status code mapping:** 429 → rate-limit message, 503/504 → service unavailable, all others → generic "Something went wrong. You can try sending your message again."
- **onError callback:** Optional `(error: ChatError) => void` in plugin config. Called on every API error, regardless of inline display. Must be wrapped in try/catch to prevent callback errors from breaking the chat
- **History fetch errors are NOT part of this story** — history fetch failure is silent (loading indicator disappears, no error message). That behavior is already implemented in `loadMore()` and is Story 4.2 territory for the retry mechanism

### Architecture Compliance Checklist

**Error-as-Message Pattern (architecture.md#Error & Loading Patterns):**
- [ ] Error messages are `ChatMessage` objects in the `messages` array — not toasts, modals, or banners
- [ ] Error messages have `role: 'assistant'` — they appear in the assistant column (left-aligned)
- [ ] Error messages use `id: error-*` prefix — enables detection without a dedicated role
- [ ] Error rendering uses `MessageBubble` with `variant="error"` — same component, different variant
- [ ] On send failure: optimistic message removed → error message added → input re-populated via `failedMessageText`
- [ ] On history fetch failure: silent (NOT part of this story — already handled)

**State Management (architecture.md#State Patterns):**
- [ ] All error state managed in `useChat()` composable — components never catch API errors directly
- [ ] `failedMessageText: Readonly<Ref<string | null>>` exposed as readonly ref
- [ ] Error messages added via mutation of internal `messages` ref — components observe reactively
- [ ] No component-local error state — single source of truth in `useChat()`

**Component Boundaries (architecture.md#Component Boundaries):**
- [ ] `MessageBubble` is a pure display component — receives message via props, no state injection needed for error rendering
- [ ] `MessageList` renders all messages (including errors) identically via `v-for` — no special error filtering
- [ ] `ChatInput` reads `failedMessageText` from injected state — pre-populates on error (Story 4.2 scope, but verify the ref exists)
- [ ] `useChat()` is the only place that calls `apiClient` methods — error catching is centralized

**CSS Isolation (architecture.md#CSS Patterns):**
- [ ] Error message styling uses `nc-message-bubble--error` class within `@layer native-chat`
- [ ] No new colors needed — error messages use the same assistant bubble styling (white background, border)
- [ ] No red, no alert colors — calm, neutral presentation per UX spec

**Accessibility (architecture.md + ux-design-specification.md):**
- [ ] Error messages announced via existing `aria-live="polite"` on the `<ul>` message list
- [ ] Error messages have `aria-label="Error message"` on the `<li>` wrapper
- [ ] No focus trap introduced — error state doesn't change focus management
- [ ] After error: focus stays on input field (handled by ChatInput's existing focus logic)

### Library & Framework Requirements

**No new dependencies for this story.** All required libraries are already installed.

**Vue 3.5+ Patterns Used:**
- `ref()`, `readonly()`, `computed()` for reactive error state
- `provide/inject` with `InjectionKey<T>` for typed state distribution
- `<script setup lang="ts">` for all component modifications
- `nextTick()` if DOM assertions needed after error message renders

**Vuetify 3.11+ Components Used:**
- `MessageBubble` uses no Vuetify components directly for error rendering — it's a custom styled `<li>` element
- Error messages styled with CSS classes (`nc-message-bubble--error`), not Vuetify utility classes
- No new Vuetify components needed

**Vitest 4.0+ / @vue/test-utils 2.4+ Testing Patterns:**
- `vi.fn().mockRejectedValue(new Error('...'))` for simulating API failures
- `vi.fn().mockRejectedValueOnce(...)` for one-shot error scenarios
- `await flushPromises()` or `await nextTick()` for async error handling flows
- Globals enabled: `describe`, `it`, `expect`, `vi` available without imports
- Mount helper pattern: `mount{ComponentName}()` encapsulates Vuetify + provide setup
- Inject keys cast: `{ [CHAT_STATE_KEY as symbol]: chatState }` — `as symbol` required

**Error Simulation in Tests:**
```typescript
// Mock API client that fails on sendMessage
const mockApiClient = {
  sendMessage: vi.fn().mockRejectedValue(
    Object.assign(new Error('Server Error'), { response: { status: 503 } })
  ),
  // ... other methods
}

// For testing HTTP status code mapping
const error429 = Object.assign(new Error('Too Many Requests'), {
  response: { status: 429 },
})
const error503 = Object.assign(new Error('Service Unavailable'), {
  response: { status: 503 },
})
```

**Critical: Error Object Shape**
The `getErrorContent()` function in `useChat.ts` inspects `error.statusCode` to determine the HTTP status code. Test mocks must attach a `.statusCode` property to the error object to test status-specific messaging.

### File Structure Requirements

**Files to verify and potentially modify:**

| File | Action | Purpose |
|------|--------|---------|
| `src/composables/useChat.ts` | **Verify** | Error handling in `sendMessage()`, `getErrorContent()`, `onError` callback invocation. Fix gaps if found (e.g., missing `status: 'failed'` on error messages) |
| `src/components/MessageBubble.vue` | **Verify** | Error variant detection (`isError`), left-aligned rendering, plain text, no copy button, aria-label |
| `src/types/chat.ts` | **Verify** | `ChatError` type, `MessageStatus` includes `'failed'` |
| `src/types/config.ts` | **Verify** | `onError` callback in `NativeChatPluginOptions` |

**Files to update with new tests:**

| File | Action | Purpose |
|------|--------|---------|
| `src/composables/__tests__/useChat.test.ts` | **Update** | Add tests for error message creation, status code mapping, failedMessageText, onError callback |
| `src/components/__tests__/MessageBubble.test.ts` | **Update** | Add tests for error variant rendering, styling, accessibility |

**Files that should NOT be modified:**

| File | Reason |
|------|--------|
| `src/components/MessageList.vue` | Already renders all messages (including errors) via `v-for` — no changes needed |
| `src/components/ChatInput.vue` | `failedMessageText` pre-population is Story 4.2 scope |
| `src/components/ChatPanel.vue` | No error-specific behavior needed |
| `src/plugin.ts` | Plugin install unchanged |
| `src/keys.ts` | No new injection keys needed |
| `src/types/api.ts` | API client interface unchanged |

**No new files to create.**

**No new dependencies to add.**

### Component Interaction Map

```
NativeChatWidget (root — provides CHAT_STATE_KEY)
  ├── FloatingButton (toggle open/close)
  └── ChatPanel (v-navigation-drawer)
       ├── ChatHeader (close button)
       ├── .nc-chat-panel__body
       │    ├── Loading spinner (when isLoading && no messages)
       │    ├── WelcomeState (when messages empty && !isLoading && !isSending)
       │    └── MessageList (when messages exist)
       │         └── v-infinite-scroll
       │              └── <ul> message list (aria-live="polite")
       │                   ├── MessageBubble (role="user")
       │                   ├── MessageBubble (role="assistant")
       │                   └── MessageBubble (variant="error") ← THIS STORY VERIFIES
       └── ChatInput (always visible when panel open)
            └── reads failedMessageText ← POPULATED BY THIS STORY'S ERROR FLOW
```

### Naming Conventions (Enforce)

- **Component files:** PascalCase (`MessageBubble.vue`)
- **CSS classes:** BEM with `nc-` prefix (`nc-message-bubble`, `nc-message-bubble--error`)
- **Event handlers:** `handle` prefix (`handleSend`)
- **Boolean computeds:** `is`/`has` prefix (`isError`, `isSending`)
- **Tests:** `.test.ts` suffix, co-located `__tests__/` folder
- **Imports:** Use `@/` path alias — never relative paths

### Testing Requirements

**Baseline: 162 existing tests must continue to pass.** Do not break any existing tests.

**Test Strategy: Verify existing behavior + add missing test coverage.**

Some error handling tests may already exist from Story 2.4. The dev agent must:
1. Read existing tests in `useChat.test.ts` and `MessageBubble.test.ts` first
2. Identify what is already covered vs what is missing
3. Add only the missing test coverage — do not duplicate existing tests

**Required Test Coverage in `src/composables/__tests__/useChat.test.ts`:**

```
describe('error display as chat messages', () => {
  // AC#1: Error message creation
  it('removes optimistic message on send failure')
  it('adds error message to messages array on send failure')
  it('error message has role assistant and id starting with error-')
  it('error message content is user-friendly text, not raw error')
  it('populates failedMessageText with original message on failure')
  it('resets isSending to false after error')

  // AC#2: HTTP status code mapping
  it('maps 429 error to rate-limit message')
  it('maps 503 error to service unavailable message')
  it('maps 504 error to service unavailable message')
  it('maps unknown error to generic error message')
  it('maps network error (no status code) to generic error message')

  // AC#3: onError callback
  it('calls onError callback with ChatError on send failure')
  it('ChatError contains message, statusCode, and originalError')
  it('displays inline error even when onError is not configured')
  it('survives onError callback throwing an error')
})
```

**Required Test Coverage in `src/components/__tests__/MessageBubble.test.ts`:**

```
describe('error variant', () => {
  // AC#1: Visual rendering
  it('renders error message left-aligned like assistant messages')
  it('applies nc-message-bubble--error class')
  it('renders error content as plain text, not markdown')
  it('does not show copy button for error messages')
  it('does not show assistant label/icon for error messages')

  // AC#4: Accessibility
  it('has aria-label="Error message"')
  it('renders as li with role="listitem"')
})
```

**Test Utilities Available:**
- `createMockApiClient()` — returns `vi.fn()` for each API method
- `createMockChatState()` or manual construction of `UseChatReturn` mock
- `mount{ComponentName}()` helper encapsulating Vuetify + provide setup
- `flushPromises()` from `@vue/test-utils` for async assertion

**Critical Test Pattern — Error Object with HTTP Status:**
```typescript
// The error must have .response.status for status code mapping
const apiError = Object.assign(new Error('Bad Request'), {
  response: { status: 429 },
})
mockApiClient.sendMessage.mockRejectedValueOnce(apiError)
```

**Critical Test Pattern — onError Callback:**
```typescript
const onError = vi.fn()
const config = { apiClient: mockApiClient, onError }
// ... setup useChat with config
// ... trigger sendMessage failure
expect(onError).toHaveBeenCalledWith(
  expect.objectContaining({
    message: expect.any(String),
    statusCode: 429,
    originalError: expect.any(Error),
  })
)
```

### Previous Story Intelligence

**From Story 3.2 (Performance Validation) — most recent completed story:**
- 162 Vitest tests pass, build succeeds (102.84 kB / 29.33 kB gzip), lint clean
- 7 pre-existing lint warnings — **don't try to fix them**
- No `src/` changes in Story 3.2 — benchmark exists in `docs/` and `perf/` only
- Vuetify components need explicit imports in VitePress theme (`vuetify/components`, `vuetify/directives`)
- `dist/` is tracked in git — run `yarn build` and commit dist/ changes if source changes

**From Story 3.1 (Infinite Scroll) — last story that modified `src/`:**
- ResizeObserver polyfill in `vitest.setup.ts` — required for Vuetify's VProgressCircular in jsdom
- Inject keys cast: `{ [CHAT_STATE_KEY as symbol]: chatState }` — `as symbol` required in test provide
- Full mock state: construct complete `UseChatReturn` with `readonly(ref(...))` + `vi.fn()` for actions
- Async mocks: `vi.fn().mockResolvedValue(...)` for API responses
- Scroll container is `v-infinite-scroll`'s root `$el` — not the `<ul>` inside it
- ChatPanel and SendReceiveFlow tests use `.nc-chat-panel__loader` selector for loading spinner

**From Story 2.4 (Send & Receive Message Flow) — story that implemented error handling:**
- Error handling infrastructure built here: `getErrorContent()`, error message creation, `failedMessageText`, `onError` callback
- 153 tests at the time (now 162 after Stories 3.1–3.2)
- Test microtask flushing — async operations in useChat require `await flushPromises()` in tests
- Error messages are `ChatMessage` objects with `role: 'assistant'`
- VNavigationDrawer requires `vuetify:layout` injection — ChatPanel test wraps in VLayout

**Key Learnings for This Story:**
1. **Read existing error tests first** — Story 2.4 likely added some error handling tests already
2. **Use `flushPromises()`** after triggering `sendMessage()` failures to ensure async error flow completes
3. **Mock API client errors with `.response.status`** for HTTP status code mapping tests
4. **Don't modify dist/ manually** — run `yarn build` if source changes are needed

### Git Intelligence

Recent commits follow `feat: {description} (Story X.Y)` convention. This story's commit should be:
```
feat: add error display as chat messages with status code mapping and tests (Story 4.1)
```

Last 5 commits:
- `cfaf9c4` chore: add test-results to gitignore
- `a79c2f5` feat: add 1000-message scroll performance benchmark with Playwright (Story 3.2)
- `06ebf77` feat: add infinite scroll with history loading and scroll position preservation (Story 3.1)
- `18c2388` feat: add send/receive message flow with optimistic UI and focus management (Story 2.4)
- `991ee22` feat: add chat input with auto-expanding textarea and send button (Story 2.3)

10 clean commits (Stories 1.1–3.2), no merge conflicts, no reverted commits, no hotfixes. Clean linear history on master branch.

### Latest Tech Information

**No new libraries or APIs required for this story.** All technologies are already in use and stable:

- **Vue 3.5+** — `ref()`, `readonly()`, `computed()` patterns well-established in codebase
- **Vuetify 3.11+** — No Vuetify-specific error components used; MessageBubble is custom CSS
- **Vitest 4.0+** — `mockRejectedValue()`, `mockRejectedValueOnce()` for error simulation
- **TypeScript 5.9+** — Strict mode, all error types already defined in `types/chat.ts`

**No web research needed** — this story exercises existing infrastructure with no external API changes or library updates.

### Project Context Reference

**Read `_bmad-output/project-context.md` before implementing.** Key rules relevant to this story:

- **Error handling:** Errors are `ChatMessage` objects (id: `error-*`), not separate UI. Send failure: remove optimistic msg → error inline → `failedMessageText` repopulates input
- **Security:** All `v-html` content sanitized via DOMPurify — but error messages render as plain text, so no `v-html` for errors
- **CSS isolation:** All four layers required: `@layer native-chat`, `<style scoped>`, `nc-` prefix, `<v-theme-provider>`
- **Testing:** Co-located `__tests__/` folder, `.test.ts` suffix, globals enabled, mount helper pattern
- **Never do:** `reactive()` for state, `<style>` without scoped, hardcoded colors, string inject keys, direct API calls from components

### References

- [Source: architecture.md#Error & Loading Patterns] — Error-as-message pattern, failedMessageText retry, onError callback, silent history failure
- [Source: architecture.md#State Patterns] — useChat() composable structure, readonly refs, message lifecycle state machine ('sending' → 'sent' | 'failed')
- [Source: architecture.md#Component Boundaries] — MessageBubble is pure display, useChat centralizes API calls and error handling
- [Source: architecture.md#CSS Patterns] — @layer native-chat, no !important, scoped styles, theme tokens
- [Source: architecture.md#Implementation Patterns] — Naming conventions, anti-patterns, enforcement guidelines
- [Source: epics.md#Story 4.1] — Acceptance criteria, FR24 coverage
- [Source: epics.md#Epic 4] — Error Handling & Recovery overview, error-as-message pattern, failedMessageText mechanism
- [Source: prd.md#FR24] — System can display error states as messages in the chat when API requests fail
- [Source: prd.md#FR27] — System can recover from errors without page reload — input re-enables, user can compose new messages
- [Source: ux-design-specification.md#Feedback Patterns] — Error feedback: inline chat messages, calm/neutral tone, no red backgrounds, no alert icons
- [Source: ux-design-specification.md#Emotional Design Principles] — "Errors are conversations, not crises"
- [Source: ux-design-specification.md#Journey 2] — Error Recovery flow: optimistic message removed, error inline, input pre-filled
- [Source: project-context.md#Error handling] — Errors are ChatMessage objects (id: error-*), send failure removes optimistic msg
- [Source: project-context.md#Critical Don't-Miss Rules] — CSS isolation layers, no hardcoded colors, no direct API calls from components
- [Source: 3-2-performance-validation.md] — 162 tests baseline, 7 pre-existing lint warnings, dist/ tracked in git
- [Source: 3-1-infinite-scroll-with-history-loading.md] — Inject keys cast pattern, async mock patterns, ResizeObserver polyfill
- [Source: 2-4-send-receive-message-flow.md] — Error handling implementation, flushPromises pattern, VLayout wrapper for ChatPanel tests

## Change Log

- 2026-02-20: Story created by BMad Method create-story workflow. Comprehensive developer guide with verification tasks, testing requirements, and architecture compliance checklist.
- 2026-02-20: Story implemented — verified existing error infrastructure, hardened with `status: 'failed'` on error messages, wrapped `onError` callbacks in try/catch, hid header for error messages, added 18 new tests covering all ACs.
- 2026-02-20: Code review (Claude Opus 4.6 + gpt-5.1-codex) — Fixed 5 issues: (1) HIGH: async onError callback rejection handling via Promise.resolve().catch() pattern, (2) MEDIUM: extracted handleSendFailure() helper to eliminate DRY violation, (3) MEDIUM: replaced hardcoded #ebebed border color with Vuetify theme token, (4) MEDIUM: corrected story documentation about error.statusCode vs error.response?.status, (5) Added 1 new test for async onError resilience. Total: 181 tests pass, build 29.35 kB gzip.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

No debug issues encountered. Clean implementation.

### Completion Notes List

- **Task 1 (Verify useChat.ts error handling):** Verified `getErrorContent()` correctly maps HTTP status codes via `error.statusCode` property (429 → rate-limit, 503/504 → service unavailable, others → generic). Found gap: error messages were missing `status: 'failed'` field. Fixed by adding `status: 'failed'` to both error message creation locations (conversation-creation failure path at line ~114 and sendMessage failure path at line ~166).
- **Task 2 (Harden onError callback):** Found gap: `config.onError()` calls were NOT wrapped in try/catch, violating AC#3 requirement that callback failure must not break the chat. Fixed by wrapping both onError invocations in try/catch blocks with silent catch.
- **Task 3 (Verify MessageBubble error variant):** All error rendering verified working — left-aligned, plain text, no copy button, correct aria-label, aria-live on `<ul>`. Improvement: hid the "AI Assistant" header (star icon + label) for error messages by adding `v-if="!isError"` to the header div, since error messages are system notifications, not AI responses.
- **Task 4 (Write tests):** Added 12 new unit tests in `useChat.test.ts` (error message structure, status codes, onError callback, callback crash resilience), 5 new tests in `MessageBubble.test.ts` (error variant rendering, header hiding, role/listitem), and 1 integration test in `SendReceiveFlow.test.ts` (full end-to-end send-fail-error-display flow). Total: 18 new tests.
- **Task 5 (Validation):** All 180 tests pass (162 existing + 18 new), build succeeds (29.37 kB gzip), lint clean.

### File List

- `src/composables/useChat.ts` — **Modified**: Added `status: 'failed'` to error ChatMessage objects, extracted `handleSendFailure()` helper (DRY), async-safe `onError` via `Promise.resolve().catch()`
- `src/components/MessageBubble.vue` — **Modified**: Added `v-if="!isError"` to header div, replaced hardcoded `#ebebed` border with `rgba(var(--v-theme-on-surface), 0.12)` theme token
- `src/composables/__tests__/useChat.test.ts` — **Modified**: Added `describe('error display as chat messages')` block with 13 tests covering AC#1, AC#2, AC#3 (including async onError resilience)
- `src/components/__tests__/MessageBubble.test.ts` — **Modified**: Added `describe('error variant')` block with 5 new tests covering AC#1, AC#4
- `src/components/__tests__/SendReceiveFlow.test.ts` — **Modified**: Added `describe('Error Display Flow Integration')` block with 1 integration test covering full send-fail-error-display flow
- `dist/native-chat-vue.css` — **Build output**: Regenerated from source changes
- `dist/native-chat-vue.es.js` — **Build output**: Regenerated from source changes
- `dist/types/components/MessageBubble.vue.d.ts.map` — **Build output**: Regenerated type map
- `dist/types/composables/useChat.d.ts.map` — **Build output**: Regenerated type map
