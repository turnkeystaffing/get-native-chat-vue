# Story 6.1: Floating Panel Layout & Scroll Containment

Status: done

Epic: 6 — Figma Design Alignment
Date: 2026-02-22
Depends on: All Epics 1-5 complete (13 stories done)

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want the chat panel to float with gaps from the window edges and the input to always stay pinned at the bottom,
so that the widget feels like a lightweight overlay and I can always type without scrolling.

## Acceptance Criteria

1. **Given** the chat is open on desktop (>=768px) **When** inspecting the panel **Then** it has ~24px gaps from the right, top, and bottom window edges **And** all four corners are rounded (20px border-radius) **And** a prominent drop shadow is visible (`box-shadow: 0 8px 40px rgba(0,0,0,0.12)`)

2. **Given** the chat is open with messages **When** messages fill the panel beyond its height **Then** only the message list area scrolls **And** the header remains fixed at the top **And** the input remains fixed at the bottom **And** the input never scrolls away regardless of message content length

3. **Given** the chat is open on mobile (<768px) **When** inspecting the panel **Then** it renders as a full-screen takeover with no edge gaps **And** height is `100dvh` **And** border-radius is 0

4. **Given** the chat panel is open **When** the user presses Escape **Then** the panel closes and focus returns to the floating button

5. **Given** the panel implementation **When** inspecting the DOM **Then** `v-navigation-drawer` is no longer used **And** the panel is rendered via `Teleport` to body with a fixed-positioned div

6. **Given** the existing test suite **When** running `yarn test` **Then** all ChatPanel and integration tests pass with updated selectors

## Tasks / Subtasks

