---
title: 'API Version Prefix'
slug: 'api-version-prefix'
created: '2026-02-27'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['TypeScript', 'Axios', 'Vitest']
files_to_modify: ['src/helpers/createApiClient.ts', 'src/helpers/__tests__/createApiClient.test.ts', 'docs/guide/api-client.md', 'README.md', '_bmad-output/project-knowledge/index.md']
code_patterns: ['String literal paths in client methods', 'Thin Axios wrapper — consumer owns baseURL']
test_patterns: ['Vitest + mocked AxiosInstance', 'vi.fn() with toHaveBeenCalledWith on exact path strings']
---

# Tech-Spec: API Version Prefix

**Created:** 2026-02-27

## Overview

### Problem Statement

API client endpoints hit `/conversations` directly — the backend now expects versioned paths under `api/v1/`.

### Solution

Hardcode `api/v1` prefix on all four endpoint paths in `createNativeChatApiClient`.

### Scope

**In Scope:**
- Prefix all 4 endpoint paths in `createApiClient.ts` with `/api/v1`
- Update existing tests to reflect new paths
- Update documentation (`docs/guide/api-client.md`, `README.md`) with new paths
- Update `_bmad-output/project-knowledge/index.md` baseURL example
- Bump version (breaking change)

**Out of Scope:**
- Configurable version prefix
- Backward compatibility shims

## Context for Development

### Codebase Patterns

