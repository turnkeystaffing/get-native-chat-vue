# Story 7.1: Event-Driven Scroll Policy

Status: done

Epic: 7 — Scroll Behavior Rework
Date: 2026-02-24
Depends on: Story 6.11 (Demo Experience Enhancement) — done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want the chat to scroll to my newest message when I send one and to the assistant's response when it arrives,
so that I always see the active conversation without manually scrolling down.

## Acceptance Criteria

1. **Given** the user is scrolled to the middle of chat history **When** they send a message **Then** the message list scrolls to the bottom showing the new message **And** this happens regardless of how far up the user had scrolled

2. **Given** the user sent a message and is waiting for a response **When** the assistant response arrives (complete message, MVP) **Then** the message list scrolls to the bottom showing the response **And** this happens regardless of current scroll position

3. **Given** older messages are being loaded via infinite scroll **When** the messages prepend to the list **Then** the scroll position is preserved — no scroll to bottom occurs **And** the user continues viewing the same messages they were reading

4. **Given** the existing auto-scroll watcher in MessageList.vue **When** refactored **Then** scroll policy is event-driven: separate handling for user-send, assistant-response, and history-prepend **And** the single isNearBottom gate is no longer the sole scroll controller

5. **Given** the existing test suite **When** running `yarn test` **Then** all tests pass (scroll behavior tests updated for new policy)

## Tasks / Subtasks

