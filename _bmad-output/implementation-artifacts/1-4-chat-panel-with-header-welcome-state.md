# Story 1.4: Chat Panel with Header & Welcome State

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want the chat to open as a side panel with a title and welcome message,
so that I have a clear, familiar interface ready for conversation.

## Acceptance Criteria

1. **Given** the user clicks the floating button **When** the chat opens **Then** a side panel appears as a right-aligned overlay (~400px wide, 20px top border-radius) **And** the panel contains a header with a magenta star icon, "AI Assistant" title, and a close (X) button **And** the panel body displays a welcome message in large, light-gray text ("Hello! How can I help you?" by default, configurable via `welcomeMessage` option)

2. **Given** the chat panel is open **When** the user clicks the close (X) button in the header **Then** the panel closes **And** focus returns to the floating button

3. **Given** the chat panel is open **When** the user presses the Escape key **Then** the panel closes **And** focus returns to the floating button

4. **Given** the viewport is below 768px wide **When** the chat opens **Then** the panel renders as a full-screen takeover instead of an overlay **And** dynamic viewport height (`dvh`) is used to handle virtual keyboards

5. **Given** the viewport is >=768px wide **When** the chat opens **Then** the panel renders as a right-side overlay (~400px) **And** the host app content remains visible and interactive alongside the panel

6. **Given** the chat panel is rendered **When** inspecting the DOM **Then** all plugin styles are wrapped in `@layer native-chat` **And** all plugin components render within a `<v-theme-provider theme="nativeChat">` **And** plugin styles do not affect host application elements **And** the panel has `role="complementary"` and `aria-label="Chat with AI Assistant"` **And** the close button has `aria-label="Close chat"` and is keyboard accessible

## Tasks / Subtasks

