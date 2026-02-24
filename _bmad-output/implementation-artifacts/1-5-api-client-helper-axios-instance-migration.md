# Story 1.5: API Client Helper — Axios Instance Migration

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer integrating the plugin into a host app with Axios interceptors,
I want `createNativeChatApiClient` to accept my pre-configured Axios instance,
so that the plugin participates in my app's auth lifecycle (token refresh, error handling, retry logic) automatically.

## Acceptance Criteria

1. **Given** I have an Axios instance with auth interceptors attached **When** I call `createNativeChatApiClient({ axiosInstance })` **Then** all 4 API methods delegate HTTP requests through my Axios instance **And** auth tokens are injected by the Axios interceptor (not by the helper) **And** the helper uses relative paths (`/conversations`, `/conversations/:id/messages`)

2. **Given** the Axios instance has a `baseURL` configured **When** any API method is called **Then** the helper passes only relative paths (e.g., `/conversations`) to the Axios instance — URL resolution to `baseURL` is Axios's responsibility, not the helper's. Verified by asserting the first argument to `axiosInstance.get()`/`.post()` starts with `/` and contains no protocol or host

3. **Given** an Axios request fails with an error containing `error.response.status` **When** `useChat` processes the error **Then** the status code is extracted correctly for error message mapping (429, 503, 504) **And** the `onError` callback receives the status code in `ChatError.statusCode`

4. **Given** a custom `NativeChatApiClient` implementation throws errors with `error.statusCode` **When** `useChat` processes the error **Then** backward compatibility is maintained — `error.statusCode` is still recognized

5. **Given** the plugin's `package.json` **When** a consumer installs the package **Then** `axios` is listed as an optional peer dependency **And** consumers who implement `NativeChatApiClient` directly do not need axios installed

6. **Given** the library is built with `yarn build` **When** the output bundle is inspected **Then** `axios` is externalized (not bundled), same as `vue` and `vuetify`

## Tasks / Subtasks

