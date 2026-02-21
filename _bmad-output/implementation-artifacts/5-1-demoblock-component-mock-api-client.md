# Story 5.1: DemoBlock Component & Mock API Client

Status: done

Epic: 5 — VitePress Documentation & Interactive Playground
Date: 2026-02-21
Depends on: Epic 4 complete (all plugin components and error handling implemented)

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer browsing the docs,
I want to see live interactive demos with their source code displayed alongside,
so that I can understand how each component works and copy working examples.

## Acceptance Criteria

1. **Given** a VitePress documentation page uses `<DemoBlock>` **When** the page renders **Then** a live preview of the plugin component renders inside the block **And** the source code is displayed below the preview with syntax highlighting **And** the demo is interactive (buttons click, input accepts text, messages display)

2. **Given** the docs site needs a working chat widget in demos **When** a demo page renders `<NativeChatWidget />` **Then** a mock API client provides simulated responses without a real backend **And** the mock supports: returning canned conversations, simulating send/response with realistic delay (~1s), simulating errors on demand

3. **Given** the VitePress theme setup **When** the docs site loads **Then** the plugin is registered in the VitePress app via `app.use(NativeChatPlugin, { apiClient: mockApiClient })` **And** `<NativeChatWidget />` and all plugin components are available in demo pages

## Tasks / Subtasks