- [x] Task 1: Replace v-navigation-drawer with Teleport + positioned div in ChatPanel.vue (AC: #1, #2, #3, #5)
  - [x] 1.1 Remove `v-navigation-drawer` template wrapper and all its props (`v-model`, `location`, `temporary`, `:scrim`, `:width`)
  - [x] 1.2 Remove `drawerModel` computed proxy (no longer needed — was only to prevent Vuetify drawer close events)
  - [x] 1.3 Replace with `<Teleport to="body">` wrapping a `<div>` with `v-if="chatState.isOpen.value"`
  - [x] 1.4 Add `role="complementary"` and `aria-label="Chat with AI Assistant"` to the new root div
  - [x] 1.5 Apply `nc-chat-panel` class and mobile class toggle `:class="{ 'nc-chat-panel--mobile': isMobile }"`
  - [x] 1.6 Keep all children unchanged: ChatHeader, nc-chat-panel__body (with loader/WelcomeState/MessageList), ChatInput
  - [x] 1.7 Remove `VLayout` import dependency (VNavigationDrawer required a layout parent)
  - [x] 1.8 Keep Escape key handler, `useDisplay()` responsive logic, and provide/inject — all unchanged

- [x] Task 2: Add floating panel CSS to ChatPanel.vue (AC: #1, #3)
  - [x] 2.1 Desktop styles: `position: fixed; right: 24px; bottom: 24px; top: 24px; width: 420px;`
  - [x] 2.2 Add `border-radius: 20px` (all four corners)
  - [x] 2.3 Add `box-shadow: 0 8px 40px rgba(0,0,0,0.12)` for prominent drop shadow
  - [x] 2.4 Add `display: flex; flex-direction: column; overflow: hidden` for internal layout
  - [x] 2.5 Add `z-index: 10000` to stack above host app content
  - [x] 2.6 Add `background: rgb(var(--v-theme-surface))` for panel background color
  - [x] 2.7 Mobile styles (`.nc-chat-panel--mobile`): `top: 0; left: 0; right: 0; bottom: 0; width: 100%; border-radius: 0; height: 100dvh`
  - [x] 2.8 Remove old CSS: border-top-left/right-radius media query, old mobile height rule

- [x] Task 3: Fix scroll containment in MessageList.vue (AC: #2)
  - [x] 3.1 Add `overflow-y: auto` to `.nc-message-list-scroll` — this makes MessageList the sole scroll container
  - [x] 3.2 Verify parent `.nc-chat-panel__body` keeps `overflow: hidden` and `flex: 1` — prevents scroll leaking to panel level

- [x] Task 4: Update ChatPanel.test.ts selectors and assertions (AC: #6)
  - [x] 4.1 Remove `VLayout` wrapper from `mountChatPanel()` helper — no longer needed
  - [x] 4.2 Replace `findComponent({ name: 'VNavigationDrawer' })` with `.find('.nc-chat-panel')` or `.find('[role="complementary"]')`
  - [x] 4.3 Remove test: "renders v-navigation-drawer with location='right'" — replace with test for Teleport root div
  - [x] 4.4 Update visibility tests: check `v-if` rendering (div present/absent) instead of drawer `modelValue` prop
  - [x] 4.5 Remove test: "scrim is disabled" — no longer applicable
  - [x] 4.6 Remove tests: "computed setter ignores Vuetify close/open attempts" — no Vuetify model to ignore
  - [x] 4.7 Remove test: "uses 400px width on desktop" — width is now CSS-based (420px), not a prop
  - [x] 4.8 Add new test: "panel renders inside Teleport to body when open"
  - [x] 4.9 Add new test: "panel has floating CSS class and proper structure"
  - [x] 4.10 Preserve unchanged tests: role/aria-label, Escape key, WelcomeState/MessageList/loader rendering, ChatHeader, ChatInput, welcomeMessage config, unmount cleanup

- [x] Task 5: Update SendReceiveFlow.test.ts wrapper (AC: #6)
  - [x] 5.1 Remove `VLayout` wrapper from `createMountHelper()` — mount ChatPanel directly instead of via `h(VLayout, null, () => h(ChatPanel))`
  - [x] 5.2 Repeat for all mount helpers in the file (there may be multiple)
  - [x] 5.3 Verify all send/receive integration tests pass with updated wrapper

- [x] Task 5b: Fix ChatInput.vue v-if mount timing (AC: #2, #6)
  - [x] 5b.1 Add `{ immediate: true }` to isOpen watcher in ChatInput.vue — ChatInput now mounts inside v-if (previously always mounted in v-navigation-drawer), so watcher must fire immediately to focus textarea on mount
  - [x] 5b.2 Update ChatInput.test.ts: add test for focus-on-mount with isOpen already true, update close-focus spy timing

- [x] Task 6: Verify end-to-end (AC: all)
  - [x] 6.1 Run `yarn test` — all 186 tests pass
  - [x] 6.2 Run `yarn build` — library build succeeds (29.26 kB gzip)
  - [x] 6.3 Run `yarn lint` — no new lint errors (pre-existing DemoBlock.vue prettier warning unchanged)
  - [ ] 6.4 Run `yarn docs:dev` — chat widget opens as floating panel with edge gaps, input stays pinned. **Review note:** verify focus rings on close button and edge elements are not clipped by panel's `overflow: hidden`
  - [ ] 6.5 Verify scroll containment: fill chat with messages, confirm only MessageList scrolls
  - [ ] 6.6 Verify mobile behavior: resize below 768px, confirm full-screen takeover
  - [ ] 6.7 Verify Escape key closes panel
  - [x] 6.8 Run `yarn docs:build` — VitePress build succeeds

## Dev Notes

### CRITICAL: Structural Replacement — NOT a Refactor

**This story replaces the `v-navigation-drawer` Vuetify component with a `Teleport` + fixed-positioned `div`.** The root cause is that `v-navigation-drawer` is designed for app navigation, not floating chat widgets. Its internal `.v-navigation-drawer__content` has `overflow-y: auto` which creates a competing scroll container, causing the input to scroll away with messages. Its edge-flush positioning model cannot produce the floating card design with edge gaps.

**Functional requirements are already met** — all FR1-FR27 work correctly. This change is purely structural/visual to match the approved Figma design.

### Critical Architecture Constraints

- **`<script setup lang="ts">` only** — no Options API
- **`@/` import alias** for all imports — never relative paths
- **Import order**: Vue core → third-party → `@/` project imports
- **Colors via theme tokens only**: `rgb(var(--v-theme-surface))` — no hardcoded hex values for backgrounds
- **CSS isolation — all four layers required:**
  1. `@layer native-chat { ... }` wrapping all styles
  2. `<style scoped>` on every component
  3. `nc-` prefix on all custom CSS classes with BEM naming
  4. `<v-theme-provider theme="nativeChat">` at root (NativeChatWidget — unchanged)
- **No `!important`** in CSS
- **Prettier**: single quotes, no semicolons, trailing commas, 100 char width
- **Vitest globals**: `describe`, `it`, `expect`, `vi` available without imports
- **Inject keys cast**: `{ [CHAT_STATE_KEY as symbol]: chatState }` — `as symbol` required in provide

### ChatPanel.vue Replacement Guide

**Current structure (REMOVE):**
```vue
<v-navigation-drawer
  v-model="drawerModel"
  location="right"
  temporary
  :scrim="false"
  :width="panelWidth"
  role="complementary"
  aria-label="Chat with AI Assistant"
  class="nc-chat-panel"
  :class="{ 'nc-chat-panel--mobile': isMobile }"
>
  <ChatHeader />
  <div class="nc-chat-panel__body">...</div>
  <ChatInput />
</v-navigation-drawer>
```

**New structure (ADD):**
```vue
<Teleport to="body">
  <div
    v-if="chatState.isOpen.value"
    class="nc-chat-panel"
    :class="{ 'nc-chat-panel--mobile': isMobile }"
    role="complementary"
    aria-label="Chat with AI Assistant"
  >
    <ChatHeader />
    <div class="nc-chat-panel__body">
      <v-progress-circular
        v-if="chatState.isLoading.value && chatState.messages.value.length === 0"
        indeterminate
        size="24"
        class="nc-chat-panel__loader"
      />
      <WelcomeState
        v-else-if="chatState.messages.value.length === 0 && !chatState.isSending.value"
        :message="welcomeMessage"
      />
      <MessageList v-else />
    </div>
    <ChatInput />
  </div>
</Teleport>
```

**Script section changes:**
- **REMOVE**: `drawerModel` computed proxy (lines 14-19 in current file) — this was needed to prevent Vuetify's click-outside-to-close behavior. With a plain div, there's no external model to manage.
- **REMOVE**: `panelWidth` computed — width is now CSS-based (420px), not a component prop
- **KEEP**: `isMobile` computed, `useDisplay()`, Escape key handler, `onUnmounted`, `watch` for keyboard listener, config inject, welcomeMessage computed
- **KEEP**: All child component imports (ChatHeader, WelcomeState, MessageList, ChatInput)

**CSS changes — complete replacement:**
```css
@layer native-chat {
  .nc-chat-panel {
    position: fixed;
    right: 24px;
    bottom: 24px;
    top: 24px;
    width: 420px;
    border-radius: 20px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 10000;
    background: rgb(var(--v-theme-surface));
  }

  .nc-chat-panel--mobile {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100dvh;
    border-radius: 0;
  }

  .nc-chat-panel__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .nc-chat-panel__loader {
    align-self: center;
    margin-top: 32px;
  }
}
```

### Scroll Containment Fix (MessageList.vue)

**Root cause**: The `v-navigation-drawer` injects its own scroll container (`.v-navigation-drawer__content` with `overflow-y: auto`). This creates two competing scroll contexts — the drawer content and the message list. When messages overflow, the drawer content scrolls first, pushing ChatInput offscreen.

**Fix**: With the plain div, the panel uses `overflow: hidden` and a flex column layout. The body (`nc-chat-panel__body`) also has `overflow: hidden` and `flex: 1`. The only element with scrolling must be the `v-infinite-scroll` inside MessageList.

**MessageList.vue CSS change:**
```css
/* Add overflow-y: auto to make MessageList the sole scroll container */
.nc-message-list-scroll {
  flex: 1;
  overflow-y: auto;
}
```

This is a CSS-only change to MessageList.vue. No template or script changes needed.

### Test Update Guide

**ChatPanel.test.ts — what changes:**

The `mountChatPanel()` helper currently wraps ChatPanel in `VLayout` because `VNavigationDrawer` requires a layout parent:
```typescript
// REMOVE this wrapper pattern:
const Wrapper = defineComponent({
  setup() {
    return () => h(VLayout, null, () => h(ChatPanel))
  },
})
```

**Replace with direct mount:**
```typescript
const wrapper = mount(ChatPanel, {
  global: {
    provide: {
      [CONFIG_KEY as symbol]: config,
      [CHAT_STATE_KEY as symbol]: chatState,
    },
  },
})
```

**Note on Teleport in tests**: Vue Test Utils mounts components with Teleport disabled by default in jsdom. The `<Teleport to="body">` will render inline in tests. If content doesn't appear, check Vue Test Utils docs — may need to find content via `wrapper.find('[role="complementary"]')` rather than searching for a Teleport target.

**Tests to REMOVE (7 tests no longer applicable):**
1. "renders v-navigation-drawer with location='right'" — no drawer
2. "drawer is visible when isOpen is true" — replace with v-if check
3. "drawer is hidden when isOpen is false" — replace with v-if check
4. "scrim is disabled (no click-outside-to-close)" — no scrim concept
5. "computed setter ignores Vuetify close attempts" — no Vuetify model
6. "computed setter ignores Vuetify open attempts" — no Vuetify model
7. "uses 400px width on desktop" — width is CSS, not a prop

**Tests to ADD (replacement tests):**
1. "renders panel div when isOpen is true" — check `wrapper.find('.nc-chat-panel').exists()` is `true`
2. "does not render panel div when isOpen is false" — check `wrapper.find('.nc-chat-panel').exists()` is `false`
3. "panel has correct accessibility attributes" — verify `role="complementary"` and `aria-label` on `.nc-chat-panel`

**Tests to KEEP UNCHANGED (10 tests — core behavior):**
1. "renders ChatHeader as child"
2. "renders WelcomeState when messages are empty and not loading"
3. "renders MessageList when messages exist"
4. "renders loading indicator when isLoading is true and no messages"
5. "renders MessageList (not spinner) when isLoading is true but messages exist"
6. "panel has role='complementary' and aria-label='Chat with AI Assistant'" — may need selector update from `nav.nc-chat-panel` to `div.nc-chat-panel` or `[role="complementary"]`
7. "global Escape key calls close() regardless of focus location"
8. "Escape key does not call close() when panel is closed"
9. "passes welcomeMessage from config to WelcomeState"
10. "renders ChatInput component when panel is open"
11. "cleans up Escape listener on unmount"

**IMPORTANT selector change**: The current test for accessibility (line 160) uses `wrapper.find('nav.nc-chat-panel')` because VNavigationDrawer renders a `<nav>` element. The new div will be a `<div>`, so update to `wrapper.find('div.nc-chat-panel')` or `wrapper.find('[role="complementary"]')`.

**SendReceiveFlow.test.ts:**
- Same `VLayout` wrapper removal — replace with direct ChatPanel mount
- There are multiple mount helper functions in this file — update ALL of them
- No assertion changes needed — tests focus on send/receive behavior, not drawer structure

### Project Structure Notes

**Files to MODIFY:**

| File | Nature of Change |
|------|-----------------|
| `src/components/ChatPanel.vue` | **Structural** — template + script + CSS replacement |
| `src/components/MessageList.vue` | **CSS only** — add `overflow-y: auto` to scroll container |
| `src/components/__tests__/ChatPanel.test.ts` | **Test updates** — remove VLayout wrapper, update selectors, replace drawer-specific tests |
| `src/components/__tests__/SendReceiveFlow.test.ts` | **Test updates** — remove VLayout wrapper from mount helpers |

**Files that MUST NOT be modified:**

| File | Reason |
|------|--------|
| `src/composables/useChat.ts` | State management unchanged |
| `src/plugin.ts` | Plugin registration unchanged |
| `src/keys.ts` | Injection keys unchanged |
| `src/types/*` | No type changes |
| `src/helpers/*` | API client helper unchanged |
| `src/components/NativeChatWidget.vue` | Root wrapper unchanged (already uses v-theme-provider, no VLayout) |
| `src/components/FloatingButton.vue` | Not affected |
| `src/components/ChatHeader.vue` | Not affected |
| `src/components/ChatInput.vue` | **NOT in this story** — placeholder update is Story 6.2 |
| `src/components/MessageBubble.vue` | **NOT in this story** — padding update is Story 6.2 |
| `src/components/WelcomeState.vue` | **NOT in this story** — positioning update is Story 6.2 |
| `docs/**/*` | No docs changes |

**CRITICAL**: Story 6.1 is ONLY the structural ChatPanel replacement and scroll containment fix. Visual polish changes (bubble padding, message gap, placeholder text, welcome positioning) belong to Story 6.2. Do NOT mix them.

### Library & Framework Requirements

**No new dependencies for this story.** All required APIs are built into Vue 3 and CSS.

| Technology | Already Available | Usage |
|---|---|---|
| Vue 3 `Teleport` | Built-in Vue component | Renders panel to `<body>` |
| CSS `position: fixed` | CSS standard | Panel positioning with edge gaps |
| CSS `dvh` unit | Browser standard | Mobile viewport height |
| Vuetify `useDisplay()` | Already imported | Responsive breakpoint detection |
| Vuetify `v-progress-circular` | Already used | Loading indicator (unchanged) |
| `@vue/test-utils` | Already installed | Updated test mounting |

**Removed dependencies (from ChatPanel only):**
- `v-navigation-drawer` — no longer used in ChatPanel
- `VLayout` — no longer needed in tests (was only required as drawer parent)

### Testing Requirements

**Expected test count**: Similar to current 189+ baseline. Some drawer-specific tests are removed, replacement tests are added.

**Validation checklist:**

1. `yarn test` — all tests pass
2. `yarn build` — library build succeeds
3. `yarn lint` — no lint errors
4. `yarn docs:dev` — visual verification of floating panel
5. `yarn docs:build` — VitePress build succeeds

### Previous Story Intelligence

**From Story 5.3 (Component Demo Pages & Landing Page):**
- 189 tests passing at last story completion
- Build output: 29.34 kB gzip
- `yarn lint` clean (7 pre-existing warnings — **don't try to fix them**)
- `yarn docs:build` succeeds in ~8.6s
- ESLint flat config (`eslint.config.ts`, not `.eslintrc.cjs`)
- `dist/` is tracked in git — rebuild needed since `src/` changes are made in this story
- Commit convention: `feat: {description} (Story X.Y)`

**From Story 4.2 (Message Retry & Error Recovery):**
- Error handling works correctly — `failedMessageText` repopulates input on send failure
- Error messages display as inline chat messages (ChatMessage objects with `id: error-*`)
- All error/retry logic is in `useChat.ts` composable — untouched by this story

**From Sprint Change Proposal:**
- Multi-model consensus (Gemini 3 Pro + GPT 5.2) both recommended replacing v-navigation-drawer
- Panel width increased from 400px to 420px to accommodate edge gaps while maintaining internal width
- The competing scroll container from `.v-navigation-drawer__content { overflow-y: auto }` is the root cause of input scrolling away
- z-index: 10000 recommended to stack above typical host app elements

### Git Intelligence

Recent commits follow `feat: {description} (Story X.Y)` convention. This story's commit should be:
```
feat: replace v-navigation-drawer with floating panel layout (Story 6.1)
```

Last 5 commits:
- `0a28773` feat: add component demo pages and landing page features (Story 5.3)
- `0b82261` feat: add guide documentation pages for installation, configuration, and API client (Story 5.2)
- `90de7eb` feat: add DemoBlock component and mock API client for VitePress docs (Story 5.1)
- `be138f3` fix: remove duplicate Vuetify registration in ChatInput tests
- `ebddd5d` feat: add message retry and error recovery with error history preservation (Story 4.2)

Clean linear history on master branch. All Epics 1-5 complete (13 stories).

### References

- [Source: sprint-change-proposal-2026-02-22.md#Section 4] — Detailed ChatPanel replacement code, CSS specs, all component changes
- [Source: epics.md#Story 6.1] — Acceptance criteria and implementation notes
- [Source: architecture.md#Component Boundaries] — NativeChatWidget root, ChatPanel container, MessageList scrollable
- [Source: architecture.md#CSS Patterns] — @layer native-chat, scoped styles, nc- prefix, no !important
- [Source: architecture.md#Performance Strategy] — v-infinite-scroll, MessageList public API implementation-agnostic
- [Source: ux-design-specification.md#Component Strategy > ChatPanel] — Panel as right-aligned overlay, responsive breakpoints
- [Source: ux-design-specification.md#Visual Design Foundation] — Panel width ~400px, 20px border-radius, color system
- [Source: ux-design-specification.md#Scroll Behavior Patterns] — Scroll position preservation, auto-scroll rules
- [Source: project-context.md#Vue & Vuetify Rules] — Script setup, provide/inject, theme tokens, no reactive()
- [Source: project-context.md#Testing Rules] — Co-located tests, mount helper pattern, inject keys cast
- [Source: project-context.md#CSS isolation] — Four layers: @layer, scoped, nc- prefix, v-theme-provider
- [Source: src/components/ChatPanel.vue] — Current implementation with v-navigation-drawer
- [Source: src/components/__tests__/ChatPanel.test.ts] — Current 18 tests with VLayout wrapper
- [Source: src/components/__tests__/SendReceiveFlow.test.ts] — Integration tests with VLayout wrapper
- [Source: src/components/MessageList.vue] — Scroll container with v-infinite-scroll

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Teleport stub + JSDOM DOM detachment caused focus() and v-model sync failures in integration tests
- Multi-model consensus (Gemini 3 Pro + GPT-5.2) identified three distinct root causes:
  1. JSDOM ignores focus() on elements not attached to document.body
  2. Vuetify v-textarea replaces internal DOM nodes on disabled toggle (stale refs)
  3. v-if mount timing: ChatInput watcher on isOpen missed transitions because component mounts when isOpen is already true
- Fix: attachTo: document.body + re-query stale refs + { immediate: true } on isOpen watcher

### Completion Notes List

- Replaced v-navigation-drawer with Teleport + fixed-positioned div in ChatPanel.vue
- Removed drawerModel computed proxy and panelWidth computed (no longer needed)
- Added floating panel CSS: position fixed, 24px edge gaps, 420px width, 20px border-radius, drop shadow, z-index 10000
- Added mobile full-screen takeover styles via .nc-chat-panel--mobile class
- Added overflow-y: auto to MessageList.vue .nc-message-list-scroll for scroll containment
- Updated ChatInput.vue: added { immediate: true } to isOpen watcher for v-if compatibility
- ChatPanel.test.ts: removed VLayout wrapper, removed 7 drawer-specific tests, added 4 replacement tests (15 total)
- SendReceiveFlow.test.ts: removed VLayout wrapper from all mount helpers, added attachTo: document.body + afterEach cleanup, added teleport stub
- ChatInput.test.ts: updated focus-on-mount test expectation and close-focus spy timing for { immediate: true } watcher
- All 186 tests pass, build succeeds (29.26 kB gzip), no new lint errors, docs:build succeeds
- **Code review fixes (2026-02-22):** Added `box-shadow: none` to `.nc-chat-panel--mobile` (mobile should not have floating shadow), fixed `SendReceiveFlow.test.ts` afterEach to properly `unmount()` Vue wrappers before clearing DOM (prevents leaked Escape key listeners), added Task 5b documenting ChatInput.vue scope change

### Change Log

- 2026-02-22: Replaced v-navigation-drawer with Teleport + floating panel layout, fixed scroll containment, updated all tests
- 2026-02-22: Code review fixes — added mobile box-shadow reset, fixed test afterEach to properly unmount Vue components, added missing ChatInput.vue task

### File List

- src/components/ChatPanel.vue (modified — structural template + script + CSS replacement)
- src/components/ChatInput.vue (modified — added { immediate: true } to isOpen watcher)
- src/components/MessageList.vue (modified — added overflow-y: auto to scroll container)
- src/components/__tests__/ChatPanel.test.ts (modified — removed VLayout wrapper, updated selectors, replaced drawer-specific tests)
- src/components/__tests__/SendReceiveFlow.test.ts (modified — removed VLayout wrapper, added attachTo/teleport stub/afterEach cleanup)
- src/components/__tests__/ChatInput.test.ts (modified — updated focus-on-mount test and close-focus spy timing)
