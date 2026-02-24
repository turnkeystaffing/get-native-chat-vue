---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/prd-validation-report.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
workflowType: 'architecture'
project_name: 'native-chat-vue'
user_name: 'Volodymyr'
date: '2026-02-19'
lastStep: 8
status: 'complete'
completedAt: '2026-02-19'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

27 FRs across 6 functional areas that map directly to component boundaries:

- **Plugin Integration (FR1-4):** npm package installation, `app.use()` registration with config object accepting auth token and pre-configured API client. These define the plugin's public API surface and entry point.
- **Chat Window Management (FR5-8):** Floating button toggle, overlay panel, responsive rendering (320px-1920px with 44px min tap targets). Architecturally: a root-level panel component with open/close state and responsive layout logic.
- **Message Display (FR9-13):** Message list with role distinction, infinite scroll (configurable batch size, default 20), scroll position preservation on prepend, loading indicator. Architecturally: the most complex component — requires virtual scroll management and careful DOM measurement.
- **Message Input & Sending (FR14-18):** Auto-expanding textarea (max 6 rows then internal scroll), Enter-to-send/Shift+Enter-for-newline, send button, input disable during pending response. Architecturally: a controlled input component with keyboard event handling.
- **Conversation Flow (FR19-23):** Send via API client, optimistic UI, assistant response display, fetch history on open, multi-turn context (server-managed). Architecturally: the core state management logic — message lifecycle (pending → sent → confirmed / failed), history pagination state, and API client orchestration.
- **Error Handling (FR24-27):** Errors as inline chat messages, network failure resilience, retry capability (input re-populated with failed text), no-reload recovery. Architecturally: error state is part of the message model, not a separate UI layer.

**Non-Functional Requirements:**

NFRs that will drive architectural decisions:

- **Performance:** 200ms chat open (warm start), no jank on infinite scroll (no frames >16ms), optimistic UI within one frame (16ms), <100ms input lag, ≥30fps with 1000+ messages loaded (no frame >50ms). These require efficient rendering — potential need for virtualized list if DOM node count impacts performance.
- **Bundle Size:** <50KB minified+gzipped excluding peer dependencies (Vue 3, Vuetify 3). Constrains dependency choices and requires tree-shaking awareness.
- **Accessibility:** WCAG 2.1 Level A — keyboard navigation, ARIA labels/roles, live regions for new messages, visible focus indicators, contrast ratios (≥4.5:1 normal text, ≥3:1 large text).
- **Integration Isolation:** CSS isolated from host app (no leakage in either direction), no global JS state mutation, works with any API client conforming to the interface, no state collisions with host Vue app.

**Scale & Complexity:**

- Primary domain: Frontend component library (Vue 3 plugin)
- Complexity level: Low — standard chat UI patterns, single responsibility, no backend
- Estimated architectural components: 8 custom components (NativeChatWidget root wrapper, FloatingButton, ChatPanel, ChatHeader, MessageList, MessageBubble, ChatInput, WelcomeState) + 1 plugin install function + 1 composable for state + TypeScript interfaces

### Technical Constraints & Dependencies

- **Vue 3.x** as peer dependency (required)
- **Vuetify 3.x lock-in (deliberate):** The plugin depends on Vuetify components (`v-infinite-scroll`, `v-textarea`, `v-btn`, `v-theme-provider`) for core functionality. This is a deliberate scope decision — all target host applications already use Vuetify, making it zero-cost for adopters. Trade-off: the plugin cannot be used in non-Vuetify Vue apps without a rewrite.
- **Minimal runtime dependencies** — `marked` (~11.8KB gzip) and `dompurify` (~6-7KB gzip) are the only runtime dependencies beyond Vue and Vuetify peer deps. Total plugin budget remains under 50KB gzipped.
- **API client is injected, not owned** — plugin cannot assume Axios, fetch, or any specific HTTP library. Must define a minimal interface contract (send message, fetch history, error shape)
- **No real-time/WebSocket for MVP** — responses are complete messages via request/response. Architecture must not preclude future streaming support
- **No SSR requirement** — SPA-only plugin, no server rendering concerns
- **Browser support:** Chrome, Firefox, Safari, Edge (latest 2 versions) — no IE11, no legacy

### Cross-Cutting Concerns Identified

- **API Client Interface (Gating Decision):** The API client interface is the plugin's only external data contract. It must define: message send signature, history fetch with pagination, message content shape (plain text vs structured), and error contract (throw vs return). This interface must be finalized before component architecture can proceed — every data-touching component depends on it.
- **CSS Isolation:** Affects every component. Strategy: `@layer native-chat` for specificity control + Vuetify `v-theme-provider` for theme scoping. Must be enforced consistently across all plugin styles.
- **State Management:** A single `useChat()` composable using Vue reactive refs, provided to the component tree via `provide/inject`. No external state library (Pinia/Vuex) needed. Key state: panel open/closed, messages array, pagination cursor, loading flags, input text. Message lifecycle is a state machine: `sending` → `sent` | `failed` — this must be modeled explicitly.
- **Accessibility:** Spans all 7 components — ARIA attributes, keyboard handlers, focus management, live regions. Not a bolt-on; must be built into each component from the start.
- **Responsive Behavior:** 3-tier breakpoint strategy (mobile full-screen <768px, tablet/desktop overlay ≥768px) affects ChatPanel layout and potentially message density. Uses Vuetify's `useDisplay()` composable.
- **Rich Text Rendering (Bundle Size Tension):** Assistant messages support headings, paragraphs, and lists. Rendering approach affects bundle size (<50KB constraint) and depends on the API client interface (message content shape). Options: lightweight markdown parser (~7KB), server-provided HTML, or structured JSON blocks with a custom renderer. Decision deferred to architecture step.

