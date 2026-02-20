# Story 2.3: Chat Input & Send Message

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to type a message and send it with Enter or a send button,
so that I can ask questions quickly without extra steps.

## Acceptance Criteria

1. **Given** the chat is open and the input is focused **When** the user types text **Then** the textarea auto-expands vertically up to 6 lines (approximately 120px) **And** beyond 6 lines, the textarea scrolls internally **And** input lag stays below 100ms

2. **Given** the user has typed a message **When** they press Enter **Then** the message is sent via `chatState.sendMessage(text)` **And** the input clears

3. **Given** the user is typing a multi-line message **When** they press Shift+Enter **Then** a newline is inserted (message is NOT sent)

4. **Given** the user has typed a message **When** they click the send button (magenta arrow icon) **Then** the message is sent via `chatState.sendMessage(text)` **And** the input clears

5. **Given** the input field is empty **When** the user presses Enter or clicks the send button **Then** nothing happens (no empty message sent) **And** the send button appears disabled/muted

6. **Given** the chat input is rendered **When** a keyboard user tabs to it **Then** it has `aria-label="Type a message"` **And** the send button has `aria-label="Send message"`

## Tasks / Subtasks

- [x] Task 1: Create `src/icons/IconSend.vue` send arrow icon (AC: #4)
  - [x] 1.1 Create `src/icons/IconSend.vue` -- self-contained SVG icon component following the existing `IconStar.vue` / `IconClose.vue` / `IconCopy.vue` pattern. Use a send/arrow-up-right SVG path. `fill="currentColor"`, `aria-hidden="true"`, `width="1em"` / `height="1em"`, `viewBox="0 0 24 24"`.

- [x] Task 2: Create `src/components/ChatInput.vue` component (AC: #1-#6)
  - [x] 2.1 Create `src/components/ChatInput.vue` as a `<script setup lang="ts">` SFC
  - [x] 2.2 Inject `CHAT_STATE_KEY` to access `sendMessage()`, `isSending`, `failedMessageText` state
  - [x] 2.3 Implement **auto-expanding textarea**:
    - Use `<v-textarea>` with `auto-grow`, `rows="1"`, `max-rows="6"`, `no-resize`
    - Pill-shaped styling: large border-radius (~50px), matching UX spec
    - Placeholder: "Type a message" (matches aria-label)
    - Bind v-model to local `inputText` ref
  - [x] 2.4 Implement **send button**:
    - Render `IconSend` inside a `<v-btn>` with `icon` variant, positioned at the right of the input
    - Button color: `secondary` (magenta `#C4105B`)
    - Disabled when `inputText.trim()` is empty OR `chatState.isSending.value` is true
    - On click: call `handleSend()`
  - [x] 2.5 Implement **keyboard handling**:
    - Attach `@keydown` handler to the textarea
    - **Enter** (without Shift): call `event.preventDefault()` then `handleSend()`
    - **Shift+Enter**: allow default behavior (newline insertion)
    - Guard: if `isSending` is true, ignore Enter
  - [x] 2.6 Implement **handleSend() function**:
    - Return early if `inputText.value.trim()` is empty or `chatState.isSending.value`
    - Store text in local variable, clear `inputText.value` immediately (responsive feel)
    - Call `await chatState.sendMessage(trimmedText)`
    - Keep focus on the textarea after send
  - [x] 2.7 Implement **failedMessageText pre-population**:
    - Watch `chatState.failedMessageText` -- when it changes from null to a string, set `inputText.value` to that string
    - This enables the retry UX from Story 2.4/4.2
  - [x] 2.8 Implement **disabled state during sending**:
    - When `chatState.isSending.value` is true, set textarea to `disabled` and send button to `disabled`
    - Input re-enables automatically when `isSending` becomes false
  - [x] 2.9 **Accessibility**:
    - Textarea: `aria-label="Type a message"`
    - Send button: `aria-label="Send message"`, `aria-disabled` when disabled
    - Visible focus indicator on both elements (Vuetify default)
  - [x] 2.10 **Styling** -- all styles in `<style scoped>` wrapped in `@layer native-chat { }`:
    - Use theme tokens via `rgb(var(--v-theme-{name}))` -- never hardcode hex colors
    - CSS class prefix: `nc-chat-input`
    - Layout: `display: flex; align-items: flex-end; gap: 8px; padding: 12px 16px`
    - Textarea wrapper: pill-shaped border-radius, border color from theme
    - Send button: circular, secondary color, positioned at end of input row

- [x] Task 3: Integrate ChatInput into `src/components/ChatPanel.vue` (AC: #1)
  - [x] 3.1 Import `ChatInput` component
  - [x] 3.2 Place `<ChatInput />` after the `.nc-chat-panel__body` div, as a bottom-pinned sibling in the panel flex layout
  - [x] 3.3 ChatInput should always render when the panel is open (visible alongside WelcomeState, MessageList, or loading state)
  - [x] 3.4 Ensure ChatInput does not flex-grow -- `flex-shrink: 0` so it stays at the bottom

- [x] Task 4: Write tests for ChatInput (AC: #1-#6)
  - [x] 4.1 Create `src/components/__tests__/ChatInput.test.ts`
  - [x] 4.2 Test: renders textarea with `aria-label="Type a message"`
  - [x] 4.3 Test: renders send button with `aria-label="Send message"`
  - [x] 4.4 Test: send button is disabled when input is empty
  - [x] 4.5 Test: send button is enabled when input has text
  - [x] 4.6 Test: pressing Enter calls `sendMessage()` with trimmed text and clears input
  - [x] 4.7 Test: pressing Shift+Enter does NOT call `sendMessage()` (newline allowed)
  - [x] 4.8 Test: clicking send button calls `sendMessage()` with trimmed text and clears input
  - [x] 4.9 Test: empty input + Enter does not call `sendMessage()`
  - [x] 4.10 Test: send button and textarea disabled when `isSending` is true
  - [x] 4.11 Test: `failedMessageText` pre-populates the input field
  - [x] 4.12 Test: `failedMessageText` being cleared does not empty user-typed text

- [x] Task 5: Update ChatPanel tests and run full test suite
  - [x] 5.1 Update `src/components/__tests__/ChatPanel.test.ts` -- add test: renders ChatInput component when panel is open
  - [x] 5.2 Run `yarn test` -- all tests pass (existing 119 tests + new tests)
  - [x] 5.3 Run `yarn build` -- verify build succeeds
  - [x] 5.4 Run `yarn lint` -- verify no new lint errors

## Dev Notes

### Critical Architecture Constraints

- **TypeScript strict mode** -- all files compile under `"strict": true`. Use `defineProps<T>()` for component interfaces
- **Symbol-based provide/inject** -- import `CHAT_STATE_KEY` from `@/keys`. Never use string keys. `inject(CHAT_STATE_KEY)!` returns typed `UseChatReturn`
- **No reactive() for top-level state** -- use individual `ref()` values per architecture mandate
- **No hardcoded colors** -- use Vuetify theme tokens via `rgb(var(--v-theme-{name}))`. Colors are defined in `src/theme/nativeChatTheme.ts`
- **No !important in CSS** -- use wrapper elements or specificity for overrides
- **@layer native-chat** -- wrap ALL `<style scoped>` content in `@layer native-chat { }`
- **v-theme-provider** -- all plugin content already wrapped at NativeChatWidget root level. Theme tokens are available in all child components
- **ESM-only** -- all imports/exports use ES modules
- **No icon font dependency** -- self-contained SVG components in `src/icons/`. Follow existing `IconStar.vue` / `IconClose.vue` pattern exactly
- **State access via inject only** -- ChatInput injects `CHAT_STATE_KEY` for state. Reads `isSending`, `failedMessageText`; calls `sendMessage()` action
- **No direct state mutation** -- components read readonly refs from `UseChatReturn`. Actions must go through `useChat()` action functions
- **Yarn v4 Berry** -- use `yarn` exclusively (not npm)
- **@/* path alias** -- configured in tsconfig, vite, and vitest. Use `@/keys`, `@/types/chat`, `@/icons/IconSend.vue`, etc.
- **ESLint 10 flat config** -- `eslint.config.ts` (not `.eslintrc.cjs`)

### ChatInput Component Implementation

**Vuetify `v-textarea` auto-grow behavior:**

```typescript
// ChatInput.vue
const inputText = ref('')
const textareaRef = ref<InstanceType<typeof VTextarea> | null>(null)

const canSend = computed(() => inputText.value.trim().length > 0 && !chatState.isSending.value)

async function handleSend() {
  const text = inputText.value.trim()
  if (!text || chatState.isSending.value) return
  inputText.value = ''  // Clear immediately for responsive feel
  await chatState.sendMessage(text)
  // Focus remains on textarea (v-textarea keeps focus after clear)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
  // Shift+Enter: default behavior (newline) -- no interception needed
}
```

**Template pattern:**

```vue
<template>
  <div class="nc-chat-input">
    <v-textarea
      ref="textareaRef"
      v-model="inputText"
      auto-grow
      :rows="1"
      :max-rows="6"
      no-resize
      hide-details
      variant="outlined"
      density="compact"
      placeholder="Type a message"
      aria-label="Type a message"
      :disabled="chatState.isSending.value"
      class="nc-chat-input__textarea"
      @keydown="handleKeydown"
    />
    <v-btn
      icon
      variant="flat"
      color="secondary"
      size="small"
      :disabled="!canSend"
      aria-label="Send message"
      class="nc-chat-input__send-btn"
      @click="handleSend"
    >
      <IconSend />
    </v-btn>
  </div>
</template>
```

**CRITICAL `v-textarea` notes for Vuetify 3.11.8:**
- `auto-grow` + `rows="1"` starts at 1 row and expands as user types
- `max-rows="6"` caps expansion at 6 rows (~120px), then internal scroll kicks in
- `no-resize` prevents manual resize handle
- `hide-details` removes the message/hint area below the field (saves vertical space)
- `variant="outlined"` gives a visible border for the pill-shaped styling
- `density="compact"` reduces padding for chat-appropriate sizing
- `@keydown` on `v-textarea` attaches to the inner `<textarea>` element

**failedMessageText watcher:**

```typescript
watch(
  () => chatState.failedMessageText.value,
  (newText) => {
    if (newText) {
      inputText.value = newText
    }
  }
)
```

This watcher pre-populates the input when a send fails (Story 2.4/4.2 integration). It only sets text when `failedMessageText` transitions to a non-null value. It does NOT clear user-typed text when `failedMessageText` resets to null.

### ChatPanel Integration

**Current ChatPanel structure (from `src/components/ChatPanel.vue`):**

```
<v-navigation-drawer>
  <div class="nc-chat-panel">
    <ChatHeader />
    <div class="nc-chat-panel__body">
      [Loading spinner | WelcomeState | MessageList]
    </div>
    <!-- ADD ChatInput HERE - after body, before closing nc-chat-panel -->
    <ChatInput />
  </div>
</v-navigation-drawer>
```

**Key layout facts:**
- `.nc-chat-panel` is `display: flex; flex-direction: column; height: 100%`
- `.nc-chat-panel__body` is `flex: 1; overflow: hidden`
- ChatInput must be `flex-shrink: 0` to stay pinned at the bottom
- ChatInput renders **always when panel is open** -- visible alongside WelcomeState, loading state, or MessageList
- Do NOT conditionally hide ChatInput based on loading or empty state

### useChat() sendMessage Interface

**From `src/composables/useChat.ts`:**

```typescript
async function sendMessage(text: string): Promise<void> {
  // Guards: empty text, already sending, no conversationId
  if (!text.trim() || isSending.value || !conversationId.value) return

  isSending.value = true
  failedMessageText.value = null

  // 1. Optimistic message added with status: 'sending'
  // 2. API call: apiClient.sendMessage(conversationId, text)
  // 3. On success: replace optimistic → 'sent', add assistant response
  // 4. On failure: remove optimistic, add error message, set failedMessageText = text
  // 5. isSending = false in finally block
}
```

**ChatInput only calls `sendMessage(text)` -- all optimistic UI, error handling, and state transitions happen inside `useChat()`.** ChatInput does NOT need to handle API errors or message lifecycle directly.

### Icon Pattern (FOLLOW EXACTLY)

From `src/icons/IconStar.vue`:
```vue
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="..." />
  </svg>
</template>
```

**IconSend.vue must follow this pattern exactly.** Use `fill="currentColor"` so the icon inherits color from the `v-btn` parent. No props needed (size controlled by parent `v-btn`). Use a standard send/paper-plane/arrow-up SVG path.

### Theme Color Reference (from `nativeChatTheme.ts`)

| Token | Value | Usage in ChatInput |
|-------|-------|-------------------|
| `--v-theme-secondary` | `#C4105B` (magenta) | Send button background |
| `--v-theme-on-secondary` | `#FFFFFF` (white) | Send button icon color |
| `--v-theme-on-surface` | `#002B38` (dark teal) | Input text color |
| `--v-theme-surface` | `#FFFFFF` (white) | Input background |
| `--v-theme-on-surface` with opacity | ~`#727272` | Placeholder text (via Vuetify's default) |

**Border colors:**
- Default border: `#CCCCD1` (from UX spec -- input field border)
- Use Vuetify's outlined variant which handles border automatically via theme
- Override border-radius to achieve pill shape

### Styling Approach

```css
@layer native-chat {
  .nc-chat-input {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 12px 16px;
    flex-shrink: 0; /* Stay pinned at bottom */
  }

  .nc-chat-input__textarea {
    flex: 1;
  }

  /* Override v-textarea border-radius for pill shape */
  .nc-chat-input__textarea :deep(.v-field) {
    border-radius: 24px;
  }

  /* Ensure internal textarea scrolls after max-rows */
  .nc-chat-input__textarea :deep(textarea) {
    max-height: 120px; /* ~6 lines fallback */
  }

  .nc-chat-input__send-btn {
    flex-shrink: 0;
    margin-bottom: 2px; /* Align with textarea baseline */
  }
}
```

**CRITICAL: Use `:deep()` to penetrate Vuetify's scoped component styles.** The `v-textarea` renders a complex internal DOM; border-radius must target `.v-field` inside it.

### Previous Story (2.2) Learnings

- **CHAT_STATE_KEY is typed as `InjectionKey<UseChatReturn>`** -- `inject(CHAT_STATE_KEY)!` returns fully typed state. No untyped casts needed.
- **`sendMessage()` is async** -- it returns `Promise<void>`, handles optimistic UI internally
- **`isSending` ref** -- true while waiting for API response. ChatInput should disable input and button when true.
- **`failedMessageText` ref** -- `string | null`. Set to the failed message text on send error; null otherwise. ChatInput should watch this and pre-populate input.
- **VNavigationDrawer requires vuetify:layout injection** -- ChatPanel test setup wraps in `VLayout`. ChatInput tests do NOT need VLayout (ChatInput does not use v-navigation-drawer).
- **119 tests pass, build succeeds, lint clean** -- this is the baseline for regression testing
- **dist/ tracked in git** -- run `yarn build` and commit dist/ after implementation
- **7 pre-existing lint warnings** -- don't try to fix them
- **Test microtask flushing** -- async operations in useChat require `await Promise.resolve()` or `await flushPromises()` in tests
- **Error messages are ChatMessage objects with `role: 'assistant'`** -- they appear in the messages array. No separate error handling needed in ChatInput.
- **ChatPanel body layout** -- `.nc-chat-panel__body` is `display: flex; flex-direction: column; flex: 1; overflow: hidden`. ChatInput goes OUTSIDE this div.

### Git Intelligence (Recent Commits)

```
e27c78e feat: add message list and message bubbles with markdown rendering and copy-to-clipboard (Story 2.2)
c7a85c4 feat: add useChat composable with conversation lifecycle and typed state (Story 2.1)
4fa4535 feat: add chat panel with header, welcome state, and close controls (Story 1.4)
c6b9fde feat: add floating agent button with theme registration and state management (Story 1.3)
72a5c1f feat: add core types, API client helper, and plugin install (Story 1.2)
1ae0e31 feat: scaffold project with build, test, lint, and docs tooling (Story 1.1)
```

**Patterns from recent commits:**
- Commit messages follow conventional commits: `feat: description (Story X.Y)`
- Each story is a single commit with all related changes
- dist/ is rebuilt and committed with each story
- Tests are always included in the same commit as implementation

### Testing Strategy

**ChatInput.test.ts setup pattern (no VLayout needed):**

```typescript
import { mount } from '@vue/test-utils'
import { ref, readonly } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ChatInput from '../ChatInput.vue'
import { CHAT_STATE_KEY } from '@/keys'
import type { UseChatReturn } from '@/composables/useChat'

const vuetify = createVuetify({ components, directives })

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
      plugins: [vuetify],
      provide: {
        [CHAT_STATE_KEY as symbol]: state,
      },
    },
  })
  return { wrapper, chatState: state }
}
```

**Key test patterns:**
- **Input interaction:** Set `v-textarea` value via `wrapper.find('textarea').setValue('hello')` then trigger events
- **Enter key:** `wrapper.find('textarea').trigger('keydown', { key: 'Enter', shiftKey: false })`
- **Shift+Enter:** `wrapper.find('textarea').trigger('keydown', { key: 'Enter', shiftKey: true })`
- **Button click:** `wrapper.find('[aria-label="Send message"]').trigger('click')`
- **Disabled state:** Set `isSending` ref to `true` before mounting or after mount, then check `disabled` attribute
- **failedMessageText:** Set the ref value and await `nextTick()`, then check textarea value
- **Async sendMessage:** Mock returns `Promise.resolve()` -- use `await wrapper.vm.$nextTick()` or `await flushPromises()` for assertions after send

### Component Interaction Map

```
NativeChatWidget (root -- provides CHAT_STATE_KEY)
  ├── FloatingButton (toggle open/close)
  └── ChatPanel (v-navigation-drawer)
       ├── ChatHeader (close button)
       ├── .nc-chat-panel__body
       │    ├── Loading spinner (v-progress-circular, when isLoading)
       │    ├── WelcomeState (when messages empty && !isLoading && !isSending)
       │    └── MessageList (when messages exist)
       │         └── MessageBubble[] (one per message)
       └── ChatInput (NEW -- always visible when panel open)  ← Story 2.3
            ├── v-textarea (auto-grow, pill-shaped)
            └── v-btn + IconSend (send action)
