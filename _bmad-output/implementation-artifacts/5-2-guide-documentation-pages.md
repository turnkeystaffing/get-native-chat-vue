# Story 5.2: Guide Documentation Pages

Status: done

Epic: 5 — VitePress Documentation & Interactive Playground
Date: 2026-02-21
Depends on: Story 5.1 complete (DemoBlock, mock API client, VitePress plugin registration)

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer integrating the plugin,
I want clear documentation covering installation, configuration, and API client setup,
so that I can integrate the plugin into my application without guesswork.

## Acceptance Criteria

1. **Given** the docs site **When** a developer navigates to the Getting Started guide **Then** the page covers: installation (`yarn add`), peer dependency requirements (Vue 3, Vuetify 3), basic `app.use()` registration, placing `<NativeChatWidget />` in a template, and a minimal working example

2. **Given** the docs site **When** a developer navigates to the Configuration guide **Then** the page documents all `NativeChatPluginOptions` properties with types, defaults, and descriptions **And** includes code examples for common configuration scenarios (custom position, welcome message, error callback)

3. **Given** the docs site **When** a developer navigates to the API Client guide **Then** the page documents the `NativeChatApiClient` interface with all method signatures **And** explains the `createNativeChatApiClient` helper with usage example **And** shows how to provide a custom API client implementation

4. **Given** the VitePress config **When** the site renders **Then** a sidebar navigation shows: Getting Started, Configuration, API Client under a "Guide" group

## Tasks / Subtasks