### Open Risks for Architecture Step

- **DOM accumulation with `v-infinite-scroll`:** The UX spec uses `v-infinite-scroll` which loads batches but does not virtualize. At 1000+ messages (NFR target), DOM node count could reach 3000-5000+, potentially conflicting with the ≥30fps performance requirement. Architecture must decide: accept and monitor, or plan virtualization from the start.
- **Rich text rendering approach:** Unresolved — affects bundle size budget and API client interface design.
- **API client error contract:** Unresolved — affects error handling patterns across all components.

## Starter Template Evaluation

### Technical Preferences

- **Language:** TypeScript (strict)
- **Build tool:** Vite (library mode)
- **Testing:** Vitest + Vue Test Utils
- **Linting/Formatting:** ESLint + Prettier
- **Package manager:** Yarn
- **UI framework:** Vuetify 3.x (peer dependency)
- **Documentation/Playground:** VitePress

### Primary Technology Domain

**Vue 3 plugin / component library** — built with Vite library mode, distributed as an npm package with Vue 3 and Vuetify 3 as peer dependencies.

### Starter Options Considered

**Option 1: VitePress + Vite Library Mode (Manual scaffold)**
- `yarn create vite` with Vue + TypeScript, then configure `build.lib` manually
- Add VitePress as dev dependency for docs/playground
- Build a custom `DemoBlock.vue` using Vite's `?raw` import for source display — no external demo plugin needed
- VitePress serves as both documentation site and development playground
- Vuetify registered in VitePress theme with `ssr: true`
- Industry standard for Vue plugin authors (used by VueUse, Vuetify, etc.)

**Option 2: Storybook 8 + Vite**
- Official Vuetify recipe exists
- Component isolation and visual regression testing
- Heavier setup, separate configuration, decorator overhead for Vuetify context
- Best for large design systems with 50+ components and dedicated QA

**Option 3: Histoire**
- Vue-native, reuses Vite config
- Lower maintenance velocity, smaller community
- Riskier long-term bet compared to VitePress

### Selected Approach: VitePress + Vite Library Mode

**Rationale:**
- VitePress is the de facto standard for Vue plugin documentation and development
- Serves dual purpose: documentation site AND development playground with hot reload
- Native Vue rendering — plugin components work directly in markdown pages
- VitePress runs a full Vue app, making Vuetify provider setup straightforward
- No external demo preview plugin needed — custom `DemoBlock.vue` with `?raw` imports is zero-dependency and future-proof
- Produces a static documentation site as a build artifact
- Lightweight: fits a 7-component plugin without the overhead of Storybook

**Project Structure:**

