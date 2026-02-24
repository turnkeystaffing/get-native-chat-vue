# Story 7.3: Scroll-to-Bottom FAB Button

Status: done

Epic: 7 — Scroll Behavior Rework
Date: 2026-02-24
Depends on: Story 7.2 (Anchor-Based Scroll Preservation) — done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want a down-arrow button to appear when I've scrolled up in the chat,
so that I can quickly return to the most recent messages with one click.

## Acceptance Criteria

1. **Given** the user has scrolled up past the ~50px near-bottom threshold **When** the message list renders **Then** a small circular down-arrow button appears overlaid on the bottom-center of the message list area **And** the button uses `v-btn` with `icon`, `variant="elevated"`, `color="surface"`, `size="small"` **And** the button transitions in with an opacity fade

2. **Given** the scroll-to-bottom button is visible **When** the user clicks it **Then** the message list scrolls to the most recent message **And** the button disappears (user is now at bottom)

3. **Given** the user is at or near the bottom of the message list **When** the message list renders **Then** no scroll-to-bottom button is visible

4. **Given** the scroll-to-bottom button **When** inspecting accessibility **Then** the button has `aria-label="Scroll to latest messages"`

5. **Given** the user has `prefers-reduced-motion: reduce` enabled **When** the button appears or disappears **Then** the transition is instant (no fade animation)

6. **Given** the existing test suite **When** running `yarn test` **Then** all tests pass with new tests for the FAB button

## Tasks / Subtasks

