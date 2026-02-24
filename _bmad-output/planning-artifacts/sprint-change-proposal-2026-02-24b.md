# Sprint Change Proposal — API Client Axios Instance Migration

**Date:** 2026-02-24
**Author:** Volodymyr (facilitated by BMad Method Correct Course workflow)
**Change Scope:** Minor
**Status:** Pending Approval

---

## Section 1: Issue Summary

### Problem Statement

The `createNativeChatApiClient` helper currently accepts `{ baseUrl, getAccessToken }` and uses the Fetch API internally for HTTP requests. While `getAccessToken()` is called per-request, the helper operates as a standalone HTTP client that does not participate in the host application's auth lifecycle.

The host application (get-native-vue-auth) manages authentication through Axios interceptors (`setupAuthInterceptors`) that handle:

- Token refresh orchestration via `ensureValidToken()` (queues requests during refresh)
- Auth error response handling (401 session expired, 403 permission denied, 503 service unavailable)
- Configuration error detection (auth not configured guard)

The plugin's fetch-based client bypasses this entire infrastructure, creating a gap where token expiration, refresh coordination, and structured auth error handling are not applied to chat API requests.

### Discovery Context

Discovered during integration of native-chat-vue into the host Vue application that uses `@turnkeystaffing/get-native-vue-auth` for authentication. The host app expects all API clients to use a shared Axios instance so interceptors cover the full auth lifecycle uniformly.

### Evidence

The `setupAuthInterceptors()` function from the host app attaches request interceptors (token injection + refresh) and response interceptors (structured auth error mapping) to an `AxiosInstance`. The plugin creating its own fetch-based HTTP client breaks this pattern and cannot benefit from the host's auth infrastructure.

---

## Section 2: Impact Analysis

### Epic Impact

| Epic | Impact | Details |
|------|--------|---------|
| Epic 1: Plugin Foundation & Chat Shell | **Modified** | Story 1.2 ACs updated for new helper signature. New Story 1.5 added. |
| Epic 2: Core Messaging Experience | None | Consumes `NativeChatApiClient` interface — unchanged |
| Epic 3: Infinite Scroll & Deep History | None | No API client interaction changes |
| Epic 4: Error Handling & Recovery | **Minor** | `useChat.ts` error extraction updated to support both error shapes |
| Epic 5: VitePress Documentation | **Modified** | 3 doc pages need updates (getting-started, api-client, configuration) |
| Epic 6: Figma Design Alignment | None | Visual-only changes |
| Epic 7: Scroll Behavior Rework | None | Scroll-only changes |

### Story Impact

- **Story 1.2** (existing): Acceptance criteria updated — helper now accepts `{ axiosInstance }` instead of `{ baseUrl, getAccessToken }`
- **Story 1.5** (new): Captures the complete migration — source code, error handling, packaging, build config, and documentation

### Artifact Conflicts

| Artifact | Impact | Specific Changes |
|----------|--------|-----------------|
| PRD | Minor | FR3 reworded: "auth token" → "authenticated HTTP client (Axios instance)" |
| Architecture | Moderate | 5 references updated: decision table, code block, description, build externals, implementation sequence |
| UX Design | None | No UI changes |
| Epics | Moderate | Story 1.2 ACs updated, Story 1.5 added, overview changelog updated, Epic 1 description updated, architecture requirements line updated |
| Docs (api-client.md) | Major rewrite | Helper section, custom implementation, error contract all rewritten |
| Docs (getting-started.md) | Moderate | 2 code examples updated |
| Docs (configuration.md) | Minor | 1 full config example updated |
| Project Knowledge | Regenerate | Auto-generated docs to be regenerated after implementation |

### Technical Impact

- **Source files modified:** 2 (`createApiClient.ts`, `useChat.ts`)
- **Test files modified:** 1 (`createApiClient.test.ts`)
- **Config files modified:** 2 (`package.json`, `vite.config.ts`)
- **Doc files modified:** 3 (`api-client.md`, `getting-started.md`, `configuration.md`)
- **New dependencies:** `axios` as optional peer dependency (not bundled)
- **Existing tests unaffected:** 163+ tests against components, composable, and types continue to pass (only 12 helper tests rewritten)
- **`NativeChatApiClient` interface:** Unchanged — zero impact on consumers who implement the interface directly

---

## Section 3: Recommended Approach

### Selected Path: Direct Adjustment (Option 1)

**Rationale:**

1. **Minimal blast radius** — Only 2 source files, 1 test file, and 2 config files change. The `NativeChatApiClient` interface is untouched, so all existing consumers and 163+ non-helper tests remain valid.

2. **No new runtime dependencies** — Axios is provided by the consumer (optional peer dependency). The plugin uses `import type { AxiosInstance }` only — zero runtime cost, zero bundle size impact.

3. **Aligns with existing architecture** — FR4 already states "Developer can provide a pre-configured API client." The change makes the built-in helper follow this same philosophy — consumer provides their pre-configured HTTP client.

4. **Eliminates a class of integration bugs** — The host app's interceptor pattern is the standard across all services. Aligning the plugin with it means token refresh, auth errors, and retry logic are handled uniformly.

5. **Backward compatible error handling** — The `extractStatusCode()` helper in `useChat.ts` supports both `error.statusCode` (old pattern) and `error.response.status` (Axios pattern), so custom implementations continue to work.

### Effort & Risk

- **Effort:** Low — estimated 1-2 implementation sessions
- **Risk:** Low — interface contract preserved, change is additive
- **Timeline impact:** None — no blocking dependencies, no architectural changes

### Alternatives Considered

- **Rollback** (Option 2): Not viable — nothing to roll back, this is a design adaptation not a bug fix
- **MVP Review** (Option 3): Not needed — MVP is fully implemented and unaffected