```
native-chat-vue/
├── src/                          # Library source code
│   ├── components/               # Vue SFC components
│   │   ├── __tests__/            # Co-located component tests
│   │   │   ├── NativeChatWidget.test.ts
│   │   │   ├── FloatingButton.test.ts
│   │   │   ├── ChatPanel.test.ts
│   │   │   └── ...
│   │   ├── NativeChatWidget.vue  # Root wrapper — state provider
│   │   ├── FloatingButton.vue
│   │   ├── ChatPanel.vue
│   │   ├── ChatHeader.vue
│   │   ├── MessageList.vue
│   │   ├── MessageBubble.vue
│   │   ├── ChatInput.vue
│   │   └── WelcomeState.vue
│   ├── composables/              # useChat() and other composables
│   │   ├── __tests__/
│   │   │   └── useChat.test.ts
│   │   └── useChat.ts
│   ├── types/                    # TypeScript interfaces (API client, messages, config)
│   ├── theme/                    # Vuetify nativeChatTheme definition
│   ├── plugin.ts                 # Vue plugin install function
│   └── index.ts                  # Main entry — exports plugin + types
├── docs/                         # VitePress (docs + dev playground)
│   ├── .vitepress/
│   │   ├── config.ts             # VitePress config
│   │   └── theme/
│   │       ├── index.ts          # Register Vuetify + plugin for dev
│   │       └── DemoBlock.vue     # Custom source + preview wrapper
│   ├── guide/                    # Usage documentation
│   ├── components/               # Per-component demo pages
│   └── index.md                  # Landing page
├── package.json
├── vite.config.ts                # Library build config (build.lib)
├── vitest.config.ts              # Test config
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript with `<script setup lang="ts">`, strict mode. `vite-plugin-dts` (unplugin-dts) generates `.d.ts` declarations for consumers.

**Build Tooling:**
Vite library mode with Rollup. Output: ESM-only (no CJS — all target consumers are modern Vue 3 SPAs). Vue and Vuetify externalized in `rollupOptions`. `build.copyPublicDir: false`.

**Styling Solution:**
Vuetify theme system (`nativeChatTheme`) + CSS `@layer native-chat`. No separate CSS preprocessor needed — Vuetify handles component styles.

**Testing Framework:**
Vitest + `@vue/test-utils`. Vuetify context provided in test setup via `createVuetify()`.

**Development Experience:**
VitePress `docs:dev` — hot-reloading development server where plugin components render live inside documentation pages. Custom `DemoBlock.vue` shows source code + live preview without external dependencies.

**Code Organization:**
Components in `src/components/`, composables in `src/composables/`, types in `src/types/`. Single entry point (`src/index.ts`) exports the plugin install function and public TypeScript interfaces only. Internal components are not exported.

**Note:** Project initialization using this structure should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

| Decision | Choice | Rationale |
|---|---|---|
| API client interface | Mirrors OpenAPI spec; `apiClient` injected, plugin never handles auth | PRD FR4, security — plugin doesn't touch tokens |
| API client helper | Export `createNativeChatApiClient({ baseUrl, getAccessToken })` utility | DX convenience without violating auth boundary |
| Error contract | Client throws on HTTP errors; plugin catches + maps status codes | Standard JS pattern, HTTP status codes already defined by backend |
| Pagination | Offset-based (`offset` + `limit` + `has_more`) | Matches backend API contract |
| Message ordering | API returns newest-first; plugin reverses for display | Backend spec confirmed |
| Markdown rendering | `marked` + DOMPurify (~18-19KB gzip) | Assistant output is unpredictable; only viable full-markdown option within budget |

**Important Decisions (Shape Architecture):**

| Decision | Choice | Rationale |
|---|---|---|
| Performance strategy | `v-infinite-scroll`, no virtualization for MVP | Encapsulated in MessageList; performance test gates the decision |
| Performance test | Explicit story: render 1000 messages, measure scroll FPS ≥30 in Chrome | Concrete pass/fail gate, not "monitor and hope" |
| MessageList public API | Implementation-agnostic props/events (`messages`, `loading`, `hasMore`, `@load-more`) | Survives virtualization switch without affecting parent components |
| Plugin config API | `apiClient` required; `position`, `welcomeMessage`, `batchSize`, `conversationId`, `onError` optional | Minimal surface, host retains control |
| Build output | ESM-only, Vue + Vuetify externalized, separate CSS file | Modern Vue 3 consumers only; avoids dual-package hazard |
| Conversation management | Single active conversation, server is source of truth, no localStorage | `getConversations(0,1)` → use latest; if none → `createConversation()` |

**Deferred Decisions (Post-MVP):**

| Decision | Rationale |
|---|---|
| Virtualized message list | Only needed if performance test (1000 messages ≥30fps) fails |
| Conversation list/switching UI | API supports it; MVP scoped to single conversation |
| "New conversation" action | Requires conversation history UI; deferred with conversation management |
| Theming API for host overrides | UX spec notes as post-MVP consideration |
| WebSocket/streaming | PRD explicitly defers to Phase 2 |

### API Client Interface

```typescript
// Required interface — host app implements or uses helper
export interface NativeChatApiClient {
  createConversation(): Promise<ConversationResponse>
  getConversations(offset: number, limit: number): Promise<ConversationListResponse>
  getMessages(conversationId: string, offset: number, limit: number): Promise<MessageHistoryResponse>
  sendMessage(conversationId: string, message: string): Promise<SendMessageResponse>
}

