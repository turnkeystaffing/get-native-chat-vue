# Story 6.8: Error Message Visual Distinction

Status: done

Epic: 6 — Figma Design Alignment
Date: 2026-02-23
Depends on: Story 6.7 (VitePress Demo Environment Fixes) — done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want error messages to look visually different from assistant messages,
so that I can immediately recognize when something went wrong.

## Acceptance Criteria

1. **Given** an error message is displayed in the chat **When** comparing it to an assistant message **Then** the error bubble has a subtle red-tinted background (`rgba(error, 0.06)`) **And** the error bubble has a red-tinted border (`rgba(error, 0.2)`) **And** the styling is calm and not alarming — no solid red backgrounds or large alert icons

2. **Given** an error message is displayed **When** inspecting its header **Then** it shows a small muted warning icon and "Error" label (left-aligned) **And** the icon uses the error theme color at reduced opacity

3. **Given** the error styling **When** the nativeChat theme is applied **Then** the error color (`#DE3232`) is used via theme tokens, not hardcoded

4. **Given** the existing calm tone principle **When** evaluating the error visual treatment **Then** the distinction is subtle enough to not feel alarming **And** the error text content remains calm and informational

5. **Given** the existing test suite **When** running `yarn test` **Then** all MessageBubble tests pass (new selectors may need tests added)

## Tasks / Subtasks

