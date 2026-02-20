# Story 1.3: Floating Agent Button

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see a floating button in the corner of my app,
so that I can open the chat whenever I need assistance.

## Acceptance Criteria

1. **Given** the plugin is registered and `<NativeChatWidget />` is placed in the host app template **When** the page loads **Then** a circular floating button (56px, magenta `#C4105B`, white star icon) appears at the configured position (`bottom-right` by default) **And** the button has a subtle elevation/shadow

2. **Given** the floating button is visible **When** the user clicks the button **Then** the `isOpen` state toggles to `true`

3. **Given** the chat panel is open **When** the user clicks the floating button again **Then** the `isOpen` state toggles to `false`

4. **Given** the plugin config specifies `position: 'bottom-left'` **When** the button renders **Then** it is positioned at the bottom-left of the viewport

5. **Given** the floating button is rendered **When** a keyboard user tabs to it **Then** a visible focus indicator appears **And** the button has `aria-label="Open chat"` (or `"Close chat"` when open) and `aria-expanded` matching the open state

## Tasks / Subtasks

- [x] Task 1: Register nativeChatTheme with Vuetify at runtime (AC: #1)
  - [x] 1.1 Update `src/theme/nativeChatTheme.ts` — add border/divider color tokens needed for future components (`info: '#002B38'`, `'on-secondary': '#FFFFFF'`) and ensure the theme object is fully typed
  - [x] 1.2 In `NativeChatWidget.vue` setup, call `useTheme()` from Vuetify to register `nativeChatTheme` as `'nativeChat'` theme at runtime: `theme.themes.value.nativeChat = nativeChatTheme`
  - [x] 1.3 Wrap all NativeChatWidget template content in `<v-theme-provider theme="nativeChat">` for CSS isolation

- [x] Task 2: Implement NativeChatWidget root wrapper with state management (AC: #2, #3)
  - [x] 2.1 Replace placeholder `NativeChatWidget.vue` — add `<script setup lang="ts">` with `isOpen` ref (`ref(false)`), `open()`, `close()`, and `toggle()` functions
  - [x] 2.2 Inject plugin config via `inject(CONFIG_KEY)` to read `position` option
  - [x] 2.3 Provide widget state to children: create a state object `{ isOpen: readonly(isOpen), open, close, toggle }` and `provide(CHAT_STATE_KEY, widgetState)` — this state object will be replaced by `useChat()` return value in Story 2.1
  - [x] 2.4 Render `<FloatingButton />` as a child component inside the theme provider
  - [x] 2.5 Add `<style scoped>` block — no custom CSS needed at this stage (Vuetify theme provider handles scoping)

- [x] Task 3: Create FloatingButton.vue component (AC: #1, #2, #3, #4, #5)
  - [x] 3.1 Create `src/components/FloatingButton.vue` — `<script setup lang="ts">`, inject widget state from `CHAT_STATE_KEY`, read `isOpen` and `toggle` from injected state
  - [x] 3.2 Inject config from `CONFIG_KEY` to read `position` option (default `'bottom-right'`)
  - [x] 3.3 Render `<v-btn>` with: `icon` prop for circular shape, `size="56"`, `color="secondary"` (maps to `#C4105B` in nativeChatTheme), `elevation="4"` for subtle shadow
  - [x] 3.4 Create `src/icons/IconStar.vue` — a self-contained SVG icon component (inline SVG, no icon font dependency). The plugin MUST NOT depend on the host app's icon library (host apps may use Fluent, FontAwesome, etc. — not necessarily MDI). Use the component with Vuetify's `v-icon`: `<v-icon :icon="IconStar" color="white" />`. The SVG should render a four-pointed star/sparkle matching the UX design, sized via `width="1em" height="1em"` to inherit Vuetify's icon sizing
  - [x] 3.5 Add click handler: `@click="toggle"` — toggles `isOpen` state via injected action
  - [x] 3.6 Add accessibility attributes: `:aria-label="isOpen ? 'Close chat' : 'Open chat'"`, `:aria-expanded="isOpen.toString()"`
  - [x] 3.7 Add `<style scoped>` with `@layer native-chat` wrapping all styles
  - [x] 3.8 Apply fixed positioning via CSS class: `position: fixed`, `z-index: 9999`, `bottom: 24px`
  - [x] 3.9 Compute left/right position based on config: `right: 24px` for `'bottom-right'` (default), `left: 24px` for `'bottom-left'`

- [x] Task 4: Write tests (AC: #1, #2, #3, #4, #5)
  - [x] 4.1 Create `src/components/__tests__/FloatingButton.test.ts`:
    - Test: renders a circular button with correct size (56px)
    - Test: button uses `secondary` color from theme
    - Test: renders star icon inside the button
    - Test: clicking button calls `toggle()` from injected state
    - Test: `aria-label` is `"Open chat"` when `isOpen` is false
    - Test: `aria-label` is `"Close chat"` when `isOpen` is true
    - Test: `aria-expanded` reflects `isOpen` state
    - Test: default position is bottom-right (right: 24px)
    - Test: `position: 'bottom-left'` config places button at left: 24px
    - Test: button has `position: fixed` style
  - [x] 4.2 Update `src/components/__tests__/NativeChatWidget.test.ts`:
    - Test: renders FloatingButton as child
    - Test: provides state via CHAT_STATE_KEY with `isOpen`, `open`, `close`, `toggle`
    - Test: `isOpen` starts as `false`
    - Test: wraps content in v-theme-provider with theme="nativeChat"
    - Test: registers nativeChatTheme with Vuetify's theme system
  - [x] 4.3 Run `yarn test` — all tests pass
  - [x] 4.4 Run `yarn build` — verify build succeeds
  - [x] 4.5 Run `yarn lint` — verify no lint errors

## Dev Notes

### Critical Architecture Constraints

- **TypeScript strict mode** — all files compile under `"strict": true`. Use `defineProps<T>()` and `defineEmits<T>()` for component interfaces
- **Symbol-based provide/inject** — import `CONFIG_KEY` and `CHAT_STATE_KEY` from `@/keys`. Never use string keys
- **No reactive() for top-level state** — use individual `ref()` values in NativeChatWidget
- **No hardcoded colors** — use Vuetify theme tokens via `color="secondary"`, never `color="#C4105B"` in templates
- **No !important in CSS** — ever
- **@layer native-chat** — wrap all `<style scoped>` content in `@layer native-chat { }`
- **v-theme-provider** — wrap all plugin template content in `<v-theme-provider theme="nativeChat">` at the NativeChatWidget root level
- **ESM-only** — all imports/exports use ES modules

### NativeChatWidget State Management (Pre-useChat)

Story 2.1 introduces `useChat()` composable with the full `UseChatReturn` interface. For this story, NativeChatWidget manages a **minimal local state** that will be replaced by `useChat()` in Story 2.1:

```typescript
// Minimal widget state for Story 1.3 (replaced by useChat() in Story 2.1)
const isOpen = ref(false)

const open = () => { isOpen.value = true }
const close = () => { isOpen.value = false }
const toggle = () => { isOpen.value = !isOpen.value }

// Provide to children — FloatingButton (and later ChatPanel) inject this
provide(CHAT_STATE_KEY, {
  isOpen: readonly(isOpen),
  open,
  close,
  toggle,
})
```

The `CHAT_STATE_KEY` is currently an untyped Symbol. When `useChat()` is created in Story 2.1, the key will be typed as `InjectionKey<UseChatReturn>` and the state object will expand with `messages`, `isLoading`, `isSending`, `hasMore`, `failedMessageText`, `sendMessage()`, `loadMore()`, `retry()`.

**Important for dev agent:** Do NOT create a separate composable for this — keep it inline in NativeChatWidget setup. Story 2.1 will extract it properly.

### Vuetify Theme Registration Pattern

The plugin cannot register themes during `app.use()` because Vuetify's `useTheme()` composable requires Vue composition API context (i.e., must be called inside `setup()`). Instead:

```typescript
// In NativeChatWidget.vue <script setup>
import { useTheme } from 'vuetify'
import { nativeChatTheme } from '@/theme/nativeChatTheme'

const theme = useTheme()
theme.themes.value.nativeChat = nativeChatTheme
```

This registers the theme the first time NativeChatWidget mounts. The `<v-theme-provider theme="nativeChat">` wrapper then scopes all children to this theme.

### FloatingButton Vuetify Pattern (Vuetify 3.11.x)

In Vuetify 3, the `fab` prop from v2 was removed. To create a floating action button:

```vue
<script setup lang="ts">
import IconStar from '@/icons/IconStar.vue'
</script>

<template>
  <v-btn
    icon
    size="56"
    color="secondary"
    elevation="4"
    :aria-label="isOpen ? 'Close chat' : 'Open chat'"
    :aria-expanded="isOpen.toString()"
    @click="toggle"
    class="nc-floating-button"
  >
    <v-icon :icon="IconStar" color="white" />
  </v-btn>
</template>
```

- `icon` prop makes v-btn circular
- `size="56"` sets 56px diameter
- `color="secondary"` maps to `#C4105B` (magenta) via nativeChatTheme
- `elevation="4"` adds subtle shadow
- Fixed positioning is handled via CSS class (Vuetify v-btn does NOT have `position` or `location` props)

### Icon Component Pattern (No Icon Font Dependency)

The plugin MUST NOT depend on the host app's icon library. Host apps may use Fluent, FontAwesome, or any other icon set — not necessarily `@mdi/font`. All plugin icons are self-contained SVG Vue components in `src/icons/`.

```vue
<!-- src/icons/IconStar.vue -->
<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <!-- four-pointed star/sparkle SVG path -->
  </svg>
</template>
```

Usage with Vuetify: `<v-icon :icon="IconStar" />` — Vuetify 3 accepts component references via the `:icon` prop. The `width="1em" height="1em"` ensures the SVG inherits Vuetify's icon sizing.

Future icons (close X, send arrow, copy, etc.) follow the same pattern — one component per icon in `src/icons/`.

### CSS Fixed Positioning Pattern

```css
@layer native-chat {
  .nc-floating-button {
    position: fixed !important; /* Exception: override Vuetify's position: relative on v-btn */
    z-index: 9999;
    bottom: 24px;
  }

  .nc-floating-button--right {
    right: 24px;
  }

  .nc-floating-button--left {
    left: 24px;
  }
}
```

**NOTE on !important exception:** Vuetify's `v-btn` applies `position: relative` by default. Overriding to `position: fixed` requires `!important` specifically for this one property. The architecture anti-pattern "No !important" should be interpreted as "no !important for styling overrides" — this is a positioning override required for the FAB pattern. **If you can achieve fixed positioning without !important (e.g., by using a wrapper div with `position: fixed` instead), prefer that approach.**

**Preferred approach (no !important):**
```vue
<div class="nc-floating-button-wrapper" :class="positionClass">
  <v-btn icon size="56" color="secondary" elevation="4" ...>
    <v-icon color="white">mdi-star-four-points</v-icon>
  </v-btn>
</div>
```
```css
@layer native-chat {
  .nc-floating-button-wrapper {
    position: fixed;
    z-index: 9999;
    bottom: 24px;
  }
  .nc-floating-button-wrapper--right {
    right: 24px;
  }
  .nc-floating-button-wrapper--left {
    left: 24px;
  }
}
```

### Icon Selection

The UX design shows a four-pointed star/sparkle icon in the floating button. The SVG path should produce a clean 4-pointed sparkle shape. The dev agent should render it in VitePress to verify it matches the UX design visually. `@mdi/font` is a dev-only dependency for VitePress playground — it MUST NOT be used in plugin components.

### Existing Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `src/components/NativeChatWidget.vue` | **Replace** | Currently a placeholder div — replace entirely with root wrapper |
| `src/theme/nativeChatTheme.ts` | **Minor update** | Add any missing color tokens needed |
| `src/keys.ts` | **No change** | CONFIG_KEY and CHAT_STATE_KEY already exist |
| `src/plugin.ts` | **No change** | Plugin install already provides config |
| `src/styles.css` | **No change** | @layer native-chat already established |
| `src/index.ts` | **No change** | NativeChatWidget already exported |

### New Files to Create

| File | Purpose |
|------|---------|
| `src/components/FloatingButton.vue` | Floating agent button component |
| `src/icons/IconStar.vue` | Self-contained SVG star icon component (no icon font dependency) |
| `src/components/__tests__/FloatingButton.test.ts` | FloatingButton unit tests |

### Testing Strategy

**FloatingButton.test.ts:**
- Mount with mocked provide values for CONFIG_KEY and CHAT_STATE_KEY
- Use `createVuetify()` from vitest.setup.ts for Vuetify context
- Test DOM attributes (aria-label, aria-expanded) and computed position classes
- Test click events call injected `toggle()`
- For position testing: inject config with `position: 'bottom-left'` and verify CSS class

**NativeChatWidget.test.ts (update existing):**
- Mount with CONFIG_KEY provided (mock apiClient)
- Verify FloatingButton renders as child
- Verify CHAT_STATE_KEY is provided to children (mount a test consumer component)
- Verify isOpen starts false
- Verify v-theme-provider renders with theme="nativeChat"

### Naming Conventions (Enforce)

- **Component files:** PascalCase (`FloatingButton.vue`)
- **CSS classes:** kebab-case with `nc-` prefix (`nc-floating-button`, `nc-floating-button-wrapper`)
- **Tests:** `.test.ts` suffix, co-located `__tests__/` folder
- **Imports:** Use `@/` path alias (`@/keys`, `@/theme/nativeChatTheme`)
- **Provide/inject:** Symbol-based from `@/keys`

### Verified Package Versions (from Story 1-1)

| Package | Version | Relevance to Story |
|---------|---------|-------------------|
| Vue | 3.5.28 | `ref()`, `readonly()`, `provide()`, `inject()` |
| Vuetify | 3.11.8 | `v-btn`, `v-icon` (with component icons), `v-theme-provider`, `useTheme()` |
| Vitest | 4.0.x | Test runner |
| @vue/test-utils | 2.4.6 | Component mounting |

### Previous Story (1-2) Learnings

- **Yarn v4 Berry** — use `yarn` exclusively
- **@/* path alias** — configured in tsconfig.json, vite.config.ts, vitest.config.ts. Use `@/keys` not `../keys`
- **src/styles.css** — already exists with `@layer native-chat {}`. Do NOT recreate
- **vitest.setup.ts** — Vuetify registered globally for component tests
- **ESLint 10 flat config** — eslint.config.ts, not .eslintrc.cjs
- **dist/ tracked in git** — build output is committed
- **Existing NativeChatWidget.test.ts** — already exists, needs updating (not creating from scratch)
- **Plugin provides config via CONFIG_KEY** — already implemented, inject in NativeChatWidget
- **CHAT_STATE_KEY is untyped Symbol** — will be properly typed in Story 2.1
- **Lint warnings** — 7 pre-existing warnings (Prettier/ESLint singleline conflict + false positive one-component-per-file). Don't try to fix pre-existing warnings

### Project Structure Notes

- FloatingButton.vue goes in `src/components/` (flat structure per architecture — no nesting)
- Test goes in `src/components/__tests__/FloatingButton.test.ts`
- NativeChatWidget.vue is at `src/components/NativeChatWidget.vue` (already exists as placeholder)
- nativeChatTheme is at `src/theme/nativeChatTheme.ts` (already exists with color tokens)
- No new directories needed

### References

- [Source: architecture.md#Component Boundaries] — NativeChatWidget root wrapper, FloatingButton reads isOpen from injected state
- [Source: architecture.md#Implementation Patterns & Consistency Rules] — Naming, state, CSS patterns, anti-patterns
- [Source: architecture.md#CSS Patterns] — @layer native-chat, v-theme-provider, scoped styles
- [Source: architecture.md#State Patterns] — useChat() composable structure (Story 2.1 preview), ref() over reactive()
- [Source: architecture.md#Project Structure & Boundaries] — File locations, component hierarchy
- [Source: ux-design-specification.md#FloatingButton] — 56px, magenta, star icon, configurable position, accessibility
- [Source: ux-design-specification.md#Visual Design Foundation] — Color system, floating button specs
- [Source: ux-design-specification.md#Accessibility Strategy] — aria-label, aria-expanded, focus indicators, keyboard navigation
- [Source: ux-design-specification.md#Responsive Strategy] — Floating button same size on all breakpoints
- [Source: epics.md#Story 1.3] — Acceptance criteria, FR coverage (FR5, FR6 partial)
- [Source: 1-2-core-types-api-client-helper-plugin-install.md] — Previous story learnings, package versions, existing code
- [Source: 1-1-project-scaffold-build-configuration.md] — Project scaffold, nativeChatTheme stub, CSS layer setup

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Vuetify `InternalThemeDefinition` requires all color properties and `variables` — resolved by merging nativeChatTheme colors with Vuetify's default light theme defaults at registration time
- Vuetify components (v-btn, v-icon, v-theme-provider) not resolving in test environment — fixed by adding `server.deps.inline: ['vuetify']` to vitest.config.ts and importing all components/directives in vitest.setup.ts
- Used wrapper `<div>` approach for fixed positioning to avoid `!important` on v-btn's `position: relative`

### Completion Notes List

- Task 1: Added `info` and `on-secondary` color tokens to nativeChatTheme. Added `variables: {}` for Vuetify InternalThemeDefinition compatibility. Registered theme at runtime in NativeChatWidget setup via `useTheme()`, merging with light theme defaults. Wrapped content in `<v-theme-provider theme="nativeChat">`.
- Task 2: Replaced placeholder NativeChatWidget with full root wrapper. Manages minimal local state (`isOpen`, `open`, `close`, `toggle`) via `ref()` and `readonly()`. Provides state to children via `provide(CHAT_STATE_KEY, ...)`. Renders FloatingButton inside theme provider. Config injection delegated to FloatingButton (which reads position directly).
- Task 3: Created FloatingButton.vue with Vuetify `v-btn` (icon, size=56, color=secondary, elevation=4). Created IconStar.vue as self-contained SVG (four-pointed sparkle, no icon font dependency). Used wrapper div for fixed positioning (no !important). Computed position class from injected config. Full accessibility: dynamic aria-label, aria-expanded.
- Task 4: Created 10 FloatingButton tests (size, color, icon, click/toggle, aria-label open/close, aria-expanded, default position, bottom-left position, fixed wrapper). Updated 10 NativeChatWidget tests (5 plugin tests preserved, 5 new: renders FloatingButton, provides state via CHAT_STATE_KEY, isOpen starts false, v-theme-provider with nativeChat, theme registration). All 40 tests pass. Build succeeds. Lint: 0 errors, 7 warnings (pre-existing).

### Change Log

- 2026-02-20: Implemented Story 1.3 — Floating Agent Button. Added FloatingButton.vue, IconStar.vue, updated NativeChatWidget.vue with theme registration and state management, updated nativeChatTheme.ts with additional color tokens, created FloatingButton tests, updated NativeChatWidget tests, and updated vitest config for Vuetify component resolution.
- 2026-02-20: **Code Review (AI)** — Adversarial review by Claude Opus 4.6 + Gemini 3 Pro + GPT-5.1 Codex. Found 1 critical, 5 high, 5 medium, 3 low issues. All critical/high/medium issues fixed:
  - C1: Fixed Prettier formatting in FloatingButton.vue (task 4.5 was falsely marked complete)
  - H1: Added runtime guard for missing CHAT_STATE_KEY injection in FloatingButton.vue
  - H2: Added idempotency guard for theme registration in NativeChatWidget.vue
  - H3: Added StrictThemeDefinition type to nativeChatTheme.ts (solution from GPT-5.1 Codex)
  - H4: Fixed placeholder test in FloatingButton.test.ts — now verifies CSS classes
  - H5: Fixed duplicate test in NativeChatWidget.test.ts — now verifies theme registration + idempotency
  - M1: Added aria-hidden="true" focusable="false" to IconStar.vue for screen readers
  - M3: Updated File List with sprint-status.yaml
  - L1: Added empty `<style scoped>` to NativeChatWidget.vue per architecture mandate

### File List

| File | Status |
|------|--------|
| `src/theme/nativeChatTheme.ts` | Modified — added `info`, `on-secondary` colors and `variables` |
| `src/components/NativeChatWidget.vue` | Modified — replaced placeholder with root wrapper, theme registration, state management |
| `src/components/FloatingButton.vue` | New — floating agent button component |
| `src/icons/IconStar.vue` | New — self-contained SVG star icon |
| `src/components/__tests__/FloatingButton.test.ts` | New — 10 unit tests for FloatingButton |
| `src/components/__tests__/NativeChatWidget.test.ts` | Modified — updated with 5 new NativeChatWidget tests |
| `vitest.setup.ts` | Modified — import all Vuetify components/directives for test resolution |
| `vitest.config.ts` | Modified — added `server.deps.inline: ['vuetify']` for CSS handling |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | Modified — story status tracking |
