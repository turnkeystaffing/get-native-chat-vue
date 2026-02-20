# Story 1.2: Core Types, API Client Helper & Plugin Install

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to register the plugin with `app.use()` providing an API client configuration,
so that the plugin is configured and ready to render in my application.

## Acceptance Criteria

1. **Given** the plugin package is imported **When** I call `app.use(NativeChatPlugin, { apiClient })` **Then** the plugin registers successfully **And** `<NativeChatWidget />` is available as a global component **And** the configuration is provided to the component tree via `provide/inject` with Symbol-based keys

2. **Given** the plugin is being registered **When** the `apiClient` property is missing from the config **Then** the plugin logs a console warning with a clear message **And** the plugin skips registration (no component registered)

3. **Given** the `createNativeChatApiClient` helper is imported **When** I call `createNativeChatApiClient({ baseUrl, getAccessToken })` **Then** it returns an object conforming to the `NativeChatApiClient` interface **And** each method attaches the `Authorization: Bearer <token>` header using the `getAccessToken` callback

4. **Given** the package entry point `src/index.ts` **When** a consumer imports from the package **Then** `NativeChatPlugin`, `NativeChatWidget`, `createNativeChatApiClient`, and all public TypeScript interfaces are available

## Tasks / Subtasks

- [x] Task 1: Create TypeScript type definitions (AC: #1, #3, #4)
  - [x] 1.1 Create `src/types/api.ts` — `NativeChatApiClient` interface with `createConversation()`, `getConversations(offset, limit)`, `getMessages(conversationId, offset, limit)`, `sendMessage(conversationId, message)` methods; response types `ConversationResponse`, `ConversationListResponse`, `MessageHistoryResponse`, `SendMessageResponse`
  - [x] 1.2 Create `src/types/chat.ts` — `ChatMessage` type with `id`, `conversationId`, `role` (`'user' | 'assistant'`), `content`, `createdAt`, `status` (`MessageStatus`); `MessageStatus` type (`'sending' | 'sent' | 'failed'`); `ChatError` type with `message`, `statusCode?`, `originalError?`
  - [x] 1.3 Create `src/types/config.ts` — `NativeChatPluginOptions` interface with required `apiClient: NativeChatApiClient` and optional `position?: 'bottom-left' | 'bottom-right'`, `welcomeMessage?: string`, `batchSize?: number`, `conversationId?: string`, `onError?: (error: ChatError) => void`
  - [x] 1.4 Create `src/types/index.ts` — re-export all public types from `api.ts`, `chat.ts`, `config.ts`

- [x] Task 2: Create provide/inject keys (AC: #1)
  - [x] 2.1 Create `src/keys.ts` — export `CONFIG_KEY` as `Symbol('native-chat-config')` for plugin options and `CHAT_STATE_KEY` as `Symbol('native-chat-state')` for useChat composable state

- [x] Task 3: Create API client helper (AC: #3)
  - [x] 3.1 Create `src/helpers/createApiClient.ts` — implement `createNativeChatApiClient({ baseUrl, getAccessToken })` that returns an object conforming to `NativeChatApiClient`
  - [x] 3.2 Each method uses `fetch()` with `Authorization: Bearer <token>` header obtained from `getAccessToken()` callback (supports both sync and async)
  - [x] 3.3 Methods call correct REST endpoints: `POST /conversations`, `GET /conversations?offset=&limit=`, `GET /conversations/:id/messages?offset=&limit=`, `POST /conversations/:id/messages`
  - [x] 3.4 Methods throw on non-ok HTTP responses (error contract: client throws, plugin catches and maps status codes)

- [x] Task 4: Create Vue plugin install function (AC: #1, #2)
  - [x] 4.1 Create `src/plugin.ts` — implement `NativeChatPlugin` as a Vue plugin object with `install(app, options)` method
  - [x] 4.2 Validate config: if `apiClient` is missing, log `console.warn('[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped.')` and return early (no component registered)
  - [x] 4.3 On valid config: `app.provide(CONFIG_KEY, options)` to inject config into component tree
  - [x] 4.4 Register `NativeChatWidget` as a global component: `app.component('NativeChatWidget', NativeChatWidget)`
  - [x] 4.5 Create minimal placeholder `src/components/NativeChatWidget.vue` — `<script setup lang="ts">`, renders `<div class="nc-widget">NativeChatWidget placeholder</div>` (actual implementation in Story 1.3+)

- [x] Task 5: Update public entry point (AC: #4)
  - [x] 5.1 Update `src/index.ts` — export `NativeChatPlugin` (default and named), `NativeChatWidget` component, `createNativeChatApiClient` helper, and all public TypeScript interfaces from `types/index.ts`
  - [x] 5.2 Keep `import './styles.css'` for CSS layer output

- [x] Task 6: Write tests (AC: #1, #2, #3, #4)
  - [x] 6.1 Create `src/helpers/__tests__/createApiClient.test.ts` — test that `createNativeChatApiClient` returns an object with all 4 NativeChatApiClient methods; test that each method calls fetch with correct URL and Authorization header; test that async `getAccessToken` is supported; test that non-ok responses throw
  - [x] 6.2 Update `src/components/__tests__/NativeChatWidget.test.ts` — test that `app.use(NativeChatPlugin, { apiClient })` registers NativeChatWidget as global component; test that missing apiClient logs console.warn and skips registration; test that config is provided via CONFIG_KEY
  - [x] 6.3 Create `src/types/__tests__/types.test.ts` — type-level tests verifying interface shapes compile correctly (optional compile-time check)
  - [x] 6.4 Run `yarn test` — all tests pass
  - [x] 6.5 Run `yarn build` — verify build succeeds with new exports
  - [x] 6.6 Run `yarn lint` — verify no lint errors

## Dev Notes

### Critical Architecture Constraints

- **TypeScript strict mode** — all files must compile under `"strict": true`. Use `defineProps<T>()` and `defineEmits<T>()` for component interfaces, not runtime validators
- **Symbol-based provide/inject keys** — all keys centralized in `src/keys.ts`. Never use string keys. Import from `@/keys`
- **No reactive() for top-level state** — use individual `ref()` values. This rule applies to useChat in Story 2.1 but establishes the pattern now
- **API client error contract** — client throws on HTTP errors; plugin catches and maps status codes (429 → rate limit, 503/504 → service unavailable, others → generic). The helper must throw on non-ok responses
- **Pagination** — offset-based (`offset` + `limit` + `has_more`). API returns newest-first; plugin reverses for display
- **Auth boundary** — plugin NEVER stores, manages, or refreshes tokens. `getAccessToken` callback in the helper is the auth mechanism. Plugin itself never touches credentials
- **Config validation** — missing `apiClient` → console.warn + skip registration. Not a throw — graceful degradation
- **ESM-only** — all imports/exports use ES modules. No CJS patterns

### API Client Interface (Exact Contract)

```typescript
export interface NativeChatApiClient {
  createConversation(): Promise<ConversationResponse>
  getConversations(offset: number, limit: number): Promise<ConversationListResponse>
  getMessages(conversationId: string, offset: number, limit: number): Promise<MessageHistoryResponse>
  sendMessage(conversationId: string, message: string): Promise<SendMessageResponse>
}
```

### Response Types (from Architecture)

```typescript
export interface ConversationResponse {
  id: string
  createdAt: string
}

export interface ConversationListResponse {
  conversations: ConversationResponse[]
  has_more: boolean
}

export interface MessageResponse {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface MessageHistoryResponse {
  messages: MessageResponse[]
  has_more: boolean
}

export interface SendMessageResponse {
  userMessage: MessageResponse
  assistantMessage: MessageResponse
}
```

### Plugin Configuration (Exact Contract)

```typescript
export interface NativeChatPluginOptions {
  apiClient: NativeChatApiClient                   // Required
  position?: 'bottom-left' | 'bottom-right'        // Default: 'bottom-right'
  welcomeMessage?: string                           // Default: 'Hello! How can I help you?'
  batchSize?: number                                // Default: 20
  conversationId?: string                           // Resume specific conversation
  onError?: (error: ChatError) => void              // Error notification hook
}
```

### Internal Types (ChatMessage, MessageStatus, ChatError)

```typescript
export type MessageStatus = 'sending' | 'sent' | 'failed'

export interface ChatMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  status?: MessageStatus  // Only present on client-side messages during send lifecycle
}

export interface ChatError {
  message: string
  statusCode?: number
  originalError?: unknown
}
```

### createNativeChatApiClient Helper Pattern

```typescript
export function createNativeChatApiClient(config: {
  baseUrl: string
  getAccessToken: () => string | Promise<string>
}): NativeChatApiClient
```

- Uses `fetch()` internally — no Axios or other HTTP library dependency
- `getAccessToken` supports both sync and async return values (for token refresh scenarios)
- Each request adds `Authorization: Bearer <token>` and `Content-Type: application/json` headers
- Throws on non-ok HTTP responses with status code preserved in error
- REST endpoints pattern: `${baseUrl}/conversations`, `${baseUrl}/conversations/${id}/messages`

### Plugin Install Pattern

```typescript
export const NativeChatPlugin: Plugin = {
  install(app: App, options?: NativeChatPluginOptions) {
    if (!options?.apiClient) {
      console.warn('[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped.')
      return
    }
    app.provide(CONFIG_KEY, options)
    app.component('NativeChatWidget', NativeChatWidget)
  }
}
```

### Naming Conventions (Enforce)

- **Type files:** camelCase (`api.ts`, `chat.ts`, `config.ts`)
- **Interfaces:** No `I` prefix (`NativeChatApiClient`, not `INativeChatApiClient`)
- **Helper files:** camelCase (`createApiClient.ts`)
- **Component files:** PascalCase (`NativeChatWidget.vue`)
- **Provide/inject keys:** SCREAMING_SNAKE_CASE constants (`CONFIG_KEY`, `CHAT_STATE_KEY`)
- **Tests:** `.test.ts` suffix, co-located `__tests__/` folders

### Verified Package Versions (from Story 1-1)

| Package | Version | Notes |
|---------|---------|-------|
| Vue | 3.5.28 | `Plugin`, `App`, `InjectionKey` types from `vue` |
| Vuetify | 3.11.8 | Peer dependency only — not used directly in this story |
| TypeScript | 5.9.x | Strict mode, satisfies all interface patterns |
| Vite | 7.3.x | Library mode build |
| Vitest | 4.0.x | Test runner with jsdom environment |

### Previous Story (1-1) Learnings

- **Yarn v4 Berry** — use `yarn` exclusively; `.yarnrc.yml` with node-modules linker
- **@/* path alias** — configured in tsconfig.json, vite.config.ts, vitest.config.ts. Use `@/types/api` not `../types/api` for imports
- **src/styles.css** — already exists with `@layer native-chat {}`. Do NOT recreate or overwrite
- **vitest.setup.ts** — Vuetify registered globally for component tests. Test utils available
- **ESLint 10 flat config** — eslint.config.ts, not .eslintrc.cjs. Run `yarn lint` to verify
- **dist/ tracked in git** — build output is committed for consumers
- **Smoke test exists** — `NativeChatWidget.test.ts` already exists, needs updating (not creating from scratch)

### Project Structure Notes

- All new type files go in `src/types/` (existing empty directory from Story 1-1)
- Helper goes in `src/helpers/` (existing empty directory)
- `src/keys.ts` is a new file (directory for it is `src/`)
- `src/plugin.ts` is a new file (directory for it is `src/`)
- `src/components/NativeChatWidget.vue` is a new placeholder component
- `src/index.ts` is an existing file that needs updating (not creating)
- Test files go in co-located `__tests__/` folders (existing directories)

### References

- [Source: architecture.md#API Client Interface] — NativeChatApiClient interface contract
- [Source: architecture.md#Plugin Configuration API] — NativeChatPluginOptions interface
- [Source: architecture.md#Core Architectural Decisions] — Error contract, pagination, markdown rendering decisions
- [Source: architecture.md#Implementation Patterns & Consistency Rules] — Naming conventions, provide/inject patterns, anti-patterns
- [Source: architecture.md#Project Structure & Boundaries] — File locations, component hierarchy, data flow
- [Source: architecture.md#Build & Distribution] — ESM-only output, entry point exports
- [Source: epics.md#Story 1.2] — Acceptance criteria, FR coverage, file creation list
- [Source: 1-1-project-scaffold-build-configuration.md] — Previous story learnings, package versions, project structure

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No debug issues encountered during implementation.

### Completion Notes List

- Created all TypeScript type definitions matching architecture spec exactly (api.ts, chat.ts, config.ts, index.ts)
- Implemented Symbol-based provide/inject keys (CONFIG_KEY with InjectionKey<NativeChatPluginOptions>, CHAT_STATE_KEY)
- Built createNativeChatApiClient helper using fetch() with async getAccessToken support, correct REST endpoints, and error throwing on non-ok responses
- Implemented NativeChatPlugin with config validation (console.warn + skip on missing apiClient), provide/inject, and global component registration
- Created NativeChatWidget placeholder component
- Updated src/index.ts with all public exports (plugin, component, helper, types)
- All 26 tests pass across 3 test files (10 API client tests, 6 plugin/widget tests, 10 type-level tests)
- Build produces ESM output with declaration files (7 modules)
- Lint passes with 0 errors (7 warnings: Prettier/ESLint singleline conflict + false positive one-component-per-file in test)

### File List

- src/types/api.ts (new) — NativeChatApiClient interface, response types
- src/types/chat.ts (new) — ChatMessage, MessageStatus, ChatError types
- src/types/config.ts (new) — NativeChatPluginOptions interface
- src/types/index.ts (new) — re-exports all public types
- src/keys.ts (new) — CONFIG_KEY, CHAT_STATE_KEY Symbol constants
- src/helpers/createApiClient.ts (new) — createNativeChatApiClient helper
- src/plugin.ts (new) — NativeChatPlugin Vue plugin
- src/components/NativeChatWidget.vue (new) — placeholder widget component
- src/index.ts (modified) — updated with full public exports
- src/helpers/__tests__/createApiClient.test.ts (new) — API client tests
- src/components/__tests__/NativeChatWidget.test.ts (modified) — plugin + widget tests
- src/types/__tests__/types.test.ts (new) — type compile-time verification tests

### Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.6 + Gemini 3 Pro (PAL) on 2026-02-20
**Outcome:** Approved with fixes applied

**Issues Found:** 3 High, 3 Medium, 3 Low
**Issues Fixed:** 6 (all HIGH and MEDIUM)

Fixes applied:
- H1: Plugin type changed from bare `Plugin` to `Plugin<[NativeChatPluginOptions?]>` for consumer type safety
- H2: Replaced misleading provide test with proper `app.provide` spy verification + negative test
- H3: Added `encodeURIComponent()` to conversationId in URL path parameters (getMessages, sendMessage)
- M1: Content-Type header now only sent on requests with a body (removed from GET and bodyless POST)
- M2: Added TODO comment on CHAT_STATE_KEY for InjectionKey typing in Story 2.1
- M3: Added network-level fetch error test (TypeError propagation)

Remaining LOW issues (deferred):
- L1: statusCode monkey-patching on Error (works but fragile)
- L2: NativeChatWidget placeholder has no `<style scoped>` block
- L3: No trailing slash normalization on baseUrl

## Change Log

- 2026-02-20: Implemented Story 1.2 — Core types, API client helper, plugin install, and comprehensive test suite
- 2026-02-20: Code review — 6 issues fixed (type safety, URL encoding, test coverage, HTTP semantics)
