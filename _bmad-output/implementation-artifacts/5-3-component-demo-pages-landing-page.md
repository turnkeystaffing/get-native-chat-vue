# Story 5.3: Component Demo Pages & Landing Page

Status: done

Epic: 5 — VitePress Documentation & Interactive Playground
Date: 2026-02-21
Depends on: Story 5.1 complete (DemoBlock, mock API client), Story 5.2 complete (guide pages, sidebar config)

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer exploring the plugin,
I want interactive demos of key components with live playground,
so that I can see the plugin in action and experiment before integrating.

## Acceptance Criteria

1. **Given** the docs site **When** a developer navigates to the Full Widget demo page **Then** a complete `<NativeChatWidget />` renders with mock API client **And** the developer can open the chat, send messages, receive simulated responses, scroll history, and trigger errors **And** the source code for the demo setup is visible via DemoBlock

2. **Given** the docs site **When** a developer navigates to individual component demo pages **Then** MessageBubble demos show user, assistant, and error variants with markdown rendering **And** ChatInput demo shows auto-expand, send, and keyboard behavior **And** each demo includes source code via DemoBlock

3. **Given** the docs landing page (`docs/index.md`) **When** a developer visits the docs site root **Then** a VitePress hero section with plugin name, tagline, and quick-start links renders **And** feature highlights summarize key capabilities

4. **Given** the VitePress config **When** the site renders **Then** sidebar navigation shows component demos under a "Components" group **And** `yarn docs:build` completes without errors

## Tasks / Subtasks