// Convenience helper — exported from package
export function createNativeChatApiClient(config: {
  baseUrl: string
  getAccessToken: () => string | Promise<string>
}): NativeChatApiClient
```

- Auth handled entirely by the host app's client or via `getAccessToken` callback in the helper
- Plugin never stores, manages, or refreshes tokens
- Error contract: client throws on HTTP errors; plugin maps status codes (429 → rate limit, 503/504 → service unavailable, others → generic error)
- Pagination: offset-based per backend API
- Message ordering: API returns newest-first; plugin reverses for chronological display

### Plugin Configuration API

```typescript
export interface NativeChatPluginOptions {
  apiClient: NativeChatApiClient                   // Required
  position?: 'bottom-left' | 'bottom-right'        // Default: 'bottom-right'
  welcomeMessage?: string                           // Default: 'Hello! How can I help you?'
  batchSize?: number                                // Default: 20
  conversationId?: string                           // Resume specific conversation
  hideToggleWhenOpen?: boolean                       // Default: false — hide FAB when panel open
  onError?: (error: ChatError) => void              // Error notification hook
}
```

- Validated during `app.use()` — missing `apiClient` logs console warning, skips registration
- Config provided to component tree via `provide/inject`
- No `authToken` — plugin never handles credentials

### Markdown Rendering

- **Parser:** `marked` (~11.8KB gzip) — full CommonMark support
- **Sanitization:** DOMPurify (~6-7KB gzip) — XSS prevention for `v-html` rendering
- **Scope:** Assistant messages only; user messages rendered as plain text
- **Total rendering budget:** ~18-19KB of the 50KB budget
- **Rationale:** Assistant output is unpredictable; full markdown parser is necessary

### Conversation Management

- Single active conversation for MVP — no conversation list, no switching UI
- Flow: `getConversations(0, 1)` → use most recent; if none exists → `createConversation()`
- If multiple conversations exist, always use the latest
- No client-side persistence — server is the single source of truth
- `conversationId` in config allows host to override auto-detection

### Build & Distribution

- **Output format:** ESM-only (no CJS)
- **Externals:** `vue`, `vuetify` externalized in rollupOptions
- **CSS:** Vuetify theme handles component styles; plugin CSS bundled via `@layer native-chat`, emitted as separate `.css` file
- **Type declarations:** `vite-plugin-dts` generates `.d.ts` files
- **Entry point:** Single `src/index.ts` exporting `NativeChatPlugin`, `NativeChatWidget`, `createNativeChatApiClient`, and TypeScript interfaces

### Performance Strategy

- MVP: `v-infinite-scroll` without virtualization
- Gated by explicit performance test: 1000 messages, scroll FPS ≥30 in Chrome
- MessageList public API (`messages`, `loading`, `hasMore`, `@load-more`) is implementation-agnostic — internal scroll mechanism can be swapped without affecting parent components
- If test fails: replace `v-infinite-scroll` internals with virtual scroller in a follow-up story

### Decision Impact Analysis

**Implementation Sequence:**
1. API client interface + `createNativeChatApiClient` helper (gating — all components depend on this)
2. Plugin install function + config validation + `provide/inject` setup
3. `useChat()` composable (state management, conversation lifecycle, message operations)
4. NativeChatWidget (root wrapper — creates useChat, provides state)
5. Components: FloatingButton → ChatPanel + ChatHeader → MessageList + MessageBubble → ChatInput → WelcomeState
6. Markdown rendering integration (marked + DOMPurify in MessageBubble)
7. Performance test (1000 messages benchmark)

**Cross-Component Dependencies:**
- All data-touching components depend on the API client interface
- MessageList and ChatInput both depend on `useChat()` composable
- MessageBubble depends on markdown rendering (marked + DOMPurify)
- ChatPanel uses `Teleport` to body + CSS fixed positioning + Vuetify `useDisplay()` for responsive breakpoint logic + Vue `<Transition>` for open/close animation
- FloatingButton uses Vue `<Transition>` for icon swap animation (star ↔ close)
- MessageList tracks animation state (`knownIds`/`animatingIds`) and passes `animate` prop to MessageBubble for entrance animations
- All components depend on CSS isolation (`@layer native-chat` + `v-theme-provider`)

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Component Files:**
- PascalCase: `FloatingButton.vue`, `ChatPanel.vue`, `MessageBubble.vue`
- One component per file, file name matches component name exactly

**Composable Files:**
- camelCase with `use` prefix: `useChat.ts`, `useScrollPosition.ts`

**Type Files:**
- camelCase: `api.ts`, `messages.ts`, `config.ts`
- Interfaces with no prefix: `NativeChatApiClient`, not `INativeChatApiClient`
- Props types: `{ComponentName}Props`

**Functions & Variables:**
- camelCase: `sendMessage()`, `isLoading`, `hasMoreMessages`
- Booleans prefixed with `is`/`has`/`should`: `isOpen`, `hasMore`, `shouldAutoScroll`
- Event handlers prefixed with `handle` or `on`: `handleSend()`, `onScrollTop()`

**CSS Classes (when needed beyond Vuetify):**
- kebab-case with `nc-` prefix: `nc-message-bubble`, `nc-chat-panel`
- Prefix prevents collision with host app classes

**Emitted Events:**
- kebab-case: `@load-more`, `@send-message`, `@panel-toggle`

**Provide/Inject Keys:**
- Symbol-based: `const CHAT_STATE_KEY = Symbol('native-chat-state')`
- All keys exported from a single `src/keys.ts` file

### Structure Patterns

**Test Location:**
- Co-located `__tests__/` folder next to the code being tested:
  - `src/components/__tests__/MessageBubble.test.ts`
  - `src/composables/__tests__/useChat.test.ts`
- Test files use `.test.ts` suffix (not `.spec.ts`)

**Component Organization:**
- All components flat in `src/components/` — no nested folders for MVP (only 7 components)
- Each component is a single `.vue` file with `<script setup lang="ts">`, `<template>`, and optional `<style>`

**Composable Organization:**
- `src/composables/useChat.ts` — primary composable (state, message operations, conversation lifecycle)
- Additional composables only if logic needs extraction (e.g., `useScrollPosition.ts`)
- Each composable is a single function export, not a class

**Type Organization:**
- `src/types/api.ts` — API client interface, response types (`ConversationResponse`, `MessageHistoryResponse`, `SendMessageResponse`, etc.)
- `src/types/chat.ts` — internal types (`ChatMessage`, `MessageStatus`, `ChatError`)
- `src/types/config.ts` — plugin options interface
- `src/types/index.ts` — re-exports all public types

**Exports:**
- `src/index.ts` exports: `NativeChatPlugin` (install function), `NativeChatWidget` (root component), `createNativeChatApiClient` (helper), and public TypeScript interfaces
- Internal components (FloatingButton, ChatPanel, etc.), composables, and utilities are NOT exported

### Component Patterns

**Props:**
- Defined with `defineProps<T>()` using TypeScript interface (not runtime validation)
- Props interface named `{ComponentName}Props` and co-located in the SFC
- Required props have no default; optional props use `withDefaults()`

**Emits:**
- Defined with `defineEmits<T>()` using TypeScript interface
- Kebab-case event names: `'load-more'`, `'send-message'`

**Vuetify Usage:**
- Always access Vuetify components directly (e.g., `<v-btn>`) — no wrapping or re-exporting
- Always use Vuetify theme tokens via the scoped `nativeChatTheme` — no hardcoded hex values
- Wrap all plugin content in `<v-theme-provider theme="nativeChat">` at the root (`ChatPanel`)

**Provide/Inject:**
- `NativeChatWidget` (root) creates `useChat()` and provides chat state via `provide(CHAT_STATE_KEY, chatState)`
- All children (FloatingButton, ChatPanel subtree) consume via `const chat = inject(CHAT_STATE_KEY)!`
- All injection keys in `src/keys.ts`
- Never use string keys — always Symbols

### State Patterns

**`useChat()` composable structure:**
- Returns reactive state + action functions, not a class
- State is `readonly` refs exposed to components; mutations only via action functions
- Message lifecycle state machine: `'sending'` → `'sent'` | `'failed'`

```typescript
// Pattern for useChat return shape
interface UseChatReturn {
  // Readonly state
  messages: Readonly<Ref<ChatMessage[]>>
  isOpen: Readonly<Ref<boolean>>
  isLoading: Readonly<Ref<boolean>>
  isSending: Readonly<Ref<boolean>>
  hasMore: Readonly<Ref<boolean>>
  failedMessageText: Readonly<Ref<string | null>>

