# Story 6.7: VitePress Demo Environment Fixes

Status: done

Epic: 6 — Figma Design Alignment
Date: 2026-02-23
Depends on: Story 6.6 (Chat Input Redesign) — done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer viewing the docs site,
I want the chat widget to display with correct theme colors and unbroken markdown rendering,
so that the demo accurately represents how the plugin looks in production.

## Acceptance Criteria

1. **Given** the VitePress docs site is running (`yarn docs:dev`) **When** the chat widget opens **Then** user message bubbles use primary color `#002B38` (not Vuetify default `#1867C0`) **And** the send button and floating button use secondary color `#C4105B` **And** the chat panel has a white (`#FFFFFF`) background **And** all theme token CSS variables resolve to nativeChatTheme values

2. **Given** the chat panel is rendered via Teleport to body **When** inspecting the DOM **Then** the teleported content is wrapped in `<v-theme-provider theme="nativeChat">` **And** theme CSS variables (`--v-theme-primary`, `--v-theme-surface`, etc.) are available inside the panel

3. **Given** an assistant message contains markdown with bullet lists (`ul`, `li`) **When** rendered in the VitePress docs site **Then** the list renders with proper bullet markers (not stripped by VitePress global CSS) **And** list item spacing matches the plugin's own styles, not VitePress defaults

4. **Given** the chat panel is open **When** inspecting the panel background **Then** the background is fully opaque (`rgb(var(--v-theme-surface))` resolves to `#FFFFFF`) **And** the floating button shadow is not visible through the panel

5. **Given** the existing test suite **When** running `yarn test` **Then** all tests pass

## Tasks / Subtasks