- API client is a thin wrapper around an Axios instance passed by the consumer
- All paths are string literals in the client methods (no path-building utility)
- Consumer controls `baseURL` on the Axios instance; this prefix is additive
- `encodeURIComponent` used on dynamic path segments (`conversationId`)
- Mock client in `docs/.vitepress/mock/mockApiClient.ts` implements `NativeChatApiClient` directly with canned data — no real URLs, unaffected by this change

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/helpers/createApiClient.ts` | API client — 4 endpoints with string literal paths |
| `src/helpers/__tests__/createApiClient.test.ts` | 6 `toHaveBeenCalledWith` assertions on exact path strings |
| `src/types/api.ts` | Type definitions — no changes needed |
| `docs/.vitepress/mock/mockApiClient.ts` | Demo mock — no changes needed |
| `docs/guide/api-client.md` | API client guide — path table (lines 137-140), description (line 126), fetch examples (lines 151-171) |
| `README.md` | Quick-start — URL patterns table (lines 159-162), fetch examples (lines 123-131) |
| `_bmad-output/project-knowledge/index.md` | AI agent context — `baseURL` example (line 86) |

### Technical Decisions

- Clean cut — no backward compat, no config option. Just prefix the paths.
- No `API_PREFIX` constant — scope is too small to justify abstraction.

## Implementation Plan

### Tasks

- [x] Task 1: Prefix all endpoint paths in `createApiClient.ts`
  - File: `src/helpers/createApiClient.ts`
  - Action: Change all 4 path string literals from `/conversations...` to `/api/v1/conversations...`
  - Specific changes:
    - Line 22: `'/conversations'` → `'/api/v1/conversations'` (createConversation — POST)
    - Line 31: `'/conversations'` → `'/api/v1/conversations'` (getConversations — GET)
    - Line 46: `` `/conversations/${encodeURIComponent(conversationId)}/messages` `` → `` `/api/v1/conversations/${encodeURIComponent(conversationId)}/messages` `` (getMessages — GET)
    - Line 64: `` `/conversations/${encodeURIComponent(conversationId)}/messages` `` → `` `/api/v1/conversations/${encodeURIComponent(conversationId)}/messages` `` (sendMessage — POST)

- [x] Task 2: Update test assertions to match new paths
  - File: `src/helpers/__tests__/createApiClient.test.ts`
  - Action: Update all 6 `toHaveBeenCalledWith` assertions to expect `/api/v1/conversations...`
  - Specific changes:
    - Line 51: `'/conversations'` → `'/api/v1/conversations'`
    - Line 70: `'/conversations'` → `'/api/v1/conversations'`
    - Line 97: `'/conversations/conv-42/messages'` → `'/api/v1/conversations/conv-42/messages'`
    - Line 134: `'/conversations/abc%2Fdef%20123/messages'` → `'/api/v1/conversations/abc%2Fdef%20123/messages'`
    - Line 155: `'/conversations/conv-1/messages'` → `'/api/v1/conversations/conv-1/messages'`
    - Line 190: `'/conversations/abc%2Fdef%20123/messages'` → `'/api/v1/conversations/abc%2Fdef%20123/messages'`

- [x] Task 3: Update documentation paths in `docs/guide/api-client.md`
  - File: `docs/guide/api-client.md`
  - Action: Update all path references from `/conversations...` to `/api/v1/conversations...`
  - Specific changes:
    - Line 126: Update description to reference `/api/v1/conversations` paths
    - Lines 137-140: Update URL Patterns table — all 4 rows get `/api/v1` prefix
    - Lines 151, 157, 164, 171: Update fetch examples from `/api/conversations...` to `/api/v1/conversations...`

- [x] Task 4: Update documentation paths in `README.md`
  - File: `README.md`
  - Action: Update all path references from `/conversations...` to `/api/v1/conversations...`
  - Specific changes:
    - Lines 123, 125, 128, 131: Update fetch examples to use `/api/v1/conversations...`
    - Lines 159-162: Update URL Patterns table — all 4 rows get `/api/v1` prefix

- [x] Task 5: Update `baseURL` example in project knowledge
  - File: `_bmad-output/project-knowledge/index.md`
  - Action: Update line 86 from `baseURL: 'https://your-api.com/chat'` to `baseURL: 'https://your-api.com'` and add a note that the client now includes `/api/v1` in its paths

- [x] Task 6: Bump version (breaking change)
  - Action: Update `package.json` version with a minor or major bump per project convention, reflecting the breaking path change

- [x] Task 7: Run tests to verify
  - Action: `yarn test src/helpers/__tests__/createApiClient.test.ts`
  - Expected: All 9 tests pass with new path assertions

### Acceptance Criteria

- [x] AC 1: Given the API client is created, when `createConversation()` is called, then the POST request is sent to `/api/v1/conversations`
- [x] AC 2: Given the API client is created, when `getConversations(0, 20)` is called, then the GET request is sent to `/api/v1/conversations`
- [x] AC 3: Given the API client is created, when `getMessages('conv-42', 0, 20)` is called, then the GET request is sent to `/api/v1/conversations/conv-42/messages`
- [x] AC 4: Given the API client is created, when `sendMessage('conv-1', 'hello')` is called, then the POST request is sent to `/api/v1/conversations/conv-1/messages`
- [x] AC 5: Given a conversationId with special characters (`abc/def 123`), when `getMessages` or `sendMessage` is called, then the path correctly encodes to `/api/v1/conversations/abc%2Fdef%20123/messages`
- [x] AC 6: Given the API client, when any method encounters an Axios error, then the error propagates unchanged (covered by existing tests — no new code needed)
- [x] AC 7: Given `docs/guide/api-client.md`, when reviewed, then all path references and fetch examples use `/api/v1/conversations...`
- [x] AC 8: Given `README.md`, when reviewed, then all path references and fetch examples use `/api/v1/conversations...`
- [x] AC 9: Given `_bmad-output/project-knowledge/index.md`, when reviewed, then the `baseURL` example does not include `/api/v1` (since the client now adds it)

## Additional Context

### Dependencies

None — pure path string change. No new packages, no API contract changes beyond path prefix.

### Testing Strategy

- **Unit tests**: Update existing 6 path assertions in `createApiClient.test.ts` — all 9 existing tests must pass
- **No new tests needed**: Existing test coverage already validates all 4 methods, encoding, and error propagation
- **Docs review**: Manual scan of `docs/guide/api-client.md`, `README.md`, and `_bmad-output/project-knowledge/index.md` to confirm no stale path references remain

### Notes

- **Breaking change** — consumers who already set `baseURL` to include `/api/v1` will need to remove it to avoid double-prefixing. Version bump required.
- Mock client in docs is unaffected (implements interface directly, no URL construction)
- Built docs in `docs/.vitepress/dist/` will be regenerated on next `yarn docs:build` — no manual changes needed to dist files

## Review Notes

- Adversarial review completed
- Findings: 12 total, 7 fixed, 5 skipped (1 skipped by choice, 4 low severity)
- Resolution approach: walk-through
- Fixed: stale build artifact (F1), stale project-knowledge/architecture.md (F2), stale planning artifacts (F3), missing encodeURIComponent in README (F4), missing baseURL guidance in docs (F6), incorrect "relative paths" wording (F7)
- Skipped: CHANGELOG/migration guide (F5), tech-spec note omission (F8), table formatting (F9), configurable prefix design (F10), getting-started/configuration clarification (F11), placeholder domain inconsistency (F12)