  // Actions
  open(): Promise<void>
  close(): void
  sendMessage(text: string): Promise<void>
  loadMore(): Promise<void>
  retry(): Promise<void>
}
```

**Reactive patterns:**
- Use `ref()` for primitives and arrays, `computed()` for derived state
- No `reactive()` for top-level state objects — `ref()` is more explicit about reactivity boundaries
- Never mutate state directly from components — always call action functions

### Error & Loading Patterns

**Error handling:**
- API errors caught in `useChat()` action functions, never in components
- Errors mapped to `ChatError` type with user-friendly message
- Errors rendered as `MessageBubble` with `variant="error"` — same visual container, neutral tone
- On send failure: optimistic message removed, error shown inline, input re-populated with failed text
- On history fetch failure: silent — loading indicator disappears, user retries by scrolling

**Loading states:**
- `isLoading` — initial history fetch on chat open
- `isSending` — waiting for assistant response after send
- `hasMore` — controls whether infinite scroll triggers more fetches
- Loading states managed exclusively in `useChat()`, components only read them
- No component-local loading state — single source of truth

### CSS Patterns

**All plugin styles wrapped in `@layer native-chat`:**
```css
@layer native-chat {
  .nc-message-bubble { /* ... */ }
}
```

**Theme token access:**
- Use Vuetify's theme system via `v-theme-provider` — no hardcoded colors
- When custom CSS is needed, reference CSS custom properties from the Vuetify theme
- Never use `!important`

**Scoping rules:**
- `<style scoped>` on all components as a secondary isolation layer
- `@layer native-chat` as primary specificity control
- No global styles — every rule scoped to plugin components

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow naming patterns exactly — PascalCase components, camelCase functions, kebab-case events, `nc-` CSS prefix
- Place tests in co-located `__tests__/` folders using `.test.ts` suffix
- Never hardcode colors — always use Vuetify theme tokens
- Never access or mutate state directly — always use `useChat()` actions
- Never add runtime dependencies beyond `marked` and `dompurify` — the only allowed runtime deps alongside Vue and Vuetify peer deps
- Wrap all styles in `@layer native-chat`
- Use Symbol-based provide/inject keys from `src/keys.ts`
- Define props and emits with TypeScript generics, not runtime validators

**Anti-Patterns (Never Do):**
- `reactive({ messages: [], isOpen: false })` — use individual `ref()` values
- `<style>` without `scoped` — always use `<style scoped>`
- `color: #C4105B` in component CSS — use theme token
- `inject('chat-state')` with string key — use `inject(CHAT_STATE_KEY)` with Symbol
- Component directly calling `apiClient.sendMessage()` — go through `useChat().sendMessage()`
- `export default defineComponent({})` — use `<script setup lang="ts">`

## Project Structure & Boundaries

### Complete Project Directory Structure

