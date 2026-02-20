# Story 2.2: Message List & Message Bubbles

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see my conversation as a list of messages with clear visual distinction between my messages and the assistant's,
so that I can follow the conversation naturally.

## Acceptance Criteria

1. **Given** the chat is open and messages have been fetched **When** the message list renders **Then** user messages appear right-aligned with dark teal (`#002B38`) background and white (`#FDFDFD`) text, with user name and avatar above **And** assistant messages appear left-aligned with white background and `#EBEBED` border, with "AI Assistant" label and star icon above **And** each message is rendered as a `<li>` within a `<ul>` container

2. **Given** an assistant message contains markdown (headings, paragraphs, lists) **When** the message renders **Then** the content is parsed with `marked` and sanitized with DOMPurify before rendering via `v-html` **And** user messages render as plain text (no markdown parsing)

3. **Given** an assistant message is displayed **When** the user clicks the copy icon below the message **Then** the message text is copied to the clipboard **And** the icon changes to a checkmark for ~1.5 seconds then reverts **And** if clipboard write fails (permission denied), the failure is silent

4. **Given** the message list is rendered **When** inspecting accessibility **Then** the list has `role="list"` and `aria-live="polite"` **And** each message has `role="listitem"` with `aria-label` indicating the sender role

5. **Given** the user is at or near the bottom of the list (~50px threshold) **When** a new message appears (user's own or assistant response) **Then** the list auto-scrolls to the bottom

6. **Given** the user has scrolled up to read history **When** a new message appears **Then** the list does NOT auto-scroll -- the user's scroll position is preserved

## Tasks / Subtasks

- [x] Task 1: Create `src/icons/IconCopy.vue` and `src/icons/IconCheck.vue` icon components (AC: #3)
  - [x] 1.1 Create `src/icons/IconCopy.vue` -- self-contained SVG icon component following the existing `IconStar.vue` / `IconClose.vue` pattern (no icon font dependency). Use a standard copy/clipboard SVG path. Accept optional `size` prop (default 16).
  - [x] 1.2 Create `src/icons/IconCheck.vue` -- self-contained SVG checkmark icon, same pattern. Accept optional `size` prop (default 16).

- [x] Task 2: Create `src/components/MessageBubble.vue` component (AC: #1, #2, #3, #4)
  - [x] 2.1 Create `src/components/MessageBubble.vue` as a `<script setup lang="ts">` SFC
  - [x] 2.2 Define props interface `MessageBubbleProps`:
    - `message: ChatMessage` (required) -- the message to render
  - [x] 2.3 Implement **user variant** (when `message.role === 'user'`):
    - Right-aligned layout with dark teal (`rgb(var(--v-theme-primary))`) background, white (`rgb(var(--v-theme-on-primary))`) text
    - "You" label above the bubble (right-aligned)
    - Render `message.content` as **plain text** (no markdown parsing)
    - 12-16px border-radius on bubble
  - [x] 2.4 Implement **assistant variant** (when `message.role === 'assistant'` and not error):
    - Left-aligned layout with white background and `#EBEBED` border
    - "AI Assistant" label + `IconStar` (secondary color, small) above the bubble
    - Render `message.content` through **markdown pipeline**: `marked.parse(content)` -> `DOMPurify.sanitize(html)` -> render via `v-html`
    - 12-16px border-radius on bubble
  - [x] 2.5 Implement **error variant** (when `message.status === 'failed'` or message content matches error pattern):
    - Same layout as assistant variant (left-aligned, no special error styling per UX spec -- no red backgrounds, no alert icons)
    - Calm, neutral tone text (already set by `useChat()` error messages)
  - [x] 2.6 Implement **copy action** for assistant messages only:
    - Render `IconCopy` button below the assistant message bubble (subtle, gray, small)
    - On click: call `navigator.clipboard.writeText(message.content)` (raw markdown content, not rendered HTML)
    - On success: swap icon to `IconCheck` for 1.5 seconds, then revert to `IconCopy`
    - On failure (clipboard permission denied): fail silently, no error display
    - Use `ref<boolean>` for `copied` state with `setTimeout` to revert
  - [x] 2.7 Implement **sending indicator** for optimistic messages:
    - When `message.status === 'sending'`, show subtle visual indicator (e.g., slightly reduced opacity on the bubble)
  - [x] 2.8 **Accessibility**:
    - Root element is `<li>` with `role="listitem"`
    - Add `aria-label` indicating sender: `"Message from you"` or `"Message from AI Assistant"` or `"Error message"`
    - Copy button: `aria-label="Copy message"` / `"Message copied"` when in copied state
  - [x] 2.9 **Styling** -- all styles in `<style scoped>` wrapped in `@layer native-chat { }`:
    - Use theme tokens via `rgb(var(--v-theme-{name}))` -- never hardcode hex colors
    - CSS class prefix: `nc-message-bubble`, `nc-message-bubble--user`, `nc-message-bubble--assistant`, `nc-message-bubble--error`
    - Markdown rendered content styling: scope `v-html` output with `.nc-message-bubble__content :deep()` selectors for h1-h4, p, ul, ol, li, code, pre, strong, em, a

- [x] Task 3: Create `src/components/MessageList.vue` component (AC: #1, #4, #5, #6)
  - [x] 3.1 Create `src/components/MessageList.vue` as a `<script setup lang="ts">` SFC
  - [x] 3.2 Inject `CHAT_STATE_KEY` to access `messages`, `isLoading`, `hasMore`, `isSending` state
  - [x] 3.3 Render a `<ul>` container with `role="list"` and `aria-live="polite"`
  - [x] 3.4 Iterate over `chatState.messages.value` and render `<MessageBubble>` for each message
  - [x] 3.5 Implement **auto-scroll behavior**:
    - Track scroll position: maintain a `isNearBottom` computed/reactive flag
    - "Near bottom" threshold: within ~50px of the bottom edge of the scrollable container
    - Use a `watch()` on `messages` array length -- when new messages are added AND user is near bottom, call `scrollToBottom()` via `nextTick`
    - When user has scrolled up (not near bottom), do NOT auto-scroll on new messages
    - Use `template ref` on the scroll container for `scrollTop`/`scrollHeight` measurements
  - [x] 3.6 Implement **scroll event listener**:
    - Attach `@scroll` handler to the scrollable container
    - Update `isNearBottom` flag on each scroll event
    - Use passive event listener for performance (`{ passive: true }`)
  - [x] 3.7 Implement **initial scroll to bottom**:
    - On first render with messages (after initial history fetch), scroll to the bottom so the user sees most recent messages
    - Use `nextTick(() => scrollToBottom())` after messages are set
  - [x] 3.8 **Styling** -- `<style scoped>` wrapped in `@layer native-chat { }`:
    - Full height scrollable container (`overflow-y: auto`, `flex: 1`)
    - Remove default list styling (`list-style: none`, `padding: 0`, `margin: 0`)
    - Message spacing: ~12-16px vertical gap between messages
    - Padding: 16px horizontal, 8px vertical within the list container
    - CSS class: `nc-message-list`

- [x] Task 4: Integrate MessageList into `src/components/ChatPanel.vue` (AC: #1)
  - [x] 4.1 Import `MessageList` component
  - [x] 4.2 Replace the `<!-- MessageList slot for Story 2.2 -->` placeholder comment
  - [x] 4.3 Render `<MessageList>` when `chatState.messages.value.length > 0 || chatState.isSending.value`
  - [x] 4.4 Keep existing conditional logic: `WelcomeState` shown when `messages.length === 0 && !isLoading`, loading spinner when `isLoading`
  - [x] 4.5 Ensure the MessageList fills the available space in the flex layout (`.nc-chat-panel__body` is already `display: flex; flex-direction: column; flex: 1`)

- [x] Task 5: Write tests for MessageBubble (AC: #1, #2, #3, #4)
  - [x] 5.1 Create `src/components/__tests__/MessageBubble.test.ts`
  - [x] 5.2 Test: renders user message with right-alignment class and plain text content
  - [x] 5.3 Test: renders assistant message with left-alignment class
  - [x] 5.4 Test: assistant message content is rendered through marked + DOMPurify (markdown `**bold**` becomes `<strong>bold</strong>`)
  - [x] 5.5 Test: user message content is rendered as plain text (no markdown parsing -- `**text**` stays as `**text**`)
  - [x] 5.6 Test: error message renders with assistant styling (no special error visual treatment)
  - [x] 5.7 Test: copy button appears only on assistant messages (not on user or error messages)
  - [x] 5.8 Test: clicking copy button calls `navigator.clipboard.writeText()` with raw message content
  - [x] 5.9 Test: copy button icon changes to checkmark after successful copy, reverts after 1.5s (use `vi.useFakeTimers()`)
  - [x] 5.10 Test: clipboard failure is handled silently (no error thrown, no UI change)
  - [x] 5.11 Test: `role="listitem"` present on root element
  - [x] 5.12 Test: `aria-label` reflects sender role ("Message from you", "Message from AI Assistant")
  - [x] 5.13 Test: sending status shows visual indicator (e.g., opacity class)

- [x] Task 6: Write tests for MessageList (AC: #1, #4, #5, #6)
  - [x] 6.1 Create `src/components/__tests__/MessageList.test.ts`
  - [x] 6.2 Test: renders `<ul>` with `role="list"` and `aria-live="polite"`
  - [x] 6.3 Test: renders one `MessageBubble` per message in `chatState.messages`
  - [x] 6.4 Test: messages render in chronological order (first message at top, last at bottom)
  - [x] 6.5 Test: auto-scrolls to bottom when new message added and user is near bottom
  - [x] 6.6 Test: does NOT auto-scroll when user has scrolled up (not near bottom)
  - [x] 6.7 Test: scrolls to bottom on initial render with messages
  - [x] 6.8 Test: empty messages array renders empty list (no crash)

- [x] Task 7: Update ChatPanel tests and run full test suite (AC: #1)
  - [x] 7.1 Update `src/components/__tests__/ChatPanel.test.ts` -- add test: renders MessageList when messages exist
  - [x] 7.2 Update ChatPanel test: WelcomeState still shown when messages empty and not loading
  - [x] 7.3 Run `yarn test` -- all tests pass (existing 94 tests + new tests)
  - [x] 7.4 Run `yarn build` -- verify build succeeds
  - [x] 7.5 Run `yarn lint` -- verify no new lint errors (7 pre-existing warnings acceptable)

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
- **State access via inject only** -- MessageList injects `CHAT_STATE_KEY` for state. MessageBubble receives data via props (pure display component, no inject)
- **No direct state mutation** -- components read readonly refs from `UseChatReturn`. Actions must go through `useChat()` action functions
- **Yarn v4 Berry** -- use `yarn` exclusively (not npm)
- **@/* path alias** -- configured in tsconfig, vite, and vitest. Use `@/keys`, `@/types/chat`, etc.

### Markdown Rendering Pipeline

**CRITICAL: Assistant messages only. User messages are ALWAYS plain text.**

```typescript
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// In MessageBubble.vue -- computed property for assistant messages only
const renderedContent = computed(() => {
  if (props.message.role !== 'assistant') return null
  const rawHtml = marked.parse(props.message.content) as string
  return DOMPurify.sanitize(rawHtml)
})
```

**Package versions already installed:**
- `marked`: ^17.0.0 (latest stable 17.0.3 -- breaking change in v17: list token handling changed; does NOT affect basic markdown rendering for chat messages)
- `dompurify`: ^3.3.0 (latest stable 3.3.1)

**DOMPurify configuration:** Use defaults (no custom config needed for chat). DOMPurify's defaults allow standard HTML tags (p, h1-h6, ul, ol, li, strong, em, a, code, pre, blockquote, br) and strip dangerous attributes (onclick, onerror, etc.). This covers all markdown output from `marked`.

**Rendering approach:**
- Assistant: `<div v-html="renderedContent" class="nc-message-bubble__content"></div>`
- User: `<div class="nc-message-bubble__content">{{ message.content }}</div>` (text interpolation, no v-html)

**Markdown content styling (`:deep()` selectors):**
Scoped styles don't penetrate `v-html` output. Use `:deep()` to style rendered markdown:
```css
.nc-message-bubble__content :deep(h1),
.nc-message-bubble__content :deep(h2),
.nc-message-bubble__content :deep(h3) {
  font-size: 14px;
  font-weight: 700;
  margin: 8px 0 4px;
}
.nc-message-bubble__content :deep(p) {
  margin: 4px 0;
}
.nc-message-bubble__content :deep(ul),
.nc-message-bubble__content :deep(ol) {
  padding-left: 20px;
  margin: 4px 0;
}
.nc-message-bubble__content :deep(code) {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 13px;
}
.nc-message-bubble__content :deep(pre) {
  background: rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}
.nc-message-bubble__content :deep(a) {
  color: rgb(var(--v-theme-secondary));
  text-decoration: underline;
}
```

### Copy-to-Clipboard Pattern

```typescript
const copied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.message.content)
    copied.value = true
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => { copied.value = false }, 1500)
  } catch {
    // Silent failure per UX spec -- clipboard permission denied
  }
}
```

**CRITICAL:** Copy the raw `message.content` (markdown source), NOT the rendered HTML. Users expect to paste the text content, not HTML markup.

### Auto-Scroll Behavior

```typescript
const listRef = ref<HTMLUListElement | null>(null)
const isNearBottom = ref(true)

const SCROLL_THRESHOLD = 50 // pixels from bottom

function checkIsNearBottom() {
  const el = listRef.value
  if (!el) return
  const { scrollTop, scrollHeight, clientHeight } = el
  isNearBottom.value = scrollHeight - scrollTop - clientHeight <= SCROLL_THRESHOLD
}

function scrollToBottom() {
  const el = listRef.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

// Watch for new messages
watch(
  () => chatState.messages.value.length,
  () => {
    if (isNearBottom.value) {
      nextTick(scrollToBottom)
    }
  }
)

// Initial scroll to bottom
onMounted(() => {
  if (chatState.messages.value.length > 0) {
    nextTick(scrollToBottom)
  }
})
```

**Rules:**
- Auto-scroll ONLY when user is at/near bottom (~50px threshold)
- NEVER auto-scroll when user has scrolled up to read history
- Initial render with history: always scroll to bottom (most recent messages)
- `@scroll` handler on list container with `{ passive: true }` for performance
- `aria-live="polite"` on `<ul>` announces new messages ONLY (not triggered by history loads -- history loads are prepended, not appended, so this works naturally)

### Message Layout & Visual Design

**User messages:**
- Right-aligned within the list
- Dark teal bubble: `background: rgb(var(--v-theme-primary))`, `color: rgb(var(--v-theme-on-primary))`
- "You" label above bubble (14px, semibold, right-aligned)
- Border radius: 12px (or 16px, match chat aesthetic)
- Max width: ~80% of list width (prevents full-width stretching)
- No copy button, no markdown

**Assistant messages:**
- Left-aligned within the list
- White bubble with border: `background: rgb(var(--v-theme-surface))`, `border: 1px solid #EBEBED`
- "AI Assistant" label + IconStar (secondary color, 14px) above bubble
- Border radius: 12px
- Max width: ~80% of list width
- Copy button below (subtle, gray `IconCopy`, 24px total area for tap target)
- Markdown rendered via v-html

**Error messages:**
- Identical to assistant layout (left-aligned, same colors)
- NO red backgrounds, NO alert icons, NO exclamation marks per UX spec
- Content is calm text already set by `useChat()` error mapper

**Sending state:**
- User bubble with `status === 'sending'` gets slightly reduced opacity (e.g., `opacity: 0.7`)
- CSS class: `nc-message-bubble--sending`

**Spacing:**
- Vertical gap between messages: 12-16px (use `gap` on the `<ul>` with `display: flex; flex-direction: column`)
- Internal bubble padding: 12px horizontal, 8px vertical

### Theme Color Reference (from `nativeChatTheme.ts`)

| Token | Value | Usage |
|-------|-------|-------|
| `--v-theme-primary` | `#002B38` (dark teal) | User bubble background |
| `--v-theme-on-primary` | `#FDFDFD` (white) | User bubble text |
| `--v-theme-secondary` | `#C4105B` (magenta) | Star icon, links |
| `--v-theme-surface` | `#FFFFFF` | Assistant bubble background |
| `--v-theme-on-surface` | `#002B38` | Assistant bubble text |
| `--v-theme-error` | `#DE3232` | NOT used for error messages (per UX) |
| `--v-theme-welcome-text` | `#B0BCC0` | NOT used here (WelcomeState only) |

**Border color for assistant bubble:** Use `#EBEBED` directly (it's a border, not a theme surface). This is the one exception to "no hardcoded colors" -- it's a structural border color defined in the UX spec, not a semantic color. Alternatively define as a CSS custom property within `@layer native-chat`.

### Component Interaction Map

```
NativeChatWidget (root -- provides CHAT_STATE_KEY)
  ├── FloatingButton (toggle open/close)
  └── ChatPanel (v-navigation-drawer)
       ├── ChatHeader (close button)
       ├── Loading spinner (v-progress-circular, when isLoading)
       ├── WelcomeState (when messages empty && !isLoading)
       └── MessageList (NEW -- when messages exist)  ← Story 2.2
            └── MessageBubble[] (NEW -- one per message)  ← Story 2.2
                 ├── User variant (plain text)
                 ├── Assistant variant (markdown + copy)
                 └── Error variant (plain text, assistant style)
```

**Data flow for this story:**
- `MessageList` injects `CHAT_STATE_KEY` → reads `messages`, watches for changes → manages scroll
- `MessageBubble` receives `ChatMessage` as a prop → pure display component, no state injection
- Copy action is self-contained in `MessageBubble` (no state mutation, no composable call)

### Existing Icon Pattern (FOLLOW EXACTLY)

From `src/icons/IconStar.vue`:
```vue
<script setup lang="ts">
interface IconStarProps {
  size?: number
}
withDefaults(defineProps<IconStarProps>(), { size: 24 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="currentColor" xmlns="...">
    <path d="..." />
  </svg>
</template>
```

**Follow this pattern exactly for IconCopy and IconCheck.** Use `fill="currentColor"` so the icon inherits text color from parent. Default size 16 for these smaller action icons.

### Previous Story (2.1) Learnings

- **CHAT_STATE_KEY is typed as `InjectionKey<UseChatReturn>`** -- `inject(CHAT_STATE_KEY)!` returns fully typed state. No untyped casts needed.
- **`open()` is async** -- conversation initialization involves API calls
- **Message ordering**: API returns newest-first; composable reverses to chronological. Messages in `chatState.messages.value` are ALREADY in chronological order (oldest first, newest last). Do NOT reverse again.
- **Message status**: `'sending'` (optimistic), `'sent'` (confirmed), `'failed'` (error). Status is optional on `ChatMessage` type.
- **Error messages are ChatMessage objects** with `role: 'assistant'` -- they appear in the messages array like any other message. There is NO separate error array. Detect error messages by checking `message.status === 'failed'` or by content pattern.
- **VNavigationDrawer requires vuetify:layout injection** -- test setup must wrap components needing layout in `VLayout`
- **94 tests pass, build succeeds, lint clean** -- this is the baseline for regression testing
- **dist/ tracked in git** -- run `yarn build` and commit dist/ after implementation
- **7 pre-existing lint warnings** -- don't try to fix them
- **ESLint 10 flat config** -- `eslint.config.ts` (not `.eslintrc.cjs`)
- **Test microtask flushing** -- async operations in useChat require `await Promise.resolve()` or `await flushPromises()` in tests
- **ChatPanel body layout** -- `.nc-chat-panel__body` is already `display: flex; flex-direction: column; flex: 1; overflow: hidden`. MessageList should take `flex: 1; overflow-y: auto` to fill available space.

### Git Intelligence (Recent Commits)

```
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

### Latest Tech Information

**marked v17.0.x (installed ^17.0.0):**
- Latest patch: 17.0.3 (Feb 17, 2026)
- Breaking change in v17: list token handling changed (does NOT affect basic chat markdown rendering)
- `marked.parse()` returns `string` (synchronous by default)
- No built-in sanitization -- MUST use DOMPurify
- Import: `import { marked } from 'marked'`

**DOMPurify v3.3.x (installed ^3.3.0):**
- Latest: 3.3.1
- Default config is sufficient for chat markdown (allows standard HTML tags, strips dangerous attrs)
- Import: `import DOMPurify from 'dompurify'`
- In jsdom test environment: must use `import { JSDOM } from 'jsdom'` and `DOMPurify(new JSDOM('').window)` -- OR mock DOMPurify in tests to avoid jsdom dependency issues
- **CRITICAL test consideration:** `DOMPurify.sanitize()` may not work correctly in Vitest's jsdom environment. Consider mocking the markdown pipeline in MessageBubble tests (mock `marked.parse` and `DOMPurify.sanitize` to return predictable output) rather than testing the actual libraries.

**Vuetify 3.11.8:**
- `v-infinite-scroll` is available but NOT used in this story (reserved for Story 3.1)
- `v-btn` with `icon` variant available for copy button
- `v-theme-provider` already wrapping all components at root level

### Project Structure Notes

**New files to create:**
| File | Purpose |
|------|---------|
| `src/components/MessageList.vue` | Scrollable message container with auto-scroll |
| `src/components/MessageBubble.vue` | Single message display (user/assistant/error) |
| `src/icons/IconCopy.vue` | Copy clipboard SVG icon |
| `src/icons/IconCheck.vue` | Checkmark SVG icon |
| `src/components/__tests__/MessageList.test.ts` | MessageList unit tests |
| `src/components/__tests__/MessageBubble.test.ts` | MessageBubble unit tests |

**Existing files to modify:**
| File | Action | Notes |
|------|--------|-------|
| `src/components/ChatPanel.vue` | **Update** | Replace placeholder with MessageList, update conditional rendering |
| `src/components/__tests__/ChatPanel.test.ts` | **Update** | Add test for MessageList rendering when messages exist |

**No dependencies to add** -- `marked` and `dompurify` are already in `package.json`.

**Alignment with architecture project structure:**
- Components flat in `src/components/` (matches architecture -- no nested folders)
- Icons in `src/icons/` (follows established pattern from Stories 1.3-1.4)
- Tests co-located in `src/components/__tests__/` with `.test.ts` suffix

### Testing Strategy

**MessageBubble.test.ts (pure display component -- no inject needed):**
- Mount with `props: { message: ChatMessage }` directly
- Mock `marked.parse` and `DOMPurify.sanitize` to avoid jsdom issues with actual parsing
- Mock `navigator.clipboard.writeText` with `vi.fn()` returning `Promise.resolve()` / `Promise.reject()`
- Use `vi.useFakeTimers()` for the 1.5s copy timeout test
- No Vuetify layout wrapper needed (MessageBubble doesn't use v-navigation-drawer)

**MessageList.test.ts (needs inject + scroll simulation):**
- Provide mock `CHAT_STATE_KEY` with reactive messages array
- Mock `Element.prototype.scrollHeight` / `scrollTop` / `clientHeight` for scroll tests
- Use `wrapper.find('.nc-message-list').trigger('scroll')` with custom event properties
- Test auto-scroll by manipulating mock scroll properties and adding messages to reactive array
- Watch for `nextTick` timing -- scroll assertions may need `await nextTick()` after message array mutations

**ChatPanel.test.ts (update existing):**
- Add messages to mock state → verify MessageList renders
- Verify WelcomeState still works with empty messages

### Naming Conventions (Enforce)

- **Component files:** PascalCase (`MessageList.vue`, `MessageBubble.vue`)
- **Icon files:** PascalCase with `Icon` prefix (`IconCopy.vue`, `IconCheck.vue`)
- **CSS classes:** kebab-case with `nc-` prefix, BEM-style modifiers (`nc-message-bubble--user`, `nc-message-bubble--assistant`)
- **Props interfaces:** PascalCase (`MessageBubbleProps`)
- **Event handlers:** `handle` prefix (`handleCopy`, `handleScroll`)
- **Boolean refs:** `is`/`has` prefix (`isNearBottom`, `copied` is an exception -- short and clear)
- **Tests:** `.test.ts` suffix, co-located `__tests__/` folder
- **Imports:** Use `@/` path alias (`@/keys`, `@/types/chat`, `@/icons/IconCopy.vue`)

### References

- [Source: architecture.md#Component Patterns] -- Props with defineProps<T>(), provide/inject with Symbol keys, Vuetify usage rules
- [Source: architecture.md#State Patterns] -- UseChatReturn interface, readonly state, message lifecycle state machine
- [Source: architecture.md#CSS Patterns] -- @layer native-chat, theme token access, scoping rules, no !important
- [Source: architecture.md#Implementation Patterns & Consistency Rules] -- Naming, anti-patterns, enforcement guidelines
- [Source: architecture.md#Core Architectural Decisions] -- Markdown rendering (marked + DOMPurify), MessageList public API (implementation-agnostic)
- [Source: architecture.md#Project Structure & Boundaries] -- Component hierarchy, data flow diagram
- [Source: epics.md#Story 2.2] -- Acceptance criteria, FR coverage (FR9, FR10)
- [Source: epics.md#Epic 2] -- Core Messaging Experience overview
- [Source: ux-design-specification.md#Visual Design Foundation] -- Color system, typography, spacing, message layout
- [Source: ux-design-specification.md#Component Strategy] -- MessageBubble variants, MessageList behavior, ChatHeader/Input anatomy
- [Source: ux-design-specification.md#UX Consistency Patterns] -- Feedback patterns (copy action), scroll behavior, auto-scroll rules
- [Source: ux-design-specification.md#Accessibility Strategy] -- Keyboard navigation, screen reader support, ARIA attributes, focus management
- [Source: ux-design-specification.md#Responsive Design] -- 768px breakpoint, mobile full-screen, dvh usage
- [Source: prd.md#FR9] -- Message list with role distinction
- [Source: prd.md#FR10] -- Scroll through conversation history
- [Source: 2-1-usechat-composable-conversation-lifecycle.md] -- Previous story learnings, package versions, test patterns, debug log

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No blocking issues encountered during implementation.

### Completion Notes List

- Task 1: Created IconCopy.vue and IconCheck.vue following the exact pattern of existing icons (IconStar, IconClose) - self-contained SVG, fill="currentColor", aria-hidden, 1em sizing
- Task 2: Created MessageBubble.vue with user/assistant/error variants, markdown rendering pipeline (marked + DOMPurify), copy-to-clipboard with 1.5s feedback, sending opacity indicator, full accessibility (role="listitem", aria-label per role)
- Task 3: Created MessageList.vue with auto-scroll behavior (50px threshold), passive scroll listener, initial scroll-to-bottom on mount, proper cleanup on unmount
- Task 4: Integrated MessageList into ChatPanel.vue replacing placeholder comment, updated overflow to hidden on body so MessageList handles its own scrolling
- Task 5: 13 MessageBubble tests covering all variants, markdown rendering (mocked), copy functionality with fake timers, clipboard failure, accessibility attributes
- Task 6: 7 MessageList tests covering list rendering, message ordering, auto-scroll behavior, scroll-up preservation, empty state
- Task 7: Added 1 new ChatPanel test for MessageList rendering when messages exist, updated WelcomeState test to verify MessageList absence. All 115 tests pass, lint clean, build succeeds.

### Change Log

- 2026-02-20: Implemented Story 2.2 - Message List & Message Bubbles. Created MessageBubble.vue (user/assistant/error variants with markdown + copy), MessageList.vue (auto-scroll, accessibility), IconCopy.vue, IconCheck.vue. Integrated into ChatPanel. Added 21 new tests (115 total).
- 2026-02-20: Code review fixes (3 HIGH, 5 MEDIUM resolved):
  - H1: Fixed memory leak — added onBeforeUnmount to clear copyTimeout in MessageBubble.vue
  - H2: Fixed hardcoded #9e9e9e color — replaced with theme token `rgb(var(--v-theme-on-surface) / 0.4)` in copy button
  - H3: Fixed ChatPanel loading condition — spinner only shows when isLoading AND no messages (prevents MessageList disappearing during loadMore)
  - M1: Added isSending check to ChatPanel WelcomeState condition per Task 4.3 spec
  - M2: Error messages now skip markdown pipeline (plain text rendering, no unnecessary marked+DOMPurify)
  - M3: Improved MessageList initial scroll test with actual scrollHeight mock and scrollTop assertion
  - M4: Added error message aria-label test, error plain text rendering test, and unmount cleanup test
  - M5: Changed MessageList watch from .length to array reference for robustness
  - Tests: 119 total (4 new), build succeeds, lint clean

### File List

New files:
- src/icons/IconCopy.vue
- src/icons/IconCheck.vue
- src/components/MessageBubble.vue
- src/components/MessageList.vue
- src/components/__tests__/MessageBubble.test.ts
- src/components/__tests__/MessageList.test.ts
- dist/types/components/MessageBubble.vue.d.ts
- dist/types/components/MessageBubble.vue.d.ts.map
- dist/types/components/MessageList.vue.d.ts
- dist/types/components/MessageList.vue.d.ts.map
- dist/types/icons/IconCheck.vue.d.ts
- dist/types/icons/IconCheck.vue.d.ts.map
- dist/types/icons/IconCopy.vue.d.ts
- dist/types/icons/IconCopy.vue.d.ts.map

Modified files:
- src/components/ChatPanel.vue (added MessageList import and rendering, fixed loading condition for loadMore compatibility)
- src/components/__tests__/ChatPanel.test.ts (added MessageList rendering test, added loadMore spinner test)
- dist/native-chat-vue.es.js (rebuilt)
- dist/native-chat-vue.css (rebuilt)
- dist/types/components/ChatPanel.vue.d.ts.map (rebuilt)
- dist/types/composables/useChat.d.ts.map (rebuilt — cosmetic source map change)