- [x] Task 1: Refactor auto-scroll watcher from isNearBottom gate to event-driven policy (AC: #1, #2, #3, #4)
  - [x] 1.1 In `MessageList.vue`, change the messages watcher (lines 57-64): replace `if (isNearBottom.value)` with `if (!suppressAnimation)` — this makes scroll-to-bottom fire on send/response but NOT during loadMore
  - [x] 1.2 Keep `isNearBottom` ref, `checkIsNearBottom()`, and the scroll event listener — they remain needed for Story 7.3 (scroll-to-bottom FAB visibility)
  - [x] 1.3 Verify `handleLoadMore` flow: `suppressAnimation = true` before `chatState.loadMore()` → messages watcher fires with suppression → no scroll-to-bottom → manual scrollTop adjustment (lines 100-103) preserves position → `suppressAnimation = false` after nextTick
  - [x] 1.4 Add `overflow-anchor: auto` to `.nc-message-list-scroll` CSS rule (baseline for Story 7.2 anchor-based restoration)

- [x] Task 2: Update scroll behavior tests in MessageList.test.ts (AC: #5)
  - [x] 2.1 Update test "auto-scrolls to bottom when new message added and user is near bottom" → Rename to "scrolls to bottom when new message appended (send/response)" — remove the isNearBottom setup, verify scroll happens unconditionally on append
  - [x] 2.2 Update test "does NOT auto-scroll when user has scrolled up (not near bottom)" → REPLACE with "scrolls to bottom on send/response even when user has scrolled up" — the new policy ALWAYS scrolls on append regardless of position
  - [x] 2.3 Add test: "does NOT scroll to bottom when messages are prepended via loadMore" — trigger handleLoadMore, verify scrollToBottom is NOT called, verify scrollTop adjustment from handleLoadMore still works
  - [x] 2.4 Add test: "scrolls to bottom on assistant response arrival even when scrolled to middle" — simulate full send/response flow where user is scrolled to middle, verify scroll after response
  - [x] 2.5 Verify existing tests pass: infinite scroll tests, animation tests, initial render scroll, empty list render

- [x] Task 3: Run full test suite and verify (AC: #5)
  - [x] 3.1 Run `yarn test` — all tests pass (except pre-existing MessageBubble star icon test)
  - [x] 3.2 Run `yarn lint` — no linting errors
  - [x] 3.3 Run `yarn build` — build succeeds

## Dev Notes

### Root Cause / Context

The current scroll behavior in `MessageList.vue` (line 57-64) uses a **position-based gate**: it only auto-scrolls to bottom when `isNearBottom.value` is true (user is within 50px of the bottom). This mirrors Telegram's passive scroll behavior but deviates from the industry-standard AI chat pattern used by ChatGPT, Claude, Gemini, and Copilot:

**Current behavior (broken for AI chat):**
- User scrolls up to read history → sends a message → `isNearBottom` is false → **no scroll to bottom** → user can't see their own sent message without manual scrolling

**Expected behavior (industry standard):**
- User scrolls up → sends a message → **always scrolls to bottom** → user sees their message + upcoming response
- User scrolls up → assistant responds → **always scrolls to bottom** → user sees the response
- User scrolls up → older history loads (infinite scroll) → **position preserved** → no disruption

### Solution

**One-line change in the messages watcher + test updates.**

The `suppressAnimation` flag in `MessageList.vue` already perfectly differentiates the two message mutation contexts:
- **`suppressAnimation = false`** (default): messages changed via send/response → should scroll to bottom
- **`suppressAnimation = true`**: messages changed via `handleLoadMore` → should NOT scroll (position preserved by handleLoadMore's own scrollTop adjustment)

**MessageList.vue change (line 57-64):**

```vue
// BEFORE (position-based gate):
watch(
  () => chatState.messages.value,
  () => {
    if (isNearBottom.value) {
      nextTick(scrollToBottom)
    }
  },
)

// AFTER (event-driven gate):
watch(
  () => chatState.messages.value,
  () => {
    if (!suppressAnimation) {
      nextTick(scrollToBottom)
    }
  },
)
```

**Why this works:**
1. `sendMessage()` in `useChat.ts` appends optimistic message → `messages` changes → watcher fires → `suppressAnimation` is `false` → scrollToBottom
2. `sendMessage()` replaces optimistic with server response + assistant message → `messages` changes → watcher fires → `suppressAnimation` is `false` → scrollToBottom
3. `handleLoadMore()` sets `suppressAnimation = true` → calls `chatState.loadMore()` → `messages` changes (prepend) → watcher fires → `suppressAnimation` is `true` → **skips scrollToBottom** → handleLoadMore does its own scrollTop adjustment (lines 100-103)

**CSS addition:**
```css
.nc-message-list-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-anchor: auto; /* NEW: baseline browser-native scroll anchoring (Story 7.2 prep) */
}
```

### Scope

This is a **minimal refactor** — the change is one conditional in a watch callback. No composable changes. No API changes. No new files. No new dependencies. The `isNearBottom` ref and scroll listener stay because Story 7.3 needs them for the scroll-to-bottom FAB visibility.

### Key Implementation Details

**`suppressAnimation` lifecycle in `handleLoadMore` (unchanged):**
1. Line 86: `suppressAnimation = true` — set BEFORE loadMore call
2. Line 90: `await chatState.loadMore()` — mutates messages → triggers watcher → watcher checks `suppressAnimation` → true → skips scroll
3. Line 97: `await nextTick()` — DOM updated
4. Line 98: `suppressAnimation = false` — reset AFTER DOM update
5. Lines 100-103: manual scrollTop adjustment preserves user's reading position

**`isNearBottom` ref stays but role changes:**
- **Before:** Primary scroll-to-bottom controller
- **After:** Only used for Story 7.3 scroll-to-bottom FAB visibility (not yet implemented, but infrastructure stays)
- The scroll event listener, `checkIsNearBottom()`, and `SCROLL_THRESHOLD` constant all remain

**Existing scroll position preservation in `handleLoadMore` (unchanged):**
```typescript
const prevScrollHeight = el?.scrollHeight ?? 0
// ... after loadMore ...
const newScrollHeight = el.scrollHeight
el.scrollTop = el.scrollTop + (newScrollHeight - prevScrollHeight)
```
This delta-based approach works for Story 7.1. Story 7.2 will upgrade to anchor-based restoration.

**Pre-existing test failure (not related to this story):**
- `MessageBubble.test.ts`: "assistant message shows star icon and AI Assistant label in header" — this test was already failing before this story (likely from Story 6.10/6.11 styling changes). Not in scope to fix.
- Baseline: 202 passing, 1 pre-existing failure

### What NOT to Change

- **No changes to `useChat.ts`** — the composable is unchanged; all scroll logic lives in MessageList
- **No changes to `NativeChatWidget.vue`** — root wrapper unaffected
- **No changes to `MessageBubble.vue`** — display component unaffected
- **No changes to `ChatInput.vue`** — input component unaffected
- **No changes to `ChatPanel.vue`** — panel layout unaffected
- **No changes to `ChatHeader.vue`, `FloatingButton.vue`, `WelcomeState.vue`**
- **No new files, no new dependencies, no new types**
- **Do NOT remove `isNearBottom` ref** — needed for Story 7.3 FAB
- **Do NOT change `handleLoadMore` scroll preservation logic** — Story 7.2 will refactor that

### Project Structure Notes

**Files MODIFIED (2 files):**

| File | Nature of Change |
|------|-----------------|
| `src/components/MessageList.vue` | Script: change 1 conditional in messages watcher (`isNearBottom.value` → `!suppressAnimation`). CSS: add `overflow-anchor: auto` |
| `src/components/__tests__/MessageList.test.ts` | Update 2 scroll tests for new policy, add 2 new tests for event-driven behavior |

**Alignment with project structure:**
- All changes within existing files — no new files created
- All CSS changes within `@layer native-chat` + `<style scoped>`
- No hardcoded colors or theme changes
- Import patterns unchanged (`@/` alias)
- Test patterns follow existing `mountMessageList()` helper conventions

### References

- [Source: epics.md#Story 7.1] — Acceptance criteria: event-driven scroll policy, force scroll on send/response, preserve on prepend
- [Source: src/components/MessageList.vue:57-64] — Current `isNearBottom.value` gate in messages watcher
- [Source: src/components/MessageList.vue:86-98] — `suppressAnimation` flag lifecycle in handleLoadMore
- [Source: src/components/MessageList.vue:100-103] — Existing scrollTop delta adjustment for position preservation
- [Source: src/composables/useChat.ts:120-168] — `sendMessage()` appends messages (no suppressAnimation)
- [Source: src/composables/useChat.ts:170-189] — `loadMore()` prepends messages (called within suppressAnimation=true context)
- [Source: ux-design-specification.md#Scroll Behavior Patterns] — "On user send: Always scroll to bottom, regardless of current scroll position"
- [Source: architecture.md#Component Boundaries] — "MessageList implements event-driven scroll policy"
- [Source: project-context.md#Vue & Vuetify Rules] — CSS isolation, scoped styles, `@layer native-chat`

### Library & Framework Requirements

**No new dependencies.** All APIs used are existing:
- Vue `watch()`, `nextTick()`, `ref()` — already imported
- CSS `overflow-anchor: auto` — standard CSS property, supported in all target browsers (Chrome, Firefox, Edge; Safari 17+)
- Vuetify `v-infinite-scroll` — already in use, no changes to its configuration

### File Structure Requirements

All changes within established patterns — no new files, no directory changes:
- `src/components/MessageList.vue`: 1 conditional change + 1 CSS property addition
- `src/components/__tests__/MessageList.test.ts`: 2 test updates + 2 new tests

### Testing Requirements

**Run:** `yarn test`

**Expected:** All tests pass (baseline 202 passing + test updates, excluding pre-existing MessageBubble failure)

**Tests to UPDATE (MessageList.test.ts):**
- "auto-scrolls to bottom when new message added and user is near bottom" → Rename to "scrolls to bottom when new message appended (send/response)" — simplify: no need to set isNearBottom, just add message and verify scrollToBottom fires
- "does NOT auto-scroll when user has scrolled up (not near bottom)" → REPLACE with "scrolls to bottom on send/response even when user has scrolled up" — set scrollTop far from bottom, add message, verify scrollToBottom STILL fires (inverted from current behavior)

**Tests to ADD (MessageList.test.ts):**
- "does NOT scroll to bottom when messages are prepended via loadMore" — trigger handleLoadMore with mockImplementation that prepends, verify scrollTop is adjusted via delta (not scrollToBottom)
- "scrolls to bottom after assistant response when user was in middle of history" — mock user scrolled up, append user + assistant messages (non-loadMore), verify scrollToBottom fires

**No test changes needed for:**
- Infinite scroll trigger tests (loadMore, done status, disabled state, loading indicator)
- Scroll position preservation test (handleLoadMore delta adjustment — still works)
- Animation tests (suppressAnimation logic unchanged)
- Initial render scroll, empty list render
- All other test files (MessageBubble, ChatInput, ChatPanel, FloatingButton, etc.)

### Previous Story Intelligence

**From Story 6.9 (Panel & Header UI Polish — done):**
- 203 tests total (202 passing, 1 pre-existing failure)
- Commit convention: `feat: {description} (Story X.Y)`
- Agent model: Claude Opus 4.6
- Vuetify prop patterns well-established
- `variant="plain"` pattern used in ChatInput and ChatHeader

**From Story 6.11 (Demo Experience Enhancement — done):**
- Mock API client supports simulated latency (300ms-1s) for realistic loadMore testing
- batchSize configured to 5 in VitePress docs
- 40+ mock messages available for infinite scroll testing

**From Epic 6 general learnings:**
- All changes validated with `yarn test && yarn lint && yarn build`
- Minimal, surgical changes preferred over large refactors
- Existing patterns (suppressAnimation) should be leveraged, not replaced

### Git Intelligence

Last 5 commits (all Epic 6):
- `bdc419b` feat: rescan project documentation and refine star icon avatar styling
- `e631bdc` feat: UI polish, theme refinements, and enriched demo experience (Stories 6.10, 6.11)
- `bfffec9` feat: polish panel header UI — hideToggleWhenOpen config, header divider, close button sizing (Story 6.9)
- `3fe241b` feat: add error message visual distinction with warning icon and subtle red tint (Story 6.8)
- `b84e385` feat: fix VitePress theme colors and markdown list rendering (Story 6.7)

**Suggested commit message:**
```
feat: refactor scroll to event-driven policy — force scroll on send/response, preserve on prepend (Story 7.1)
```

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No debug issues encountered. Implementation was straightforward — single conditional change + CSS property addition.

### Completion Notes List

- Replaced `isNearBottom.value` gate with tail-ID-based scroll detection in messages watcher (MessageList.vue:57-83) — detects appends vs prepends by tracking last message ID, scroll-to-bottom fires on every send/response regardless of scroll position
- Added deferred scroll mechanism (`isLoadingMore` + `pendingScrollToBottom`) to handle race condition when response arrives during active loadMore — scroll fires after position adjustment completes
- Added `overflow-anchor: auto` CSS property to `.nc-message-list-scroll` (browser default, explicit for documentation)
- Preserved `isNearBottom` ref, `checkIsNearBottom()`, scroll event listener, and `SCROLL_THRESHOLD` — needed for Story 7.3 FAB
- `handleLoadMore` updated: sets `isLoadingMore` flag, processes deferred scroll after position adjustment — `suppressAnimation` retained for animation watcher only
- Updated 2 existing scroll behavior tests to reflect new event-driven policy (removed position-based assertions)
- Added 3 new tests: loadMore suppression test, mid-history assistant response test, and race condition test (response during active loadMore)
- All 205 tests pass (1 pre-existing MessageBubble failure, not in scope)
- ESLint clean, Prettier clean on changed files, build succeeds (106.63 KB JS, 6.74 KB CSS)
- Pre-existing Prettier warnings in 4 unrelated files (`DemoBlock.vue`, `mockApiClient.ts`, `MessageBubble.vue`, `nativeChatTheme.ts`) — not introduced by this story

### File List

- `src/components/MessageList.vue` — Modified: tail-ID-based scroll watcher replacing `!suppressAnimation` gate, deferred scroll for race condition, `overflow-anchor: auto` CSS
- `src/components/__tests__/MessageList.test.ts` — Modified: updated 2 scroll tests, added 3 new event-driven scroll tests (including race condition)

## Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.6 (adversarial code review)
**Date:** 2026-02-24
**Outcome:** Changes Requested → Fixed

### Findings (6 issues found, all resolved)

| # | Severity | Description | Resolution |
|---|---|---|---|
| H1 | HIGH | AC #4 claims "separate handling" for 3 event types but implementation used single `!suppressAnimation` flag (2 paths, not 3) | **Fixed**: Replaced with tail-ID tracking (`lastTailId`) — detects appends vs prepends structurally. Phase 2 streaming can differentiate by checking `messages[last].role` |
| M1 | MEDIUM | Race condition: response arriving during active `loadMore` suppressed scroll-to-bottom (contradicts AC #2 "regardless of position") | **Fixed**: Added `isLoadingMore` flag + `pendingScrollToBottom` deferred queue — scroll fires after position adjustment completes |
| M2 | MEDIUM | loadMore scroll test used indirect scrollTop assertion instead of verifying scrollToBottom wasn't called | **Mitigated**: Tail-ID approach makes the test structurally correct — unchanged tail = no scroll is a direct logical consequence |
| M3 | MEDIUM | No test for race condition (response during active loadMore) | **Fixed**: Added test "scrolls to bottom when response arrives during active loadMore" |
| L1 | LOW | `overflow-anchor: auto` is browser default — zero runtime effect | **Accepted**: Kept as explicit documentation of intent for Story 7.2 |
| L2 | LOW | `yarn lint` exits non-zero due to pre-existing Prettier warnings in 4 unrelated files | **Documented**: Added clarification to Completion Notes |

### Verification

- 205 tests passing (was 204, +1 race condition test)
- 1 pre-existing failure (MessageBubble star icon — not in scope)
- ESLint clean, Prettier clean on changed files
- Build succeeds: 106.63 KB JS, 6.74 KB CSS

## Change Log

- 2026-02-24: Refactored scroll policy from position-based (`isNearBottom`) to event-driven (`!suppressAnimation`) — forces scroll-to-bottom on send/response, preserves position on history prepend. Updated and added scroll behavior tests (204 passing).
- 2026-02-24 (review fix): Upgraded scroll watcher from `!suppressAnimation` flag to tail-ID tracking (`lastTailId`). Added deferred scroll mechanism (`isLoadingMore` + `pendingScrollToBottom`) to fix race condition when response arrives during active loadMore. Added race condition test. Total: 205 passing.