```
native-chat-vue/
├── package.json                    # Package config, peer deps, scripts
├── vite.config.ts                  # Library build config (build.lib, externals)
├── vitest.config.ts                # Test config
├── tsconfig.json                   # TypeScript strict config
├── tsconfig.build.json             # Build-specific TS config (excludes tests, docs)
├── .eslintrc.cjs                   # ESLint config
├── .prettierrc                     # Prettier config
├── .gitignore
├── README.md
│
├── src/                            # Library source code
│   ├── index.ts                    # Public entry — exports plugin, helper, types
│   ├── plugin.ts                   # Vue plugin install function (app.use)
│   ├── keys.ts                     # Symbol-based provide/inject keys
│   │
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── NativeChatWidget.test.ts
│   │   │   ├── FloatingButton.test.ts
│   │   │   ├── ChatPanel.test.ts
│   │   │   ├── ChatHeader.test.ts
│   │   │   ├── MessageList.test.ts
│   │   │   ├── MessageBubble.test.ts
│   │   │   ├── ChatInput.test.ts
│   │   │   └── WelcomeState.test.ts
│   │   ├── NativeChatWidget.vue    # Root wrapper — creates useChat(), provides state
│   │   ├── FloatingButton.vue      # FR5, FR6 — floating agent button toggle
│   │   ├── ChatPanel.vue           # FR7, FR8 — overlay panel, responsive layout
│   │   ├── ChatHeader.vue          # Panel header — title, close button
│   │   ├── MessageList.vue         # FR9-FR13 — message display, infinite scroll
│   │   ├── MessageBubble.vue       # FR9 — single message (user/assistant/error)
│   │   ├── ChatInput.vue           # FR14-FR18 — textarea, send, keyboard
│   │   └── WelcomeState.vue        # Empty state — welcome message
│   │
│   ├── composables/
│   │   ├── __tests__/
│   │   │   └── useChat.test.ts
│   │   └── useChat.ts              # FR19-FR27 — state, message lifecycle, API orchestration
│   │
│   ├── types/
│   │   ├── api.ts                  # NativeChatApiClient, response types from OpenAPI
│   │   ├── chat.ts                 # ChatMessage, MessageStatus, ChatError
│   │   ├── config.ts               # NativeChatPluginOptions
│   │   └── index.ts                # Re-exports public types
│   │
│   ├── helpers/
│   │   ├── __tests__/
│   │   │   └── createApiClient.test.ts
│   │   └── createApiClient.ts      # createNativeChatApiClient() convenience helper
│   │
│   └── theme/
│       └── nativeChatTheme.ts      # Vuetify theme definition (colors, typography)
│
├── docs/                           # VitePress (docs + dev playground)
│   ├── .vitepress/
│   │   ├── config.ts               # VitePress site config
│   │   └── theme/
│   │       ├── index.ts            # Register Vuetify + plugin for dev
│   │       └── DemoBlock.vue       # Source code + live preview wrapper
│   ├── index.md                    # Landing page
│   ├── guide/
│   │   ├── getting-started.md      # Installation + quick start
│   │   ├── configuration.md        # Plugin options reference
│   │   └── api-client.md           # API client interface + helper docs
│   └── components/
│       ├── chat-panel.md           # ChatPanel demo
│       ├── message-bubble.md       # MessageBubble demo (user/assistant/error)
│       └── chat-input.md           # ChatInput demo
│
└── dist/                           # Build output (gitignored)
    ├── native-chat-vue.es.js       # ESM bundle
    ├── native-chat-vue.css         # Plugin CSS (@layer native-chat)
    └── types/                      # Generated .d.ts declarations
```

### Architectural Boundaries

**Plugin Boundary (host ↔ plugin):**
- **Entry point:** `app.use(NativeChatPlugin, options)` registers config and `<NativeChatWidget />` global component — the only integration surface
- **Data contract:** `NativeChatApiClient` interface — the only data boundary
- **Style boundary:** `@layer native-chat` + `<v-theme-provider>` — CSS isolation in both directions
- **State boundary:** All plugin state encapsulated in `useChat()` via `provide/inject` — no global state, no Pinia/Vuex, no window-level side effects
- **Event boundary:** Plugin emits no events to the host app; `onError` callback is the only outbound signal

**Component Boundaries (internal):**