- [x] Task 1: Create IconWarning.vue SVG icon component (AC: #2)
  - [x] 1.1 Create `src/icons/IconWarning.vue` following the existing icon pattern (viewBox 0 0 24 24, width/height 1em, fill currentColor, aria-hidden, focusable false)
  - [x] 1.2 Use a simple triangle-with-exclamation SVG path (Material Design `mdi-alert-outline` style or similar lightweight warning icon)
  - [x] 1.3 Verify the icon renders at 14px in isolation

- [x] Task 2: Add error header to MessageBubble.vue template (AC: #2, #4)
  - [x] 2.1 Change the header `v-if` from `!isError` to `true` (show header for ALL message types)
  - [x] 2.2 Add a third template branch for error messages: `<template v-else-if="isError">`
  - [x] 2.3 Error header contains: `<IconWarning class="nc-message-bubble__warning-icon" />` + `<span class="nc-message-bubble__label">Error</span>`
  - [x] 2.4 Import `IconWarning` from `@/icons/IconWarning.vue`

- [x] Task 3: Split error bubble CSS from assistant styling (AC: #1, #3)
  - [x] 3.1 Remove `.nc-message-bubble--error` from the combined assistant+error bubble rule (line 147-152 currently)
  - [x] 3.2 Add new `.nc-message-bubble--error .nc-message-bubble__bubble` rule with: `background: rgba(var(--v-theme-error), 0.06)`, `border: 1px solid rgba(var(--v-theme-error), 0.2)`, `color: rgb(var(--v-theme-on-surface))`
  - [x] 3.3 Add `.nc-message-bubble__warning-icon` styling: `font-size: 14px`, `color: rgba(var(--v-theme-error), 0.6)`

- [x] Task 4: Update tests for error visual distinction (AC: #5)
  - [x] 4.1 Update test "does not show assistant label/icon for error messages" → now it SHOULD show error header with warning icon and "Error" label
  - [x] 4.2 Add test: error message renders with error header containing warning icon and "Error" label
  - [x] 4.3 Add test: error message has `nc-message-bubble--error` class (existing — verify still passes)
  - [x] 4.4 Run `yarn test` — all tests must pass

## Dev Notes

### Root Cause / Context

Currently, error messages in the chat have **no visual distinction** from assistant messages — they share the exact same white bubble with gray border styling (lines 147-152 of MessageBubble.vue). The only difference is the absence of the "AI Assistant" header (the `v-if="!isError"` on line 72 hides the header entirely for error messages).

This means users cannot tell at a glance whether a message is a normal assistant response or an error notification. The UX spec's "calm over anxiety" principle is maintained — the error treatment uses extremely subtle visual cues (6% opacity background tint, 20% opacity border tint) that are nearly invisible but create just enough distinction for recognition.

### Solution

**Three changes to MessageBubble.vue:**

1. **Template:** Replace `v-if="!isError"` with always-visible header. Add error-specific header branch with `<IconWarning>` + "Error" label.

2. **CSS:** Split the combined `.nc-message-bubble--assistant, .nc-message-bubble--error` bubble rule. Error gets its own rule with `rgba(var(--v-theme-error), 0.06)` background and `rgba(var(--v-theme-error), 0.2)` border.

3. **New icon:** `src/icons/IconWarning.vue` — lightweight SVG warning icon matching existing icon component pattern.

**Template structure (after change):**

```vue
<!-- BEFORE -->
<div v-if="!isError" class="nc-message-bubble__header">
  <template v-if="isUser">...</template>
  <template v-else>...</template>
</div>

<!-- AFTER -->
<div class="nc-message-bubble__header">
  <template v-if="isUser">
    <span class="nc-message-bubble__label">You</span>
  </template>
  <template v-else-if="isError">
    <IconWarning class="nc-message-bubble__warning-icon" />
    <span class="nc-message-bubble__label">Error</span>
  </template>
  <template v-else>
    <IconStar class="nc-message-bubble__star" />
    <span class="nc-message-bubble__label">AI Assistant</span>
  </template>
</div>
```

**CSS change:**

```css
/* BEFORE: combined rule */
.nc-message-bubble--assistant .nc-message-bubble__bubble,
.nc-message-bubble--error .nc-message-bubble__bubble {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  color: rgb(var(--v-theme-on-surface));
}

/* AFTER: separate rules */
.nc-message-bubble--assistant .nc-message-bubble__bubble {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  color: rgb(var(--v-theme-on-surface));
}

.nc-message-bubble--error .nc-message-bubble__bubble {
  background: rgba(var(--v-theme-error), 0.06);
  border: 1px solid rgba(var(--v-theme-error), 0.2);
  color: rgb(var(--v-theme-on-surface));
}

.nc-message-bubble__warning-icon {
  font-size: 14px;
  color: rgba(var(--v-theme-error), 0.6);
}
```

### Scope

This is a template + CSS change to one component, plus a new icon component. **No script logic changes** to MessageBubble.vue beyond importing IconWarning. No composable changes. No state changes. No new dependencies.

### Key Implementation Details

**Theme token usage:**
- `--v-theme-error` is already defined in `nativeChatTheme.ts` (line 15): `error: '#DE3232'`
- Vuetify resolves this as RGB components: `var(--v-theme-error)` → `222,50,50`
- `rgba(var(--v-theme-error), 0.06)` produces a nearly invisible red tint
- `rgba(var(--v-theme-error), 0.2)` produces a subtle red border

**Icon component pattern:**
- Follow existing pattern from `IconStar.vue`: `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">`
- Use a simple outline-style warning triangle (lighter visual weight than a filled icon)
- The icon will inherit `color` from the CSS class `nc-message-bubble__warning-icon`

**isError detection (existing, no changes needed):**
- `src/components/MessageBubble.vue:20-22` — checks `message.status === 'failed'` OR `message.id.startsWith('error-')`
- Error messages are created in `useChat.ts` with id prefix `error-` and role `assistant`

**Test impact:**
- The test "does not show assistant label/icon for error messages" (line 229-237) currently asserts that `.nc-message-bubble__header` does NOT exist for error messages. This test MUST be updated because now errors DO have a header (with warning icon + "Error" label instead of star icon + "AI Assistant" label).
- New test should verify error header contains: `IconWarning` component + "Error" label text
- All other existing tests should continue to pass without changes

### What NOT to Change

- **No changes to `useChat.ts`** — error creation logic is correct as-is
- **No changes to `nativeChatTheme.ts`** — error color already defined
- **No changes to `MessageList.vue`** — animation tracking and rendering unchanged
- **No changes to error text content** — the calm tone is maintained in the composable
- **No changes to ChatPanel.vue** — only MessageBubble is affected
- **No new runtime dependencies**

### Project Structure Notes

**Files CREATED (1 file):**

| File | Purpose |
|------|---------|
| `src/icons/IconWarning.vue` | SVG warning icon (triangle with exclamation), follows existing icon pattern |

**Files MODIFIED (2 files):**

| File | Nature of Change |
|------|-----------------|
| `src/components/MessageBubble.vue` | Template: show header for error messages with IconWarning + "Error" label. CSS: split error bubble from assistant styling, add red-tinted background/border |
| `src/components/__tests__/MessageBubble.test.ts` | Update error header test, add new test for error visual distinction |

**Alignment with project structure:**
- `IconWarning.vue` follows naming convention in `src/icons/` (PascalCase, Icon prefix)
- All CSS changes within `@layer native-chat` + `<style scoped>`
- All colors via theme tokens (no hardcoded hex)
- Import via `@/icons/IconWarning.vue` (@ alias, not relative path)

### References

- [Source: epics.md#Story 6.8] — Acceptance criteria: subtle red-tinted background/border, warning icon + "Error" label, calm distinction
- [Source: src/components/MessageBubble.vue:72] — Current `v-if="!isError"` that hides header for errors
- [Source: src/components/MessageBubble.vue:147-152] — Combined assistant+error bubble CSS rule to split
- [Source: src/theme/nativeChatTheme.ts:15] — Error color: `#DE3232` already defined
- [Source: src/components/MessageBubble.vue:20-22] — isError computed: checks status 'failed' OR id prefix 'error-'
- [Source: src/components/__tests__/MessageBubble.test.ts:229-237] — Test to update: "does not show assistant label/icon for error messages"
- [Source: src/icons/IconStar.vue] — Icon component pattern to follow
- [Source: ux-design-specification.md#Feedback Patterns] — "No red backgrounds, no alert icons" → 6% opacity tint satisfies this
- [Source: architecture.md#Error & Loading Patterns] — Errors rendered as MessageBubble variant="error"
- [Source: project-context.md#CSS isolation] — All four layers: @layer, scoped, nc- prefix, v-theme-provider

### Library & Framework Requirements

**No new dependencies.** All Vuetify theme tokens (`--v-theme-error`) already available. `IconWarning.vue` is a custom SVG component — no icon library needed (following project convention of custom SVG icons in `src/icons/`).

### File Structure Requirements

All changes within established patterns:
- `src/icons/IconWarning.vue`: new file following PascalCase Icon-prefix naming convention
- `src/components/MessageBubble.vue`: template + CSS changes within existing `@layer native-chat` block and `<style scoped>`
- `src/components/__tests__/MessageBubble.test.ts`: test updates within existing test file

### Testing Requirements

**Run:** `yarn test`

**Expected:** All tests pass (194 baseline from Story 6.7 + any new tests added)

**Tests to UPDATE:**
- `MessageBubble.test.ts` line 229-237: "does not show assistant label/icon for error messages" — this test must be rewritten because error messages now DO show a header. New assertion: `.nc-message-bubble__header` exists, contains "Error" text, and does NOT contain "AI Assistant" text or star icon.

**Tests to ADD:**
- Error message header shows warning icon and "Error" label
- Error message does not show assistant star icon or "AI Assistant" label
- Verify `nc-message-bubble--error` class still applied correctly (existing tests should cover — verify)

**No test changes needed for:**
- Copy button tests (copy only appears on assistant, not error — unchanged)
- User message tests
- Animation tests
- Accessibility tests (aria-label "Error message" — already tested)

### Previous Story Intelligence

**From Story 6.7 (VitePress Demo Environment Fixes — done):**
- 194 tests passing after Story 6.7
- Critical: `with-background` prop needed on `v-theme-provider` inside Teleport to emit actual DOM element with CSS variables
- VitePress CSS bleed: unlayered styles beat layered — for plugin-internal styles within `@layer native-chat` and `<style scoped>`, this is NOT an issue (scoped specificity wins within the component)
- Commit convention: `feat: {description} (Story X.Y)`
- Agent model: Claude Opus 4.6

**From Story 6.6 (Chat Input Redesign — done):**
- Pattern: Vuetify props for styling (e.g., `variant="plain"`, `color="secondary"`)
- `v-progress-circular` is built-in Vuetify, no import needed
- ChatInput test selectors were updated — tests use `.nc-*` classes

**From Story 6.5 (Message Bubble Animations — done):**
- MessageBubble has `animate` prop and CSS keyframes
- Animation classes combine: `nc-message-bubble--animate-in.nc-message-bubble--error`
- `prefers-reduced-motion: reduce` disables animations

### Git Intelligence

Last 5 commits (all Epic 6):
- `b84e385` feat: fix VitePress theme colors and markdown list rendering (Story 6.7)
- `6b64438` feat: redesign chat input with inline send button and loading spinner (Story 6.6)
- `9dc9ab7` feat: add chat panel transitions and message bubble entrance animations (Stories 6.4, 6.5)
- `0271f7f` feat: update planning artifacts — remove v-navigation-drawer references (Story 6.3)
- `f9e2a8a` feat: visual polish — figma spacing for bubbles, messages, input (Story 6.2)

**Files modified in recent commits relevant to this story:**
- `src/components/MessageBubble.vue` — modified in Stories 6.2 (padding), 6.4/6.5 (animation), 6.7 (list resets)
- `src/icons/` — all 5 icon files created in earlier epics (1, 2)

**Suggested commit message:**
```
feat: add error message visual distinction with warning icon and subtle red tint (Story 6.8)
```

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Integration test `SendReceiveFlow.test.ts` line 461 also asserted no header on error bubbles — fixed alongside MessageBubble unit tests.

### Completion Notes List

- Created `IconWarning.vue` SVG icon component following existing IconStar.vue pattern (triangle-with-exclamation outline)
- Updated MessageBubble.vue template: removed `v-if="!isError"` from header, added error-specific branch with IconWarning + "Error" label
- Split combined assistant+error CSS rule into separate rules; error bubble now has subtle red-tinted background (`rgba(error, 0.06)`) and border (`rgba(error, 0.2)`) using theme tokens
- Added `.nc-message-bubble__warning-icon` CSS rule (14px, `rgba(error, 0.6)`)
- Updated MessageBubble.test.ts: rewrote error header test to verify warning icon + "Error" label presence
- Updated SendReceiveFlow.test.ts: fixed integration test that asserted no header on error messages
- All 194 tests pass, zero regressions

### File List

**Created:**
- `src/icons/IconWarning.vue`

**Modified:**
- `src/components/MessageBubble.vue`
- `src/components/__tests__/MessageBubble.test.ts`
- `src/components/__tests__/SendReceiveFlow.test.ts`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `_bmad-output/implementation-artifacts/6-8-error-message-visual-distinction.md`
- `_bmad-output/planning-artifacts/ux-design-specification.md` (review fix: updated error feedback pattern to reflect Story 6.8 refinement)

### Change Log

- 2026-02-23: Implemented error message visual distinction — error bubbles now have subtle red-tinted background/border via theme tokens, warning icon + "Error" label in header. All 194 tests pass. Sprint-status.yaml updated to "review". (Story 6.8)
- 2026-02-23: Code review fixes — added test for `status: 'failed'` error header rendering, added test for assistant header content (star icon + "AI Assistant" label), updated UX spec to document error visual distinction refinement. (Review)