- [x] Task 1: Create mock API client (AC: #2)
  - [x] 1.1 Create `docs/.vitepress/mock/mockApiClient.ts` implementing `NativeChatApiClient` interface
  - [x] 1.2 Implement `createConversation()` — returns a mock conversation with generated ID
  - [x] 1.3 Implement `getConversations(offset, limit)` — returns a single mock conversation in a list, `has_more: false`
  - [x] 1.4 Implement `getMessages(conversationId, offset, limit)` — returns canned message history with pagination support (`has_more` based on offset vs total canned messages), messages returned newest-first per API contract
  - [x] 1.5 Implement `sendMessage(conversationId, message)` — returns mock user+assistant response after configurable delay (~1s default); assistant responses should be contextual canned replies (not echo)
  - [x] 1.6 Add error simulation support — export a way to toggle error mode (e.g., `mockApiClient.simulateError(statusCode)` or a reactive flag) so demo pages can trigger 429, 503, or generic errors on demand
  - [x] 1.7 Add canned conversation data — at least 8-10 messages covering: short user questions, medium assistant responses with markdown (bold, lists, paragraphs), a long assistant response with headings and code blocks

- [x] Task 2: Register plugin in VitePress theme (AC: #3)
  - [x] 2.1 Update `docs/.vitepress/theme/index.ts` — import `NativeChatPlugin` from `@/plugin` and the mock API client
  - [x] 2.2 Add `app.use(NativeChatPlugin, { apiClient: mockApiClient })` in `enhanceApp()`
  - [x] 2.3 Verify `<NativeChatWidget />` renders on `yarn docs:dev` — floating button visible, chat opens, mock messages load

- [x] Task 3: Create DemoBlock component (AC: #1)
  - [x] 3.1 Create `docs/.vitepress/components/DemoBlock.vue` with `<script setup lang="ts">`
  - [x] 3.2 Accept `source` prop (string) — raw source code passed via Vite `?raw` import from consuming page
  - [x] 3.3 Render a `<slot />` inside a bordered preview container for the live interactive demo
  - [x] 3.4 Add a "Show/Hide Code" toggle button below the preview
  - [x] 3.5 Render source code in a collapsible `<pre><code class="language-vue">` block below the toggle
  - [x] 3.6 Add a "Copy Code" button that copies `source` to clipboard (same pattern as MessageBubble copy — icon changes to checkmark for ~1.5s, silent failure on permission denied)
  - [x] 3.7 Style with Vuetify theme tokens — bordered container, subtle background for code area, clean typography

- [x] Task 4: Verify end-to-end demo functionality (AC: #1, #2, #3)
  - [x] 4.1 Create a minimal test page `docs/components/widget.md` that imports `DemoBlock` and renders `<NativeChatWidget />` inside it with `?raw` source display — this page will be fully built out in Story 5.3 but serves as a smoke test here
  - [x] 4.2 Run `yarn docs:dev` and verify: floating button appears, chat opens, mock messages load, send message works with mock response, source code toggles, copy button works
  - [x] 4.3 Run `yarn docs:build` — confirm no build errors

- [x] Task 5: Run existing test suite and build (AC: all)
  - [x] 5.1 Run `yarn test` — all 189 existing tests pass (no new tests needed — docs-only components)
  - [x] 5.2 Run `yarn build` — library build succeeds (docs components are NOT part of library output)
  - [x] 5.3 Run `yarn lint` — no lint errors

## Dev Notes

### CRITICAL: Docs-Only Components — NOT Part of Library Build

**This story creates files exclusively in `docs/` — nothing in `src/` is created or modified.** The mock API client and DemoBlock live in the VitePress docs directory and are NOT included in the library build output (`dist/`). No changes to `src/index.ts` exports, no new runtime dependencies.

**Key difference from previous stories:** No unit tests with Vitest are needed for docs-only components. Validation is via `yarn docs:dev` (visual) and `yarn docs:build` (no errors). The existing 189 library tests must still pass unchanged.

### Critical Architecture Constraints

- **`<script setup lang="ts">` only** — even for docs components
- **`@/` import alias** for any imports from `src/` — already configured in VitePress vite config (`docs/.vitepress/config.ts` maps `@` to `../../src`)
- **Import order**: Vue core → third-party → `@/` project imports
- **No new runtime dependencies** — docs components use only what's already available (Vue, Vuetify, VitePress built-ins)
- **Vuetify theme tokens for styling** — use `rgb(var(--v-theme-primary))` etc., no hardcoded hex values
- **`@layer native-chat`** — wrap any `<style scoped>` content in docs components inside `@layer native-chat { }` (consistent with PerfBenchmark.vue pattern)
- **CSS class prefix** — use `nc-` prefix for custom classes: `nc-demo-block`, `nc-demo-block__preview`
- **BEM naming** — `nc-demo-block__preview`, `nc-demo-block__source`, `nc-demo-block__actions`
- **No `!important`** in any CSS
- **Prettier rules** — single quotes, no semicolons, trailing commas, 100 char width

### Mock API Client Implementation Guide

**File:** `docs/.vitepress/mock/mockApiClient.ts`

**Must implement the exact `NativeChatApiClient` interface from `@/types/api`:**

```typescript
import type { NativeChatApiClient } from '@/types/api'
```

**Canned message data — at least 8-10 messages covering these scenarios:**
- Short user question ("What can you help me with?")
- Medium assistant response with **bold** and bullet lists
- Long assistant response with `## headings`, paragraphs, and a code block
- Another user/assistant exchange demonstrating multi-turn
- This exercises the markdown rendering pipeline (marked + DOMPurify) in demos

**API behavior contract (must match real API shape exactly):**

| Method | Return Shape | Notes |
|--------|-------------|-------|
| `createConversation()` | `{ id: string, createdAt: string }` | Generate stable mock ID like `'mock-conv-1'` |
| `getConversations(offset, limit)` | `{ conversations: [...], has_more: boolean }` | Return one conversation, `has_more: false` |
| `getMessages(convId, offset, limit)` | `{ messages: [...], has_more: boolean }` | **Messages newest-first** per API contract; plugin reverses for display. Support pagination via offset. |
| `sendMessage(convId, message)` | `{ userMessage: {...}, assistantMessage: {...} }` | Add ~1s `setTimeout` delay for realistic feel. Return contextual canned reply. |

**CRITICAL — Message ordering:** The real API returns messages **newest-first**. The mock must do the same. `useChat()` reverses them for chronological display. If the mock returns chronological order, the UI will display messages backwards.

**Error simulation pattern:**

```typescript
// Export a reactive flag or function for demo pages to toggle errors
export let simulateErrorCode: number | null = null

export function setSimulateError(code: number | null) {
  simulateErrorCode = code
}

// In sendMessage():
if (simulateErrorCode) {
  const error = new Error('Simulated error')
  ;(error as any).statusCode = simulateErrorCode
  throw error
}
```

This lets Story 5.3's demo pages add an "Error Mode" toggle button that calls `setSimulateError(503)`.

### DemoBlock Component Implementation Guide

**File:** `docs/.vitepress/components/DemoBlock.vue`

**Usage pattern in VitePress .md pages:**

```vue
<script setup>
import DemoBlock from '../.vitepress/components/DemoBlock.vue'
import WidgetDemoSource from './demos/WidgetDemo.vue?raw'
import WidgetDemo from './demos/WidgetDemo.vue'
</script>

<DemoBlock :source="WidgetDemoSource">
  <WidgetDemo />
</DemoBlock>
```

**How Vite `?raw` imports work:**
- `import Foo from './Foo.vue?raw'` returns the file contents as a plain string
- `import Foo from './Foo.vue'` returns the compiled Vue component
- Both imports are used together — component for live rendering, raw string for source display

**Component structure:**

```
┌─────────────────────────────────┐
│ Preview Area                     │
│ ┌─────────────────────────────┐ │
│ │ <slot /> (live component)   │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ [▼ Show Code]  [📋 Copy]       │
├─────────────────────────────────┤
│ <pre><code>                     │
│   {{ source }}                  │
│ </code></pre>                   │
└─────────────────────────────────┘
```

**Props:**
- `source: string` (required) — raw source code string from `?raw` import

**State:**
- `expanded: ref(false)` — toggles code visibility
- `copied: ref(false)` — shows checkmark feedback after copy

**Copy-to-clipboard pattern** — reuse the exact same pattern from `MessageBubble.vue`:

```typescript
async function copySource() {
  try {
    await navigator.clipboard.writeText(props.source)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  } catch {
    // Silent failure on clipboard permission denied
  }
}
```

**Source code display — NO extra highlighting dependency needed:**
- Use `<pre><code>{{ source }}</code></pre>` — plain text with monospace styling
- VitePress's built-in CSS already styles `pre` and `code` elements with nice backgrounds and padding
- Syntax highlighting is NOT required for MVP — plain source is readable and functional
- If desired later, VitePress includes shiki which could be used, but that's a post-MVP enhancement

**Styling guidelines:**
- Preview area: bordered container with subtle padding, `border: 1px solid rgba(var(--v-theme-on-surface), 0.12)`
- Code area: slightly darker background using VitePress's existing code block styles
- Toggle button: simple text button, not a Vuetify `v-btn` (docs component, keep lightweight)
- Copy button: small icon button next to toggle
- Use the existing PerfBenchmark.vue as a style reference — it uses the same theme token pattern

### VitePress Theme Update Guide

**File:** `docs/.vitepress/theme/index.ts`

**Current state:**
```typescript
import DefaultTheme from 'vitepress/theme'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { nativeChatTheme } from '../../../src/theme/nativeChatTheme'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import type { Theme } from 'vitepress'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      nativeChat: nativeChatTheme,
    },
  },
})

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(vuetify)
  },
} satisfies Theme
```

**Required change — add two lines:**

1. Import the plugin: `import { NativeChatPlugin } from '@/plugin'`
2. Import mock client: `import { mockApiClient } from '../mock/mockApiClient'`
3. Register in `enhanceApp`: `app.use(NativeChatPlugin, { apiClient: mockApiClient })`

**CRITICAL — Registration order matters:**
- `app.use(vuetify)` MUST come before `app.use(NativeChatPlugin, ...)` because the plugin's components depend on Vuetify being available
- The existing code already registers Vuetify first, so just add the plugin registration after it

**After this change:**
- `<NativeChatWidget />` is globally registered and available in any VitePress page
- The floating button will appear on every docs page (this is intentional for Story 5.3's full widget demo)
- Demo pages that want isolated component demos (MessageBubble, ChatInput without the full widget) can use provide/inject directly, following the PerfBenchmark.vue pattern

### File Structure Requirements

**Files to CREATE:**

| File | Purpose |
|------|---------|
| `docs/.vitepress/mock/mockApiClient.ts` | Mock `NativeChatApiClient` implementation with canned data, send delay, error simulation |
| `docs/.vitepress/components/DemoBlock.vue` | Source + preview wrapper using slot + `?raw` source prop |
| `docs/components/widget.md` | Minimal smoke-test page with DemoBlock wrapping the full widget (expanded in Story 5.3) |

**Files to MODIFY:**

| File | Action | Purpose |
|------|--------|---------|
| `docs/.vitepress/theme/index.ts` | **Modify** | Add `NativeChatPlugin` registration with mock API client |

**Files that MUST NOT be modified:**

| File | Reason |
|------|--------|
| `src/**/*` | No library source changes — this is a docs-only story |
| `package.json` | No new dependencies |
| `vite.config.ts` | Library build config unchanged |
| `vitest.config.ts` | Test config unchanged |
| `dist/**/*` | No library rebuild needed unless `src/` changes (it shouldn't) |

**Directory structure after this story:**

```
docs/
├── .vitepress/
│   ├── config.ts                    # (unchanged)
│   ├── theme/
│   │   └── index.ts                 # MODIFIED: + NativeChatPlugin registration
│   ├── components/
│   │   ├── PerfBenchmark.vue        # (existing — unchanged)
│   │   └── DemoBlock.vue            # NEW: source + preview wrapper
│   └── mock/
│       └── mockApiClient.ts         # NEW: mock NativeChatApiClient
├── performance/
│   └── benchmark.md                 # (existing — unchanged)
└── components/
    └── widget.md                    # NEW: smoke-test demo page
```

### Library & Framework Requirements

**No new dependencies for this story.** All required libraries are already installed.

**Technologies used in docs components:**

| Technology | Available Via | Usage |
|---|---|---|
| Vue 3.5+ | Already installed | `<script setup lang="ts">`, `ref()`, `computed()` |
| Vuetify 3.11+ | Already installed | Theme tokens for styling, `v-theme-provider` if needed |
| VitePress 1.6+ | Already installed | Custom theme components, `?raw` imports |
| TypeScript 5.9+ | Already installed | Strict mode for mock API client |
| `marked` + `dompurify` | Already installed | Used automatically by MessageBubble for assistant messages in demos |

**Vite `?raw` import — no config needed:**
- Vite natively supports `?raw` suffix on any import — returns file content as string
- Already works in the VitePress dev server and build
- TypeScript declaration: Vite's `client.d.ts` includes the `?raw` module declaration

**VitePress custom components — registration patterns:**
- Global components: registered in `docs/.vitepress/theme/index.ts` via `app.component()` or `app.use()`
- Per-page components: imported directly in `<script setup>` blocks inside `.md` files
- DemoBlock will be imported per-page (not globally) since only demo pages use it

### Testing Requirements

**No new Vitest tests for this story.** DemoBlock and mockApiClient are docs-only components not included in the library build.

**Validation approach:**

1. **`yarn test`** — all 189 existing tests pass unchanged (regression check)
2. **`yarn build`** — library build succeeds (docs components excluded by `tsconfig.build.json`)
3. **`yarn lint`** — no lint errors (ESLint covers `docs/` files too)
4. **`yarn docs:dev`** — manual verification:
   - Floating button appears on docs pages
   - Click button → chat panel opens with mock messages loaded
   - Send a message → mock response appears after ~1s delay
   - DemoBlock on widget.md shows live preview + toggleable source code
   - Copy button copies source to clipboard
5. **`yarn docs:build`** — VitePress static build completes without errors

**Why no unit tests:**
- DemoBlock is a simple display wrapper with no business logic worth unit testing
- mockApiClient is test infrastructure itself — testing mock infrastructure is circular
- The PerfBenchmark.vue (existing docs component) also has no unit tests — this is the established pattern

### Previous Story Intelligence

**From Story 4.2 (Message Retry & Error Recovery) — most recent story:**
- 189 Vitest tests pass, build succeeds (29.34 kB gzip), lint clean
- Error infrastructure fully operational — `handleSendFailure()`, `failedMessageText`, error messages preserved in history
- `dist/` is tracked in git — run `yarn build` and commit dist/ changes if source changes. **But this story should NOT change src/, so no dist/ rebuild needed**
- 7 pre-existing lint warnings — **don't try to fix them**
- ESLint 10 flat config (`eslint.config.ts`, not `.eslintrc.cjs`) — the architecture doc mentions `.eslintrc.cjs` but the project actually uses flat config

**From PerfBenchmark.vue (existing docs component pattern):**
- Docs components use `<script setup lang="ts">` with `@/` alias imports
- Provide/inject pattern for isolated component demos: construct a `UseChatReturn` mock object, `provide(CHAT_STATE_KEY, mockState)` and `provide(CONFIG_KEY, mockConfig)`
- Vuetify theme wrapping: `<v-theme-provider theme="nativeChat">` around rendered plugin components
- CSS uses `@layer native-chat` with `nc-` prefix and `<style scoped>`
- Import internal components directly: `import MessageList from '@/components/MessageList.vue'`

**Key pattern from PerfBenchmark.vue for mock state:**
```typescript
import { CHAT_STATE_KEY, CONFIG_KEY } from '@/keys'
import type { UseChatReturn } from '@/composables/useChat'
import type { NativeChatPluginOptions } from '@/types/config'

const mockChatState: UseChatReturn = {
  messages: readonly(messages) as DeepReadonly<Ref<ChatMessage[]>>,
  isOpen: readonly(ref(true)),
  isLoading: readonly(isLoading),
  isSending: readonly(ref(false)),
  hasMore: readonly(hasMore),
  failedMessageText: readonly(ref<string | null>(null)),
  open: async () => {},
  close: () => {},
  sendMessage: async () => {},
  loadMore: mockLoadMore,
  retry: async () => {},
}
provide(CHAT_STATE_KEY, mockChatState)
provide(CONFIG_KEY, { apiClient: mockApiClient } satisfies NativeChatPluginOptions)
```

**IMPORTANT — This story uses a DIFFERENT pattern than PerfBenchmark:**
- PerfBenchmark uses manual `provide/inject` because it renders a single component (`MessageList`) in isolation
- This story registers the **full plugin** via `app.use(NativeChatPlugin, { apiClient })` in the VitePress theme — the plugin handles its own provide/inject setup internally
- Individual component demos (Story 5.3) may use the PerfBenchmark pattern for isolation, but Story 5.1 only needs the global plugin registration

### Git Intelligence

Recent commits follow `feat: {description} (Story X.Y)` convention. This story's commit should be:
```
feat: add DemoBlock component and mock API client for VitePress docs (Story 5.1)
```

Last 5 commits:
- `be138f3` fix: remove duplicate Vuetify registration in ChatInput tests
- `ebddd5d` feat: add message retry and error recovery with error history preservation (Story 4.2)
- `9e57a4f` feat: add error display as chat messages with status code mapping and tests (Story 4.1)
- `cfaf9c4` chore: add test-results to gitignore
- `a79c2f5` feat: add 1000-message scroll performance benchmark with Playwright (Story 3.2)

Clean linear history on master branch. All Epics 1-4 complete.

### Project Structure Notes

- All new files are in `docs/` — aligns with the architecture's project structure (`docs/.vitepress/` for theme customization, `docs/components/` for demo pages)
- `docs/.vitepress/mock/` is a new directory — does not conflict with any existing structure
- `docs/components/widget.md` aligns with the planned structure from architecture.md (`docs/components/` for per-component demo pages)
- No conflicts with `src/` structure — complete separation between library code and documentation code
- The mock API client is **not** the same as the test mock (`createMockApiClient()` in test helpers) — test mocks use `vi.fn()`, the docs mock uses real async implementations with delays

### Naming Conventions (Enforce)

- **Docs component files:** PascalCase (`DemoBlock.vue`) — same as library components
- **Mock files:** camelCase (`mockApiClient.ts`)
- **CSS classes:** BEM with `nc-` prefix (`nc-demo-block`, `nc-demo-block__preview`, `nc-demo-block__source`)
- **VitePress pages:** kebab-case (`widget.md`, `getting-started.md`)
- **Imports from src:** Use `@/` alias — `import { NativeChatPlugin } from '@/plugin'`

### References

- [Source: architecture.md#Starter Template Evaluation] — VitePress + Vite Library Mode, DemoBlock.vue with `?raw` imports, VitePress as dev playground
- [Source: architecture.md#Project Structure & Boundaries] — `docs/` directory layout, `docs/.vitepress/theme/`, `docs/components/`
- [Source: architecture.md#Development Workflow] — `yarn docs:dev` as primary development flow, VitePress with hot reload
- [Source: architecture.md#API Client Interface] — `NativeChatApiClient` interface definition, method signatures, error contract
- [Source: architecture.md#Plugin Configuration API] — `NativeChatPluginOptions` with required `apiClient`
- [Source: architecture.md#Markdown Rendering] — `marked` + DOMPurify for assistant messages (exercised by mock data)
- [Source: architecture.md#Core Architectural Decisions] — Message ordering: API returns newest-first, plugin reverses
- [Source: epics.md#Story 5.1] — Acceptance criteria, creates DemoBlock.vue + mockApiClient.ts + updates theme/index.ts
- [Source: epics.md#Epic 5] — VitePress Documentation & Interactive Playground overview
- [Source: project-context.md#Technology Stack] — Vue 3.5, Vuetify 3.11, TypeScript 5.9, VitePress, Vite 7.3
- [Source: project-context.md#Critical Implementation Rules] — @/ alias, import order, script setup, Prettier rules
- [Source: project-context.md#Code Quality & Style Rules] — BEM with nc- prefix, component naming, CSS layer rules
- [Source: docs/.vitepress/theme/index.ts] — Current VitePress theme setup with Vuetify registration
- [Source: docs/.vitepress/config.ts] — VitePress config with @ alias, empty sidebar
- [Source: docs/.vitepress/components/PerfBenchmark.vue] — Reference pattern for docs components using provide/inject with plugin types
- [Source: src/types/api.ts] — NativeChatApiClient interface, response type shapes
- [Source: src/types/chat.ts] — ChatMessage, MessageStatus, ChatError types
- [Source: 4-2-message-retry-error-recovery.md] — 189 tests baseline, dist/ tracked, 7 pre-existing lint warnings, ESLint flat config

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Pre-existing `yarn docs:build` failure: Vuetify SSR CSS import error (`VCode.css`) and DOMPurify SSR incompatibility. Fixed by adding `ssr.noExternal: ['vuetify']` to VitePress config and wrapping client-only components with `<ClientOnly>`.
- NativeChatWidget requires Vuetify layout injection (`v-app`) for VNavigationDrawer. Created custom Layout.vue wrapping VitePress DefaultTheme.Layout in `<v-app>` with client-only widget rendering via `onMounted` guard.

### Completion Notes List

- Created mock API client with 10 canned messages (user questions, assistant markdown responses with headings/code/lists), pagination support (newest-first ordering matching API contract), ~1s send delay, and error simulation via `setSimulateError(code)`.
- Created DemoBlock.vue with slot-based live preview, collapsible source code display, and copy-to-clipboard button with checkmark feedback.
- Registered NativeChatPlugin in VitePress theme with client-only guard (`typeof window !== 'undefined'`) to prevent SSR issues.
- Created widget.md smoke-test page with DemoBlock wrapping WidgetDemo component.
- Fixed pre-existing VitePress SSR build failures: added `ssr.noExternal: ['vuetify']` to config.ts and wrapped PerfBenchmark and DemoBlock in `<ClientOnly>`.
- All 189 existing tests pass, library build unchanged (29.34 kB gzip), lint clean, docs build succeeds.

### Change Log

- 2026-02-21: Implemented Story 5.1 — DemoBlock component, mock API client, VitePress plugin registration, SSR build fixes
- 2026-02-21: Code review (Claude Opus 4.6 + Gemini 3 Pro) — Fixed 7 issues: restored deleted index.md, added getConversations pagination params, reset replyIndex on createConversation, fixed non-idiomatic template syntax, added button accessibility attributes, improved WidgetDemo description, reordered imports

### File List

New files:
- `docs/.vitepress/mock/mockApiClient.ts` — Mock NativeChatApiClient with canned data, send delay, error simulation
- `docs/.vitepress/components/DemoBlock.vue` — Source + preview wrapper component
- `docs/.vitepress/theme/Layout.vue` — Custom VitePress layout wrapping DefaultTheme in v-app with client-only widget
- `docs/components/widget.md` — Smoke-test demo page
- `docs/components/demos/WidgetDemo.vue` — Widget demo wrapper component

Modified files:
- `docs/.vitepress/theme/index.ts` — Added NativeChatPlugin registration with mock API client, reordered imports
- `docs/.vitepress/config.ts` — Added `ssr.noExternal: ['vuetify']` for SSR build compatibility
- `docs/performance/benchmark.md` — Wrapped PerfBenchmark in `<ClientOnly>` for SSR build compatibility
- `docs/index.md` — Restored (was incorrectly deleted)
