# Story 3.1: Infinite Scroll with History Loading

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want older messages to load automatically as I scroll up,
so that I can browse my full conversation history without manual actions.

## Acceptance Criteria

1. **Given** the chat is open with messages loaded and more history exists on the server **When** the user scrolls near the top of the message list **Then** `v-infinite-scroll` (with `side="start"`) triggers a fetch for the next batch **And** `apiClient.getMessages(conversationId, offset, batchSize)` is called with the correct offset **And** a subtle loading indicator (`v-progress-circular`) appears at the top of the message list

2. **Given** the older message batch is returned successfully **When** the messages are prepended to the list **Then** the messages are reversed from newest-first to chronological order and added at the top **And** the user's current scroll position is preserved — the view does not jump (achieved via `scrollTop` adjustment after prepend) **And** the loading indicator disappears

3. **Given** the server returns `has_more: false` **When** the response is processed **Then** no further fetch requests are triggered when scrolling to the top **And** `hasMore` state is set to `false`

4. **Given** a history fetch fails (network error, server error) **When** the error occurs **Then** the loading indicator disappears silently (no error message shown) **And** the user can retry by scrolling up again

5. **Given** a fetch is already in progress **When** the user continues scrolling **Then** no duplicate requests are made (`v-infinite-scroll` handles debounce)

## Tasks / Subtasks