```
┌──────────────────────────────────────────────┐
│ NativeChatWidget (root)                       │
│ ┌─ creates & provides: useChat() state ─────┐│
│ │                                            ││
│ │  FloatingButton       [toggle + icon swap] ││
│ │                                            ││
│ │  ChatPanel        [Teleport + Transition]  ││
│ │   ├─ ChatHeader       [close action]       ││
│ │   ├─ WelcomeState     [if no messages]     ││
│ │   ├─ MessageList      [scrollable]         ││
│ │   │   └─ MessageBubble[] [user/asst/err]   ││
│ │   └─ ChatInput        [send action]        ││
│ │                                            ││
│ └────────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

- **NativeChatWidget** is the public root component — host places `<NativeChatWidget />` in their template. Creates `useChat()` instance and provides it to all children (FloatingButton + ChatPanel subtree). Registered as a global component during `app.use()`.
- **FloatingButton** reads `isOpen` from injected state; calls `open()` / `close()` actions; swaps icon (star ↔ close) with rotate+scale transition
- **ChatPanel** renders the chat drawer — reads `isOpen` from injected state, contains ChatHeader, MessageList, ChatInput, WelcomeState
- **MessageList** reads `messages`, `isLoading`, `isSending`, `hasMore` from injected state; emits `@load-more`; tracks animation state via `knownIds`/`animatingIds` sets — suppresses animation on initial load and history prepend, enables it only for newly appended messages. Implements event-driven scroll policy: force-scroll to bottom on user send and assistant response; scroll position preservation on history prepend delegated to VInfiniteScroll's native `side="start"` scroll management (captures `previousScrollSize` before load, adjusts `scrollTop` after `done()`). Includes a scroll-to-bottom FAB (`v-btn` icon, down-arrow) that appears when user has scrolled up past ~50px threshold.
- **MessageBubble** is a pure display component — receives a single message and optional `animate` flag via props, no state access; entrance animation slides from left (assistant/error) or right (user) when `animate` is true
- **ChatInput** reads `isSending`, `failedMessageText` from state; calls `sendMessage()` / `retry()` actions
- **ChatHeader** calls `close()` action
- **WelcomeState** is a pure display component — no state, no props beyond `welcomeMessage`

### Requirements to Structure Mapping

| FR Category | Files | Key FRs |
|---|---|---|
| Plugin Integration (FR1-4) | `plugin.ts`, `index.ts`, `types/config.ts` | `app.use()`, config validation, exports |
| Chat Window (FR5-8) | `NativeChatWidget.vue`, `FloatingButton.vue`, `ChatPanel.vue` | Root wrapper, open/close toggle, overlay, responsive |
| Message Display (FR9-13) | `MessageList.vue`, `MessageBubble.vue` | Role distinction, infinite scroll, scroll preservation |
| Message Input (FR14-18) | `ChatInput.vue` | Auto-expand, Enter/Shift+Enter, disable during send |
| Conversation Flow (FR19-23) | `useChat.ts`, `types/api.ts`, `helpers/createApiClient.ts` | Send, optimistic UI, fetch history, conversation lifecycle |
| Error Handling (FR24-27) | `useChat.ts`, `types/chat.ts` | Error as messages, retry, resilience |
| Markdown Rendering | `MessageBubble.vue` (uses `marked` + `dompurify`) | Rich assistant messages |
| CSS Isolation | `theme/nativeChatTheme.ts`, all `<style scoped>` blocks | `@layer native-chat`, `v-theme-provider` |
| Accessibility | Built into each component | ARIA, keyboard, focus, live regions |

### Data Flow

```
Host App
  │
  ├─ provides: apiClient (NativeChatApiClient)
  │
  └─ app.use(NativeChatPlugin, { apiClient, ...options })
       │
       ├─ plugin.ts: validates config, provide(CONFIG_KEY), registers <NativeChatWidget>
       │
       └─ <NativeChatWidget /> (host places in template)
            │
            ├─ creates useChat(apiClient), provide(CHAT_STATE_KEY)
            │
            ├─ FloatingButton: reads isOpen, calls open()/close()
            │
            └─ ChatPanel: reads isOpen, contains chat UI
                 │
                 ├─ open() → getConversations(0,1) → getMessages(id, 0, batchSize)
                 │            │                        │
                 │            └─ [newest-first]         └─ reverse → messages[]
                 │
                 ├─ sendMessage(text)
                 │   ├─ optimistic message added (status: 'sending')
                 │   ├─ apiClient.sendMessage(convId, text)
                 │   ├─ success → update message (status: 'sent') + add assistant message
                 │   └─ failure → remove optimistic, add error message, populate failedMessageText
                 │
                 └─ loadMore()
                     ├─ apiClient.getMessages(convId, offset, limit)
                     └─ reverse + prepend → messages[], adjust scroll position
