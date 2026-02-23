# Story 6.9: Panel & Header UI Polish

Status: done

Epic: 6 — Figma Design Alignment
Date: 2026-02-23
Depends on: Story 6.8 (Error Message Visual Distinction) — done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want the chat header and panel to have polished visual details,
so that the widget feels refined and professional.

## Acceptance Criteria

1. **Given** `hideToggleWhenOpen` is `true` **When** the chat panel is open **Then** the floating trigger button is hidden (`v-show` false) **And** no button shadow bleeds through the panel

2. **Given** `hideToggleWhenOpen` is `true` **When** the chat panel is closed **Then** the floating trigger button is visible **And** its elevation is `4` (normal shadow)

3. **Given** the chat header is rendered **When** inspecting the bottom edge **Then** a subtle divider line is visible (`1px solid` at 12% opacity of the on-surface color)

4. **Given** the close (X) button in the header **When** inspecting its size **Then** the button uses `size="default"` (not `size="small"`) **And** the icon uses `size="22"` (not `size="18"`) **And** the button meets the 44px minimum tap target

5. **Given** the close button **When** the user hovers over it **Then** no dark background appears **And** the button uses `variant="plain"` (opacity change only on hover)

6. **Given** the existing test suite **When** running `yarn test` **Then** all tests pass

## Tasks / Subtasks

