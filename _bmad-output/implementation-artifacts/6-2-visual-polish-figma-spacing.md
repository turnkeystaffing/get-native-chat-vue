# Story 6.2: Visual Polish & Figma Spacing

Status: done

Epic: 6 — Figma Design Alignment
Date: 2026-02-22
Depends on: Story 6.1 (Floating Panel Layout & Scroll Containment) — done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want message bubbles, spacing, and input to match the Figma design precisely,
so that the chat feels polished and professional.

## Acceptance Criteria

1. **Given** a user or assistant message bubble **When** rendered **Then** the bubble has `12px 16px` padding (increased from `8px 12px`)

2. **Given** the message list with multiple messages **When** displayed **Then** the vertical gap between messages is `16px` (increased from `14px`)

3. **Given** the chat input field **When** rendered with no text **Then** the placeholder reads "How can I help you? Ask me anything..."

4. **Given** all visual changes **When** running `yarn test` **Then** all tests pass

## Tasks / Subtasks

- [x] Task 1: Update MessageBubble.vue bubble padding (AC: #1)
  - [x] 1.1 Change `.nc-message-bubble__bubble` padding from `8px 12px` to `12px 16px`

- [x] Task 2: Update MessageList.vue message gap (AC: #2)
  - [x] 2.1 Change `.nc-message-list` gap from `14px` to `16px`

- [x] Task 3: Update ChatInput.vue placeholder text (AC: #3)
  - [x] 3.1 Change `placeholder` attribute from `"Type a message"` to `"How can I help you? Ask me anything..."`
  - [x] 3.2 Keep `aria-label="Type a message"` unchanged — aria-label describes the field's purpose, placeholder is hint text

- [x] Task 4: Verify all tests pass (AC: #4)
  - [x] 4.1 Run `yarn test` — all 186 tests pass (no test changes expected — all modifications are CSS/template only)
  - [x] 4.2 Run `yarn build` — library build succeeds
  - [x] 4.3 Run `yarn lint` — no new lint errors
  - [ ] 4.4 Run `yarn docs:dev` — visual verification of updated padding, spacing, and placeholder
  - [x] 4.5 Run `yarn docs:build` — VitePress build succeeds

## Dev Notes

### Scope — CSS & Template Only

This story makes three small, targeted changes to align visual styling with the approved Figma design. All changes are CSS property updates or template attribute updates. No script logic, no new components, no test modifications.

**This is the simplest story in the project.** Each change is a single-line edit in a single file. Do NOT add scope — no refactoring, no restructuring, no "improvements" beyond the three listed changes.

### Critical Architecture Constraints

- **`<script setup lang="ts">` only** — no Options API
- **`@/` import alias** for all imports — never relative paths
- **Colors via theme tokens only**: `rgb(var(--v-theme-surface))` — no hardcoded hex values for backgrounds
- **CSS isolation — all four layers required:**
  1. `@layer native-chat { ... }` wrapping all styles
  2. `<style scoped>` on every component
  3. `nc-` prefix on all custom CSS classes with BEM naming
  4. `<v-theme-provider theme="nativeChat">` at root (NativeChatWidget — unchanged)
- **No `!important`** in CSS
- **Prettier**: single quotes, no semicolons, trailing commas, 100 char width

### Exact Changes Guide

**MessageBubble.vue (line 133):**
```css
/* BEFORE: */
.nc-message-bubble__bubble {
  max-width: 80%;
  padding: 8px 12px;    /* ← CHANGE THIS */
  border-radius: 12px;
  word-break: break-word;
}

/* AFTER: */
.nc-message-bubble__bubble {
  max-width: 80%;
  padding: 12px 16px;   /* ← Figma spacing */
  border-radius: 12px;
  word-break: break-word;
}
```

**MessageList.vue (line 108):**
```css
/* BEFORE: */
.nc-message-list {
  display: flex;
  flex-direction: column;
  gap: 14px;    /* ← CHANGE THIS */
  list-style: none;
  padding: 8px 16px;
  margin: 0;
}

/* AFTER: */
.nc-message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;    /* ← Figma spacing */
  list-style: none;
  padding: 8px 16px;
  margin: 0;
}
```

**ChatInput.vue (line 79):**
```vue
<!-- BEFORE: -->
<v-textarea
  ...
  placeholder="Type a message"
  aria-label="Type a message"
  ...
/>

<!-- AFTER: -->
<v-textarea
  ...
  placeholder="How can I help you? Ask me anything..."
  aria-label="Type a message"
  ...
/>
```

### Test Impact Analysis

**No test modifications needed.** All changes are CSS values or template attributes that no test asserts:

| File | Tests | Impact |
|---|---|---|
| MessageBubble.test.ts | 17 tests | None — tests check classes, text, aria-labels, not CSS values |
| MessageList.test.ts | 13 tests | None — tests check rendering, scroll behavior, not CSS gap |
| ChatInput.test.ts | 17 tests | None — tests check `aria-label="Type a message"` (unchanged), not placeholder text |

### Project Structure Notes

**Files to MODIFY (4 files, single-line changes each):**

| File | Nature of Change |
|------|-----------------|
| `src/components/MessageBubble.vue` | **CSS only** — bubble padding `8px 12px` → `12px 16px` |
| `src/components/MessageList.vue` | **CSS only** — message gap `14px` → `16px` |
| `src/components/ChatInput.vue` | **Template only** — placeholder text update |

**Files that MUST NOT be modified:**

| File | Reason |
|------|--------|
| `src/components/ChatPanel.vue` | Modified in Story 6.1, no changes needed |
| `src/composables/useChat.ts` | State management unchanged |
| `src/plugin.ts` | Plugin registration unchanged |
| `src/keys.ts` | Injection keys unchanged |
| `src/types/*` | No type changes |
| `src/helpers/*` | API client helper unchanged |
| `src/components/NativeChatWidget.vue` | Root wrapper unchanged |
| `src/components/FloatingButton.vue` | Not affected |
| `src/components/ChatHeader.vue` | Not affected |
| `src/components/WelcomeState.vue` | Not affected — keep centered positioning |
| `src/components/__tests__/*` | No test changes needed |
| `docs/**/*` | No docs changes |

### Library & Framework Requirements

**No new dependencies.** All changes use existing CSS properties and HTML attributes.

### Testing Requirements

**Expected test count**: 186 tests (unchanged from Story 6.1).

**Validation checklist:**

1. `yarn test` — all 186 tests pass
2. `yarn build` — library build succeeds
3. `yarn lint` — no new lint errors
4. `yarn docs:dev` — visual verification:
   - Message bubbles have more breathing room (12px 16px padding)
   - Message list spacing is slightly increased (16px gap)
   - Input placeholder reads "How can I help you? Ask me anything..."
5. `yarn docs:build` — VitePress build succeeds

### Previous Story Intelligence

**From Story 6.1 (Floating Panel Layout & Scroll Containment):**
- 186 tests passing
- Build output: 29.26 kB gzip
- `yarn lint` clean (pre-existing DemoBlock.vue prettier warning unchanged)
- `yarn docs:build` succeeds
- Commit convention: `feat: {description} (Story X.Y)`
- Replaced v-navigation-drawer with Teleport + fixed-positioned div
- Added `overflow-y: auto` to MessageList.vue `.nc-message-list-scroll` for scroll containment
- Added `{ immediate: true }` to ChatInput.vue isOpen watcher for v-if compatibility
- `dist/` is tracked in git — rebuild needed since `src/` changes are made in this story

**Key learnings from Story 6.1:**
- CSS changes in `@layer native-chat` blocks work correctly with scoped styles
- No test changes needed for CSS-only modifications
- VitePress docs:dev is the best way to visually verify CSS changes

### Git Intelligence

Recent commits follow `feat: {description} (Story X.Y)` convention. This story's commit should be:
```
feat: visual polish — figma spacing for bubbles, messages, input, welcome (Story 6.2)
```

Last 5 commits:
- `1646091` feat: replace v-navigation-drawer with floating panel layout (Story 6.1)
- `0a28773` feat: add component demo pages and landing page features (Story 5.3)
- `0b82261` feat: add guide documentation pages for installation, configuration, and API client (Story 5.2)
- `90de7eb` feat: add DemoBlock component and mock API client for VitePress docs (Story 5.1)
- `be138f3` fix: remove duplicate Vuetify registration in ChatInput tests

### References

- [Source: epics.md#Story 6.2] — Acceptance criteria and file list
- [Source: ux-design-specification.md#Spacing & Layout Foundation] — Message spacing ~16px, bubble radius 12-16px
- [Source: ux-design-specification.md#Visual Design Foundation] — Chat input placeholder, welcome text positioning
- [Source: architecture.md#CSS Patterns] — @layer native-chat, scoped styles, nc- prefix, no !important
- [Source: project-context.md#CSS isolation] — Four layers: @layer, scoped, nc- prefix, v-theme-provider
- [Source: project-context.md#Code Quality & Style Rules] — Prettier: single quotes, no semicolons, trailing commas, 100 char width
- [Source: src/components/MessageBubble.vue:133] — Current padding: 8px 12px
- [Source: src/components/MessageList.vue:108] — Current gap: 14px
- [Source: src/components/ChatInput.vue:79] — Current placeholder: "Type a message"

## Change Log

- 2026-02-22: Implemented visual polish — bubble padding, message gap, input placeholder to match Figma design
- 2026-02-22: Code review passed — all 4 ACs verified, File List updated with missing build artifact (dist/types/components/ChatInput.vue.d.ts.map), status → done

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No debug issues encountered. All three changes were single-line edits applied cleanly.

### Completion Notes List

- Task 1: Updated MessageBubble.vue `.nc-message-bubble__bubble` padding from `8px 12px` to `12px 16px`
- Task 2: Updated MessageList.vue `.nc-message-list` gap from `14px` to `16px`
- Task 3: Updated ChatInput.vue placeholder from `"Type a message"` to `"How can I help you? Ask me anything..."` — `aria-label` left unchanged as specified
- Task 4: All automated validations pass — 186/186 tests, build (29.29 kB gzip), lint clean, docs:build succeeds
- Task 4.4: `yarn docs:dev` visual verification requires user to confirm in browser
- No test modifications needed — all changes are CSS/template only
- No new dependencies added

### File List

- `src/components/MessageBubble.vue` — modified (CSS: bubble padding 8px 12px → 12px 16px)
- `src/components/MessageList.vue` — modified (CSS: message gap 14px → 16px)
- `src/components/ChatInput.vue` — modified (template: placeholder text updated)
- `dist/native-chat-vue.es.js` — rebuilt (library build output)
- `dist/native-chat-vue.css` — rebuilt (library build output)
- `dist/types/components/ChatInput.vue.d.ts.map` — rebuilt (type declaration map regenerated by build)
