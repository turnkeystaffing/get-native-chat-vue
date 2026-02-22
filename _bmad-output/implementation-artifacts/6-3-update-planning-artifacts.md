# Story 6.3: Update Planning Artifacts

Status: done

Epic: 6 — Figma Design Alignment
Date: 2026-02-22
Depends on: Story 6.1 (Floating Panel Layout & Scroll Containment) — done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a project maintainer,
I want the architecture, UX spec, and project context documents to reflect the ChatPanel architectural change,
so that future implementation work references accurate component descriptions.

## Acceptance Criteria

1. **Given** `architecture.md` **When** reading the ChatPanel component description and hierarchy diagram **Then** it describes `Teleport` + positioned div (not `v-navigation-drawer`) **And** the Vuetify components table for ChatPanel is updated

2. **Given** `ux-design-specification.md` **When** reading Component Strategy > ChatPanel **Then** it describes the floating panel approach with Teleport + positioned div **And** the Vuetify components table no longer lists `v-navigation-drawer` for the chat panel

3. **Given** `project-context.md` **When** reading the Vuetify components or Vue rules section **Then** `v-navigation-drawer` is not listed as a ChatPanel dependency

4. **Given** `epics.md` **When** reading the document **Then** Epic 6 with all 3 stories and full acceptance criteria is present

## Tasks / Subtasks

