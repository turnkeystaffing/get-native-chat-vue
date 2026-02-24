# Sprint Change Proposal — Scroll Behavior Rework

**Date:** 2026-02-23
**Author:** Volodymyr (via Correct Course workflow)
**Scope:** Minor — direct implementation by development team
**Validated by:** Multi-model consensus (Gemini 3 Pro 10/10, GPT-5.2 8/10)

---

## Section 1: Issue Summary

### Problem Statement

The chat widget's scroll behavior deviates from industry-standard AI chat UI patterns across three areas:

1. **No scroll-to-bottom on send:** When a user is scrolled to the middle of chat history and sends a message, the chat does NOT auto-scroll to the bottom. In ChatGPT, Claude, Gemini, and Copilot, sending always returns the user to the live conversation edge.

2. **Scroll position jumps on history load:** When loading older messages via infinite scroll, the scroll position jumps to random messages instead of preserving the user's current reading position. Root cause: the `scrollHeight`-diff technique in `handleLoadMore` is invalidated by Vuetify's `v-infinite-scroll` spinner DOM insertion/removal.

3. **No scroll-to-bottom affordance:** No button or control exists for users to quickly return to the most recent messages after browsing history. This is standard in all major AI chat products.

### Discovery Context

Reported by product owner (Volodymyr) during end-to-end testing of the completed widget (Epics 1-6 all stories done). The scroll behavior worked exactly as the original UX spec described — the spec itself was incorrect for AI assistant chat UIs.

### Evidence

- **User report:** "chat jumps to random messages" after history load; "doesn't scroll to newest messages" on send from middle
- **Code analysis:** `MessageList.vue:57-64` — single `isNearBottom` watcher gates all scroll behavior uniformly for sends, responses, and history loads
- **Code analysis:** `MessageList.vue:85-103` — `scrollHeight` diff adjustment is fragile against Vuetify spinner DOM changes
- **Industry consensus:** Gemini 3 Pro (10/10 confidence) and GPT-5.2 (8/10 confidence) unanimously confirm deviation from ChatGPT, Claude, Gemini, and Copilot scroll behavior across all 5 analyzed behaviors

---

## Section 2: Impact Analysis

### Epic Impact

| Epic | Status | Impact |
|------|--------|--------|
| Epic 1-5 | Done | No impact |
| Epic 6 | In-progress (all stories done) | Should be closed. No modifications needed. |
| **Epic 7 (new)** | Proposed | "Scroll Behavior Rework" — 3 new stories |

### Story Impact

**Existing stories (acceptance criteria corrections for documentation):**
- Story 2.2 (MessageList) — auto-scroll rules were correct per original spec, now spec is changing
- Story 2.4 (Send/Receive flow) — scroll-on-send was not required, now it is
- Story 3.1 (Infinite scroll) — scroll preservation technique needs rework

**New stories:**
- Story 7.1: Event-Driven Scroll Policy
- Story 7.2: Anchor-Based Scroll Preservation
- Story 7.3: Scroll-to-Bottom FAB Button

### Artifact Conflicts

| Artifact | Change Needed |
|----------|---------------|
| `prd.md` | Add FR28 (scroll on send/response), FR29 (scroll-to-bottom control) |
| `architecture.md` | Update MessageList component description |
| `ux-design-specification.md` | Rewrite auto-scroll rules, add scroll-to-bottom FAB, update scroll preservation description |
| `epics.md` | Add Epic 7 with 3 stories, update overview and FR coverage map |
| `sprint-status.yaml` | Close Epic 6, add Epic 7 with stories |

### Technical Impact

- **Primary file:** `MessageList.vue` — scroll watcher refactor, anchor-based preservation, new FAB element
- **Test file:** `MessageList.test.ts` — update existing scroll tests, add new ones
- **No composable changes:** `useChat.ts` is untouched — scroll is a view concern
- **No API changes:** No backend impact
- **No architectural changes:** Component hierarchy unchanged, CSS isolation patterns unchanged

---

## Section 3: Recommended Approach

### Selected Path: Direct Adjustment

Add Epic 7 with 3 focused stories that rework the scroll logic in `MessageList.vue` and add a scroll-to-bottom FAB.

### Rationale