- [x] Task 1: Integrate `v-infinite-scroll` into MessageList.vue (AC: #1, #5)
  - [x] 1.1 Wrap the `<ul>` message list inside a `<v-infinite-scroll>` with `side="start"` and `:disabled="!chatState.hasMore.value"` to prevent triggers when no more history
  - [x] 1.2 Bind the `@load` event to a handler that calls `chatState.loadMore()` and signals completion via the `done` callback (`done('ok')` on success, `done('empty')` when no more, `done('error')` on failure)
  - [x] 1.3 Remove or adjust the existing manual scroll event listener — `v-infinite-scroll` manages scroll threshold detection internally
  - [x] 1.4 Preserve the existing auto-scroll-to-bottom logic for new messages (the `isNearBottom` tracking and watcher must remain)

- [x] Task 2: Add loading indicator at top of message list (AC: #1, #4)
  - [x] 2.1 Add a `v-progress-circular` inside the `v-infinite-scroll` `#loading` slot — appears automatically when a load is triggered
  - [x] 2.2 Style the loading indicator: centered, small (`size="24"`), subtle color matching theme
  - [x] 2.3 Indicator disappears automatically when `done()` callback is called (success or failure)

- [x] Task 3: Implement scroll position preservation on prepend (AC: #2)
  - [x] 3.1 Before `loadMore()` resolves and messages prepend, capture `scrollHeight` and `scrollTop` of the scroll container
  - [x] 3.2 After messages prepend and DOM updates (`nextTick`), calculate the height difference and adjust `scrollTop` so the user's view stays on the same messages
  - [x] 3.3 This is the most critical UX behavior — test manually to verify no visible jump

- [x] Task 4: Write tests for infinite scroll trigger (AC: #1, #3, #5)
  - [x] 4.1 Test: `v-infinite-scroll` component renders with `side="start"` when `hasMore` is true
  - [x] 4.2 Test: `@load` event triggers `loadMore()` on the composable
  - [x] 4.3 Test: scroll is disabled when `hasMore` is false
  - [x] 4.4 Test: loading indicator appears during fetch (check `#loading` slot renders `v-progress-circular`)

- [x] Task 5: Write tests for scroll position preservation and error handling (AC: #2, #4)
  - [x] 5.1 Test: after messages prepend, scroll position adjusted (measure scrollTop before/after)
  - [x] 5.2 Test: failed fetch calls `done('ok')` — loading indicator disappears, no error message in chat (done('ok') used since loadMore catches silently and hasMore stays true, allowing retry)
  - [x] 5.3 Test: user can trigger another load after failed fetch (retry by scrolling)

- [x] Task 6: Run full test suite and build (AC: all)
  - [x] 6.1 Run `yarn test` — all existing 153 tests + 9 new tests pass (162 total)
  - [x] 6.2 Run `yarn build` — verify build succeeds
  - [x] 6.3 Run `yarn lint` — verify no new lint errors
  - [x] 6.4 Commit dist/ changes

## Dev Notes

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

### This Story Modifies One Component

**Most backend logic is already implemented.** The `useChat.loadMore()` function is fully working with correct guards, offset tracking, message reversal, and silent error handling. This story's purpose is:

1. **Integrate `v-infinite-scroll`** into `MessageList.vue` to trigger `loadMore()` on scroll-to-top
2. **Add a loading indicator** at the top of the message list during history fetch
3. **Implement scroll position preservation** when older messages prepend
4. **Write tests** for the UI-level infinite scroll behavior

**DO NOT rewrite `useChat.ts`.** The `loadMore()` function already handles all data logic correctly. This story is purely UI integration.

### loadMore() — Already Implemented (DO NOT MODIFY)

```typescript
// src/composables/useChat.ts — ALREADY EXISTS AND WORKING
async function loadMore(): Promise<void> {
  if (!hasMore.value || isLoading.value || !conversationId.value) return

  isLoading.value = true
  try {
    const response = await apiClient.getMessages(
      conversationId.value,
      messageOffset.value,
      batchSize,
    )
    const chronological = [...response.messages].reverse()
    messages.value = [...chronological, ...messages.value]
    messageOffset.value += chronological.length
    hasMore.value = response.has_more
  } catch {
    // Silent failure per UX spec
  } finally {
    isLoading.value = false
  }
}
```

**Guards already in place:**
- `!hasMore.value` — stops when no more history
- `isLoading.value` — prevents concurrent fetches
- `!conversationId.value` — requires active conversation

**State already tracked:**
- `messageOffset` — increments by batch size after each fetch
- `hasMore` — set from `response.has_more`
- `isLoading` — loading flag for UI indicators

### v-infinite-scroll Integration Pattern

Vuetify's `v-infinite-scroll` with `side="start"` detects scroll-to-top and fires `@load` with a `done` callback. The component manages debounce and duplicate prevention internally.

```vue
<v-infinite-scroll
  :side="'start'"
  :disabled="!chatState.hasMore.value"
  @load="handleLoadMore"
>
  <ul ref="listRef" role="list" aria-live="polite" class="nc-message-list">
    <MessageBubble v-for="msg in chatState.messages.value" :key="msg.id" :message="msg" />
  </ul>

  <template #loading>
    <div class="nc-message-list__loader">
      <v-progress-circular indeterminate size="24" width="2" />
    </div>
  </template>

  <template #empty>
    <!-- No "end of history" indicator needed per spec -->
  </template>
</v-infinite-scroll>
```

**Handler pattern:**
```typescript
import type { InfiniteScrollStatus } from 'vuetify/components'

async function handleLoadMore({
  done,
}: {
  done: (status: InfiniteScrollStatus) => void
}) {
  const prevScrollHeight = listRef.value?.scrollHeight ?? 0
  const prevScrollTop = listRef.value?.scrollTop ?? 0

  await chatState.loadMore()

  // Determine status for v-infinite-scroll
  if (!chatState.hasMore.value) {
    done('empty')
  } else {
    done('ok')
  }

  // Preserve scroll position after prepend
  await nextTick()
  const el = listRef.value
  if (el) {
    const newScrollHeight = el.scrollHeight
    el.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight)
  }
}
```

**CRITICAL: Scroll position preservation**
- Capture `scrollHeight` BEFORE `loadMore()` runs
- After messages prepend + `nextTick()`, calculate height delta
- Adjust `scrollTop` by the delta so the user's viewport stays anchored

**CRITICAL: Error handling in the handler**
- If `loadMore()` throws (it doesn't — it catches internally), the `done` callback must still be called
- Since `loadMore()` catches errors silently and `isLoading` resets, the handler just checks `hasMore` to determine status
- On failure, `hasMore` stays `true` (loadMore didn't update it), so `done('ok')` allows retry

**CRITICAL: isLoading conflict**
- `v-infinite-scroll` manages its own loading state via the `done` callback
- `useChat.loadMore()` also sets `isLoading = true/false`
- The `isLoading` in useChat is already used by ChatPanel for the initial loading spinner (when `messages.length === 0`)
- For infinite scroll loading (when `messages.length > 0`), the `v-infinite-scroll` `#loading` slot handles the indicator automatically
- No conflict: ChatPanel's loading spinner shows only when `isLoading && messages.length === 0`, while v-infinite-scroll's loading shows when scrolling with existing messages

### Existing Auto-Scroll Logic (MUST PRESERVE)

The current MessageList has auto-scroll-to-bottom logic that must remain:

```typescript
// KEEP THIS — auto-scroll when near bottom and new messages arrive
const isNearBottom = ref(true)
const SCROLL_THRESHOLD = 50

function checkIsNearBottom() {
  const el = listRef.value
  if (!el) return
  const { scrollTop, scrollHeight, clientHeight } = el
  isNearBottom.value = scrollHeight - scrollTop - clientHeight <= SCROLL_THRESHOLD
}

watch(
  () => chatState.messages.value,
  () => {
    if (isNearBottom.value) {
      nextTick(scrollToBottom)
    }
  },
)
```

**IMPORTANT:** When wrapping in `v-infinite-scroll`, the scroll container may change. The `listRef` must reference the actual scrollable element. If `v-infinite-scroll` becomes the scroll container, adjust `listRef` accordingly. Test that auto-scroll still works after integration.

**IMPORTANT:** The auto-scroll watcher fires on ALL message changes (including prepends from loadMore). When prepending older messages, `isNearBottom` will be `false` (user scrolled up to trigger loadMore), so auto-scroll won't fire — this is correct behavior. But verify this in tests.

### Previous Story (2.4) Learnings

- **153 tests pass, build succeeds, lint clean** — this is the baseline
- **dist/ tracked in git** — run `yarn build` and commit dist/ after implementation
- **7 pre-existing lint warnings** — don't try to fix them
- **Test microtask flushing** — async operations in useChat require `await Promise.resolve()` or `await flushPromises()` in tests
- **Error messages are ChatMessage objects with `role: 'assistant'`** — they appear in the messages array
- **VNavigationDrawer requires vuetify:layout injection** — ChatPanel test setup wraps in `VLayout`
- **Inject keys cast** — `{ [CHAT_STATE_KEY as symbol]: chatState }` — `as symbol` required in provide

### Testing Strategy

**Test the UI trigger, not the data logic.** The `loadMore()` composable function has 4 comprehensive tests already in `useChat.test.ts`. This story's tests focus on:

1. **v-infinite-scroll renders correctly** — `side="start"`, disabled state, loading slot
2. **Load handler calls loadMore()** — verify the bridge between UI event and composable
3. **Scroll position preservation** — verify scrollTop adjustment after prepend
4. **Error recovery** — verify user can retry after failed fetch

**Mock pattern for v-infinite-scroll tests:**
```typescript
// Mount MessageList with mock chatState that has messages and hasMore=true
const messages = ref<ChatMessage[]>([...existingMessages])
const hasMore = ref(true)
const isLoading = ref(false)
const loadMore = vi.fn()

const chatState = createMockChatState({
  messages: readonly(messages) as DeepReadonly<Ref<ChatMessage[]>>,
  hasMore: readonly(hasMore),
  isLoading: readonly(isLoading),
  loadMore,
})
```

### Component Interaction Map

```
NativeChatWidget (root — provides CHAT_STATE_KEY)
  ├── FloatingButton (toggle open/close)
  └── ChatPanel (v-navigation-drawer)
       ├── ChatHeader (close button)
       ├── .nc-chat-panel__body
       │    ├── Loading spinner (v-progress-circular, when isLoading && no messages)
       │    ├── WelcomeState (when messages empty && !isLoading && !isSending)
       │    └── MessageList (when messages exist) ← THIS STORY MODIFIES
       │         ├── v-infinite-scroll (side="start") ← NEW
       │         │    ├── #loading slot: v-progress-circular ← NEW
       │         │    └── <ul> message list
       │         │         └── MessageBubble[] (one per message)
       │         └── scroll position preservation logic ← NEW
       └── ChatInput (always visible when panel open)
```

### Naming Conventions (Enforce)

- **Component files:** PascalCase (`MessageList.vue`)
- **CSS classes:** BEM with `nc-` prefix (`nc-message-list`, `nc-message-list__loader`)
- **Event handlers:** `handle` prefix (`handleLoadMore`, `handleScroll`)
- **Boolean computeds:** `can`/`is`/`has` prefix (`isNearBottom`)
- **Tests:** `.test.ts` suffix, co-located `__tests__/` folder
- **Imports:** Use `@/` path alias

### Project Structure Notes

**Files to modify:**
| File | Action | Notes |
|------|--------|-------|
| `src/components/MessageList.vue` | **Update** | Add v-infinite-scroll wrapper, loading indicator, scroll position preservation |
| `src/components/__tests__/MessageList.test.ts` | **Update** | Add tests for infinite scroll trigger, loading indicator, scroll preservation |

**No new files to create.**

**No dependencies to add** — `v-infinite-scroll` is part of Vuetify (already installed). `v-progress-circular` is already used in ChatPanel.

**No changes to useChat.ts** — `loadMore()` is fully implemented and tested.

**Alignment with architecture project structure:**
- All modifications are to existing files in established locations
- No new components needed
- Tests stay co-located in existing `__tests__/` folder

### Theme Color Reference (from `nativeChatTheme.ts`)

The loading indicator should use Vuetify theme defaults — `v-progress-circular` will inherit the theme's primary color. No custom color styling needed.

### References

- [Source: architecture.md#Performance Strategy] — v-infinite-scroll without virtualization for MVP, MessageList API is implementation-agnostic
- [Source: architecture.md#Error & Loading Patterns] — On history fetch failure: silent — loading indicator disappears
- [Source: architecture.md#Component Patterns] — MessageList: reads messages, isLoading, hasMore from injected state
- [Source: epics.md#Story 3.1] — Acceptance criteria, FR coverage (FR11, FR12, FR13)
- [Source: epics.md#Epic 3] — Infinite Scroll & Deep History Browsing overview
- [Source: ux-design-specification.md#Scroll Behavior Patterns] — v-infinite-scroll with side="start", scroll position preservation
- [Source: ux-design-specification.md#UX Consistency Patterns] — Loading feedback: small v-progress-circular at top
- [Source: ux-design-specification.md#Component Strategy] — MessageList uses v-infinite-scroll with side="start"
- [Source: prd.md#FR11] — Dynamic older message loading (infinite scroll, configurable batch size)
- [Source: prd.md#FR12] — Scroll position preservation
- [Source: prd.md#FR13] — Loading indicator during fetch
- [Source: prd.md#NFR2] — No jank on infinite scroll (no frames >16ms)
- [Source: prd.md#NFR5] — ≥30fps with 1000+ messages (performance gate — Story 3.2)
- [Source: project-context.md#Vue & Vuetify Rules] — Colors via theme tokens, responsive via useDisplay()
- [Source: project-context.md#Testing Rules] — Co-located tests, globals enabled, mount helper pattern
- [Source: 2-4-send-receive-message-flow.md] — Previous story learnings, test patterns, 153 tests baseline

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- ResizeObserver polyfill needed in vitest.setup.ts for Vuetify's VProgressCircular component in jsdom
- `InfiniteScrollStatus` type not re-exported from `vuetify/components` barrel; imported from deep path `vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js` (requires `.js` extension for bundler module resolution)
- ChatPanel and SendReceiveFlow tests updated to check `.nc-chat-panel__loader` instead of generic VProgressCircular (now also present in MessageList's v-infinite-scroll loading slot)
- Scroll container changed from `<ul>` to v-infinite-scroll's root `$el`; existing scroll tests updated to use `.v-infinite-scroll` selector
- `v-infinite-scroll` disabled state verified via attributes (not CSS class)

### Completion Notes List

- Wrapped MessageList's `<ul>` in `<v-infinite-scroll side="start">` with disabled binding tied to `hasMore`
- Added `handleLoadMore` handler bridging v-infinite-scroll's `@load` event to `chatState.loadMore()` with proper `done()` callback signaling
- Implemented scroll position preservation: captures `scrollHeight`/`scrollTop` before loadMore, adjusts after nextTick
- Loading indicator via `#loading` slot with centered `v-progress-circular` (size=24, width=2)
- Preserved existing auto-scroll-to-bottom logic by moving scroll listener to v-infinite-scroll's root element
- Added 9 new tests covering: v-infinite-scroll rendering, load trigger, disabled state, loading indicator, scroll preservation, error handling, and retry behavior
- Updated 3 existing scroll tests to reference new scroll container (v-infinite-scroll element)
- Updated 2 tests in other files (ChatPanel, SendReceiveFlow) for compatibility with new VProgressCircular in MessageList
- All 162 tests pass, build succeeds (102.75 kB / 29.32 kB gzip), lint clean

### File List

- `src/components/MessageList.vue` — Updated: added v-infinite-scroll wrapper, loading indicator, handleLoadMore handler, scroll position preservation
- `src/components/__tests__/MessageList.test.ts` — Updated: updated 3 existing scroll tests for new scroll container, added 9 new tests for infinite scroll behavior
- `src/components/__tests__/ChatPanel.test.ts` — Updated: fixed VProgressCircular assertion to use `.nc-chat-panel__loader` class selector
- `src/components/__tests__/SendReceiveFlow.test.ts` — Updated: fixed VProgressCircular assertion to use `.nc-chat-panel__loader` class selector
- `vitest.setup.ts` — Updated: added ResizeObserver polyfill for jsdom
- `dist/native-chat-vue.es.js` — Rebuilt
- `dist/native-chat-vue.css` — Rebuilt
- `dist/types/components/MessageList.vue.d.ts` — Rebuilt (template ref type changed from HTMLUListElement to VInfiniteScroll)
- `dist/types/components/MessageList.vue.d.ts.map` — Rebuilt
- `dist/types/components/ChatInput.vue.d.ts` — Rebuilt (type declaration reordering from build, no source changes)

## Change Log

- 2026-02-20: Implemented infinite scroll with v-infinite-scroll, loading indicator, and scroll position preservation in MessageList.vue. Added 9 new tests. All 162 tests pass, build and lint clean.
- 2026-02-20: **Code Review (Claude Opus 4.6 + GPT-5.1 Codex)** — Fixed 5 issues: (H1) Strengthened scroll preservation test to assert actual scrollTop value with proper mock of scrollHeight delta; (M1) Replaced inlined InfiniteScrollStatus type with import from vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js; (M2) Added 3 missing dist type files to File List; (M3) Removed duplicate ResizeObserver polyfills from ChatPanel.test.ts and SendReceiveFlow.test.ts; (M4) Added defensive try/catch in handleLoadMore. All 162 tests pass, build (102.84 kB / 29.33 kB gzip) and lint clean.
