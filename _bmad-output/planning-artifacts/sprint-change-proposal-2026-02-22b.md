# Sprint Change Proposal — Animation & Transition Restoration

**Date:** 2026-02-22
**Triggered by:** Changes made outside BMAD workflow after Epic 6 completion
**Scope Classification:** Minor
**Recommended Path:** Direct Adjustment (extend Epic 6)

---

## Section 1: Issue Summary

Story 6.1 replaced Vuetify's `v-navigation-drawer` with `Teleport` + positioned div for the chat panel. This removed the built-in drawer slide transitions, leaving the panel appearing and disappearing without animation. Additionally, message bubbles had no entrance animation, and the floating button showed the same star icon regardless of panel state.

Changes were implemented directly in code — adding Vue `<Transition>` wrappers, CSS keyframe animations, and a watcher-based animation tracking system — but the planning artifacts were not updated to reflect these additions.

**Evidence:**
- 6 files changed (+262/-27 lines) across ChatPanel, FloatingButton, MessageBubble, MessageList, and associated tests
- All changes are CSS animations + a single boolean prop — no architectural pattern violations
- `prefers-reduced-motion: reduce` respected in all animations

## Section 2: Impact Analysis

### Epic Impact
- **Epic 6 (Figma Design Alignment):** Scope extended with 2 new stories (6.4, 6.5). Epic description updated to include motion design. Epic remains DONE — code is already implemented and tested.
- **Epics 1-5:** No impact.
- **No new epics needed.**

### Story Impact
| Story | Status | Action |
|---|---|---|
| Story 6.4: Chat Panel & FAB Transitions | New (already implemented) | Add to epics.md, mark done in sprint-status |
| Story 6.5: Message Bubble Entrance Animations | New (already implemented) | Add to epics.md, mark done in sprint-status |

### Artifact Conflicts
| Artifact | Impact | Action |
|---|---|---|
| `epics.md` | Missing stories 6.4, 6.5 | Add stories with full acceptance criteria |
| `architecture.md` | Component descriptions outdated | Update FloatingButton, ChatPanel, MessageBubble, MessageList descriptions |
| `ux-design-specification.md` | Transition timing, icon swap, entrance animations undocumented | Update design implications, interaction patterns, component strategy sections |
| `project-context.md` | No animation conventions documented | Add animation rules, reduced-motion requirement |
| `sprint-status.yaml` | Missing story entries | Add 6-4 and 6-5 as done |

### Technical Impact
- No code changes needed — implementation is complete
- No architectural pattern violations — Vue `<Transition>`, CSS `@keyframes`, and `prefers-reduced-motion` are standard patterns
- Bundle size impact: negligible (CSS-only animations, no new dependencies)

## Section 3: Recommended Approach

**Selected: Direct Adjustment** — Modify/add stories within existing Epic 6.

**Rationale:**
- Changes are small, self-contained, and already implemented with tests
- They directly relate to Epic 6's purpose (Figma design alignment / visual polish)
- No architectural decisions were violated
- The only work is documenting what was done in planning artifacts

**Effort:** Low — document updates only
**Risk:** Low — no code changes, no behavioral shifts
**Timeline impact:** None — implementation is complete

**Alternatives considered:**
- New Epic 7: Rejected — too heavyweight for 2 small stories that fit naturally in Epic 6
- Rollback: Not applicable — these are improvements

## Section 4: Detailed Change Proposals

### 4.1 Epics (epics.md)
- Update Epic 6 description to include "smooth transitions"
- Add Story 6.4: Chat Panel & FAB Transitions (full acceptance criteria)
- Add Story 6.5: Message Bubble Entrance Animations (full acceptance criteria)

### 4.2 Architecture (architecture.md)
- Update cross-component dependencies (Transition usage, animation tracking)
- Update component boundary diagram labels
- Update FloatingButton, MessageBubble, MessageList descriptions

### 4.3 UX Design Specification (ux-design-specification.md)
- Update "Design Implications" transition description
- Expand "Panel Toggle" interaction pattern with transition details
- Update FloatingButton component (icon swap behavior)
- Update ChatPanel component (Transition implementation)
- Add entrance animation to MessageBubble component
- Add animation tracking to MessageList component

### 4.4 Project Context (project-context.md)
- Add animation convention rule (Vue Transition, CSS keyframes, nc- prefix)
- Add "never do" rule for animations without reduced-motion fallback
- Update CSS isolation note for transition/keyframe naming

### 4.5 Sprint Status (sprint-status.yaml)
- Add `6-4-chat-panel-fab-transitions: done`
- Add `6-5-message-bubble-entrance-animations: done`

## Section 5: Implementation Handoff

**Scope:** Minor — direct implementation (document updates only)

**Handoff:** Self-contained — all edits can be applied in a single session.

**Responsibilities:**
- Apply all 5 artifact updates as approved in Step 3
- Verify no inconsistencies introduced

**Success criteria:**
- All planning artifacts accurately reflect the current implementation
- Future agents reading these documents will understand animation patterns and conventions
- No orphaned stories or undocumented behaviors remain