- [x] Task 1: Add hideToggleWhenOpen config option to hide FAB when panel is open (AC: #1, #2)
  - [x] 1.1 Add `hideToggleWhenOpen?: boolean` to `NativeChatPluginOptions` in `src/types/config.ts`
  - [x] 1.2 Add `isHidden` computed in FloatingButton.vue — true when `isOpen && config.hideToggleWhenOpen`
  - [x] 1.3 Add `v-show="!isHidden"` to wrapper div — FAB hidden when open (if configured), visible by default

- [x] Task 2: Add border-bottom divider to ChatHeader (AC: #3)
  - [x] 2.1 Add `border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);` to the `.nc-chat-header` CSS rule in ChatHeader.vue
  - [x] 2.2 Verify visually: subtle divider line visible below the header, separating it from the message area

- [x] Task 3: Increase close button size and change variant in ChatHeader (AC: #4, #5)
  - [x] 3.1 Change `size="small"` to `size="default"` on the close `<v-btn>` (line 16)
  - [x] 3.2 Change `variant="text"` to `variant="plain"` on the close `<v-btn>` (line 16)
  - [x] 3.3 Change icon `size="18"` to `size="22"` on the close `<v-icon>` (line 17)
  - [x] 3.4 Verify: button meets 44px minimum tap target (Vuetify `size="default"` renders at 48px)
  - [x] 3.5 Verify: hover shows opacity change only (no dark background fill) — `variant="plain"` behavior

- [x] Task 4: Update tests (AC: #6)
  - [x] 4.1 Update FloatingButton test: add tests for hideToggleWhenOpen behavior (visible by default, hidden when open+configured, visible when closed+configured)
  - [x] 4.2 Update ChatHeader test: verify close button uses `variant="plain"` (not `variant="text"`)
  - [x] 4.3 Update ChatHeader test: verify close button uses `size="default"` (not `size="small"`)
  - [x] 4.4 Run `yarn test` — all tests must pass

## Dev Notes

### Root Cause / Context

The current implementation has three minor visual discrepancies from the approved Figma design:

1. **FloatingButton shadow bleeds through the panel.** The FAB uses a static `elevation="4"` (line 42 of `FloatingButton.vue`), which means its shadow is visible even when the chat panel is open. Since the panel sits at `z-index: 10000` and the FAB at `z-index: 9999`, the shadow can bleed through the panel's background, especially near rounded corners.

2. **ChatHeader has no bottom divider.** The header flows directly into the message area with no visual separation. The Figma design shows a subtle `1px` divider line at the bottom of the header.

3. **Close button is too small and has wrong hover style.** The close button currently uses `size="small"` (36px rendered) and `variant="text"` (dark background on hover). The Figma design shows a larger button meeting the 44px tap target and a plain hover effect (opacity change only, no background fill).

### Solution

**Targeted CSS/template changes across three files:**

1. **FloatingButton.vue** — Add `hideToggleWhenOpen` config support. New `isHidden` computed wraps `isOpen && config.hideToggleWhenOpen`. Wrapper div uses `v-show="!isHidden"` to hide FAB when panel is open (if configured). New `hideToggleWhenOpen?: boolean` added to `NativeChatPluginOptions` in `config.ts`.

2. **ChatHeader.vue** — Add `border-bottom` CSS rule to `.nc-chat-header`. Change close button from `variant="text" size="small"` to `variant="plain" size="default"`. Change close icon from `size="18"` to `size="22"`.

**config.ts change:**

```typescript
// ADDED to NativeChatPluginOptions
hideToggleWhenOpen?: boolean
```

**FloatingButton.vue changes:**

```vue
<!-- ADDED (line 12) -->
const isHidden = computed(() => isOpen.value && (config?.hideToggleWhenOpen ?? false))

<!-- BEFORE (line 35) -->
<div class="nc-floating-button-wrapper" :class="positionClass">

<!-- AFTER -->
<div v-show="!isHidden" class="nc-floating-button-wrapper" :class="positionClass">
```

**ChatHeader.vue template change:**

```vue
<!-- BEFORE (line 16-18) -->
<v-btn icon variant="text" size="small" aria-label="Close chat" @click="chatState.close()">
  <v-icon :icon="IconClose" size="18" />
</v-btn>

<!-- AFTER -->
<v-btn icon variant="plain" size="default" aria-label="Close chat" @click="chatState.close()">
  <v-icon :icon="IconClose" size="22" />
</v-btn>
```

**ChatHeader.vue CSS change:**

```css
/* BEFORE */
.nc-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

/* AFTER */
.nc-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}
```

### Scope

This is a minimal visual polish story. **No script logic changes** beyond binding the existing `isOpen` computed property to the `elevation` prop. No composable changes. No state changes. No new dependencies. No new files created.

### Key Implementation Details

**hideToggleWhenOpen on FloatingButton:**
- The `isOpen` computed property already exists on line 11: `const isOpen = computed(() => chatState.isOpen.value)`
- New `isHidden` computed on line 12: `isOpen.value && (config?.hideToggleWhenOpen ?? false)`
- Uses `v-show` (not `v-if`) to preserve DOM and avoid mount/unmount overhead
- Defaults to `false` — FAB stays visible for backward compatibility
- When enabled, hides the entire FAB when panel is open, eliminating shadow bleed-through

**ChatHeader border-bottom:**
- Uses `rgba(var(--v-theme-on-surface), 0.12)` — the same 12% opacity pattern used throughout the project (e.g., assistant bubble border in MessageBubble.vue)
- This is a Vuetify theme token, not a hardcoded color
- The divider is built into the header component, not a separate `v-divider` — simpler and avoids extra DOM

**Close button variant change:**
- `variant="text"` shows a visible dark background rectangle on hover/focus
- `variant="plain"` shows only an opacity change on hover/focus — more subtle, matches Figma
- Vuetify `size="default"` renders the button at 48px (exceeding the 44px minimum tap target)
- Icon `size="22"` is proportionally correct for the larger button (was 18px in a 36px button = 50%, now 22px in a 48px button = 46%)

**isOpen detection in FloatingButton (existing, no changes needed):**
- `FloatingButton.vue:11` — `const isOpen = computed(() => chatState.isOpen.value)`
- Already available as a computed property, used for aria-label and icon swap
- Simply needs to be referenced in the `:elevation` binding

**Test impact:**
- FloatingButton tests: currently test `elevation` via `expect(btn.props('size'))` pattern but do NOT test elevation directly. Need to add tests for dynamic elevation.
- ChatHeader tests: currently test close button exists, aria-label, and click handler. Tests for `size` and `variant` props may need updating or adding.
- No other test files affected — changes are limited to FloatingButton.vue and ChatHeader.vue

### What NOT to Change

- **No changes to `ChatPanel.vue`** — panel layout, z-index, and transitions are correct
- **No changes to `useChat.ts`** — state management unchanged
- **No changes to `NativeChatWidget.vue`** — root wrapper unaffected
- **No changes to any icon components** — existing IconClose is used as-is
- **No changes to `nativeChatTheme.ts`** — all colors already defined
- **No changes to `MessageBubble.vue`, `MessageList.vue`, `ChatInput.vue`, `WelcomeState.vue`**
- **No new runtime dependencies**

### Project Structure Notes

**Files MODIFIED (4 files):**

| File | Nature of Change |
|------|-----------------|
| `src/components/FloatingButton.vue` | Template: bind elevation dynamically to isOpen state |
| `src/components/ChatHeader.vue` | Template: close button `variant="plain"` + `size="default"`, icon `size="22"`. CSS: add `border-bottom` to `.nc-chat-header` |
| `src/components/__tests__/FloatingButton.test.ts` | Add test for dynamic elevation (0 when open, 4 when closed) |
| `src/components/__tests__/ChatHeader.test.ts` | Update/add tests for close button variant and size |

**Alignment with project structure:**
- All changes within existing files — no new files created
- All CSS changes within `@layer native-chat` + `<style scoped>`
- All colors via theme tokens (no hardcoded hex)
- Import via `@/` alias (no relative paths)

### References

- [Source: epics.md#Story 6.9] — Acceptance criteria: dynamic elevation, header divider, close button size/variant
- [Source: src/components/FloatingButton.vue:42] — Current `elevation="4"` hardcoded attribute
- [Source: src/components/FloatingButton.vue:11] — `isOpen` computed property already available
- [Source: src/components/ChatHeader.vue:16] — Current `variant="text" size="small"` on close button
- [Source: src/components/ChatHeader.vue:17] — Current icon `size="18"`
- [Source: src/components/ChatHeader.vue:25-29] — `.nc-chat-header` CSS rule (no border-bottom)
- [Source: src/components/ChatPanel.vue:84] — Panel uses `box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12)` — FAB shadow should not bleed through
- [Source: ux-design-specification.md#Accessibility Considerations] — 44px minimum tap target requirement
- [Source: architecture.md#Component Patterns] — Vuetify theme tokens only, no hardcoded colors
- [Source: project-context.md#Vue & Vuetify Rules] — Colors via theme tokens: `rgb(var(--v-theme-primary))`

### Library & Framework Requirements

**No new dependencies.** All Vuetify props (`elevation`, `variant`, `size`) are standard component APIs already in use. `rgba(var(--v-theme-on-surface), 0.12)` is a standard Vuetify theme token pattern used elsewhere in the project.

### File Structure Requirements

All changes within established patterns — no new files, no directory changes:
- `src/components/FloatingButton.vue`: template attribute change (1 line)
- `src/components/ChatHeader.vue`: template prop changes (2 lines) + CSS addition (1 line)
- `src/components/__tests__/FloatingButton.test.ts`: new test cases
- `src/components/__tests__/ChatHeader.test.ts`: updated/new test cases

### Testing Requirements

**Run:** `yarn test`

**Expected:** All tests pass (194 baseline from Story 6.8 + any new tests added)

**Tests to ADD (FloatingButton.test.ts):**
- FloatingButton is visible when open and hideToggleWhenOpen is false (default)
- FloatingButton is hidden when open and hideToggleWhenOpen is true
- FloatingButton is visible when closed and hideToggleWhenOpen is true
- FloatingButton elevation is 4 (static)

**Tests to UPDATE/ADD (ChatHeader.test.ts):**
- Close button uses `variant="plain"` (was `variant="text"`)
- Close button uses `size="default"` (was `size="small"`)
- Close icon uses `size="22"`
- Existing tests (close button exists, aria-label, click handler) should pass without changes

**No test changes needed for:**
- MessageBubble tests
- ChatInput tests
- ChatPanel tests
- MessageList tests
- Integration tests (SendReceiveFlow.test.ts)

### Previous Story Intelligence

**From Story 6.8 (Error Message Visual Distinction — done):**
- 194 tests passing after Story 6.8
- Commit convention: `feat: {description} (Story X.Y)`
- Agent model: Claude Opus 4.6
- Vuetify theme tokens work correctly: `rgba(var(--v-theme-error), 0.06)` — same pattern used for divider border
- No integration test (`SendReceiveFlow.test.ts`) changes expected for this story

**From Story 6.7 (VitePress Demo Environment Fixes — done):**
- `with-background` prop on `v-theme-provider` — already in place, no changes needed
- Theme CSS variables available inside Teleported panel

**From Story 6.6 (Chat Input Redesign — done):**
- Vuetify prop patterns: `variant="plain"` already used on ChatInput send button — same pattern needed for ChatHeader close button
- ChatInput already demonstrates the `variant="plain"` hover behavior (opacity only, no background)

### Git Intelligence

Last 5 commits (all Epic 6):
- `3fe241b` feat: add error message visual distinction with warning icon and subtle red tint (Story 6.8)
- `b84e385` feat: fix VitePress theme colors and markdown list rendering (Story 6.7)
- `6b64438` feat: redesign chat input with inline send button and loading spinner (Story 6.6)
- `9dc9ab7` feat: add chat panel transitions and message bubble entrance animations (Stories 6.4, 6.5)
- `0271f7f` feat: update planning artifacts — remove v-navigation-drawer references (Story 6.3)

**Suggested commit message:**
```
feat: polish panel header UI — dynamic FAB elevation, header divider, close button sizing (Story 6.9)
```

## Change Log

- 2026-02-23: Implemented all 4 tasks — hideToggleWhenOpen config option, header divider, close button sizing/variant, and tests. All 201 tests pass with zero regressions. User rejected original AC #1/#2 (dynamic elevation) as unnecessary; replaced with configurable FAB hide option. (Story 6.9)
- 2026-02-23: Code review fixes — updated ACs #1/#2 to reflect hideToggleWhenOpen (replacing dynamic elevation), corrected Dev Notes solution section, added missing icon size="22" test and elevation prop test (203 tests), updated File List with sprint-status.yaml, updated architecture doc with hideToggleWhenOpen option. (Review)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No debug issues encountered. All changes were straightforward template/CSS modifications.

### Completion Notes List

- Task 1: Added `hideToggleWhenOpen?: boolean` to NativeChatPluginOptions. FloatingButton uses `v-show="!isHidden"` with computed `isHidden = isOpen && config.hideToggleWhenOpen`. FAB visible by default for backward compat.
- Task 2: Added `border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12)` to `.nc-chat-header` in ChatHeader.vue. Uses Vuetify theme token pattern consistent with rest of project.
- Task 3: Changed close button from `variant="text" size="small"` to `variant="plain" size="default"`, icon from `size="18"` to `size="22"`. Button now renders at 48px (exceeds 44px tap target). Hover shows opacity-only change.
- Task 4: Added 3 hideToggleWhenOpen tests + 1 elevation test to FloatingButton.test.ts, 3 prop tests (variant, size, icon size) to ChatHeader.test.ts. Full suite: 203 tests pass.

### File List

- `src/types/config.ts` — Modified: added `hideToggleWhenOpen?: boolean` to NativeChatPluginOptions
- `src/components/FloatingButton.vue` — Modified: added `isHidden` computed + `v-show="!isHidden"` for configurable FAB hiding
- `src/components/ChatHeader.vue` — Modified: close button `variant="plain"` + `size="default"`, icon `size="22"`, CSS `border-bottom` divider
- `src/components/__tests__/FloatingButton.test.ts` — Modified: added 3 tests for hideToggleWhenOpen behavior + 1 elevation test
- `src/components/__tests__/ChatHeader.test.ts` — Modified: added 3 tests for close button variant, size, and icon size props
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Modified: sprint tracking status update (workflow artifact)