```

### Development Workflow

**`yarn docs:dev`** — Primary development flow:
- VitePress dev server with hot reload
- Plugin components render live in markdown demo pages
- Vuetify registered in VitePress theme — full provider context available
- Changes to `src/` files hot-reload instantly in docs

**`yarn test`** — Run Vitest:
- Co-located `__tests__/` discovered automatically
- Vuetify context provided in test setup

**`yarn build`** — Production library build:
- Vite library mode → `dist/native-chat-vue.es.js` + `dist/native-chat-vue.css`
- `vite-plugin-dts` → `dist/types/`
- Vue + Vuetify externalized

**`yarn docs:build`** — Build documentation site:
- Static VitePress output for deployment

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:**
All technology choices are compatible: Vue 3 + Vuetify 3 + Vite library mode + TypeScript strict is a well-trodden stack. `marked` + `dompurify` are standalone libraries with no framework coupling. ESM-only output aligns with Vue 3 ecosystem (no CJS consumers). VitePress runs on Vite, reusing the same build tooling.

**Pattern Consistency:**
- Naming conventions are uniform: PascalCase components, camelCase composables, kebab-case events, `nc-` CSS prefix
- All state flows through `useChat()` composable → `provide/inject` — no component bypasses the pattern
- All styles scoped via `@layer native-chat` + `<style scoped>` — no exceptions
- TypeScript-first: `defineProps<T>()`, `defineEmits<T>()`, typed composable returns

**Structure Alignment:**
- `NativeChatWidget` as root wrapper resolves the FloatingButton ↔ ChatPanel state sharing — both are children of a single provider
- Host-placed `<NativeChatWidget />` keeps rendering explicit and avoids DOM manipulation side effects
- Co-located `__tests__/` folders align with Vitest auto-discovery
- `src/keys.ts` centralizes injection keys, preventing Symbol sprawl

### Requirements Coverage Validation

**Functional Requirements Coverage:**

| FR Category | Architectural Support | Gaps |
|---|---|---|
| Plugin Integration (FR1-4) | `plugin.ts` + `NativeChatApiClient` interface + `provide/inject` config | None |
| Chat Window (FR5-8) | `NativeChatWidget` → `FloatingButton` + `ChatPanel` + `useDisplay()` responsive | None |
| Message Display (FR9-13) | `MessageList` + `v-infinite-scroll` + offset pagination + scroll preservation | None |
| Message Input (FR14-18) | `ChatInput` + `v-textarea` auto-grow + Enter/Shift+Enter + `isSending` disable | None |
| Conversation Flow (FR19-23) | `useChat()` + optimistic UI + message lifecycle state machine + conversation init | None |
| Error Handling (FR24-27) | Error-as-message pattern + `failedMessageText` retry + `onError` hook | None |

All 27 FRs have explicit architectural support.

**Non-Functional Requirements Coverage:**

| NFR | Architectural Support |
|---|---|
| Performance (200ms open, 30fps scroll, <100ms input) | `v-infinite-scroll` MVP + 1000-message benchmark gate + implementation-agnostic MessageList API |
| Bundle size (<50KB gzip) | ESM-only + externalized peers + marked (~12KB) + dompurify (~7KB) ≈ ~19KB rendering + plugin code |
| Accessibility (WCAG 2.1 A) | Built into each component spec — ARIA, keyboard, focus, live regions |
| CSS isolation | `@layer native-chat` + `v-theme-provider` + `<style scoped>` |
| No global side effects | Symbol-based provide/inject, no window mutations, no global event listeners |

### Implementation Readiness Validation

**Decision Completeness:**
- All critical decisions include concrete TypeScript interfaces (API client, plugin options, useChat return shape)
- Markdown rendering choice includes specific libraries with gzip sizes
- Build output format, externals, and entry point are fully specified
- Conversation lifecycle flow is documented step-by-step

**Structure Completeness:**
- Every file in the project tree maps to specific FRs
- Component hierarchy is explicit with a single root (`NativeChatWidget`)
- Test locations are defined (co-located `__tests__/`)
- Build outputs (`dist/`) are specified

**Pattern Completeness:**
- Naming, state, CSS, error, loading patterns all documented with examples
- Anti-patterns listed explicitly
- Enforcement guidelines provide clear AI agent instructions

### Gap Analysis Results

**No critical or important gaps remain.** All three validation issues have been resolved:

1. **FloatingButton ↔ ChatPanel state sharing** — Resolved: `NativeChatWidget` root wrapper creates `useChat()` and provides to both via `provide/inject`
2. **Plugin rendering mechanism** — Resolved: Host places `<NativeChatWidget />` in template; plugin registers it as global component during `app.use()`
3. **Runtime deps constraint** — Resolved: Updated to explicitly allow `marked` + `dompurify` as the only runtime deps beyond Vue/Vuetify peers

**Nice-to-Have (post-MVP):**
- CI pipeline configuration (linting, testing, build)

**Resolved via Correct Course (2026-02-21):**
- ~~Detailed VitePress `DemoBlock.vue` implementation pattern~~ → Epic 5, Story 5.1
- ~~Mock API client for VitePress playground demos~~ → Epic 5, Story 5.1

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with specific libraries and versions
- [x] Technology stack fully specified
- [x] Integration patterns defined (API client interface, plugin config, provide/inject)
- [x] Performance considerations addressed (benchmark gate, agnostic MessageList API)

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Component, state, error, loading, and CSS patterns specified
- [x] Anti-patterns and enforcement guidelines documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established with NativeChatWidget root
- [x] Integration points mapped (plugin → host, API client → backend)
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Clean separation of concerns: host owns auth, plugin owns chat UI, server owns conversation state
- Single composable (`useChat()`) as the only state management layer — no accidental complexity
- Implementation-agnostic MessageList API enables virtualization switch without architectural change
- Explicit performance benchmark gate prevents "hope-based" performance decisions
- All decisions traceable to specific FRs and NFRs

**Areas for Future Enhancement:**
- Conversation list/switching UI (API already supports it)
- WebSocket/streaming responses (architecture doesn't preclude it)
- Custom component rendering inside message stream (Phase 2 extensibility)
- Theming API for host app branding overrides
- CI/CD pipeline configuration

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions
- Never introduce runtime dependencies beyond `marked` and `dompurify`
- All state access must go through `useChat()` composable actions

**First Implementation Priority:**
1. Project scaffold (Vite + TypeScript + Vuetify + VitePress)
2. TypeScript interfaces (`types/api.ts`, `types/chat.ts`, `types/config.ts`)
3. `createNativeChatApiClient` helper
4. `plugin.ts` install function
5. `useChat()` composable