```

**Data flow for this story:**
- ChatInput injects `CHAT_STATE_KEY` -> reads `isSending`, `failedMessageText`; calls `sendMessage(text)`
- Local state: `inputText` ref (v-model for textarea), `canSend` computed
- No emits -- ChatInput calls action functions directly on injected state
- Focus management: textarea keeps focus after send (native behavior of v-textarea when value cleared)

### Naming Conventions (Enforce)

- **Component files:** PascalCase (`ChatInput.vue`)
- **Icon files:** PascalCase with `Icon` prefix (`IconSend.vue`)
- **CSS classes:** kebab-case with `nc-` prefix (`nc-chat-input`, `nc-chat-input__textarea`, `nc-chat-input__send-btn`)
- **Event handlers:** `handle` prefix (`handleSend`, `handleKeydown`)
- **Boolean computeds:** `can`/`is`/`has` prefix (`canSend`)
- **Tests:** `.test.ts` suffix, co-located `__tests__/` folder
- **Imports:** Use `@/` path alias (`@/keys`, `@/icons/IconSend.vue`)

### Project Structure Notes

**New files to create:**
| File | Purpose |
|------|---------|
| `src/components/ChatInput.vue` | Auto-expanding textarea + send button |
| `src/icons/IconSend.vue` | Send arrow SVG icon |
| `src/components/__tests__/ChatInput.test.ts` | ChatInput unit tests |

**Existing files to modify:**
| File | Action | Notes |
|------|--------|-------|
| `src/components/ChatPanel.vue` | **Update** | Add ChatInput import and render after body div |
| `src/components/__tests__/ChatPanel.test.ts` | **Update** | Add test for ChatInput rendering |

**No dependencies to add** -- `v-textarea` and `v-btn` are already available via Vuetify peer dep.

**Alignment with architecture project structure:**
- Components flat in `src/components/` (matches architecture -- no nested folders)
- Icons in `src/icons/` (follows established pattern from Stories 1.3-2.2)
- Tests co-located in `src/components/__tests__/` with `.test.ts` suffix

### References

- [Source: architecture.md#Component Patterns] -- Props with defineProps<T>(), provide/inject with Symbol keys, Vuetify usage rules
- [Source: architecture.md#State Patterns] -- UseChatReturn interface, readonly state, message lifecycle state machine
- [Source: architecture.md#CSS Patterns] -- @layer native-chat, theme token access, scoping rules, no !important
- [Source: architecture.md#Implementation Patterns & Consistency Rules] -- Naming, anti-patterns, enforcement guidelines
- [Source: architecture.md#Project Structure & Boundaries] -- Component hierarchy, data flow diagram
- [Source: epics.md#Story 2.3] -- Acceptance criteria, FR coverage (FR14, FR15, FR16, FR17)
- [Source: epics.md#Epic 2] -- Core Messaging Experience overview
- [Source: ux-design-specification.md#Visual Design Foundation] -- Color system, typography, spacing, input area layout
- [Source: ux-design-specification.md#Component Strategy] -- ChatInput anatomy: textarea + send button, pill-shaped, magenta arrow
- [Source: ux-design-specification.md#UX Consistency Patterns] -- Input behavior (Enter/Shift+Enter), disabled states, pre-fill on failure
- [Source: ux-design-specification.md#Accessibility Strategy] -- Keyboard navigation, ARIA labels, focus management
- [Source: prd.md#FR14] -- Text input field
- [Source: prd.md#FR15] -- Auto-expanding input (max 6 lines)
- [Source: prd.md#FR16] -- Send via button
- [Source: prd.md#FR17] -- Send via Enter
- [Source: 2-2-message-list-message-bubbles.md] -- Previous story learnings, test patterns, theme tokens, icon patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- VTextarea requires ResizeObserver polyfill in jsdom test environment (same pattern as ChatPanel tests)
- Vuetify plugin must be registered in ChatInput test mount helper for v-textarea and v-btn to render

### Completion Notes List

- Created IconSend.vue following exact same SVG pattern as IconStar.vue with send/paper-plane path
- Created ChatInput.vue with auto-expanding v-textarea (auto-grow, max-rows=6), pill-shaped border-radius, send button with IconSend, Enter/Shift+Enter keyboard handling, failedMessageText watcher, and disabled state during sending
- Integrated ChatInput into ChatPanel after .nc-chat-panel__body div, always visible when panel open, flex-shrink: 0
- Wrote 11 unit tests covering all acceptance criteria: aria-labels, disabled states, Enter/Shift+Enter behavior, send button click, empty input guard, isSending disabled state, failedMessageText pre-population and null-reset safety
- Added 1 ChatPanel integration test verifying ChatInput renders when panel is open
- All 131 tests pass (119 existing + 12 new), build succeeds, lint clean

### Review Fix Notes

- [Code Review] Added focus restoration after send completes -- watcher on isSending transitions from true→false calls textareaRef.focus() via nextTick
- [Code Review] Added try/catch around sendMessage() await in handleSend() to prevent unhandled promise rejections
- [Code Review] Added textareaRef for programmatic focus management
- [Code Review] Added 3 new tests: isSending behavioral guard via Enter, whitespace-only input rejection, concurrent send protection via button click
- [Code Review] Updated File List with missing dist type definition files
- All 134 tests pass (131 + 3 review fixes), build succeeds, lint clean

### File List

- `src/icons/IconSend.vue` (new) -- Send arrow SVG icon component
- `src/components/ChatInput.vue` (new) -- Auto-expanding textarea + send button component
- `src/components/__tests__/ChatInput.test.ts` (new) -- 14 unit tests for ChatInput
- `src/components/ChatPanel.vue` (modified) -- Added ChatInput import and render
- `src/components/__tests__/ChatPanel.test.ts` (modified) -- Added ChatInput rendering test
- `dist/native-chat-vue.es.js` (modified) -- Rebuilt library bundle
- `dist/native-chat-vue.css` (modified) -- Rebuilt CSS bundle
- `dist/types/components/ChatPanel.vue.d.ts.map` (modified) -- Updated type declarations
- `dist/types/components/ChatInput.vue.d.ts` (new) -- ChatInput type declarations
- `dist/types/components/ChatInput.vue.d.ts.map` (new) -- ChatInput type source map
- `dist/types/icons/IconSend.vue.d.ts` (new) -- IconSend type declarations
- `dist/types/icons/IconSend.vue.d.ts.map` (new) -- IconSend type source map

## Change Log

- 2026-02-20: Implemented Story 2.3 -- Chat Input & Send Message. Added ChatInput component with auto-expanding textarea, send button with magenta arrow icon, Enter/Shift+Enter keyboard handling, failedMessageText pre-population, and disabled state during sending. Integrated into ChatPanel. 12 new tests added (131 total).
- 2026-02-20: [Code Review] Fixed focus management after send (HIGH), added error boundary on async handleSend (HIGH), added 3 missing behavioral tests (MEDIUM), updated File List with dist type files (MEDIUM). 134 tests pass.