---

## Section 4: Detailed Change Proposals

### 4.1 Source Code Changes

#### Proposal 1: `src/helpers/createApiClient.ts` — Core Implementation

Replace fetch-based implementation with Axios instance delegation:

- Accept `{ axiosInstance: AxiosInstance }` config (single parameter)
- Use relative paths (`/conversations`, `/conversations/:id/messages`)
- Delegate all HTTP to the provided Axios instance (`.get()`, `.post()`)
- Use Axios `params` option for query parameters
- Return `response.data` directly (Axios auto-parses JSON)
- Remove `getAccessToken` callback, manual `Authorization` header, and `fetch()` usage
- Preserve `encodeURIComponent()` for conversationId path segments

#### Proposal 2: `src/composables/useChat.ts` — Error Status Code Extraction

Add `extractStatusCode()` helper that checks both error shapes:

1. `error.statusCode` (custom implementations, old fetch pattern)
2. `error.response.status` (Axios errors)

Replace inline `statusCode` checks in `getErrorContent()` and `handleError()` with calls to `extractStatusCode()`. Backward compatible — both patterns work.

### 4.2 Package & Build Changes

#### Proposal 3: `package.json` — Axios Dependencies

- Add `axios: "^1.0.0"` to `peerDependencies`
- Add `peerDependenciesMeta.axios.optional: true`
- Add `axios: "^1.9.0"` to `devDependencies`

#### Proposal 4: `vite.config.ts` — Externalize Axios

- Add `/^axios/` to `rollupOptions.external` array

### 4.3 Test Changes

#### Proposal 5: `src/helpers/__tests__/createApiClient.test.ts` — Rewrite

- Mock `AxiosInstance` instead of `globalThis.fetch`
- Test relative path construction and `params` usage
- Test error propagation (Axios errors passed through directly)
- Remove auth-specific tests (Bearer token, getAccessToken)
- 9 tests (down from 12 — 3 auth tests removed)

### 4.4 Documentation Changes

#### Proposal 6: `docs/guide/getting-started.md`

- Plugin Registration example: import pre-configured Axios instance
- Complete Example: inline `axios.create()` with comment for interceptors

#### Proposal 7: `docs/guide/api-client.md`

- Built-in Helper section: new signature, Axios-based "How It Works"
- URL Patterns table: relative paths instead of `{baseUrl}` prefixed
- Custom Implementation: flipped to fetch-based example (since built-in now covers Axios)
- Error Contract: document both `error.statusCode` and `error.response.status`
- Tip block: updated for automatic Axios error support

#### Proposal 8: `docs/guide/configuration.md`

- Full Configuration Example: updated `createNativeChatApiClient` call

### 4.5 Planning Artifact Changes

#### Proposal 9: PRD

- FR3 reworded: "auth token" → "authenticated HTTP client (Axios instance with interceptors)"

#### Proposal 10: Architecture Document

- 5 edits: decision table, code block, auth description, build externals, implementation sequence

#### Proposal 11: Epics — Story 1.2 Update

- Acceptance criteria updated for `{ axiosInstance }` signature
- Architecture requirements line updated
- Covers note updated

#### Proposal 12: Epics — New Story 1.5

- Full acceptance criteria covering: source code, error backward compat, packaging, build, docs
- Added to Epic 1 with Correct Course changelog entry

### 4.6 Post-Implementation

- Regenerate `_bmad-output/project-knowledge/` documentation

---

## Section 5: Implementation Handoff

### Change Scope Classification: Minor

This change can be implemented directly by the development team. No backlog reorganization, scope changes, or architectural review needed.

### Handoff: Development Team

**Responsibilities:**

1. Implement all 12 proposals in order (source → config → tests → docs → planning artifacts)
2. Run `yarn test` to verify all 163+ existing tests pass + 9 new helper tests pass
3. Run `yarn build` to verify clean build with axios externalized
4. Run `yarn lint` to verify code style
5. Regenerate project-knowledge docs
6. Update `sprint-status.yaml` if applicable

### Success Criteria

- [ ] `createNativeChatApiClient({ axiosInstance })` works with a pre-configured Axios instance
- [ ] Auth token injection, refresh, and error handling delegated to Axios interceptors
- [ ] `useChat` error mapping works for both `error.statusCode` and `error.response.status`
- [ ] `axios` listed as optional peer dep, externalized in build, not bundled
- [ ] All existing tests pass (no regressions)
- [ ] New helper tests pass with Axios mocks
- [ ] Documentation reflects new API surface
- [ ] Planning artifacts (PRD, Architecture, Epics) updated
- [ ] `yarn build` output does not include axios in bundle

### Files Modified (Complete List)

| File | Action |
|------|--------|
| `src/helpers/createApiClient.ts` | Rewrite |
| `src/composables/useChat.ts` | Add extractStatusCode(), update 2 call sites |
| `package.json` | Add peer dep + dev dep |
| `vite.config.ts` | Add external |
| `src/helpers/__tests__/createApiClient.test.ts` | Rewrite |
| `docs/guide/getting-started.md` | Update 2 code blocks |
| `docs/guide/api-client.md` | Rewrite 3 sections |
| `docs/guide/configuration.md` | Update 1 code block |
| `_bmad-output/planning-artifacts/prd.md` | Reword FR3 |
| `_bmad-output/planning-artifacts/architecture.md` | Update 5 references |
| `_bmad-output/planning-artifacts/epics.md` | Update Story 1.2, add Story 1.5, update overview + Epic 1 notes |
| `_bmad-output/project-knowledge/*.md` | Regenerate (post-implementation) |