- [x] Task 1: Update `architecture.md` — remove all `v-navigation-drawer` references for ChatPanel (AC: #1)
  - [x] 1.1 Line 61: Remove `v-navigation-drawer` from the Vuetify components lock-in list, since ChatPanel no longer uses it
  - [x] 1.2 Line 321: Change "ChatPanel depends on Vuetify `v-navigation-drawer` + responsive breakpoint logic" to describe `Teleport` + positioned div + `useDisplay()` responsive breakpoint
  - [x] 1.3 Line 591: Update component hierarchy diagram — change `ChatPanel [v-navigation-drawer]` to `ChatPanel [Teleport + fixed div]`

- [x] Task 2: Update `ux-design-specification.md` — remove all `v-navigation-drawer` references for ChatPanel (AC: #2)
  - [x] 2.1 Line 215: Remove `v-navigation-drawer` from the Vuetify components list in "Implementation Approach"
  - [x] 2.2 Line 425: Update the design direction implementation approach — replace `v-navigation-drawer` with `Teleport` + positioned div
  - [x] 2.3 Line 583: Update the Vuetify components table — remove the `v-navigation-drawer` row, optionally add note that ChatPanel uses `Teleport` + CSS positioning instead
  - [x] 2.4 Line 597: Update the ChatPanel custom component description — replace `v-navigation-drawer` with `Teleport` + fixed-positioned div

- [x] Task 3: Verify `project-context.md` has no `v-navigation-drawer` reference (AC: #3)
  - [x] 3.1 Search `project-context.md` for any mention of `v-navigation-drawer` — **expected result: none found (already clean)**
  - [x] 3.2 If any references found, update them. If none found, no changes needed — AC is already satisfied.

- [x] Task 4: Verify `epics.md` has Epic 6 with all stories (AC: #4)
  - [x] 4.1 Confirm Epic 6 section exists with Stories 6.1, 6.2, 6.3 and full acceptance criteria — **expected result: already present (added by Correct Course workflow)**
  - [x] 4.2 If missing, add. If present, no changes needed — AC is already satisfied.

## Dev Notes

### Scope — Documentation Only (No Code Changes)

This story updates planning artifact markdown files to reflect the architectural change completed in Story 6.1. **There are no code changes, no test changes, and no build steps.** The dev agent modifies 2 markdown files in `_bmad-output/planning-artifacts/`.

**This is a documentation alignment story.** Do NOT modify any files under `src/`, `docs/`, or `dist/`. Do NOT run `yarn test`, `yarn build`, or `yarn lint` — no source code is changing.

### What Changed in Story 6.1

Story 6.1 replaced `v-navigation-drawer` (Vuetify component) with `Teleport` + a fixed-positioned `div` in `ChatPanel.vue`. The reasons:

1. `v-navigation-drawer` is designed for app navigation, not floating chat widgets
2. Its internal `.v-navigation-drawer__content` has `overflow-y: auto` creating a competing scroll container — causing the input to scroll away with messages
3. Its edge-flush positioning model cannot produce the floating card design with edge gaps from the Figma spec

The current ChatPanel.vue implementation (post Story 6.1):
- Uses `<Teleport to="body">` to render the panel as a direct child of `<body>`
- Uses a `<div>` with `position: fixed`, `right: 24px`, `top: 24px`, `bottom: 24px`, `width: 420px`
- Mobile: full-screen takeover with `100dvh`, no gaps, no border-radius
- CSS class: `.nc-chat-panel` with `.nc-chat-panel--mobile` modifier
- Escape key handler via `window.addEventListener('keydown', ...)` with lifecycle cleanup
- `v-if="chatState.isOpen.value"` for conditional rendering (replaces `v-model` binding)

### Exact Changes Guide

**File 1: `_bmad-output/planning-artifacts/architecture.md`**

3 edits needed:

**Edit 1 — Line 61 (Vuetify lock-in list):**
```
BEFORE: ...depends on Vuetify components (`v-infinite-scroll`, `v-navigation-drawer`, `v-textarea`, `v-btn`, `v-theme-provider`)...
AFTER:  ...depends on Vuetify components (`v-infinite-scroll`, `v-textarea`, `v-btn`, `v-theme-provider`)...
```
Remove `v-navigation-drawer` from the list. ChatPanel now uses native `Teleport` + CSS, not a Vuetify component.

**Edit 2 — Line 321 (Cross-Component Dependencies):**
```
BEFORE: - ChatPanel depends on Vuetify `v-navigation-drawer` + responsive breakpoint logic
AFTER:  - ChatPanel uses `Teleport` to body + CSS fixed positioning + Vuetify `useDisplay()` for responsive breakpoint logic
```

**Edit 3 — Line 591 (Component hierarchy diagram):**
```
BEFORE: │ │  ChatPanel            [v-navigation-drawer]││
AFTER:  │ │  ChatPanel            [Teleport + fixed div]││
```

**File 2: `_bmad-output/planning-artifacts/ux-design-specification.md`**

4 edits needed:

**Edit 1 — Line 215 (Implementation Approach — Vuetify component list):**
```
BEFORE: - Use only the Vuetify components needed for MVP: `v-btn`, `v-navigation-drawer`, `v-textarea`, `v-infinite-scroll`, `v-icon`, `v-theme-provider`, `v-progress-circular`
AFTER:  - Use only the Vuetify components needed for MVP: `v-btn`, `v-textarea`, `v-infinite-scroll`, `v-icon`, `v-theme-provider`, `v-progress-circular`
```

**Edit 2 — Line 425 (Design Direction — Implementation Approach):**
```
BEFORE: - Use `v-navigation-drawer` for the chat panel, `v-btn` for floating button and actions, `v-textarea` for input
AFTER:  - Use `Teleport` + CSS fixed positioning for the chat panel, `v-btn` for floating button and actions, `v-textarea` for input
```

**Edit 3 — Line 583 (Vuetify Components Table — `v-navigation-drawer` row):**
```
BEFORE: | `v-navigation-drawer` | Chat panel container | `location="right"`, `temporary`, custom width (~400px), border-radius (20px) |
AFTER:  (DELETE THIS ROW — ChatPanel no longer uses any Vuetify container component; it uses Teleport + CSS positioning instead)
```

**Edit 4 — Line 597 (ChatPanel Custom Component — Vuetify component reference):**
```
BEFORE: **Vuetify component:** `v-navigation-drawer` with `location="right"` and `temporary` prop
AFTER:  **Implementation:** `Teleport` to body + fixed-positioned div with CSS layout (no Vuetify container component)
```

**File 3: `_bmad-output/planning-artifacts/project-context.md`**

**No changes needed.** The file does not reference `v-navigation-drawer`. AC #3 is already satisfied.

**File 4: `_bmad-output/planning-artifacts/epics.md`**

**No changes needed.** Epic 6 with all 3 stories and full acceptance criteria was added by the Correct Course workflow on 2026-02-22. AC #4 is already satisfied.

### Project Structure Notes

**Files to MODIFY (2 files):**

| File | Nature of Change |
|------|-----------------|
| `_bmad-output/planning-artifacts/architecture.md` | **Text only** — 3 edits replacing `v-navigation-drawer` references |
| `_bmad-output/planning-artifacts/ux-design-specification.md` | **Text only** — 4 edits replacing `v-navigation-drawer` references |

**Files to VERIFY (no changes expected):**

| File | Verification |
|------|-------------|
| `_bmad-output/planning-artifacts/project-context.md` | No `v-navigation-drawer` references exist — confirm |
| `_bmad-output/planning-artifacts/epics.md` | Epic 6 with Stories 6.1-6.3 already present — confirm |

**Files that MUST NOT be modified:**

| File | Reason |
|------|--------|
| `src/**/*` | No source code changes in this story |
| `docs/**/*` | No documentation site changes |
| `dist/**/*` | No build output changes |
| `src/components/__tests__/*` | No test changes |
| `package.json` | No dependency changes |
| Any `.vue`, `.ts`, `.js` file | Documentation-only story |

### Library & Framework Requirements

**No new dependencies.** All changes are markdown text edits in planning artifact files.

### Testing Requirements

**No tests to run.** This is a documentation-only story. No source code is modified.

**Validation checklist:**
1. Search `architecture.md` for `v-navigation-drawer` — zero matches expected after edits
2. Search `ux-design-specification.md` for `v-navigation-drawer` — zero matches expected after edits
3. Search `project-context.md` for `v-navigation-drawer` — zero matches (already clean)
4. Confirm `epics.md` contains Epic 6 with Stories 6.1, 6.2, 6.3 — already present

### Previous Story Intelligence

**From Story 6.2 (Visual Polish & Figma Spacing):**
- 186 tests passing, build 29.29 kB gzip
- Commit convention: `feat: {description} (Story X.Y)`
- CSS-only changes, no test modifications

**From Story 6.1 (Floating Panel Layout & Scroll Containment):**
- This is the story that made the architectural change this story documents
- Replaced `v-navigation-drawer` with `Teleport` + fixed-positioned div
- Removed `v-navigation-drawer` props: `v-model`, `location`, `temporary`, `:scrim`, `:width`
- Added CSS classes: `.nc-chat-panel`, `.nc-chat-panel--mobile`
- Added `window.addEventListener('keydown', onEscapeKey)` with lifecycle cleanup
- Added `v-if="chatState.isOpen.value"` conditional rendering
- Mobile: full-screen takeover with `100dvh`, no gaps, `border-radius: 0`
- Desktop: `right: 24px`, `top: 24px`, `bottom: 24px`, `width: 420px`, `border-radius: 20px`
- Box shadow: `0 8px 40px rgba(0, 0, 0, 0.12)`
- 186 tests pass after changes

### Git Intelligence

Recent commits follow `feat: {description} (Story X.Y)` convention. This story's commit should be:
```
feat: update planning artifacts — remove v-navigation-drawer references (Story 6.3)
```

Last 5 commits:
- `f9e2a8a` feat: visual polish — figma spacing for bubbles, messages, input (Story 6.2)
- `1646091` feat: replace v-navigation-drawer with floating panel layout (Story 6.1)
- `0a28773` feat: add component demo pages and landing page features (Story 5.3)
- `0b82261` feat: add guide documentation pages for installation, configuration, and API client (Story 5.2)
- `90de7eb` feat: add DemoBlock component and mock API client for VitePress docs (Story 5.1)

### References

- [Source: epics.md#Story 6.3] — Acceptance criteria and file list
- [Source: epics.md#Story 6.1] — Original architectural change description
- [Source: architecture.md:61] — Vuetify lock-in list with `v-navigation-drawer`
- [Source: architecture.md:321] — Cross-component dependency referencing `v-navigation-drawer`
- [Source: architecture.md:591] — Component hierarchy diagram with `v-navigation-drawer`
- [Source: ux-design-specification.md:215] — Implementation Approach Vuetify component list
- [Source: ux-design-specification.md:425] — Design Direction implementation approach
- [Source: ux-design-specification.md:583] — Vuetify components table
- [Source: ux-design-specification.md:597] — ChatPanel custom component description
- [Source: src/components/ChatPanel.vue] — Current implementation (Teleport + fixed div)
- [Source: 6-1-floating-panel-layout-scroll-containment.md] — Story that performed the architectural change

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — documentation-only story, no debugging required.

### Completion Notes List

- **Task 1:** Removed all 3 `v-navigation-drawer` references from `architecture.md` — Vuetify lock-in list (line 61), cross-component dependencies (line 321), component hierarchy diagram (line 591). All replaced with `Teleport` + fixed div / CSS positioning descriptions.
- **Task 2:** Removed all 4 `v-navigation-drawer` references from `ux-design-specification.md` — implementation approach list (line 215), design direction (line 425), Vuetify components table row deleted (line 583), ChatPanel custom component description updated (line 597).
- **Task 3:** Verified `project-context.md` has zero `v-navigation-drawer` references — already clean, no changes needed.
- **Task 4:** Verified `epics.md` contains Epic 6 with Stories 6.1, 6.2, 6.3 and full acceptance criteria — already present from Correct Course workflow.
- **Validation:** Ran grep searches confirming zero `v-navigation-drawer` matches in both modified files.

### File List

| File | Action |
|------|--------|
| `_bmad-output/planning-artifacts/architecture.md` | Modified — 3 edits removing `v-navigation-drawer` references |
| `_bmad-output/planning-artifacts/ux-design-specification.md` | Modified — 4 edits removing `v-navigation-drawer` references |
| `_bmad-output/planning-artifacts/project-context.md` | Verified — no changes needed (already clean) |
| `_bmad-output/planning-artifacts/epics.md` | Verified — no changes needed (Epic 6 already present) |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | Modified — updated `6-3-update-planning-artifacts` status from `backlog` to `review` |

### Change Log

- **2026-02-22:** Updated planning artifacts to reflect ChatPanel architectural change from Story 6.1. Removed all `v-navigation-drawer` references from `architecture.md` (3 edits) and `ux-design-specification.md` (4 edits), replacing with `Teleport` + CSS fixed positioning descriptions. Verified `project-context.md` and `epics.md` already aligned.

## Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.6
**Date:** 2026-02-22
**Outcome:** Approved with fixes applied

### Findings (4 total: 0 Critical, 1 Medium, 3 Low)

| # | Severity | Issue | Resolution |
|---|----------|-------|------------|
| 1 | MEDIUM | sprint-status.yaml modified but not documented in File List | Fixed — added to File List |
| 2 | LOW | ASCII diagram alignment broken in architecture.md (ChatPanel line 1 char too wide) | Fixed — adjusted spacing |
| 3 | LOW | Stale `v-navigation-drawer` reference in implementation-readiness-report-2026-02-20.md:200 | Fixed — updated to `Teleport` + CSS |
| 4 | LOW | Epic statuses 1-5 show "in-progress" when all stories are done | Fixed — updated to "done" |

### AC Verification

All 4 Acceptance Criteria verified as IMPLEMENTED. Zero `v-navigation-drawer` references remain in architecture.md, ux-design-specification.md, or project-context.md. Epic 6 confirmed present in epics.md with full story details.

### Review Fixes Applied

- Added sprint-status.yaml to story File List
- Fixed architecture.md diagram alignment (line 591 spacing)
- Updated implementation-readiness-report-2026-02-20.md line 200
- Updated sprint-status.yaml epic-1 through epic-5 to "done"
- Story status updated to "done"