- [x] Task 1: Create Getting Started guide page (AC: #1)
  - [x] 1.1 Create `docs/guide/getting-started.md`
  - [x] 1.2 Document installation: `yarn add native-chat-vue` with peer dependency requirements (`vue ^3.5`, `vuetify ^3.11`)
  - [x] 1.3 Document basic plugin registration: import `NativeChatPlugin`, call `app.use()` with minimal config
  - [x] 1.4 Document placing `<NativeChatWidget />` in a root template (e.g., `App.vue`)
  - [x] 1.5 Provide a minimal working example showing the complete integration (main.ts + App.vue) using `createNativeChatApiClient`
  - [x] 1.6 Note that the host app must already have Vuetify 3 installed and configured

- [x] Task 2: Create Configuration guide page (AC: #2)
  - [x] 2.1 Create `docs/guide/configuration.md`
  - [x] 2.2 Document all `NativeChatPluginOptions` properties in a reference table: `apiClient` (required), `position` (optional, `'bottom-left' | 'bottom-right'`), `welcomeMessage` (optional, string), `batchSize` (optional, default 20), `conversationId` (optional, string), `onError` (optional, callback)
  - [x] 2.3 Add code examples for common scenarios: custom position (`bottom-left`), custom welcome message, error callback for logging/analytics, resuming a specific conversation via `conversationId`
  - [x] 2.4 Document config validation behavior: missing `apiClient` logs a console warning and skips plugin registration

- [x] Task 3: Create API Client guide page (AC: #3)
  - [x] 3.1 Create `docs/guide/api-client.md`
  - [x] 3.2 Document the `NativeChatApiClient` interface with all 4 method signatures, parameter types, and return types
  - [x] 3.3 Document all response types: `ConversationResponse`, `ConversationListResponse`, `MessageResponse`, `MessageHistoryResponse`, `SendMessageResponse`
  - [x] 3.4 Document `createNativeChatApiClient({ baseUrl, getAccessToken })` helper with usage example — explain that it creates a fetch-based client with Bearer token auth
  - [x] 3.5 Show how to provide a custom API client implementation (e.g., wrapping Axios with retry logic, custom headers)
  - [x] 3.6 Document the error contract: client should throw errors with a `.statusCode` property for HTTP errors; plugin maps 429 → rate limit, 503/504 → service unavailable, others → generic
  - [x] 3.7 Document message ordering: API must return messages newest-first; plugin reverses for chronological display

- [x] Task 4: Update VitePress config with sidebar and nav (AC: #4)
  - [x] 4.1 Update `docs/.vitepress/config.ts` — add "Guide" entry to `nav`
  - [x] 4.2 Update `docs/.vitepress/config.ts` — populate `sidebar` with "Guide" group containing Getting Started, Configuration, API Client links
  - [x] 4.3 Verify sidebar renders correctly on `yarn docs:dev`

- [x] Task 5: Verify end-to-end documentation (AC: all)
  - [x] 5.1 Run `yarn docs:dev` — all three guide pages render correctly with proper navigation
  - [x] 5.2 Verify sidebar shows Guide group with all three pages, active page highlighted
  - [x] 5.3 Verify all code examples have correct syntax and formatting
  - [x] 5.4 Verify internal links between guide pages work (e.g., Getting Started links to Configuration and API Client)
  - [x] 5.5 Run `yarn docs:build` — no build errors
  - [x] 5.6 Run `yarn test` — all 189 existing tests pass unchanged
  - [x] 5.7 Run `yarn build` — library build succeeds (no src/ changes)
  - [x] 5.8 Run `yarn lint` — no new lint errors

## Dev Notes

### CRITICAL: Docs-Only Story — NO Library Source Changes

**This story creates files exclusively in `docs/` — nothing in `src/` is created or modified.** All three guide pages are VitePress markdown files. The only code change is updating `docs/.vitepress/config.ts` for sidebar/nav configuration.

**No unit tests needed** — documentation pages have no testable logic. Validation is via `yarn docs:dev` (visual), `yarn docs:build` (no errors), and `yarn test` (189 existing tests pass unchanged).

### Critical Architecture Constraints

- **VitePress markdown pages** — standard `.md` files with optional `<script setup>` blocks for imports
- **Code examples use fenced code blocks** — ` ```ts ` / ` ```vue ` syntax highlighting (VitePress uses Shiki built-in)
- **No new dependencies** — documentation uses only what VitePress provides
- **Accurate type signatures** — all code examples must match the actual exported interfaces exactly
- **Import paths in examples** — use the package name `native-chat-vue` (not `@/` alias) since these docs are for external consumers
- **Prettier rules apply to .md files** — single quotes in code blocks, no semicolons, trailing commas, 100 char width

### Guide Page Content Specifications

#### Getting Started (`docs/guide/getting-started.md`)

**Page structure:**
1. Prerequisites — Vue 3.5+, Vuetify 3.11+, host app with Vuetify configured
2. Installation — `yarn add native-chat-vue` (also show npm/pnpm alternatives)
3. Plugin Registration — import + `app.use()` in main.ts
4. Template Placement — `<NativeChatWidget />` in App.vue
5. Complete Example — full main.ts + App.vue showing end-to-end integration

**Key accuracy points:**
- Package exports: `NativeChatPlugin` (install function), `NativeChatWidget` (component), `createNativeChatApiClient` (helper), and all TypeScript types
- `NativeChatPlugin` is also the default export
- `createNativeChatApiClient` requires `{ baseUrl: string, getAccessToken: () => string | Promise<string> }`
- If `apiClient` is missing from config, plugin logs `console.warn` and skips registration — no error thrown
- `<NativeChatWidget />` is auto-registered globally by the plugin — no explicit import needed in templates after `app.use()`

#### Configuration (`docs/guide/configuration.md`)

**Full `NativeChatPluginOptions` reference:**

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `apiClient` | `NativeChatApiClient` | Yes | — | API client for server communication |
| `position` | `'bottom-left' \| 'bottom-right'` | No | `'bottom-right'` | Floating button position |
| `welcomeMessage` | `string` | No | `'Hello! How can I help you?'` | Welcome state text |
| `batchSize` | `number` | No | `20` | Messages per pagination batch |
| `conversationId` | `string` | No | — | Resume a specific conversation |
| `onError` | `(error: ChatError) => void` | No | — | Error notification callback |

**`ChatError` type:**
```typescript
interface ChatError {
  message: string
  statusCode?: number
  originalError?: unknown
}
```

**Config validation behavior:** When `apiClient` is missing or falsy, the plugin logs a descriptive `console.warn` and returns early from `install()` — no component is registered, no error is thrown. The host app continues to function normally.

#### API Client (`docs/guide/api-client.md`)

**`NativeChatApiClient` interface — all 4 methods:**

```typescript
interface NativeChatApiClient {
  createConversation(): Promise<ConversationResponse>
  getConversations(offset: number, limit: number): Promise<ConversationListResponse>
  getMessages(conversationId: string, offset: number, limit: number): Promise<MessageHistoryResponse>
  sendMessage(conversationId: string, message: string): Promise<SendMessageResponse>
}
```

**Response types:**

```typescript
interface ConversationResponse {
  id: string
  createdAt: string
}

interface ConversationListResponse {
  conversations: ConversationResponse[]
  has_more: boolean
}

interface MessageResponse {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface MessageHistoryResponse {
  messages: MessageResponse[]
  has_more: boolean
}

interface SendMessageResponse {
  userMessage: MessageResponse
  assistantMessage: MessageResponse
}
```

**`createNativeChatApiClient` helper:**

```typescript
import { createNativeChatApiClient } from 'native-chat-vue'

const apiClient = createNativeChatApiClient({
  baseUrl: 'https://api.example.com',
  getAccessToken: () => authStore.token,
})
```

- Creates a `fetch`-based client
- Calls `getAccessToken()` before every request (supports sync and async)
- Adds `Authorization: Bearer <token>` header to all requests
- Throws `Error` with `.statusCode` property on non-ok HTTP responses

**URL patterns used by the helper:**

| Method | HTTP Verb | Endpoint |
|---|---|---|
| `createConversation()` | POST | `{baseUrl}/conversations` |
| `getConversations(offset, limit)` | GET | `{baseUrl}/conversations?offset=…&limit=…` |
| `getMessages(id, offset, limit)` | GET | `{baseUrl}/conversations/{id}/messages?offset=…&limit=…` |
| `sendMessage(id, message)` | POST | `{baseUrl}/conversations/{id}/messages` |

**Custom implementation example:**

```typescript
import type { NativeChatApiClient } from 'native-chat-vue'

const customApiClient: NativeChatApiClient = {
  async createConversation() {
    const res = await axios.post('/api/conversations')
    return res.data
  },
  async getConversations(offset, limit) {
    const res = await axios.get('/api/conversations', { params: { offset, limit } })
    return res.data
  },
  async getMessages(conversationId, offset, limit) {
    const res = await axios.get(`/api/conversations/${conversationId}/messages`, {
      params: { offset, limit },
    })
    return res.data
  },
  async sendMessage(conversationId, message) {
    const res = await axios.post(`/api/conversations/${conversationId}/messages`, { message })
    return res.data
  },
}
```

**Error handling contract:**
- On HTTP errors, the client should throw an `Error` with a `.statusCode` property
- The plugin maps status codes: 429 → rate limit message, 503/504 → service unavailable, others → generic error
- Plugin also calls `onError` callback (if configured) with a `ChatError` object

**Message ordering (CRITICAL):**
- `getMessages()` must return messages **newest-first** (most recent message at index 0)
- The plugin reverses messages internally for chronological display
- `has_more: true` means older messages exist beyond the current offset

### VitePress Config Update Guide

**File:** `docs/.vitepress/config.ts`

**Current state:** `nav` has only "Home", `sidebar` is `[]` (empty).

**Required changes:**

```typescript
themeConfig: {
  nav: [
    { text: 'Home', link: '/' },
    { text: 'Guide', link: '/guide/getting-started' },
  ],
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
},
```

**Note:** Story 5.3 will add a "Components" group to the sidebar. The structure should be designed to accommodate that addition cleanly (just add another object to the `sidebar` array).

### File Structure Requirements

**Files to CREATE:**

| File | Purpose |
|------|---------|
| `docs/guide/getting-started.md` | Installation, registration, template placement, complete example |
| `docs/guide/configuration.md` | All plugin options reference with types, defaults, code examples |
| `docs/guide/api-client.md` | Interface docs, helper docs, custom implementation, error contract |

**Files to MODIFY:**

| File | Action | Purpose |
|------|--------|---------|
| `docs/.vitepress/config.ts` | **Modify** | Add "Guide" to nav, populate sidebar with guide pages |

**Files that MUST NOT be modified:**

| File | Reason |
|------|--------|
| `src/**/*` | No library source changes — this is a docs-only story |
| `package.json` | No new dependencies |
| `docs/.vitepress/theme/index.ts` | Theme setup unchanged |
| `docs/.vitepress/theme/Layout.vue` | Layout unchanged |
| `docs/.vitepress/mock/mockApiClient.ts` | Mock client unchanged |
| `docs/.vitepress/components/DemoBlock.vue` | DemoBlock unchanged |

**Directory structure after this story:**

```
docs/
├── .vitepress/
│   ├── config.ts                    # MODIFIED: nav + sidebar
│   ├── theme/
│   │   ├── index.ts                 # (unchanged)
│   │   └── Layout.vue               # (unchanged)
│   ├── components/
│   │   ├── DemoBlock.vue            # (unchanged)
│   │   └── PerfBenchmark.vue        # (unchanged)
│   └── mock/
│       └── mockApiClient.ts         # (unchanged)
├── guide/
│   ├── getting-started.md           # NEW: installation + quick start
│   ├── configuration.md             # NEW: plugin options reference
│   └── api-client.md               # NEW: API client interface + helper
├── components/
│   ├── demos/
│   │   └── WidgetDemo.vue           # (unchanged)
│   └── widget.md                    # (unchanged)
├── performance/
│   └── benchmark.md                 # (unchanged)
└── index.md                         # (unchanged — updated in Story 5.3)
```

### Library & Framework Requirements

**No new dependencies for this story.** All required libraries are already installed.

**Technologies used:**

| Technology | Available Via | Usage |
|---|---|---|
| VitePress 1.6+ | Already installed | Markdown rendering, sidebar config, code highlighting (Shiki) |
| TypeScript 5.9+ | Already installed | Code examples use TypeScript syntax |

### Testing Requirements

**No new Vitest tests for this story.** Guide pages are markdown documentation with no testable logic.

**Validation checklist:**

1. `yarn test` — all 189 existing tests pass unchanged (regression check)
2. `yarn build` — library build succeeds (no src/ changes)
3. `yarn lint` — no lint errors
4. `yarn docs:dev` — all three guide pages render, sidebar navigation works, code blocks have syntax highlighting
5. `yarn docs:build` — VitePress static build completes without errors

### Previous Story Intelligence

**From Story 5.1 (DemoBlock Component & Mock API Client):**
- VitePress theme already registers `NativeChatPlugin` with mock API client — floating button visible on all docs pages
- SSR compatibility fixes already applied: `ssr.noExternal: ['vuetify']` in config, client-only guards
- Custom `Layout.vue` wraps VitePress in `<v-app>` — Vuetify components work everywhere
- DemoBlock component available for any guide page that wants to embed live demos (not needed for text-focused guide pages)
- `docs:build` succeeds — VitePress static build is stable
- 189 tests passing, build at 29.34 kB gzip, lint clean
- 7 pre-existing lint warnings — **don't try to fix them**
- ESLint flat config (`eslint.config.ts`, not `.eslintrc.cjs`)
- `dist/` is tracked in git — but no rebuild needed since no `src/` changes

**From project-context.md:**
- Commits follow `feat: {description} (Story X.Y)` convention
- Import order: Vue core → third-party → `@/` project imports
- Prettier: single quotes, no semicolons, trailing commas, 100 char width
- Package manager: Yarn 4.x

### Git Intelligence

Recent commits follow `feat: {description} (Story X.Y)` convention. This story's commit should be:
```
feat: add guide documentation pages for installation, configuration, and API client (Story 5.2)
```

Last 5 commits:
- `90de7eb` feat: add DemoBlock component and mock API client for VitePress docs (Story 5.1)
- `be138f3` fix: remove duplicate Vuetify registration in ChatInput tests
- `ebddd5d` feat: add message retry and error recovery with error history preservation (Story 4.2)
- `9e57a4f` feat: add error display as chat messages with status code mapping and tests (Story 4.1)
- `cfaf9c4` chore: add test-results to gitignore

Clean linear history on master branch. All Epics 1-4 complete, Story 5.1 complete.

### Project Structure Notes

- All new files are in `docs/guide/` — aligns with the architecture's project structure (`docs/guide/` for usage documentation)
- `docs/guide/` is a new directory — does not conflict with any existing structure
- Config change is additive — only adds nav entry and sidebar items to existing config
- No conflicts with `src/` structure — complete separation between library code and documentation
- Story 5.3 will add a "Components" group to the sidebar — the sidebar structure should accommodate this cleanly

### References

- [Source: architecture.md#Starter Template Evaluation] — Project structure defining `docs/guide/` for usage documentation
- [Source: architecture.md#API Client Interface] — `NativeChatApiClient` interface, `createNativeChatApiClient` helper
- [Source: architecture.md#Plugin Configuration API] — `NativeChatPluginOptions` with all properties
- [Source: architecture.md#Markdown Rendering] — `marked` + DOMPurify for assistant messages
- [Source: architecture.md#Conversation Management] — Single active conversation, `getConversations(0,1)` flow
- [Source: architecture.md#Build & Distribution] — ESM-only, peer dependencies, entry point
- [Source: epics.md#Story 5.2] — Acceptance criteria, creates guide pages + updates sidebar
- [Source: epics.md#Epic 5] — VitePress Documentation & Interactive Playground overview
- [Source: project-context.md#Technology Stack] — Vue 3.5, Vuetify 3.11, TypeScript 5.9
- [Source: project-context.md#Development Workflow Rules] — Commit convention, Yarn, docs:dev
- [Source: src/types/api.ts] — NativeChatApiClient interface, all response types
- [Source: src/types/config.ts] — NativeChatPluginOptions interface
- [Source: src/types/chat.ts] — ChatMessage, MessageStatus, ChatError types
- [Source: src/index.ts] — Public exports: NativeChatPlugin, NativeChatWidget, createNativeChatApiClient, types
- [Source: src/helpers/createApiClient.ts] — Helper implementation: fetch-based, Bearer auth, URL patterns
- [Source: src/plugin.ts] — Plugin install: validates apiClient, provides config, registers widget
- [Source: docs/.vitepress/config.ts] — Current VitePress config with empty sidebar
- [Source: docs/.vitepress/theme/index.ts] — VitePress theme with NativeChatPlugin + mock API client registered
- [Source: 5-1-demoblock-component-mock-api-client.md] — Previous story learnings: SSR fixes, 189 tests baseline, lint warnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- No debug issues encountered — docs-only story with no source code changes.

### Completion Notes List

- Created three guide documentation pages under `docs/guide/`: Getting Started, Configuration, and API Client.
- Getting Started covers: prerequisites (Vue 3.5+, Vuetify 3.11+), installation (yarn/npm/pnpm), plugin registration, template placement, and a complete working example.
- Configuration documents all `NativeChatPluginOptions` properties in a reference table with types, defaults, and descriptions. Includes code examples for custom position, welcome message, error callback, and conversation resumption.
- API Client documents the full `NativeChatApiClient` interface (4 methods), all 5 response types, the `createNativeChatApiClient` helper with URL patterns, custom implementation example (Axios), error contract with status code mapping, and message ordering requirements.
- Updated `docs/.vitepress/config.ts` to add "Guide" nav entry and sidebar group with all three pages.
- All type signatures verified against actual source exports in `src/types/api.ts`, `src/types/config.ts`, `src/types/chat.ts`, `src/helpers/createApiClient.ts`, and `src/plugin.ts`.
- All guide pages include cross-links to related pages.
- Prettier auto-formatted tables in configuration.md and api-client.md.

### Validation Results

- `yarn test` — 189/189 tests pass (no regressions)
- `yarn build` — library build succeeds (29.34 kB gzip, no src/ changes)
- `yarn lint` — clean (after Prettier auto-format)
- `yarn docs:build` — VitePress build completes successfully in 6.48s

### Change Log

- 2026-02-21: Created guide documentation pages (Getting Started, Configuration, API Client) and updated VitePress sidebar/nav config (Story 5.2)
- 2026-02-21: Code review — fixed 5 issues (1 HIGH, 4 MEDIUM): Axios error contract compliance, missing vuetify/styles import, default export docs, ChatMessage/MessageStatus type docs, SSR guidance

### File List

**New files:**
- `docs/guide/getting-started.md`
- `docs/guide/configuration.md`
- `docs/guide/api-client.md`

**Modified files:**
- `docs/.vitepress/config.ts`