- [x] Task 1: Enhance the docs landing page (AC: #3)
  - [x] 1.1 Update `docs/index.md` — add hero action buttons linking to Getting Started (`/guide/getting-started`) and Full Widget Demo (`/components/widget`)
  - [x] 1.2 Add feature highlights section with 4-6 key capabilities: Embeddable Chat Widget, Vuetify Integration, Mock API Playground, TypeScript Support, Markdown Rendering, Error Handling
  - [x] 1.3 Verify the hero section renders correctly on `yarn docs:dev`

- [x] Task 2: Enhance the Full Widget demo page (AC: #1)
  - [x] 2.1 Update `docs/components/widget.md` — expand the existing smoke-test page into a full interactive demo page
  - [x] 2.2 Add descriptive content: overview of the full widget, what the demo includes (floating button, chat panel, send/receive, mock responses, error simulation)
  - [x] 2.3 Add error simulation controls — import `setSimulateError` from mock client, create a demo wrapper that includes toggle buttons for triggering 429, 503, and generic errors
  - [x] 2.4 Create `docs/components/demos/WidgetErrorDemo.vue` — demo component with error toggle buttons that call `setSimulateError(code)` and a reset button
  - [x] 2.5 Add a second DemoBlock showing the error simulation demo with source code
  - [x] 2.6 Wrap all demos in `<ClientOnly>` for SSR safety

- [x] Task 3: Create MessageBubble demo page (AC: #2)
  - [x] 3.1 Create `docs/components/message-bubble.md` with overview of the MessageBubble component
  - [x] 3.2 Create `docs/components/demos/MessageBubbleDemo.vue` — isolated demo component rendering MessageBubble variants using provide/inject pattern (PerfBenchmark approach)
  - [x] 3.3 Show **user message** variant: right-aligned, dark teal bubble with white text
  - [x] 3.4 Show **assistant message** variant: left-aligned, white bubble with border, including markdown content (bold, lists, code block)
  - [x] 3.5 Show **error message** variant: left-aligned, calm error tone
  - [x] 3.6 Add DemoBlock with source code for each demo
  - [x] 3.7 Wrap all demos in `<ClientOnly>` for SSR safety

- [x] Task 4: Create ChatInput demo page (AC: #2)
  - [x] 4.1 Create `docs/components/chat-input.md` with overview of the ChatInput component
  - [x] 4.2 Create `docs/components/demos/ChatInputDemo.vue` — isolated demo component rendering ChatInput using provide/inject pattern
  - [x] 4.3 Demonstrate auto-expand behavior (type multiple lines), Enter-to-send, Shift+Enter for newline
  - [x] 4.4 Show disabled state during mock sending
  - [x] 4.5 Add DemoBlock with source code
  - [x] 4.6 Wrap all demos in `<ClientOnly>` for SSR safety

- [x] Task 5: Update VitePress config with Components sidebar group (AC: #4)
  - [x] 5.1 Update `docs/.vitepress/config.ts` — add "Components" nav entry
  - [x] 5.2 Add "Components" sidebar group with: Full Widget, Message Bubble, Chat Input links
  - [x] 5.3 Verify sidebar renders correctly alongside existing Guide group

- [x] Task 6: Verify end-to-end documentation (AC: all)
  - [x] 6.1 Run `yarn docs:dev` — all pages render correctly, sidebar navigation works, demos are interactive
  - [x] 6.2 Verify landing page hero with action buttons and feature highlights
  - [x] 6.3 Verify widget demo: floating button opens chat, send message works, error simulation toggles work
  - [x] 6.4 Verify MessageBubble demo: all three variants render correctly with markdown
  - [x] 6.5 Verify ChatInput demo: auto-expand, send, disabled state work
  - [x] 6.6 Run `yarn docs:build` — no build errors
  - [x] 6.7 Run `yarn test` — all 189 existing tests pass unchanged
  - [x] 6.8 Run `yarn build` — library build succeeds (no src/ changes)
  - [x] 6.9 Run `yarn lint` — no new lint errors

## Dev Notes

### CRITICAL: Docs-Only Story — NO Library Source Changes

**This story creates and modifies files exclusively in `docs/` — nothing in `src/` is created or modified.** All demo pages are VitePress markdown files. Demo wrapper components live in `docs/components/demos/`. The only non-markdown code change is updating `docs/.vitepress/config.ts` for sidebar/nav configuration.

**No unit tests needed** — documentation pages and demo wrapper components have no testable logic. Validation is via `yarn docs:dev` (visual), `yarn docs:build` (no errors), and `yarn test` (189 existing tests pass unchanged).

### Critical Architecture Constraints

- **`<script setup lang="ts">` only** — even for docs demo components
- **`@/` import alias** for any imports from `src/` — already configured in VitePress vite config (`docs/.vitepress/config.ts` maps `@` to `../../src`)
- **Import order**: Vue core → third-party → `@/` project imports
- **No new runtime dependencies** — demo components use only what's already available (Vue, Vuetify, VitePress built-ins)
- **Vuetify theme tokens for styling** — use `rgb(var(--v-theme-primary))` etc., no hardcoded hex values
- **`@layer native-chat`** — wrap any `<style scoped>` content in demo components inside `@layer native-chat { }` (consistent with DemoBlock.vue and PerfBenchmark.vue patterns)
- **CSS class prefix** — use `nc-` prefix for custom classes with BEM naming
- **No `!important`** in any CSS
- **Prettier rules** — single quotes, no semicolons, trailing commas, 100 char width
- **`<ClientOnly>` wrappers** — all demo components that use Vuetify or plugin components MUST be wrapped in `<ClientOnly>` in markdown pages for SSR build compatibility (established pattern from Story 5.1)

### Isolated Component Demo Pattern (CRITICAL)

**For MessageBubble and ChatInput demos**, the components need `useChat()` state provided via inject. Since these are isolated demos (not the full widget), use the **PerfBenchmark.vue pattern** — manually construct a `UseChatReturn` mock object and provide it via `provide(CHAT_STATE_KEY, mockState)` and `provide(CONFIG_KEY, mockConfig)`.

**Reference implementation from PerfBenchmark.vue:**

```typescript
import { provide, ref, readonly } from 'vue'
import type { DeepReadonly, Ref } from 'vue'
import { CHAT_STATE_KEY, CONFIG_KEY } from '@/keys'
import type { UseChatReturn } from '@/composables/useChat'
import type { NativeChatPluginOptions } from '@/types/config'
import type { ChatMessage } from '@/types/chat'

const mockChatState: UseChatReturn = {
  messages: readonly(messages) as DeepReadonly<Ref<ChatMessage[]>>,
  isOpen: readonly(ref(true)),
  isLoading: readonly(ref(false)),
  isSending: readonly(ref(false)),
  hasMore: readonly(ref(false)),
  failedMessageText: readonly(ref<string | null>(null)),
  open: async () => {},
  close: () => {},
  sendMessage: async () => {},
  loadMore: async () => {},
  retry: async () => {},
}
provide(CHAT_STATE_KEY, mockChatState)
provide(CONFIG_KEY, { apiClient: mockApiClient } satisfies NativeChatPluginOptions)
```

**This is DIFFERENT from the full widget demo** — the widget demo uses the globally registered plugin (via `app.use(NativeChatPlugin, { apiClient: mockApiClient })` in the theme), while isolated component demos use manual provide/inject.

### Landing Page Implementation Guide

**File:** `docs/index.md`

**Current state:** Minimal VitePress `home` layout with hero (name, text, tagline). No action buttons, no features.

**Required updates:**

1. **Hero actions** — add two buttons:
   - Primary: "Get Started" → `/guide/getting-started`
   - Secondary: "View Demo" → `/components/widget`

2. **Features section** — add 4-6 feature highlights using VitePress `features` frontmatter:
   - Embeddable Chat Widget — Floating button + chat panel overlay
   - Vuetify 3 Integration — Uses host app's Vuetify with scoped theming
   - TypeScript First — Full type safety with exported interfaces
   - Markdown Rendering — Rich assistant responses with marked + DOMPurify
   - Error Recovery — Inline error messages with automatic retry
   - Customizable — Position, welcome message, batch size, error callbacks

**VitePress home layout frontmatter format:**

```yaml
---
layout: home
hero:
  name: "Native Chat Vue"
  text: "Vue 3 Chat Widget Plugin"
  tagline: "A lightweight, embeddable chat component powered by Vuetify"
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View Demo
      link: /components/widget
features:
  - title: Embeddable Chat Widget
    details: Floating button with responsive chat panel — overlay on desktop, full-screen on mobile
  - title: Vuetify 3 Integration
    details: Uses your host app's Vuetify installation with scoped theming for zero-conflict styling
  - title: TypeScript First
    details: Full type safety with exported interfaces for API client, configuration, and messages
  - title: Markdown Responses
    details: Rich assistant messages with headings, lists, and code blocks via marked + DOMPurify
  - title: Error Recovery
    details: Errors display as calm chat messages with automatic input retry — no page reload needed
  - title: Customizable
    details: Configure position, welcome message, batch size, conversation ID, and error callbacks
---
```

### Full Widget Demo Enhancement Guide

**File:** `docs/components/widget.md`

**Current state:** Simple smoke-test page with one DemoBlock wrapping WidgetDemo.vue.

**Required enhancements:**

1. Add descriptive overview content explaining what the full widget demo includes
2. Keep the existing DemoBlock with WidgetDemo.vue as the primary demo
3. Add a second section for error simulation — create WidgetErrorDemo.vue that includes error toggle buttons

**Error simulation demo component (`docs/components/demos/WidgetErrorDemo.vue`):**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { setSimulateError } from '../../.vitepress/mock/mockApiClient'

const activeError = ref<number | null>(null)

function toggleError(code: number) {
  if (activeError.value === code) {
    activeError.value = null
    setSimulateError(null)
  } else {
    activeError.value = code
    setSimulateError(code)
  }
}

function resetErrors() {
  activeError.value = null
  setSimulateError(null)
}
</script>
```

- Provides buttons for 429 (Rate Limit), 503 (Service Unavailable), and a Reset button
- Uses Vuetify `v-btn` with `v-theme-provider` wrapping
- Active error shows visually via button color/variant
- Errors affect the globally registered widget — when user sends a message with error mode active, the plugin's error handling triggers

### MessageBubble Demo Implementation Guide

**File:** `docs/components/message-bubble.md`

**Demo component:** `docs/components/demos/MessageBubbleDemo.vue`

**Must render three variants in a single vertical layout:**

1. **User message** — right-aligned, dark teal bubble, plain text content like "What can you help me with?"
2. **Assistant message** — left-aligned, white bubble with border, markdown content including:
   - Bold heading: "I can help you with:"
   - Bullet list: common capabilities
   - This exercises the `marked` + DOMPurify rendering pipeline
3. **Error message** — left-aligned, calm error message: "Something went wrong. You can try sending your message again."

**Implementation pattern:**
- Import `MessageBubble` directly: `import MessageBubble from '@/components/MessageBubble.vue'`
- Import `MessageList` for container: `import MessageList from '@/components/MessageList.vue'` — OR render MessageBubbles directly if MessageList requires too much state
- Construct `ChatMessage` objects with appropriate `role`, `content`, `status` values
- Provide mock `UseChatReturn` state via provide/inject (PerfBenchmark pattern)
- Wrap in `<v-theme-provider theme="nativeChat">` for correct theming

**IMPORTANT:** Check the actual `MessageBubble.vue` props interface to ensure demo messages match expected prop shapes. The component likely receives individual `ChatMessage` properties or the full message object as a prop.

### ChatInput Demo Implementation Guide

**File:** `docs/components/chat-input.md`

**Demo component:** `docs/components/demos/ChatInputDemo.vue`

**Must demonstrate:**

1. **Auto-expanding textarea** — type multiple lines to see it grow up to 6 lines
2. **Send behavior** — Enter sends (displays in console or shows feedback), Shift+Enter adds newline
3. **Disabled state** — simulate sending state by toggling `isSending` to show disabled input

**Implementation pattern:**
- Import `ChatInput` directly: `import ChatInput from '@/components/ChatInput.vue'`
- Provide mock `UseChatReturn` with custom `sendMessage` implementation that logs or shows temporary feedback
- Include a "Simulate Sending" toggle button to demonstrate the disabled state
- Wrap in `<v-theme-provider theme="nativeChat">`

### VitePress Config Update Guide

**File:** `docs/.vitepress/config.ts`

**Current sidebar state:**
```typescript
sidebar: [
  {
    text: 'Guide',
    items: [
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'Configuration', link: '/guide/configuration' },
      { text: 'API Client', link: '/guide/api-client' },
    ],
  },
],
```

**Required changes — add Components group:**
```typescript
sidebar: [
  {
    text: 'Guide',
    items: [
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'Configuration', link: '/guide/configuration' },
      { text: 'API Client', link: '/guide/api-client' },
    ],
  },
  {
    text: 'Components',
    items: [
      { text: 'Full Widget', link: '/components/widget' },
      { text: 'Message Bubble', link: '/components/message-bubble' },
      { text: 'Chat Input', link: '/components/chat-input' },
    ],
  },
],
```

**Also add Components to nav:**
```typescript
nav: [
  { text: 'Home', link: '/' },
  { text: 'Guide', link: '/guide/getting-started' },
  { text: 'Components', link: '/components/widget' },
],
```

### File Structure Requirements

**Files to CREATE:**

| File | Purpose |
|------|---------|
| `docs/components/message-bubble.md` | MessageBubble demo page with user, assistant, and error variants |
| `docs/components/chat-input.md` | ChatInput demo page with auto-expand and send behavior |
| `docs/components/demos/MessageBubbleDemo.vue` | Isolated MessageBubble demo using provide/inject |
| `docs/components/demos/ChatInputDemo.vue` | Isolated ChatInput demo using provide/inject |
| `docs/components/demos/WidgetErrorDemo.vue` | Error simulation controls for full widget demo |

**Files to MODIFY:**

| File | Action | Purpose |
|------|--------|---------|
| `docs/index.md` | **Modify** | Add hero action buttons and feature highlights |
| `docs/components/widget.md` | **Modify** | Enhance from smoke test to full demo page with error simulation |
| `docs/.vitepress/config.ts` | **Modify** | Add "Components" nav entry and sidebar group |

**Files that MUST NOT be modified:**

| File | Reason |
|------|--------|
| `src/**/*` | No library source changes — docs-only story |
| `package.json` | No new dependencies |
| `docs/.vitepress/theme/index.ts` | Theme setup unchanged |
| `docs/.vitepress/theme/Layout.vue` | Layout unchanged |
| `docs/.vitepress/mock/mockApiClient.ts` | Mock client unchanged — use existing `setSimulateError()` |
| `docs/.vitepress/components/DemoBlock.vue` | DemoBlock unchanged |
| `docs/.vitepress/components/PerfBenchmark.vue` | PerfBenchmark unchanged |

**Directory structure after this story:**

```
docs/
├── .vitepress/
│   ├── config.ts                    # MODIFIED: nav + sidebar with Components group
│   ├── theme/
│   │   ├── index.ts                 # (unchanged)
│   │   └── Layout.vue               # (unchanged)
│   ├── components/
│   │   ├── DemoBlock.vue            # (unchanged)
│   │   └── PerfBenchmark.vue        # (unchanged)
│   └── mock/
│       └── mockApiClient.ts         # (unchanged)
├── guide/
│   ├── getting-started.md           # (unchanged)
│   ├── configuration.md             # (unchanged)
│   └── api-client.md               # (unchanged)
├── components/
│   ├── widget.md                    # MODIFIED: enhanced full demo + error simulation
│   ├── message-bubble.md            # NEW: MessageBubble variant demos
│   ├── chat-input.md               # NEW: ChatInput behavior demos
│   └── demos/
│       ├── WidgetDemo.vue           # (unchanged)
│       ├── WidgetErrorDemo.vue      # NEW: error simulation toggle buttons
│       ├── MessageBubbleDemo.vue    # NEW: isolated MessageBubble variants
│       └── ChatInputDemo.vue        # NEW: isolated ChatInput demo
├── performance/
│   └── benchmark.md                 # (unchanged)
└── index.md                         # MODIFIED: hero actions + feature highlights
```

### Library & Framework Requirements

**No new dependencies for this story.** All required libraries are already installed.

**Technologies used:**

| Technology | Available Via | Usage |
|---|---|---|
| VitePress 1.6+ | Already installed | Markdown rendering, sidebar config, home layout features |
| Vue 3.5+ | Already installed | `<script setup>`, `ref()`, `provide()` in demo components |
| Vuetify 3.11+ | Already installed | `v-btn`, `v-theme-provider` in demo wrappers |
| TypeScript 5.9+ | Already installed | Strict mode for demo components |
| `marked` + `dompurify` | Already installed | Used automatically by MessageBubble for markdown in assistant demos |

### Testing Requirements

**No new Vitest tests for this story.** Demo pages and wrapper components are markdown documentation and thin Vue wrappers with no testable business logic.

**Validation checklist:**

1. `yarn test` — all 189 existing tests pass unchanged (regression check)
2. `yarn build` — library build succeeds (no src/ changes)
3. `yarn lint` — no lint errors
4. `yarn docs:dev` — all demo pages render, sidebar navigation works, demos are interactive
5. `yarn docs:build` — VitePress static build completes without errors

### Previous Story Intelligence

**From Story 5.2 (Guide Documentation Pages):**
- VitePress sidebar config currently has Guide group with 3 pages — add Components group alongside it
- 189 tests passing, build at 29.34 kB gzip, lint clean
- docs:build succeeds in 6.48s
- 7 pre-existing lint warnings — **don't try to fix them**
- ESLint flat config (`eslint.config.ts`, not `.eslintrc.cjs`)
- `dist/` is tracked in git — but no rebuild needed since no `src/` changes
- Story 5.2 notes: "Story 5.3 will add a 'Components' group to the sidebar — the sidebar structure should accommodate that addition cleanly"

**From Story 5.1 (DemoBlock Component & Mock API Client):**
- DemoBlock.vue works with `source` prop (string from `?raw` import) + `<slot />` for live preview
- mockApiClient has `setSimulateError(code)` for error simulation — code can be 429, 503, or any number; `null` to reset
- SSR compatibility: `ssr.noExternal: ['vuetify']` in config, `<ClientOnly>` wrappers required for all Vuetify/plugin component demos
- Custom Layout.vue wraps VitePress in `<v-app>` — Vuetify components work everywhere
- NativeChatPlugin is globally registered — floating button appears on every docs page
- PerfBenchmark.vue pattern: isolated component demos using provide/inject with `CHAT_STATE_KEY` and `CONFIG_KEY`
- Import internal components directly: `import MessageBubble from '@/components/MessageBubble.vue'`

**From project-context.md:**
- Commits follow `feat: {description} (Story X.Y)` convention
- Import order: Vue core → third-party → `@/` project imports
- Prettier: single quotes, no semicolons, trailing commas, 100 char width
- Package manager: Yarn 4.x
- Colors via theme tokens only: `rgb(var(--v-theme-primary))` — no hardcoded hex values

### Git Intelligence

Recent commits follow `feat: {description} (Story X.Y)` convention. This story's commit should be:
```
feat: add component demo pages and landing page features (Story 5.3)
```

Last 5 commits:
- `0b82261` feat: add guide documentation pages for installation, configuration, and API client (Story 5.2)
- `90de7eb` feat: add DemoBlock component and mock API client for VitePress docs (Story 5.1)
- `be138f3` fix: remove duplicate Vuetify registration in ChatInput tests
- `ebddd5d` feat: add message retry and error recovery with error history preservation (Story 4.2)
- `9e57a4f` feat: add error display as chat messages with status code mapping and tests (Story 4.1)

Clean linear history on master branch. All Epics 1-4 complete, Stories 5.1 and 5.2 complete.

### Project Structure Notes

- All new files are in `docs/` — aligns with the architecture's project structure (`docs/components/` for per-component demo pages)
- `docs/components/demos/` already exists with `WidgetDemo.vue` — new demo components go here
- Config change is additive — adds Components sidebar group alongside existing Guide group
- No conflicts with `src/` structure — complete separation between library code and documentation
- This is the final story in Epic 5 — after completion, all planned documentation is in place

### References

- [Source: architecture.md#Starter Template Evaluation] — Project structure: `docs/components/` for per-component demo pages
- [Source: architecture.md#Project Structure & Boundaries] — `docs/` directory layout with guide/ and components/ subdirectories
- [Source: architecture.md#Development Workflow] — `yarn docs:dev` as primary development flow, VitePress with hot reload
- [Source: architecture.md#API Client Interface] — NativeChatApiClient interface for mock demonstrations
- [Source: architecture.md#Component Boundaries] — NativeChatWidget root, MessageBubble display component, ChatInput with send action
- [Source: architecture.md#Error & Loading Patterns] — Error-as-message pattern, MessageBubble with variant="error"
- [Source: architecture.md#Markdown Rendering] — marked + DOMPurify for assistant messages
- [Source: ux-design-specification.md#Component Strategy] — MessageBubble variants (user/assistant/error), ChatInput behavior
- [Source: ux-design-specification.md#Visual Design Foundation] — Color system, typography, spacing for demos
- [Source: epics.md#Story 5.3] — Acceptance criteria, creates demo pages + updates landing + sidebar
- [Source: epics.md#Epic 5] — VitePress Documentation & Interactive Playground overview
- [Source: project-context.md#Technology Stack] — Vue 3.5, Vuetify 3.11, TypeScript 5.9
- [Source: project-context.md#Critical Implementation Rules] — @/ alias, import order, script setup, Prettier rules, CSS layers
- [Source: project-context.md#Code Quality & Style Rules] — BEM with nc- prefix, component naming
- [Source: docs/.vitepress/config.ts] — Current VitePress config with Guide sidebar group
- [Source: docs/.vitepress/components/DemoBlock.vue] — DemoBlock component for source + preview demos
- [Source: docs/.vitepress/components/PerfBenchmark.vue] — Reference pattern for isolated component demos using provide/inject
- [Source: docs/.vitepress/mock/mockApiClient.ts] — Mock API client with setSimulateError() for error simulation
- [Source: docs/.vitepress/theme/index.ts] — VitePress theme with NativeChatPlugin globally registered
- [Source: docs/.vitepress/theme/Layout.vue] — Custom layout wrapping VitePress in v-app with client-only widget
- [Source: docs/components/widget.md] — Current smoke-test widget demo page (to be enhanced)
- [Source: docs/index.md] — Current minimal landing page (to be enhanced)
- [Source: 5-1-demoblock-component-mock-api-client.md] — DemoBlock pattern, mockApiClient, SSR fixes, PerfBenchmark provide/inject pattern
- [Source: 5-2-guide-documentation-pages.md] — Guide pages, sidebar config pattern, 189 tests baseline, docs:build stable

## Change Log

- 2026-02-21: Implemented all 6 tasks — landing page hero with actions and features, enhanced widget demo with error simulation, MessageBubble demo page with 3 variants, ChatInput demo page with auto-expand and send behavior, Components sidebar group in VitePress config, full end-to-end verification passed.
- 2026-02-21: Code review fixes (5 issues) — added generic 500 error button to WidgetErrorDemo, added onBeforeUnmount cleanup for error simulation state, fixed inaccurate prop documentation in message-bubble.md, added lang="ts" to markdown script blocks, converted MessageBubbleDemo messages to reactive ref pattern.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Prettier formatting fix required on `docs/components/chat-input.md` and `docs/components/message-bubble.md` after creation — markdown table alignment needed automatic formatting.

### Completion Notes List

- **Task 1**: Updated `docs/index.md` with VitePress hero actions (Get Started, View Demo) and 6 feature highlights. Pure frontmatter change.
- **Task 2**: Enhanced `docs/components/widget.md` from smoke-test to full demo page with descriptive content. Created `WidgetErrorDemo.vue` with toggle buttons for 429/503 error simulation using existing `setSimulateError()`. Both demos wrapped in `<ClientOnly>` with DemoBlock source display.
- **Task 3**: Created `MessageBubbleDemo.vue` using PerfBenchmark provide/inject pattern with 3 message variants: user (plain text), assistant (markdown with bold + bullet list), error (failed status). Created `message-bubble.md` page with props/roles documentation.
- **Task 4**: Created `ChatInputDemo.vue` using provide/inject pattern with custom `sendMessage` that shows "last sent" feedback and 1.5s simulated sending delay for disabled state demo. Created `chat-input.md` page with behavior documentation.
- **Task 5**: Added "Components" nav entry and sidebar group to `docs/.vitepress/config.ts` with Full Widget, Message Bubble, and Chat Input links.
- **Task 6**: All validation passed — `yarn test` (189/189), `yarn build` (29.34 kB gzip), `yarn lint` (clean), `yarn docs:build` (8.62s, no errors).

### File List

**Created:**
- `docs/components/demos/WidgetErrorDemo.vue` — Error simulation toggle buttons for widget demo
- `docs/components/demos/MessageBubbleDemo.vue` — Isolated MessageBubble demo with 3 variants using provide/inject
- `docs/components/demos/ChatInputDemo.vue` — Isolated ChatInput demo with send feedback using provide/inject
- `docs/components/message-bubble.md` — MessageBubble component demo page
- `docs/components/chat-input.md` — ChatInput component demo page

**Modified:**
- `docs/index.md` — Added hero action buttons and 6 feature highlights
- `docs/components/widget.md` — Enhanced from smoke-test to full demo page with error simulation section
- `docs/.vitepress/config.ts` — Added Components nav entry and sidebar group