- [ ] Task 1: Rewrite `src/helpers/createApiClient.ts` — Axios instance delegation (AC: #1, #2)
  - [ ] 1.1 Change function signature from `{ baseUrl, getAccessToken }` to `{ axiosInstance: AxiosInstance }` — use `import type { AxiosInstance } from 'axios'` (type-only import, zero runtime cost). Add a runtime guard at the top of the function: if `!config.axiosInstance` throw a descriptive `Error('[native-chat-vue] createNativeChatApiClient requires an axiosInstance')` to catch misconfiguration early
  - [ ] 1.2 Replace `fetch()` with `axiosInstance.get()` / `axiosInstance.post()` — use generic type parameters on Axios calls (e.g., `axiosInstance.post<ConversationResponse>('/conversations')`) so `response.data` is typed without casts under strict mode. Return `response.data` directly (Axios auto-parses JSON)
  - [ ] 1.3 Use relative paths for all endpoints: `/conversations`, `/conversations/${encodeURIComponent(conversationId)}/messages`
  - [ ] 1.4 Use Axios `params` option for query parameters (`{ params: { offset, limit } }`) instead of manual URL construction
  - [ ] 1.5 Remove the internal `request()` wrapper, `getAccessToken` callback, manual `Authorization` header, and `Content-Type` header (Axios handles `Content-Type: application/json` automatically for object bodies)
  - [ ] 1.6 Let Axios errors propagate naturally — do NOT catch/rethrow or attach `.statusCode` (the `useChat` error extraction handles both error shapes)

- [ ] Task 2: Update `src/composables/useChat.ts` — dual error status code extraction (AC: #3, #4)
  - [ ] 2.1 Create `extractStatusCode(error: unknown): number | undefined` helper function inside `useChat.ts` that checks two shapes in order: (a) `error.response.status` (Axios errors) and (b) `error.statusCode` (custom implementations / old fetch pattern). Guard each return with `typeof value === 'number'` to reject malformed non-numeric status values
  - [ ] 2.2 Replace the inline `'statusCode' in error` check in `getErrorContent()` (grep for `'statusCode' in error` — first occurrence) with a call to `extractStatusCode(error)`
  - [ ] 2.3 Replace the inline `'statusCode' in error` check in the `onError` callback invocation (grep for `'statusCode' in error` — second occurrence) with a call to `extractStatusCode(error)`
  - [ ] 2.4 Add `extractStatusCode()` tests in `src/composables/__tests__/useChat.test.ts` for both error shapes — Axios (`{ response: { status: 429 } }`) and custom/legacy (`{ statusCode: 503 }`). These tests DO NOT currently exist — existing useChat error tests only mock `error.statusCode`, not `error.response.status`. Also test the dual-property edge case: an error with BOTH `{ response: { status: 500 }, statusCode: 503 }` must return `500` (Axios shape wins)

- [ ] Task 3: Update `package.json` — Axios dependency declarations (AC: #5)
  - [ ] 3.1 Add `"axios": "^1.0.0"` to `peerDependencies`
  - [ ] 3.2 Add `peerDependenciesMeta` section with `"axios": { "optional": true }`
  - [ ] 3.3 Add `"axios": "^1.9.0"` to `devDependencies`
  - [ ] 3.4 Run `yarn` (not `yarn install` — Yarn 4 Berry convention) to update the lockfile. Verify that PnP resolution works by confirming `import type { AxiosInstance } from 'axios'` resolves in the IDE / `vue-tsc --noEmit` after install

- [ ] Task 4: Update `vite.config.ts` — externalize Axios in build (AC: #6)
  - [ ] 4.1 Add `/^axios/` to `rollupOptions.external` array: `external: [/^vue/, /^vuetify/, /^axios/]`

- [ ] Task 5: Rewrite `src/helpers/__tests__/createApiClient.test.ts` (AC: #1, #2)
  - [ ] 5.1 Create a mock `AxiosInstance` object with `vi.fn()` for `.get()` and `.post()` — mock return `{ data: <expected response> }`. Note: this mock only covers methods the helper uses; if the implementation ever calls unmocked methods (e.g., `delete`, `patch`), the test will get `undefined` silently — this is acceptable since the helper only uses `get`/`post`
  - [ ] 5.2 Test `createConversation()` calls `axiosInstance.post('/conversations', {})` (empty body) and returns `response.data`
  - [ ] 5.3 Test `getConversations(offset, limit)` calls `axiosInstance.get('/conversations', { params: { offset, limit } })` and returns `response.data`
  - [ ] 5.4 Test `getMessages(id, offset, limit)` calls `axiosInstance.get()` with encoded conversationId path and `{ params: { offset, limit } }` — returns `response.data`
  - [ ] 5.5 Test `sendMessage(id, message)` calls `axiosInstance.post()` with encoded conversationId path and `{ message }` body — returns `response.data`
  - [ ] 5.6 Test that Axios errors propagate without modification (no `.statusCode` wrapping)
  - [ ] 5.7 Add `encodeURIComponent` edge case test: call `getMessages()` and `sendMessage()` with a conversationId containing special characters (e.g., `"abc/def 123"`) and verify the path is correctly encoded
  - [ ] 5.8 Test that calling `createNativeChatApiClient({ axiosInstance: undefined })` throws a descriptive error

- [ ] Task 6: Update documentation (AC: #1, #2, #3, #4, #5, #6)
  - [ ] 6.1 Update `docs/guide/getting-started.md` — replace `createNativeChatApiClient({ baseUrl, getAccessToken })` examples with `createNativeChatApiClient({ axiosInstance })` pattern, show Axios instance creation with comment for interceptors
  - [ ] 6.2 Update `docs/guide/api-client.md` — rewrite Built-in Helper section for Axios signature, update "How It Works" list, update URL Patterns table to show relative paths, flip Custom Implementation to fetch-based example, update Error Contract to document both `error.response.status` and `error.statusCode`, update the Tip callout block for automatic Axios error support
  - [ ] 6.3 Update `docs/guide/configuration.md` — update Full Configuration Example code block
  - [ ] 6.4 Sanity check: confirm the VitePress demo mock API client (`createMockApiClient()`) is unaffected — it implements `NativeChatApiClient` directly and does NOT use `createNativeChatApiClient`, so no changes needed. Verify by reading the mock and confirming no imports from `createApiClient.ts`

- [ ] Task 7: Verify build, test, lint (AC: #1-#6)
  - [ ] 7.1 Run `yarn test` — all 163+ existing tests pass + rewritten helper tests pass
  - [ ] 7.2 Run `yarn build` — verify clean build, axios externalized, not in bundle
  - [ ] 7.3 Run `yarn lint` — verify no new lint errors (7 pre-existing warnings acceptable)
  - [ ] 7.4 Run `yarn docs:dev` and verify the 3 updated guide pages (`getting-started`, `api-client`, `configuration`) render without errors — spot-check that code blocks display correctly

## Dev Notes

### Critical Architecture Constraints

- **TypeScript strict mode** — all files compile under `"strict": true`. Use `import type { AxiosInstance } from 'axios'` for the type-only import
- **`@/` alias for all imports** — never relative paths
- **ESM-only** — all imports/exports use ES modules
- **No new runtime dependencies** — `axios` is a peer dependency provided by the consumer. The plugin uses only `import type` — zero bundle impact
- **`NativeChatApiClient` interface is UNCHANGED** — this is critical. The interface in `src/types/api.ts` stays exactly as-is. Only the helper's internal implementation changes
- **Error contract backward compatibility** — `useChat.ts` must handle both error shapes: `error.response.status` (Axios) AND `error.statusCode` (custom implementations)

### Current Implementation (BEFORE — to be replaced)

```typescript
// src/helpers/createApiClient.ts — CURRENT (fetch-based)
export function createNativeChatApiClient(config: {
  baseUrl: string
  getAccessToken: () => string | Promise<string>
}): NativeChatApiClient {
  // Uses fetch(), manually adds Authorization header, attaches .statusCode to errors
}
```

### Target Implementation (AFTER)

```typescript
// src/helpers/createApiClient.ts — TARGET (Axios delegation)
import type { AxiosInstance } from 'axios'
import type {
  NativeChatApiClient,
  ConversationResponse,
  ConversationListResponse,
  MessageHistoryResponse,
  SendMessageResponse,
} from '@/types/api'

export function createNativeChatApiClient(config: {
  axiosInstance: AxiosInstance
}): NativeChatApiClient {
  const { axiosInstance } = config

  return {
    async createConversation() {
      // Pass empty object body — Axios omits Content-Type for undefined body,
      // but backend may expect application/json on POST. {} ensures the header is set.
      const response = await axiosInstance.post<ConversationResponse>('/conversations', {})
      return response.data
    },
    async getConversations(offset: number, limit: number) {
      const response = await axiosInstance.get<ConversationListResponse>('/conversations', {
        params: { offset, limit },
      })
      return response.data
    },
    async getMessages(conversationId: string, offset: number, limit: number) {
      const response = await axiosInstance.get<MessageHistoryResponse>(
        `/conversations/${encodeURIComponent(conversationId)}/messages`,
        { params: { offset, limit } },
      )
      return response.data
    },
    async sendMessage(conversationId: string, message: string) {
      const response = await axiosInstance.post<SendMessageResponse>(
        `/conversations/${encodeURIComponent(conversationId)}/messages`,
        { message },
      )
      return response.data
    },
  }
}
```

**Note:** Generic type parameters on Axios calls (`axiosInstance.post<ConversationResponse>(...)`) ensure `response.data` is properly typed without casts. This prevents implicit `any` under TypeScript strict mode.

### Error Extraction — Dual Shape Support

```typescript
// In src/composables/useChat.ts — NEW helper
function extractStatusCode(error: unknown): number | undefined {
  if (error && typeof error === 'object') {
    // Axios error shape: error.response.status
    if (
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response
    ) {
      const status = (error.response as { status: unknown }).status
      if (typeof status === 'number') return status
    }
    // Custom/legacy error shape: error.statusCode
    if ('statusCode' in error) {
      const code = (error as { statusCode: unknown }).statusCode
      if (typeof code === 'number') return code
    }
  }
  return undefined
}
```

**Why check `error.response.status` first:** Axios errors have `.response.status` as the canonical HTTP status code. Checking the Axios-specific shape first ensures proper extraction. Custom implementations that set `.statusCode` directly are handled by the fallback. **Dual-property edge case:** if an error has BOTH `response.status` and `statusCode`, the Axios shape wins — this is the correct behavior since a real Axios error's `response.status` is authoritative. Each return is guarded with `typeof ... === 'number'` to reject malformed non-numeric values (e.g., `status: "429"` string or `status: null`).

### Package.json Changes

```json
{
  "peerDependencies": {
    "axios": "^1.0.0",
    "vue": "^3.5.0",
    "vuetify": "^3.11.0"
  },
  "peerDependenciesMeta": {
    "axios": {
      "optional": true
    }
  },
  "devDependencies": {
    "axios": "^1.9.0"
  }
}
```

**Why optional:** Consumers who implement `NativeChatApiClient` directly (without the convenience helper) should not be forced to install axios. The helper is a DX convenience, not a requirement.

### Vite Config Changes

```typescript
rollupOptions: {
  external: [/^vue/, /^vuetify/, /^axios/],
  output: {
    globals: {
      vue: 'Vue',
      vuetify: 'Vuetify',
    },
  },
},
```

Axios added to externals. No `globals` entry needed for axios since the output is ESM-only (globals are only used for UMD/IIFE).

### Testing Strategy

**Mock AxiosInstance pattern:**

```typescript
function createMockAxiosInstance() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  } as unknown as AxiosInstance
}
```

**Mock scope limitation:** This mock only stubs `get`/`post` — the two methods the helper uses. `AxiosInstance` has many other methods (`delete`, `put`, `patch`, `interceptors`, etc.) that are `undefined` on the mock. This is acceptable: if the implementation ever calls an unmocked method, the test will fail with a `TypeError` rather than silently passing. If future stories extend the helper to use `delete`/`put`, add those methods to the mock.

**Test that errors propagate directly:**

```typescript
it('propagates Axios errors without modification', async () => {
  const axiosError = Object.assign(new Error('Request failed'), {
    response: { status: 429, data: {} },
  })
  mockAxios.post.mockRejectedValue(axiosError)

  await expect(client.createConversation()).rejects.toBe(axiosError)
})
```

**useChat error extraction tests — verify all shapes:**

```typescript
// Axios-style error
const axiosError = { response: { status: 429 }, message: 'Too Many Requests' }
expect(extractStatusCode(axiosError)).toBe(429)

// Custom-style error
const customError = { statusCode: 503, message: 'Service Unavailable' }
expect(extractStatusCode(customError)).toBe(503)

// Dual-property: Axios shape wins
const dualError = { response: { status: 500 }, statusCode: 503 }
expect(extractStatusCode(dualError)).toBe(500)

// Malformed non-numeric status: returns undefined
const badError = { response: { status: '429' } }
expect(extractStatusCode(badError)).toBeUndefined()

// Null/undefined error: returns undefined
expect(extractStatusCode(null)).toBeUndefined()
expect(extractStatusCode(undefined)).toBeUndefined()
```

### Files to Modify (Complete List)

| File | Action | Notes |
|------|--------|-------|
| `src/helpers/createApiClient.ts` | **Rewrite** | Fetch → Axios delegation |
| `src/composables/useChat.ts` | **Update** | Add `extractStatusCode()`, update 2 call sites |
| `package.json` | **Update** | Add axios peer dep (optional) + dev dep |
| `vite.config.ts` | **Update** | Add `/^axios/` to externals |
| `src/helpers/__tests__/createApiClient.test.ts` | **Rewrite** | Mock AxiosInstance instead of fetch |
| `src/composables/__tests__/useChat.test.ts` | **Update** | Add `extractStatusCode()` tests for Axios + custom + dual-property error shapes |
| `docs/guide/getting-started.md` | **Update** | 2 code blocks |
| `docs/guide/api-client.md` | **Rewrite** | 3+ sections |
| `docs/guide/configuration.md` | **Update** | 1 code block |

### Breaking Change Notice

The `createNativeChatApiClient` helper's config parameter changes from `{ baseUrl, getAccessToken }` to `{ axiosInstance }`. This is a **breaking change** for consumers who use the convenience helper. The `NativeChatApiClient` interface itself is unchanged, so consumers who implement the interface directly are unaffected.

**Semver:** This project is pre-1.0 (`0.1.0`), so breaking changes are expected per semver conventions. No major version bump required, but the next release should be `0.2.0` (minor bump signals new feature with breaking helper API). Document the migration in a changelog entry or release note:

```
## 0.2.0

### Breaking Changes
- `createNativeChatApiClient()` now accepts `{ axiosInstance }` instead of `{ baseUrl, getAccessToken }`.
  Consumers must provide a pre-configured Axios instance. See docs/guide/api-client.md for migration.

### Migration
- Before: `createNativeChatApiClient({ baseUrl: '/api', getAccessToken: () => token })`
- After: `createNativeChatApiClient({ axiosInstance: axios.create({ baseURL: '/api' }) })`
- Custom `NativeChatApiClient` implementations are unaffected.
```

### No New Files Created

This story only modifies existing files. No new source files, test files, or directories.

### Naming Conventions (Enforce)

- **`import type` for AxiosInstance** — never a runtime import of axios
- **`@/` alias** for all project imports
- **No `any` casts** — use unknown + type narrowing in `extractStatusCode()`
- **Prettier rules:** single quotes, no semicolons, trailing commas, 100 char width

### Verified Package Versions

| Package | Version | Relevance to Story |
|---------|---------|-------------------|
| Vue | 3.5.28 | Peer dep (unchanged) |
| Vuetify | 3.11.8 | Peer dep (unchanged) |
| TypeScript | ^5.9.0 | Strict mode, type-only import for AxiosInstance |
| Vite | ^7.3.0 | Build externals config |
| Vitest | 4.0.x | Test runner — mock AxiosInstance |
| axios | ^1.9.0 (dev) / ^1.0.0 (peer) | NEW — Axios instance delegation |

### Accumulated Project Learnings (from Epic 1 through Epic 7)

- **CHAT_STATE_KEY typed as `InjectionKey<UseChatReturn>`** — fully typed since Story 2.1
- **7 pre-existing lint warnings** — Prettier/ESLint singleline conflict + false positive. Don't try to fix
- **dist/ tracked in git** — run `yarn build` and commit dist/
- **Yarn v4 Berry** — use `yarn` exclusively, never `npm`/`pnpm`
- **ESLint 10 flat config** — eslint.config.ts, not .eslintrc.cjs
- **Config options added in 6.15** — `showBubbleHeaders`, `assistantBubbleFullWidth`, `hideToggleWhenOpen` exist in `NativeChatPluginOptions`. No impact on this story but be aware of the full config shape
- **CSS import relocated in 6.14** — plugin CSS is imported inside `plugin.ts` via `import './styles.css'`, not in individual components. No impact on this story
- **Scroll behavior reworked in Epic 7** — `MessageList.vue` uses CSS `overflow-anchor` + JS anchor restoration. No impact on this story but be aware if touching `useChat.ts` state shape

### Git Intelligence

Recent commits follow pattern: `feat: <description> (Story X.Y)`. This story should produce:
`feat: migrate createNativeChatApiClient to Axios instance delegation (Story 1.5)`

### Sprint Change Proposal Context

This story implements the changes described in `_bmad-output/planning-artifacts/sprint-change-proposal-2026-02-24b.md`. The proposal was created via Correct Course workflow and contains 12 detailed proposals. The story covers proposals 1-8 (source, config, tests, docs). Proposals 9-12 (planning artifact updates) were already applied during the correct-course workflow itself.

### Project Structure Notes

- All modified files are in existing locations — no structural changes
- `src/helpers/createApiClient.ts` stays in `src/helpers/` (flat structure per architecture)
- Tests stay co-located in `src/helpers/__tests__/`
- Documentation stays in `docs/guide/`
- No new directories needed
- Aligns with architecture project structure

### References

- [Source: epics.md#Story 1.5] — Full acceptance criteria and coverage notes
- [Source: architecture.md#API client helper] — `createNativeChatApiClient({ axiosInstance })` decision (line 207)
- [Source: architecture.md#Build & Distribution] — Externals: vue, vuetify, axios (line 296)
- [Source: architecture.md#Implementation Sequence] — API client helper is step 1 (gating) (line 311)
- [Source: prd.md#FR3] — Developer provides authenticated HTTP client (Axios instance with interceptors)
- [Source: prd.md#FR4] — Developer provides pre-configured API client through plugin configuration
- [Source: sprint-change-proposal-2026-02-24b.md] — Full impact analysis and 12 implementation proposals
- [Source: project-context.md#TypeScript Rules] — Strict mode, `@/` alias, `import type`
- [Source: project-context.md#Testing Rules] — Co-located tests, globals enabled, mock patterns
- [Source: project-context.md#Critical Don't-Miss Rules] — No `any`, no relative imports, no `!important`
- [Source: 1-4-chat-panel-with-header-welcome-state.md#Previous Story Learnings] — dist/ tracked, Yarn 4, lint warnings
- [Source: sprint-status.yaml] — Stories 6.15-6.16 and Epic 7 are the most recently completed work; patterns from those stories are current

## Dev Agent Record

### Agent Model Used

(to be filled by dev agent)

### Debug Log References

(to be filled during implementation)

### Completion Notes List

(to be filled during implementation)

### File List

(to be filled during implementation)