- [x] Task 1: Add v-theme-provider inside ChatPanel.vue Teleport (AC: #1, #2, #4)
  - [x] 1.1 Wrap the `<Transition>` element inside `<Teleport to="body">` with `<v-theme-provider theme="nativeChat">`
  - [x] 1.2 Import `VThemeProvider` if not auto-resolved by Vuetify (may not need explicit import)
  - [x] 1.3 Verify that `--v-theme-primary`, `--v-theme-secondary`, `--v-theme-surface` CSS variables are now defined on the teleported panel DOM subtree
  - [x] 1.4 Confirm panel background resolves to `#FFFFFF` via `rgb(var(--v-theme-surface))`

- [x] Task 2: Add CSS list style resets in MessageBubble.vue (AC: #3)
  - [x] 2.1 Add `list-style-type: disc` to `.nc-message-bubble__content :deep(ul)` to restore bullet markers stripped by VitePress
  - [x] 2.2 Add `list-style-type: decimal` to `.nc-message-bubble__content :deep(ol)` to restore numbered list markers
  - [x] 2.3 Add `list-style-position: outside` for proper indentation
  - [x] 2.4 Add `margin-left: 0` and verify `padding-left: 20px` is sufficient for bullet visibility
  - [x] 2.5 Add `:deep(li)` reset: `display: list-item` to prevent VitePress `display: block` override

- [x] Task 3: Verify in VitePress docs environment (AC: #1, #2, #3, #4)
  - [x] 3.1 Run `yarn docs:dev` and open the chat widget
  - [x] 3.2 Verify user bubbles are dark teal (#002B38), not Vuetify default blue
  - [x] 3.3 Verify send button and FAB are magenta (#C4105B)
  - [x] 3.4 Verify panel background is solid white, no transparency/bleed-through
  - [x] 3.5 Send a message and verify assistant response markdown lists have visible bullets
  - [x] 3.6 Inspect DOM: confirm `<v-theme-provider>` wraps the teleported panel content

- [x] Task 4: Run tests and verify no regressions (AC: #5)
  - [x] 4.1 Run `yarn test` — all 194 tests must pass
  - [x] 4.2 If ChatPanel tests check DOM structure, update selectors to account for v-theme-provider wrapper element
  - [x] 4.3 Verify ChatPanel.test.ts and SendReceiveFlow.test.ts still pass

## Dev Notes

### Root Cause Analysis

The core issue is a well-known Vuetify + Vue Teleport interaction:

1. **Theme provider breaks on Teleport:** `NativeChatWidget.vue` (line 48) wraps `<FloatingButton>` and `<ChatPanel>` in `<v-theme-provider theme="nativeChat">`. This sets CSS custom properties (`--v-theme-primary: 0,43,56`, `--v-theme-secondary: 196,16,91`, etc.) on the wrapper DOM element.

2. **Teleport escapes the DOM tree:** `ChatPanel.vue` (line 44) uses `<Teleport to="body">` to render the panel outside the Vue component tree's DOM. The teleported content lands directly under `<body>`, which is **outside** the `<v-theme-provider>` DOM element. CSS custom properties don't inherit from the Vue component tree — they inherit from the **DOM** tree.

3. **Result:** Inside the teleported panel, `--v-theme-primary` is undefined (or falls back to Vuetify's default light theme values: blue `#1867C0` instead of dark teal `#002B38`). All `rgb(var(--v-theme-*))` references resolve to wrong colors.

4. **VitePress CSS bleed:** VitePress applies global styles that reset list markers (`list-style: none` or `list-style-type: none` on `ul`/`ol`/`li` elements). These global styles affect the markdown-rendered content inside `MessageBubble` because the `:deep()` selectors in `<style scoped>` don't override higher-specificity VitePress rules.

### Solution

**ChatPanel.vue — Add nested v-theme-provider:**

```vue
<!-- BEFORE (current) -->
<Teleport to="body">
  <Transition name="nc-panel" ...>
    <div class="nc-chat-panel" ...>
      <!-- panel content -->
    </div>
  </Transition>
</Teleport>

<!-- AFTER (fixed) -->
<Teleport to="body">
  <v-theme-provider theme="nativeChat">
    <Transition name="nc-panel" ...>
      <div class="nc-chat-panel" ...>
        <!-- panel content -->
      </div>
    </Transition>
  </v-theme-provider>
</Teleport>
```

**Why v-theme-provider wraps Transition (not vice versa):** The `<Transition>` conditionally renders its child based on `v-show`/`v-if`. The theme provider must be the stable outer element that always exists in the DOM, ensuring CSS variables are present even during transition enter/leave animations.

**MessageBubble.vue — Explicit list style resets:**

```css
/* Add to existing markdown rendering styles */
.nc-message-bubble__content :deep(ul) {
  list-style-type: disc;
}

.nc-message-bubble__content :deep(ol) {
  list-style-type: decimal;
}

.nc-message-bubble__content :deep(li) {
  display: list-item;
}
```

These declarations explicitly restore list rendering that VitePress global CSS strips. They use `:deep()` (Vue scoped style piercing) combined with `@layer native-chat` for proper specificity.

### Scope

This is a CSS/template-only fix. **No script logic changes.** No composable changes. No new files. No new dependencies.

**Changes are purely structural:**
- ChatPanel.vue: Wrap Teleport content with v-theme-provider (template only)
- MessageBubble.vue: Add list style resets (CSS only)

### Key Implementation Details

**v-theme-provider behavior:**
- Renders a `<div>` element in the DOM with `style="--v-theme-primary: ..."` CSS custom properties
- All child elements inherit these CSS variables through normal CSS cascade
- The `theme="nativeChat"` prop references the theme registered in Vuetify's theme config
- Zero performance cost — it's just a div with inline CSS variables

**CSS variable resolution chain (after fix):**
```
<body>
  └── <div class="v-theme-provider v-theme--light"> ← NEW: sets --v-theme-* vars
        └── <Transition>
              └── <div class="nc-chat-panel"> ← now has access to all theme vars
                    └── all panel children inherit vars correctly
```

**VitePress CSS specificity:**
- VitePress applies `list-style: none` at document level via `.vp-doc ul, .vp-doc ol` selectors
- Even though MessageBubble is scoped and layered, the VitePress styles can win due to specificity
- Explicit `list-style-type: disc` in the scoped styles combined with `@layer native-chat` ensures plugin styles take precedence within the plugin's DOM

**Test impact:**
- ChatPanel.test.ts mounts ChatPanel in a test environment (not VitePress), so theme variables come from the test's Vuetify setup
- The v-theme-provider wrapper adds one extra DOM element inside the Teleport stub
- Tests that query `.nc-chat-panel` or children should still work (the wrapper is above, not between)
- `SendReceiveFlow.test.ts` may need minor selector updates if it traverses the Teleport DOM

### What NOT to Change

- **No changes to NativeChatWidget.vue** — the existing v-theme-provider there remains (it covers FloatingButton which is NOT teleported)
- **No changes to nativeChatTheme.ts** — theme colors are already correct
- **No changes to composables** — this is entirely a rendering/CSS fix
- **No new dependencies**

### Project Structure Notes

**Files MODIFIED (2 files):**

| File | Nature of Change |
|------|-----------------|
| `src/components/ChatPanel.vue` | Template: wrap Teleport content with `<v-theme-provider theme="nativeChat">` |
| `src/components/MessageBubble.vue` | CSS: add explicit list-style-type and display resets for markdown-rendered lists |

**Alignment with project structure:**
- Both files are existing components in `src/components/`
- Changes follow established patterns: `@layer native-chat`, `<style scoped>`, Vuetify components used directly
- No new files, no new dependencies

**Detected conflicts or variances:** None. The v-theme-provider pattern is already used in NativeChatWidget.vue — this duplicates it inside the Teleport to restore the broken CSS inheritance.

### References

- [Source: epics.md#Story 6.7] — Acceptance criteria and story description
- [Source: src/components/ChatPanel.vue:44-70] — Current Teleport implementation without theme provider
- [Source: src/components/NativeChatWidget.vue:48] — Existing v-theme-provider wrapping FloatingButton + ChatPanel
- [Source: src/components/MessageBubble.vue:192-196] — Existing markdown list styles (padding-left: 20px, margin: 4px 0)
- [Source: src/theme/nativeChatTheme.ts] — Theme colors: primary #002B38, secondary #C4105B, surface #FFFFFF
- [Source: docs/.vitepress/theme/index.ts] — VitePress Vuetify setup with nativeChatTheme
- [Source: architecture.md#CSS Patterns] — @layer native-chat + v-theme-provider isolation model
- [Source: project-context.md#CSS isolation] — All four layers required: @layer, scoped, nc- prefix, v-theme-provider

### Library & Framework Requirements

**No new dependencies.** `v-theme-provider` is a built-in Vuetify 3.x component, already available and used in NativeChatWidget.vue.

**Vuetify component usage:**
- `v-theme-provider` — existing usage in NativeChatWidget.vue, now also used inside ChatPanel.vue Teleport

### File Structure Requirements

All changes within existing files. Follows established patterns:
- ChatPanel.vue: `<template>` restructured (add wrapper), no `<script>` or `<style>` changes
- MessageBubble.vue: `<style scoped>` updated within existing `@layer native-chat` block

### Testing Requirements

**Run:** `yarn test`

**Expected:** All 194 tests pass (same count as after Story 6.6)

**Potential test adjustments:**
- ChatPanel.test.ts: The v-theme-provider adds a wrapper `<div>` inside the Teleport. Tests querying `.nc-chat-panel` via `wrapper.find('.nc-chat-panel')` should still work because `find()` searches descendants. Tests that check the immediate child of the Teleport stub may need updating.
- SendReceiveFlow.test.ts: Same consideration — if it traverses DOM from Teleport stub downward.

**No new tests required** — this is a CSS/template fix verified visually. The theme variable resolution is a Vuetify runtime concern not easily unit-tested (tests already provide Vuetify context).

### Previous Story Intelligence

**From Story 6.6 (Chat Input Redesign — done):**
- 194 tests passing (21 ChatInput + 173 others)
- Commit convention: `feat: {description} (Story X.Y)`
- Pattern: Vuetify props for styling (e.g., `rounded="xl"` instead of CSS border-radius)
- Pattern: v-progress-circular is built-in Vuetify, no import needed
- Agent model: Claude Opus 4.6

**From Stories 6.4/6.5 (Transitions — done):**
- Added `<Transition name="nc-panel">` wrapping ChatPanel content
- The Transition element is INSIDE the Teleport — v-theme-provider should wrap OUTSIDE Transition
- Added `prefers-reduced-motion: reduce` media queries
- Pattern: Vue `<Transition>` for enter/leave animations

**From Story 6.1 (Floating Panel Layout — done):**
- Replaced `v-navigation-drawer` with `Teleport to="body"` + CSS fixed positioning
- This is the commit that INTRODUCED the Teleport and broke theme inheritance
- ChatPanel DOM structure: Teleport → Transition → div.nc-chat-panel → children

### Git Intelligence

Last 5 commits (all Epic 6):
- `6b64438` feat: redesign chat input with inline send button and loading spinner (Story 6.6)
- `9dc9ab7` feat: add chat panel transitions and message bubble entrance animations (Stories 6.4, 6.5)
- `0271f7f` feat: update planning artifacts — remove v-navigation-drawer references (Story 6.3)
- `f9e2a8a` feat: visual polish — figma spacing for bubbles, messages, input (Story 6.2)
- `1646091` feat: replace v-navigation-drawer with floating panel layout (Story 6.1)

**Files relevant from recent commits:**
- `src/components/ChatPanel.vue` — modified in Stories 6.1 (Teleport), 6.4/6.5 (Transition)
- `src/components/MessageBubble.vue` — modified in Stories 6.2 (padding), 6.4/6.5 (animation)

**Suggested commit message:**
```
feat: fix VitePress theme colors and markdown list rendering (Story 6.7)
```

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- **Critical finding:** Vuetify's `VThemeProvider` without `with-background` does NOT render a wrapper DOM element — it only sets up provide/inject in the Vue component tree. Since `<Teleport to="body">` breaks the DOM hierarchy, the CSS custom properties were not inherited. Adding `with-background` forces VThemeProvider to render an actual `<div>` with inline `--v-theme-*` CSS variables, which restores CSS inheritance for the teleported content.
- Verified via Chrome DevTools: without `with-background`, `--v-theme-primary` resolved to Vuetify default `24,103,192` (#1867C0). With `with-background`, it correctly resolves to `0,43,56` (#002B38).
- **CSS cascade finding:** List style resets inside `@layer native-chat` were ineffective because VitePress's unlayered reset `ol, ul { list-style: none; padding-left: 0px }` always wins — per CSS spec, unlayered styles beat layered styles regardless of specificity. Solution (confirmed by Gemini 3 Pro): move list resets outside `@layer` as an "Interop Exception" while keeping them in `<style scoped>` for component isolation. The scoped selector easily beats the generic host reset on specificity.

### Completion Notes List

- Task 1: Added `<v-theme-provider theme="nativeChat" with-background>` wrapping `<Transition>` inside the `<Teleport to="body">` in ChatPanel.vue. The `with-background` prop is essential — without it, VThemeProvider only uses provide/inject (Vue tree) and does not emit a DOM element with CSS custom properties. VThemeProvider auto-resolved by Vuetify — no explicit import needed.
- Task 2: Added CSS list style resets in MessageBubble.vue inside `@layer native-chat` (plugin stays pure). VitePress CSS reset conflicts are handled at the docs site level via `docs/.vitepress/theme/overrides.css`, keeping the plugin host-agnostic. The overrides also include a `.nc-message-list` padding/margin reset (duplicates MessageList.vue:148-149 outside `@layer`) because VitePress unlayered resets strip the message list spacing too.
- Task 3: Visually verified in VitePress docs environment via Chrome DevTools. User bubbles are dark teal `rgb(0,43,56)` (#002B38), panel background is white (#FFFFFF), theme provider wrapper present with class `v-theme-provider v-theme--nativeChat`, list bullets visible with 20px padding, message list has correct 8px 16px padding.
- Task 4: All 194 tests pass (12 test files). No test modifications required — `wrapper.find()` searches descendants so the additional `<v-theme-provider>` wrapper does not break existing selectors. Both ChatPanel.test.ts (15 tests) and SendReceiveFlow.test.ts (14 tests) pass without changes.

### File List

- `src/components/ChatPanel.vue` — Modified: added `<v-theme-provider theme="nativeChat" with-background>` wrapping Teleport content (template only)
- `src/components/MessageBubble.vue` — Modified: added list style resets inside `@layer native-chat` for `ul`, `ol`, `li` (CSS only)
- `docs/.vitepress/theme/overrides.css` — New: VitePress-specific CSS overrides to counter unlayered resets for plugin elements
- `docs/.vitepress/theme/index.ts` — Modified: import overrides.css

## Change Log

- 2026-02-23: Fix VitePress theme colors and markdown list rendering — added v-theme-provider with-background inside ChatPanel Teleport to restore CSS variable inheritance, added list style resets in plugin @layer, added docs-level overrides.css to counter VitePress unlayered CSS resets (Story 6.7)