- [x] Task 1: Create ChatHeader.vue component (AC: #1, #2, #6)
  - [x] 1.1 Create `src/components/ChatHeader.vue` — `<script setup lang="ts">`, inject chat state from `CHAT_STATE_KEY` to access `close()` action
  - [x] 1.2 Render header layout: magenta star icon (`IconStar` component, `color="secondary"`), "AI Assistant" title (semibold, 14px), and close (X) button (`v-btn` icon variant) right-aligned
  - [x] 1.3 Create `src/icons/IconClose.vue` — self-contained SVG X/close icon component (same pattern as IconStar: `width="1em" height="1em"`, `fill="currentColor"`, `aria-hidden="true"`, `focusable="false"`)
  - [x] 1.4 Close button click handler: call `close()` from injected state, then use `nextTick` + refs to return focus to the floating button element
  - [x] 1.5 Add accessibility: close button `aria-label="Close chat"`, keyboard accessible via Vuetify's built-in `v-btn` keyboard support
  - [x] 1.6 Add `<style scoped>` with `@layer native-chat` — header layout styles using flexbox, nc- prefixed classes

- [x] Task 2: Create WelcomeState.vue component (AC: #1)
  - [x] 2.1 Create `src/components/WelcomeState.vue` — `<script setup lang="ts">`, pure display component
  - [x] 2.2 Define props: `message` (string, optional, default: "Hello! How can I help you?")
  - [x] 2.3 Render large, light-gray welcome text centered in the panel body — use theme color tokens, ~24px font size per UX spec
  - [x] 2.4 Add `<style scoped>` with `@layer native-chat` — welcome text styling with nc- prefixed classes

- [x] Task 3: Create ChatPanel.vue component (AC: #1, #2, #3, #4, #5, #6)
  - [x] 3.1 Create `src/components/ChatPanel.vue` — `<script setup lang="ts">`, inject chat state from `CHAT_STATE_KEY` (reads `isOpen`, `close`)
  - [x] 3.2 Inject config from `CONFIG_KEY` to read `welcomeMessage` option
  - [x] 3.3 Use Vuetify `v-navigation-drawer` as panel container: `location="right"`, `v-model` bound to internal reactive state synced with `isOpen`, `:width` computed from breakpoint, `temporary` for overlay mode
  - [x] 3.4 Disable scrim/click-outside-to-close: set `:scrim="false"` on v-navigation-drawer per UX requirement "No click-outside-to-close"
  - [x] 3.5 Add Escape key handler: `@keydown.escape` on the panel — calls `close()` and returns focus to floating button
  - [x] 3.6 Use Vuetify `useDisplay()` composable for responsive breakpoint detection
  - [x] 3.7 Compute panel width: `100%` (full-screen) when `display.smAndDown` (below 768px), `400` otherwise
  - [x] 3.8 Apply 20px top border-radius via CSS class (desktop/tablet only — no border-radius on mobile full-screen)
  - [x] 3.9 Apply dynamic viewport height (`height: 100dvh`) on mobile for virtual keyboard handling
  - [x] 3.10 Render `<ChatHeader />` at top of panel
  - [x] 3.11 Render `<WelcomeState :message="welcomeMessage" />` in panel body (placeholder for future MessageList — Story 2.x will conditionally show MessageList vs WelcomeState)
  - [x] 3.12 Add accessibility: `role="complementary"`, `aria-label="Chat with AI Assistant"` on the drawer element
  - [x] 3.13 Add `<style scoped>` with `@layer native-chat` — panel layout, border-radius, mobile full-screen styles with nc- prefixed classes

- [x] Task 4: Update NativeChatWidget.vue to render ChatPanel (AC: #1, #2, #3)
  - [x] 4.1 Import and render `<ChatPanel />` inside the theme provider, alongside FloatingButton
  - [x] 4.2 Add a template ref on FloatingButton's wrapper for focus return — expose a ref that ChatPanel/ChatHeader can use to return focus after close
  - [x] 4.3 Provide a `floatingButtonRef` via provide/inject or via the existing CHAT_STATE_KEY state object so ChatHeader can programmatically focus it on close

- [x] Task 5: Write tests (AC: #1, #2, #3, #4, #5, #6)
  - [x] 5.1 Create `src/components/__tests__/ChatHeader.test.ts`:
    - Test: renders star icon and "AI Assistant" title
    - Test: renders close (X) button
    - Test: close button has `aria-label="Close chat"`
    - Test: clicking close button calls `close()` from injected state
    - Test: close button is keyboard accessible (Enter/Space trigger click)
  - [x] 5.2 Create `src/components/__tests__/WelcomeState.test.ts`:
    - Test: renders default welcome message "Hello! How can I help you?"
    - Test: renders custom welcome message when `message` prop is provided
    - Test: text is styled with large font size
  - [x] 5.3 Create `src/components/__tests__/ChatPanel.test.ts`:
    - Test: renders v-navigation-drawer with `location="right"`
    - Test: drawer is visible when `isOpen` is true
    - Test: drawer is hidden when `isOpen` is false
    - Test: renders ChatHeader as child
    - Test: renders WelcomeState as child
    - Test: panel has `role="complementary"` and `aria-label="Chat with AI Assistant"`
    - Test: Escape key calls `close()` from injected state
    - Test: scrim is disabled (no click-outside-to-close)
    - Test: passes `welcomeMessage` from config to WelcomeState
  - [x] 5.4 Update `src/components/__tests__/NativeChatWidget.test.ts`:
    - Test: renders ChatPanel as child alongside FloatingButton
  - [x] 5.5 Run `yarn test` — all tests pass
  - [x] 5.6 Run `yarn build` — verify build succeeds
  - [x] 5.7 Run `yarn lint` — verify no new lint errors (7 pre-existing warnings acceptable)

## Dev Notes

### Critical Architecture Constraints

- **TypeScript strict mode** — all files compile under `"strict": true`. Use `defineProps<T>()` and `defineEmits<T>()` for component interfaces
- **Symbol-based provide/inject** — import `CONFIG_KEY` and `CHAT_STATE_KEY` from `@/keys`. Never use string keys
- **No reactive() for top-level state** — use individual `ref()` values
- **No hardcoded colors** — use Vuetify theme tokens via `color="secondary"`, never `color="#C4105B"` in templates
- **No !important in CSS** — use wrapper elements for positioning overrides if needed (as established in Story 1.3)
- **@layer native-chat** — wrap all `<style scoped>` content in `@layer native-chat { }`
- **v-theme-provider** — all plugin content already wrapped in `<v-theme-provider theme="nativeChat">` at NativeChatWidget root
- **ESM-only** — all imports/exports use ES modules
- **No icon font dependency** — all icons as self-contained SVG components in `src/icons/` (established in Story 1.3)

### Vuetify v-navigation-drawer Usage Pattern

The ChatPanel uses `v-navigation-drawer` from Vuetify 3.11.x. Key configuration:

```vue
<v-navigation-drawer
  v-model="drawerOpen"
  location="right"
  temporary
  :scrim="false"
  :width="panelWidth"
  role="complementary"
  aria-label="Chat with AI Assistant"
  @keydown.escape="handleClose"
  class="nc-chat-panel"
>
  <ChatHeader />
  <div class="nc-chat-panel__body">
    <WelcomeState :message="welcomeMessage" />
  </div>
</v-navigation-drawer>
```

**Critical: v-model sync with injected isOpen state**

The `v-navigation-drawer` requires its own v-model for Vuetify's internal transition/animation handling. However, the source of truth for open/close is `isOpen` from the injected chat state. Pattern:

```typescript
import { watch, ref } from 'vue'

const chatState = inject(CHAT_STATE_KEY)!
const drawerOpen = ref(chatState.isOpen.value)

// Sync injected state → drawer
watch(() => chatState.isOpen.value, (val) => {
  drawerOpen.value = val
})

// Sync drawer → injected state (for Vuetify-initiated closes, e.g., route changes)
watch(drawerOpen, (val) => {
  if (!val && chatState.isOpen.value) {
    chatState.close()
  }
})
```

This two-way sync ensures Vuetify's animation system works correctly while keeping the injected state as the single source of truth.

**Critical: Scrim and click-outside behavior**

UX spec explicitly states "No click-outside-to-close — chat is a persistent side panel". Setting `:scrim="false"` disables the backdrop overlay. The `temporary` prop is still needed to make the drawer overlay content (not push it), but with scrim disabled, clicking outside does not close the panel. If Vuetify still closes on outside click with `temporary` + `scrim="false"`, the developer should use the `@update:model-value` event to prevent unwanted closes, or consider using a non-temporary drawer with CSS absolute/fixed positioning as a fallback.

### Responsive Breakpoint Strategy

```typescript
import { useDisplay } from 'vuetify'

const display = useDisplay()
const isMobile = computed(() => display.smAndDown.value) // true when <768px (Vuetify 'sm' breakpoint is 600px, so check 'mdAndDown' if 768 is needed)
```

**Important:** Vuetify's breakpoints: xs (<600px), sm (600-959px), md (960-1279px), lg (1280-1919px), xl (1920+). The UX spec breakpoint is 768px. Vuetify's `sm` includes 600-959px which doesn't match exactly. The developer should use `display.width.value < 768` for a precise breakpoint check, or use Vuetify's `smAndDown` (covers <960px) which is close enough for the mobile full-screen trigger. **Recommend using `display.width.value < 768` for exact match with UX spec.**

```typescript
const isMobile = computed(() => display.width.value < 768)
const panelWidth = computed(() => isMobile.value ? '100%' : 400)
```

### Mobile Full-Screen Pattern

On mobile (<768px), the chat panel should take over the full screen:

```css
@layer native-chat {
  .nc-chat-panel {
    border-radius: 0 !important; /* Override needed for Vuetify drawer rounded corners */
  }

  /* Desktop/tablet: 20px top border-radius */
  @media (min-width: 768px) {
    .nc-chat-panel {
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
    }
  }
}
```

**dvh usage:** Apply `height: 100dvh` on mobile to handle virtual keyboard correctly. The `dvh` unit adapts when the virtual keyboard opens/closes, preventing content from being hidden behind the keyboard.

```css
@layer native-chat {
  .nc-chat-panel--mobile {
    height: 100dvh;
  }
}
```

**Note on !important:** Vuetify's v-navigation-drawer may apply its own border-radius. If the developer cannot avoid `!important` for the border-radius override, document it as a Vuetify override exception (same category as the Story 1.3 positioning override). **Preferred approach:** use Vuetify's `rounded` prop if available, or apply the border-radius via a nested wrapper element to avoid !important.

### Focus Management Pattern

**On close (ChatHeader close button or Escape):**
Focus must return to the floating button. The approach is to provide a ref to the floating button element through the state or a separate injection key:

```typescript
// In NativeChatWidget.vue
const floatingButtonRef = ref<HTMLElement | null>(null)

// Add to provided state object
provide(CHAT_STATE_KEY, {
  isOpen: readonly(isOpen),
  open,
  close,
  toggle,
  floatingButtonRef, // Add this
})

// In ChatPanel.vue or ChatHeader.vue (on close):
const handleClose = () => {
  chatState.close()
  nextTick(() => {
    chatState.floatingButtonRef?.value?.focus()
  })
}
```

**Alternative approach (if modifying the state shape is undesirable before Story 2.1):** Use a separate provide/inject key for the floating button ref, or use `document.querySelector` with a specific data attribute as a fallback.

**On open:** Per UX spec, focus should move to the input field on open. However, ChatInput does not exist yet (Story 2.3). For Story 1.4, no specific focus-on-open behavior is needed — the panel opens and the welcome state is visible. Story 2.3 will add input focus on open.

### Escape Key Handler

The Escape key must close the panel from anywhere within it. Add `@keydown.escape` on the v-navigation-drawer element:

```vue
<v-navigation-drawer
  ...
  @keydown.escape="handleClose"
>
```

This ensures Escape works regardless of which element inside the panel has focus. The handler calls `close()` and returns focus to the floating button.

### ChatHeader Layout Pattern

```
┌────────────────────────────────────────┐
│ ★ AI Assistant                    [X]  │
└────────────────────────────────────────┘
```

- Left: IconStar (magenta/secondary color) + "AI Assistant" text (SemiBold 600, 14px)
- Right: Close button (IconClose, subtle gray icon)
- Flexbox layout: `display: flex; align-items: center; justify-content: space-between;`
- Padding: 16px horizontal per UX spacing foundation

### WelcomeState Display Pattern

- Large text (~24px, Regular weight) centered in the panel body
- Color: light gray (`#B0BCC0` or similar from UX spec — use CSS custom property or Vuetify's `text-disabled` color)
- No interactive elements, no state
- Pure display: receives `message` prop, renders it
- Vertically centered within the panel body area (using flexbox centering)

### Existing Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `src/components/NativeChatWidget.vue` | **Update** | Add ChatPanel import/render, provide floatingButtonRef |
| `src/components/__tests__/NativeChatWidget.test.ts` | **Update** | Add test for ChatPanel rendering |

### New Files to Create

| File | Purpose |
|------|---------|
| `src/components/ChatPanel.vue` | Chat panel container with v-navigation-drawer |
| `src/components/ChatHeader.vue` | Panel header with title and close button |
| `src/components/WelcomeState.vue` | Welcome message display |
| `src/icons/IconClose.vue` | Self-contained SVG close (X) icon |
| `src/components/__tests__/ChatPanel.test.ts` | ChatPanel unit tests |
| `src/components/__tests__/ChatHeader.test.ts` | ChatHeader unit tests |
| `src/components/__tests__/WelcomeState.test.ts` | WelcomeState unit tests |

### Testing Strategy

**ChatHeader.test.ts:**
- Mount with mocked provide values for CHAT_STATE_KEY (isOpen: ref(true), close: vi.fn(), etc.)
- Use `createVuetify()` from vitest.setup.ts for Vuetify context
- Test icon rendering, title text, close button aria-label
- Test close button click calls injected `close()`

**WelcomeState.test.ts:**
- Mount as standalone component (no provide needed — pure props-driven)
- Test default message text
- Test custom message via props
- Test text styling presence (large font class)

**ChatPanel.test.ts:**
- Mount with mocked provide values for CONFIG_KEY and CHAT_STATE_KEY
- Test v-navigation-drawer renders with correct attributes (location, temporary, role, aria-label)
- Test visibility tied to isOpen state
- Test child components render (ChatHeader, WelcomeState)
- Test Escape key handler
- Test scrim is disabled
- Test welcomeMessage prop passthrough from config

**NativeChatWidget.test.ts (update):**
- Add test verifying ChatPanel renders as child

### Naming Conventions (Enforce)

- **Component files:** PascalCase (`ChatPanel.vue`, `ChatHeader.vue`, `WelcomeState.vue`)
- **Icon files:** PascalCase with `Icon` prefix (`IconClose.vue`)
- **CSS classes:** kebab-case with `nc-` prefix (`nc-chat-panel`, `nc-chat-header`, `nc-welcome-state`)
- **Tests:** `.test.ts` suffix, co-located `__tests__/` folder
- **Imports:** Use `@/` path alias (`@/keys`, `@/components/ChatHeader.vue`)
- **Provide/inject:** Symbol-based from `@/keys`

### Verified Package Versions (from Story 1.3)

| Package | Version | Relevance to Story |
|---------|---------|-------------------|
| Vue | 3.5.28 | `ref()`, `readonly()`, `provide()`, `inject()`, `watch()`, `computed()`, `nextTick()` |
| Vuetify | 3.11.8 | `v-navigation-drawer`, `v-btn`, `v-icon`, `v-theme-provider`, `useDisplay()` |
| Vitest | 4.0.x | Test runner |
| @vue/test-utils | 2.4.6 | Component mounting |

### Previous Story (1.3) Learnings

- **Wrapper div for positioning** — use wrapper elements to avoid `!important` when overriding Vuetify defaults (established for FloatingButton)
- **Vuetify InternalThemeDefinition** — nativeChatTheme requires all color properties and `variables: {}`. Already resolved in 1.3
- **Vuetify test setup** — `server.deps.inline: ['vuetify']` in vitest.config.ts. Components/directives imported globally in vitest.setup.ts. Already configured
- **CHAT_STATE_KEY is untyped Symbol** — will be properly typed as `InjectionKey<UseChatReturn>` in Story 2.1. For this story, extending the state object shape (adding `floatingButtonRef`) is acceptable since the type is not yet frozen
- **7 pre-existing lint warnings** — Prettier/ESLint singleline conflict + false positive one-component-per-file. Don't try to fix
- **dist/ tracked in git** — build output is committed. Run `yarn build` and commit dist/
- **Yarn v4 Berry** — use `yarn` exclusively
- **@/* path alias** — configured everywhere. Use `@/keys` not `../keys`
- **ESLint 10 flat config** — eslint.config.ts, not .eslintrc.cjs
- **Icon pattern** — self-contained SVG in `src/icons/`, no icon font dependency. Use with `<v-icon :icon="Component" />`
- **Theme already registered** — nativeChatTheme registered at runtime in NativeChatWidget.vue setup. v-theme-provider already wraps all content. No theme changes needed for this story

### Project Structure Notes

- ChatPanel.vue, ChatHeader.vue, WelcomeState.vue go in `src/components/` (flat structure per architecture — no nesting)
- IconClose.vue goes in `src/icons/`
- Tests go in `src/components/__tests__/`
- No new directories needed
- Aligns with architecture project structure: all components flat in `src/components/`

### References

- [Source: architecture.md#Component Boundaries] — ChatPanel contains ChatHeader + WelcomeState, reads isOpen from injected state
- [Source: architecture.md#Implementation Patterns & Consistency Rules] — Naming, state, CSS patterns, anti-patterns
- [Source: architecture.md#CSS Patterns] — @layer native-chat, v-theme-provider, scoped styles
- [Source: architecture.md#Component Patterns] — defineProps<T>(), v-navigation-drawer for ChatPanel, v-theme-provider scoping
- [Source: architecture.md#State Patterns] — useChat() composable structure (Story 2.1 preview), ref() over reactive()
- [Source: architecture.md#Project Structure & Boundaries] — File locations, component hierarchy diagram
- [Source: architecture.md#Data Flow] — NativeChatWidget → FloatingButton + ChatPanel → ChatHeader
- [Source: ux-design-specification.md#ChatPanel] — v-navigation-drawer, location="right", temporary, role="complementary", ~400px width
- [Source: ux-design-specification.md#ChatHeader] — Star icon + "AI Assistant" title + close X, aria-label="Close chat"
- [Source: ux-design-specification.md#WelcomeState] — Large light-gray text, shown after initial fetch completes with zero messages, configurable
- [Source: ux-design-specification.md#Visual Design Foundation] — Color system, typography, spacing, border-radius specs
- [Source: ux-design-specification.md#Responsive Strategy] — Mobile full-screen <768px, tablet/desktop overlay >=768px, dvh, useDisplay()
- [Source: ux-design-specification.md#Accessibility Strategy] — Escape closes panel, focus management, role="complementary", no focus trap
- [Source: ux-design-specification.md#Interaction Patterns] — No click-outside-to-close, panel toggle behavior
- [Source: ux-design-specification.md#Scroll Behavior Patterns] — Auto-scroll rules (relevant for future stories)
- [Source: epics.md#Story 1.4] — Acceptance criteria, FR coverage (FR6, FR7, FR8)
- [Source: epics.md#Epic 1] — Plugin Foundation & Chat Shell overview
- [Source: prd.md#FR6] — Close via button or control
- [Source: prd.md#FR7] — Overlay/panel positioning
- [Source: prd.md#FR8] — Responsive viewport support (320px-1920px)
- [Source: 1-3-floating-agent-button.md] — Previous story learnings, package versions, established patterns, debug log
- [Source: 1-3-floating-agent-button.md#Debug Log References] — Vuetify theme registration pattern, test setup for Vuetify components

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- VNavigationDrawer requires `vuetify:layout` injection — tests must wrap ChatPanel in VLayout with ResizeObserver mock
- Template `ref` on a Vue component returns the component instance (not HTMLElement) — focus return logic navigates via `$el.querySelector('button')` to find the actual focusable button element
- Vuetify's `smAndDown` breakpoint (covers <960px) doesn't match UX spec's 768px exactly — used `display.width.value < 768` for precise breakpoint as recommended in Dev Notes

### Completion Notes List

- Created ChatHeader.vue with magenta star icon, "AI Assistant" title, and close (X) button with full accessibility
- Created WelcomeState.vue as a pure display component with configurable welcome message (default: "Hello! How can I help you?")
- Created ChatPanel.vue using Vuetify v-navigation-drawer with two-way sync between drawer v-model and injected isOpen state
- Implemented responsive behavior: 400px overlay on desktop, full-screen takeover on mobile (<768px) with 100dvh
- Added Escape key handler on the drawer element for panel close with focus return
- Disabled scrim (`:scrim="false"`) per UX "no click-outside-to-close" requirement
- Updated NativeChatWidget.vue to render ChatPanel alongside FloatingButton and provide floatingButtonRef for focus management
- Added 17 new tests across 3 test files (ChatHeader: 5, WelcomeState: 3, ChatPanel: 9) plus 1 new test in NativeChatWidget
- All 58 tests pass, build succeeds, lint clean

### File List

**New files:**
- src/components/ChatPanel.vue
- src/components/ChatHeader.vue
- src/components/WelcomeState.vue
- src/icons/IconClose.vue
- src/components/__tests__/ChatPanel.test.ts
- src/components/__tests__/ChatHeader.test.ts
- src/components/__tests__/WelcomeState.test.ts

**Modified files:**
- src/components/NativeChatWidget.vue
- src/components/FloatingButton.vue
- src/components/__tests__/NativeChatWidget.test.ts
- src/theme/nativeChatTheme.ts

## Change Log

- 2026-02-20: Implemented Story 1.4 — Chat Panel with Header & Welcome State. Added ChatPanel (v-navigation-drawer), ChatHeader (star icon + title + close button), WelcomeState (configurable welcome message), IconClose (SVG X icon). Updated NativeChatWidget to render ChatPanel and provide floatingButtonRef for focus management. Added 18 new tests (58 total).