- [x] Task 1: Create `IconArrowDown.vue` icon component (AC: #1)
  - [x] 1.1 Create `src/icons/IconArrowDown.vue` — SVG arrow-down icon matching existing icon conventions (PascalCase, `Icon` prefix, scoped template)
  - [x] 1.2 Follow same pattern as `IconSend.vue` / `IconClose.vue` — inline SVG, `currentColor` fill, `viewBox="0 0 24 24"`. Used custom arrow-down path per user preference (not chevron)

- [x] Task 2: Add scroll-to-bottom FAB to MessageList.vue template (AC: #1, #2, #3, #4)
  - [x] 2.1 Wrap `<v-infinite-scroll>` in a container `<div class="nc-message-list-wrapper">` with `position: relative` — the FAB is positioned absolutely within this wrapper
  - [x] 2.2 Add `<Transition name="nc-scroll-fab">` wrapping a positioning `<div>` + `<v-btn>` after `</v-infinite-scroll>` inside the wrapper div
  - [x] 2.3 `<v-btn>` props: `icon`, `variant="elevated"`, `color="surface"` (white — changed from `secondary` per user feedback), `size="small"`, `aria-label="Scroll to latest messages"`. `v-show="!isNearBottom"` on wrapper `<div>` (avoids Vuetify CSS layer override)
  - [x] 2.4 `@click` handler calls existing `scrollToBottom()` function — no new logic needed
  - [x] 2.5 FAB content: `<v-icon :icon="IconArrowDown">` component

- [x] Task 3: Add FAB positioning and transition CSS (AC: #1, #5)
  - [x] 3.1 `.nc-message-list-wrapper` — `position: relative; display: flex; flex-direction: column; flex: 1; overflow: hidden` (takes over the flex layout from `.nc-message-list-scroll`)
  - [x] 3.2 `.nc-scroll-fab` — `position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%); z-index: 1` to overlay bottom-center of message list area (centered per user preference, close to input)
  - [x] 3.3 Transition classes `.nc-scroll-fab-enter-active`, `.nc-scroll-fab-leave-active` — `transition: opacity 200ms ease, transform 200ms ease`
  - [x] 3.4 `.nc-scroll-fab-enter-from`, `.nc-scroll-fab-leave-to` — `opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.9)`
  - [x] 3.5 `@media (prefers-reduced-motion: reduce)` — `.nc-scroll-fab-enter-active, .nc-scroll-fab-leave-active { transition-duration: 0ms }`

- [x] Task 4: Write tests for scroll-to-bottom FAB (AC: #1, #2, #3, #4, #6)
  - [x] 4.1 Test: FAB is NOT visible when `isNearBottom` is true (initial state — user at bottom)
  - [x] 4.2 Test: FAB becomes visible when user scrolls up past threshold (dispatch scroll event, mock `scrollHeight - scrollTop - clientHeight > 50`)
  - [x] 4.3 Test: clicking FAB calls `scrollToBottom` (scrollTop set to scrollHeight)
  - [x] 4.4 Test: FAB has correct `aria-label="Scroll to latest messages"`
  - [x] 4.5 Test: FAB disappears after scrollToBottom completes (user is back at bottom)

- [x] Task 5: Run full test suite and verify (AC: #6)
  - [x] 5.1 Run `yarn test` — all existing + new tests pass (1 pre-existing failure in MessageBubble.test.ts unrelated to this story)
  - [x] 5.2 Run `yarn lint` — no linting errors after Prettier fix (4 pre-existing warnings in unrelated files)
  - [x] 5.3 Run `yarn build` — build succeeds

## Dev Notes

### Technical Requirements

- **Vuetify `v-btn`**: Use `icon`, `variant="elevated"`, `color="secondary"`, `size="small"` — elevated gives the FAB a subtle shadow making it float above message content. `color="secondary"` resolves to magenta `#C4105B` via `nativeChatTheme`
- **Vue `<Transition>`**: Named `nc-scroll-fab` — follows project convention of `nc-` prefix on all transition names. Use `v-show` (not `v-if`) to avoid remounting on every scroll toggle
- **No new composable or state changes**: The `isNearBottom` ref and `scrollToBottom()` function already exist in MessageList.vue — this story only adds the visual FAB element and its CSS

### Architecture Compliance

- **CSS isolation**: All styles inside `@layer native-chat { }` + `<style scoped>` — no exceptions
- **Theme tokens only**: `color="secondary"` on `v-btn` — never hardcode `#C4105B`
- **Icon convention**: Custom SVG in `src/icons/IconArrowDown.vue` with `currentColor` — no external icon library deps [Source: project-context.md#Code Quality & Style Rules]
- **Component hierarchy unchanged**: FAB lives inside MessageList.vue — no new component file for the button itself (it's just a `v-btn` in the template)
- **Provide/inject**: No changes — FAB reads `isNearBottom` directly (local ref), not from `useChat()`

### Library & Framework Requirements

- **Vuetify `v-btn`**: Already a project dependency. Props: `icon` (boolean — renders as circular icon button), `variant="elevated"` (Material Design elevation with shadow), `color="secondary"`, `size="small"` (32px diameter — meets 44px tap target via Vuetify's internal hit area expansion)
- **Vue `<Transition>`**: Built-in Vue component — no additional import needed, just use in template
- **No new dependencies**: Zero new runtime or dev dependencies

### File Structure Requirements

**Files to CREATE (1):**

| File | Purpose |
|------|---------|
| `src/icons/IconArrowDown.vue` | Down-arrow SVG icon for the FAB button |

**Files to MODIFY (2):**

| File | Nature of Change |
|------|-----------------|
| `src/components/MessageList.vue` | Template: wrapper div + FAB button with Transition. Script: import IconArrowDown. CSS: wrapper positioning, FAB absolute positioning, transition classes, prefers-reduced-motion |
| `src/components/__tests__/MessageList.test.ts` | Add 5 new test cases for FAB visibility, click behavior, accessibility |

**Files NOT touched:**
- No composable changes (`useChat.ts` unchanged)
- No source type changes (build declarations in `dist/types/` regenerated by `yarn build`)
- No theme changes (`nativeChatTheme.ts` unchanged — `secondary` color already defined)
- No API changes
- No other component changes

### Testing Requirements

- **Mount helper**: Use existing `mountMessageList()` — provides full Vuetify + chat state context
- **Scroll mocking pattern**: Follow existing pattern — `Object.defineProperty` on `scrollHeight`, `scrollTop`, `clientHeight`, then `dispatchEvent(new Event('scroll'))`
- **FAB selector**: `.nc-scroll-fab` class on the positioned button element, or find `v-btn` with `aria-label="Scroll to latest messages"`
- **Transition testing**: Vue Test Utils doesn't animate transitions in unit tests — test visibility via `v-show` binding (element style `display: none` vs visible), not transition classes

### Previous Story Intelligence (7.1 + 7.2)

**Key learnings from Story 7.1 (Event-Driven Scroll Policy):**
- Refactored MessageList.vue scroll watcher from single `isNearBottom` gate to tail-ID tracking
- `isNearBottom` ref remains but is now used only for the scroll threshold check — NOT for controlling auto-scroll on new messages
- `scrollToBottom()` is a simple `el.scrollTop = el.scrollHeight` — no smooth scrolling
- Scroll event listener attached in `onMounted`, removed in `onBeforeUnmount`

**Key learnings from Story 7.2 (Anchor-Based Scroll Preservation):**
- VInfiniteScroll handles scroll preservation natively for `side="start"` — do NOT add custom scroll adjustment code
- Custom scroll code (delta-based, anchor-based, overflow-anchor CSS) all CONFLICTED with VInfiniteScroll
- `handleLoadMore` was simplified to just `loadMore()` + `done()` + animation suppression
- `scrollContainerRef` points to the `v-infinite-scroll` element (a `ComponentPublicInstance`), access the DOM via `.$el`

**Critical for this story:**
- `isNearBottom` is already reactive and updated on every scroll event — perfect for FAB visibility binding
- `scrollToBottom()` already exists and works — just call it from FAB click handler
- No need to modify any scroll logic — this story is purely additive (new UI element + CSS)

### Git Intelligence

**Recent commit patterns (Epic 7):**
```
a3c4445 feat: delegate scroll preservation to VInfiniteScroll — remove redundant custom handling (Story 7.2)
d96a83c docs: update planning artifacts and build type maps for Epic 7
4ac7d4a feat: refactor scroll to event-driven policy — force scroll on send/response, preserve on prepend (Story 7.1)
```

**Patterns established:**
- Commit message format: `feat: {description} (Story X.Y)`
- Stories 7.1 and 7.2 both only modified `MessageList.vue` and its test file
- Epic 7 is surgically scoped — no composable or API changes

### Project Structure Notes

- Alignment with unified project structure: icon in `src/icons/` (PascalCase with `Icon` prefix), component changes in `src/components/`, tests co-located in `__tests__/`
- No detected conflicts or variances — this story follows the exact same pattern as Stories 7.1 and 7.2

### References

- [Source: epics.md#Story 7.3] — Acceptance criteria and FR29 coverage
- [Source: architecture.md#Component Boundaries] — MessageList FAB specification: "scroll-to-bottom FAB (`v-btn` icon, down-arrow) that appears when user has scrolled up past ~50px from bottom"
- [Source: ux-design-specification.md#Scroll Behavior Patterns] — "Scroll-to-bottom affordance: A floating down-arrow button appears when the user has scrolled up past the near-bottom threshold"
- [Source: project-context.md#Vue & Vuetify Rules] — Animation conventions: `nc-` prefix, `prefers-reduced-motion` required
- [Source: 7-2-anchor-based-scroll-preservation.md#Dev Notes] — VInfiniteScroll handles scroll natively, `isNearBottom` + `scrollToBottom()` already exist
- [Source: src/components/MessageList.vue:11-13] — `isNearBottom` ref and `SCROLL_THRESHOLD = 50` already defined
- [Source: src/components/MessageList.vue:51-55] — `scrollToBottom()` function already implemented

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

No debug issues encountered. Implementation was purely additive — no scroll logic changes needed.

### Completion Notes List

- Created `IconArrowDown.vue` with custom arrow-down SVG path (user-provided, not chevron), following existing icon conventions (`currentColor` fill, `viewBox="0 0 24 24"`)
- Wrapped `<v-infinite-scroll>` in `.nc-message-list-wrapper` div with `position: relative` for FAB absolute positioning
- Added `<Transition name="nc-scroll-fab">` wrapping a positioning `<div>` + `<v-btn>` with props: `icon`, `variant="elevated"`, `color="surface"`, `size="small"`, `aria-label="Scroll to latest messages"`
- **Design refinements per user feedback**:
  - Changed `color="secondary"` (magenta) to `color="surface"` (white) — cleaner look against chat background
  - Centered FAB horizontally (`left: 50%; transform: translateX(-50%)`) instead of bottom-right
  - Positioned close to input (`bottom: 5px`) per user preference
  - Used `<v-icon :icon="IconArrowDown">` instead of direct component render
  - Renamed icon from `IconChevronDown` to `IconArrowDown` with user-provided arrow SVG path
- **Layout fix**: Wrapped `v-btn` in a plain `<div class="nc-scroll-fab">` with `v-show` and absolute positioning — avoids Vuetify's `position: relative` override on `v-btn` (Vuetify un-layered styles beat `@layer native-chat`)
- FAB visibility bound to existing `isNearBottom` ref via `v-show="!isNearBottom"` on wrapper div — no new state
- FAB click handler calls existing `scrollToBottom()` — no new logic
- CSS: wrapper flex layout, FAB absolute center positioning (bottom 5px), opacity+scale+translateY transition (200ms), `prefers-reduced-motion` override (0ms)
- All styles inside `@layer native-chat { }` + `<style scoped>` per architecture requirements
- 5 new test cases added covering: initial hidden state, visibility on scroll-up, click-to-scroll behavior, aria-label accessibility, disappearance after scroll-to-bottom
- All 26 MessageList tests pass. 1 pre-existing failure in MessageBubble.test.ts (star icon test — unrelated)
- No new dependencies added. Zero composable/type/theme/API changes.

### File List

**Created:**
- `src/icons/IconArrowDown.vue`

**Modified:**
- `src/components/MessageList.vue`
- `src/components/__tests__/MessageList.test.ts`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `_bmad-output/implementation-artifacts/7-3-scroll-to-bottom-fab-button.md`

## Change Log

- 2026-02-24: Implemented scroll-to-bottom FAB button — added IconArrowDown icon (user-provided SVG), white FAB overlay centered horizontally with Transition + v-show, CSS positioning and reduced-motion support, 5 unit tests. Iterated on design: white color, centered position, arrow icon per user feedback (Story 7.3)
- 2026-02-24: Code review fixes — ran Prettier on IconArrowDown.vue (formatting), updated AC #1 to match user-approved changes (color="surface", bottom-center), fixed 3 stale IconChevronDown references in Dev Notes, clarified dist/ build artifacts in File List
