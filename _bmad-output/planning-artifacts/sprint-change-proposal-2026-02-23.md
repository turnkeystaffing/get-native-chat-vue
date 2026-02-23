# Sprint Change Proposal — 2026-02-23

**Project:** native-chat-vue
**Author:** Volodymyr (via Correct Course workflow)
**Date:** 2026-02-23
**Status:** Approved

---

## Section 1: Issue Summary

**Problem statement:** Six files were modified with UI polish and demo improvements outside the BMAD workflow after all Epic 6 stories (6.1–6.9) were completed. The planning artifacts no longer reflect the current implementation state and need to catch up.

**Context:** Changes were discovered during a Correct Course review. All modifications are additive refinements — no regressions, no architectural shifts, no scope expansion beyond Epic 6's existing mandate.

**Evidence:** Git diff across 6 files — `ChatInput.vue`, `ChatPanel.vue`, `MessageBubble.vue`, `nativeChatTheme.ts`, `mockApiClient.ts`, `docs/.vitepress/theme/index.ts`. Five MessageBubble tests fail due to selector changes from the copy button refactor.

---

## Section 2: Impact Analysis

### Epic Impact

- **Epic 6 (Figma Design Alignment):** Only affected epic. All changes are consistent with its scope. Two new stories (6.10, 6.11) added to document the work. No other epics impacted.

### Story Impact

- **No existing stories modified** — all 6.1–6.9 stories remain as-is.
- **Two new stories added:**
  - **Story 6.10 — UI Polish & Theme Refinements:** ChatInput solo variant, ChatPanel border/gaps/background, MessageBubble copy button Vuetify refactor, new theme tokens, test selector fixes.
  - **Story 6.11 — Demo Experience Enhancement:** 40 additional mock messages, simulated network latency, batchSize 5 for docs.

### Artifact Conflicts

- **PRD:** No conflicts. MVP scope unchanged.
- **Architecture:** No conflicts. Copy button refactor aligns better with the Vuetify components table.
- **UX Design Spec:** Minor updates needed — panel background color (#FFFFFF → #EBEBED), input styling (outlined pill → solo flat lg), edge gaps (25px/20px), new muted icon color token.
- **Project Context:** No updates needed.
- **Tests:** 5 MessageBubble tests need selector updates (`.nc-message-bubble__copy` → v-btn selector).

### Technical Impact

- No architectural changes.
- No new dependencies.
- No deployment or infrastructure implications.
- Test fixes are straightforward selector updates.

---

## Section 3: Recommended Approach

**Selected path:** Direct Adjustment — add new stories to Epic 6 and update affected artifacts.

**Rationale:**
- All changes fit within Epic 6's existing scope and intent
- The work is already implemented — this is purely a documentation sync
- No timeline, scope, or architectural disruption
- Effort is low (story documentation + test fixes + minor spec updates)
- Risk is low (changes are additive polish, not behavioral changes)

**Effort estimate:** Low
**Risk level:** Low
**Timeline impact:** None — implementation is complete, only artifacts need updating

---

## Section 4: Detailed Change Proposals

### Story Changes

#### NEW — Story 6.10: UI Polish & Theme Refinements

As a user, I want the chat panel, input field, and copy button to have refined visual styling, so that the widget feels more polished and visually cohesive.

**Acceptance Criteria:**

- Chat panel has `border-md` class, 25px right / 20px top and bottom edge gaps, `chat-background` (#EBEBED) background
- Chat input uses `variant="solo"` with `flat`, `rounded="lg"`
- Copy button uses Vuetify `<v-btn icon variant="text" size="small">` with `color="title"` / `color="success"`
- Custom `.nc-message-bubble__copy` CSS removed
- Theme adds `chat-background: #EBEBED`, `title: #9E9E9E`, `theme-overlay-multiplier: 1`
- All 5 failing MessageBubble tests fixed with updated selectors
- All tests pass

**Modifies:** `ChatInput.vue`, `ChatPanel.vue`, `MessageBubble.vue`, `nativeChatTheme.ts`, `MessageBubble.test.ts`

#### NEW — Story 6.11: Demo Experience Enhancement

As a developer browsing the docs site, I want the demo to have a rich conversation history with realistic loading behavior, so that I can experience infinite scroll and evaluate the plugin's performance with realistic data.

**Acceptance Criteria:**

- 40+ older mock messages (20 user/assistant pairs) covering Vue development topics
- Simulated 300ms–1s network latency on getMessages
- `batchSize: 5` in VitePress plugin config for frequent scroll triggers
- Older generated messages appear before hand-written messages in correct timestamp order
- All tests pass (docs-only changes)

**Modifies:** `docs/.vitepress/mock/mockApiClient.ts`, `docs/.vitepress/theme/index.ts`

### UX Design Spec Changes

| Section | Old | New |
|---------|-----|-----|
| Background & Surface > Chat Panel | `#FFFFFF` | `#EBEBED` (via `chat-background` token) |
| Semantic Colors (add) | — | Muted icons: `#9E9E9E` (via `title` token) |
| Input Area | Rounded (~50px pill) | Solo variant, flat, lg border-radius |
| Chat Panel Dimensions | ~24px gaps | 25px right, 20px top and bottom |

### Epics Document Changes

- Epic 6 overview description expanded to cover Stories 6.10–6.11
- Implementation notes paragraph updated with story summaries
- "Added via" traceability note extended with 2026-02-23 reference
- Full Story 6.10 and 6.11 text appended after Story 6.9

### Sprint Status Changes

- Add `6-10-ui-polish-theme-refinements: done`
- Add `6-11-demo-experience-enhancement: done`

---

## Section 5: Implementation Handoff

**Change scope:** Minor — direct implementation by development team.

**Actions required:**

1. Update `epics.md` with Stories 6.10 and 6.11 (full acceptance criteria)
2. Update `ux-design-specification.md` with color/styling changes
3. Update `sprint-status.yaml` with new story entries
4. Fix 5 failing MessageBubble tests (selector updates)
5. Commit all changes

**Handoff:** Development team (self-serve — all changes are documentation sync + test fixes)

**Success criteria:**
- All planning artifacts reflect current implementation
- All 203 tests pass (198 currently passing + 5 fixed)
- Epic 6 can be marked `done` after these updates