- **Effort:** Low — scroll logic isolated in 1 file (~158 lines), no state management or API changes
- **Risk:** Low — view-layer-only changes, existing composable and component contracts unchanged
- **Timeline:** Minimal — no blocked dependencies, no epic resequencing needed
- **User impact:** High — scroll behavior is one of the most frequently-interacted-with aspects of a chat UI
- **Future-proofing:** The event-driven scroll policy (send vs. response vs. history) is the correct foundation for Phase 2 streaming support

### Alternatives Considered

| Option | Verdict | Why |
|--------|---------|-----|
| Direct Adjustment | **Selected** | Low effort, low risk, high impact |
| Rollback Stories 2.2/3.1 | Rejected | Would remove working functionality just to re-implement differently |
| MVP Scope Review | Not needed | MVP is functionally complete, this is a quality correction |

---

## Section 4: Detailed Change Proposals

### 4.1 UX Spec Changes (3 edits)

**Edit 1 — Auto-Scroll Rules (rewrite):**
- On user send: always scroll to bottom regardless of position
- On assistant response (MVP): always scroll to bottom
- On history prepend: never scroll to bottom, preserve position
- Near-bottom threshold (~50px): used for FAB visibility and Phase 2 streaming
- Scroll-to-bottom FAB: down-arrow button appears when scrolled up

**Edit 2 — MessageList Component Strategy (update):**
- Force-scrolls on send/response
- Anchor-based preservation on history prepend
- Scroll-to-bottom FAB: `v-btn` icon, `variant="elevated"`, `color="secondary"`, `size="small"`, opacity fade transition

**Edit 3 — Scroll Position Preservation (rewrite):**
- Replace scrollHeight-diff with anchor-based restoration (capture first visible element position, restore after render)
- CSS `overflow-anchor: auto` as baseline browser-native layer
- Robust against Vuetify spinner DOM changes, markdown reflow, variable-height content

### 4.2 Architecture Changes (1 edit)

**Edit 4 — MessageList Component Boundaries:**
- Add `isSending` to consumed state refs
- Document event-driven scroll policy (3 modes)
- Document scroll-to-bottom FAB
- Note `overflow-anchor: auto` CSS strategy

### 4.3 PRD Changes (1 edit)

**Edit 5 — New Functional Requirements:**
- FR28: Scroll to bottom on user send/assistant response regardless of position
- FR29: Scroll-to-bottom control when user has scrolled away from recent messages

### 4.4 Epics Changes (2 edits)

**Edit 6 — New Epic 7 with 3 stories:**

| Story | Goal | Key Technique |
|-------|------|---------------|
| 7.1 Event-Driven Scroll Policy | Force-scroll on send/response, suppress on history | Refactor message watcher to check message role/source |
| 7.2 Anchor-Based Scroll Preservation | Eliminate scroll jumps on history load | `getBoundingClientRect()` anchor + `overflow-anchor: auto` |
| 7.3 Scroll-to-Bottom FAB | One-click return from history browsing | `v-btn` icon with `v-show="!isNearBottom"` |

Dependencies: 7.2 and 7.3 depend on 7.1.

**Edit 7 — Overview, FR Coverage Map, Epic List:**
- Update overview text with Epic 7 addition note
- Add FR28, FR29 to coverage map
- Add Epic 7 summary to epic list

---

## Section 5: Implementation Handoff

### Scope Classification: Minor

Direct implementation by development team. No backlog reorganization or strategic replan needed.

### Handoff Plan

| Role | Responsibility |
|------|----------------|
| SM/PO (this workflow) | Apply all 7 edit proposals to planning artifacts, update sprint-status.yaml |
| Dev agent | Implement Stories 7.1 → 7.2 → 7.3 (in sequence) |

### Success Criteria

- [ ] Sending a message from any scroll position scrolls to the bottom
- [ ] Assistant response scrolls to the bottom
- [ ] Loading older messages via infinite scroll preserves exact reading position — no jumps
- [ ] Scroll-to-bottom FAB appears when scrolled up, disappears when at bottom
- [ ] All existing tests pass with updated assertions
- [ ] New tests cover force-scroll, anchor preservation, and FAB visibility
- [ ] `yarn test && yarn build` passes clean

### Deliverables

- Sprint Change Proposal document (this file)
- 7 artifact edit proposals (all approved)
- Epic 7 with 3 stories and full acceptance criteria
- Implementation handoff to development team
