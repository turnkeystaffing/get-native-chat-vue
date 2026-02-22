# Sprint Change Proposal

**Project:** native-chat-vue
**Date:** 2026-02-22
**Author:** Volodymyr (via Correct Course workflow)
**Change Scope:** Minor — Direct implementation by dev team

---

## Section 1: Issue Summary

### Problem Statement

The chat widget's visual implementation diverges from the approved Figma design in two critical structural areas and several visual details. The root cause is the use of `v-navigation-drawer` — a Vuetify component designed for app navigation — as the container for a floating chat widget. Its internal scroll behavior (`.v-navigation-drawer__content` has `overflow-y: auto`) creates a competing scroll container that causes the input to scroll away with messages. Its edge-flush positioning model is fundamentally incompatible with the Figma's floating card design.

### Discovery Context

Identified during post-implementation design review after all 5 epics (13 stories) were completed. All functional requirements (FR1-FR27) work correctly — the issue is purely visual/layout. Multi-model consensus analysis (Gemini 3 Pro + GPT 5.2) independently confirmed the root cause and recommended the same architectural fix.

### Evidence

| Issue | Figma Design | Current Implementation |
|-------|-------------|----------------------|
| Panel positioning | Floating card with ~24px gaps from all edges | Flush against right/top/bottom edges |
| Panel corners | Rounded on ALL four sides (~20px) | Only top corners rounded |
| Panel shadow | Prominent drop shadow for depth | Vuetify drawer default (minimal) |
| Input behavior | Pinned at bottom, never scrolls | Scrolls away with message content |
| Scroll container | Only message area scrolls | Drawer content container also scrolls |
| Bubble padding | ~12-16px generous padding | 8px 12px (tighter) |
| Message gap | ~16-20px between messages | 14px |

---

## Section 2: Impact Analysis

### Epic Impact

- **Existing Epics 1-5:** No impact. All remain done and valid.
- **New Epic 6 required:** Figma Design Alignment (3 stories)

### Story Impact

No existing stories require changes. Three new stories:

| Story | Description |
|-------|-------------|
| 6.1 | Floating Panel Layout & Scroll Containment |
| 6.2 | Visual Polish & Figma Spacing |
| 6.3 | Update Planning Artifacts |

### Artifact Conflicts

| Artifact | Impact | Action |
|----------|--------|--------|
| PRD | No conflict — FRs already describe floating panel behavior | No change needed |
| Architecture | `v-navigation-drawer` referenced as ChatPanel component | Update ChatPanel description to Teleport + positioned div |
| UX Design Spec | Prescribes `v-navigation-drawer` for ChatPanel | Update Component Strategy section |
| project-context.md | Lists `v-navigation-drawer` as Vuetify dependency | Remove from ChatPanel's component list |
| epics.md | No Epic 6 | Add Epic 6 with full story definitions |
| sprint-status.yaml | No Epic 6 entries | Add Epic 6 + 3 stories |

### Technical Impact

- **ChatPanel.vue**: Structural replacement — `v-navigation-drawer` removed, replaced with `Teleport` + fixed-positioned div
- **MessageList.vue**: CSS-only — explicit scroll containment
- **MessageBubble.vue**: CSS-only — padding and spacing adjustments
- **ChatInput.vue**: Template-only — placeholder text update
- **WelcomeState.vue**: CSS-only — positioning adjustment
- **Tests**: ChatPanel.test.ts and SendReceiveFlow.test.ts need selector updates for new DOM structure
- **No changes** to: useChat composable, types, plugin.ts, keys.ts, helpers, icons, build config

---

## Section 3: Recommended Approach

### Selected Path: Direct Adjustment (New Epic 6)

Add Epic 6 to the existing plan with 3 stories implementing the Figma design alignment.

### Rationale

- **No existing work affected** — all 5 epics remain done
- **Purely additive** — new epic, new stories, CSS/layout changes only
- **Fixes critical UX bug** — input scrolling away is a usability-breaking issue
- **Endorsed by multi-model consensus** — Gemini 3 Pro (9/10 confidence) and GPT 5.2 (8/10 confidence) both recommend replacing `v-navigation-drawer` with positioned div as the cleaner, more maintainable approach
- **Improves long-term maintainability** — removes dependency on Vuetify drawer internals, eliminates `:deep()` CSS hacks
- **Business-critical** — widget cannot ship with visual design that doesn't match approved Figma

### Alternatives Considered

| Option | Verdict | Reason |
|--------|---------|--------|
| Heavy CSS overrides on v-navigation-drawer | Rejected | Fragile, breaks on Vuetify updates, requires `:deep()` hacks on internal DOM |
| Rollback and re-implement | Rejected | Destroys working functional code (210+ tests, all FRs met) to fix a visual issue |
| MVP scope reduction | Not needed | MVP scope is unchanged, this is a polish/fix pass |

### Effort Estimate: Medium

- Story 6.1 (structural fix): Primary effort — ChatPanel replacement + test updates
- Story 6.2 (visual polish): Light — CSS-only changes across 4 components
- Story 6.3 (doc updates): Light — reference updates in 4 planning artifacts

### Risk Assessment: Low-Medium

- **Main risk**: ChatPanel DOM structure change requires test updates
- **Mitigation**: Component logic (provide/inject, escape key, responsive detection) is preserved — only the outer wrapper changes
- **No risk to**: useChat composable, API client, message lifecycle, error handling, infinite scroll logic

---

## Section 4: Detailed Change Proposals

### 4.1 ChatPanel.vue — Replace v-navigation-drawer with floating panel

**OLD:**
```vue
<v-navigation-drawer v-model="drawerModel" location="right" temporary :scrim="false" :width="panelWidth" ...>
  <ChatHeader />
  <div class="nc-chat-panel__body">...</div>
  <ChatInput />
</v-navigation-drawer>
```

**NEW:**
```vue
<Teleport to="body">
  <div v-if="chatState.isOpen.value" class="nc-chat-panel" :class="{ 'nc-chat-panel--mobile': isMobile }">
    <ChatHeader />
    <div class="nc-chat-panel__body">...</div>
    <ChatInput />
  </div>
</Teleport>
```

**CSS changes:**
- `position: fixed; right: 24px; bottom: 24px; top: 24px; width: 420px`
- `border-radius: 20px` (all corners)
- `box-shadow: 0 8px 40px rgba(0,0,0,0.12)`
- `display: flex; flex-direction: column; overflow: hidden`
- `z-index: 10000`
- Mobile: `top:0; left:0; right:0; bottom:0; width:100%; border-radius:0; height:100dvh`

**Removals:**
- `drawerModel` computed proxy (no longer needed)
- All `v-navigation-drawer` props and Vuetify drawer imports

**Preserved:**
- Escape key handler (unchanged)
- Responsive breakpoint logic (unchanged)
- provide/inject (unchanged)
- All child component rendering logic (unchanged)

### 4.2 MessageList.vue — Explicit scroll containment

**CSS change only:**
```css
.nc-message-list-scroll {
  flex: 1;
  overflow-y: auto; /* explicit — sole scroll container */
}
```

### 4.3 MessageBubble.vue — Padding and spacing

**CSS changes:**
- `.nc-message-bubble__bubble` padding: `8px 12px` → `12px 16px`

### 4.4 MessageList.vue — Message gap

**CSS change:**
- `.nc-message-list` gap: `14px` → `16px`

### 4.5 ChatInput.vue — Placeholder text

**Template change:**
- `placeholder="Type a message"` → `placeholder="How can I help you? Ask me anything..."`
- `aria-label="Type a message"` → `aria-label="Type a message"` (keep aria-label concise)

### 4.6 WelcomeState.vue — Positioning

**CSS change:**
- `align-items: center` → `align-items: flex-start`
- Add `padding-top: 48px`

### 4.7 Planning artifact updates (Story 6.3)

- `architecture.md`: Update ChatPanel description, Vuetify components table
- `ux-design-specification.md`: Update Component Strategy > ChatPanel section
- `project-context.md`: Remove `v-navigation-drawer` from ChatPanel dependencies
- `epics.md`: Add Epic 6 with 3 story definitions

---

## Section 5: Implementation Handoff

### Change Scope: Minor

Direct implementation by the development team using the standard create-story workflow.

### Handoff Recipients

| Role | Responsibility |
|------|---------------|
| Development team | Execute Epic 6 stories (6.1 → 6.2 → 6.3) |
| SM (Scrum Master agent) | Create story files via create-story workflow |

### Implementation Order

1. **Story 6.1 first** — structural ChatPanel replacement + scroll fix + test updates (all other changes depend on panel structure being settled)
2. **Story 6.2 second** — visual polish across components (CSS-only, low risk)
3. **Story 6.3 third** — documentation updates (needs final implementation to document accurately)

### Success Criteria

- Chat panel floats with ~24px edge gaps on desktop, full-screen on mobile
- Input is ALWAYS pinned at the bottom — never scrolls with messages
- Only the message list area scrolls
- All four panel corners are rounded (20px) on desktop
- Panel has a prominent drop shadow
- Message bubble padding matches Figma (~12px 16px)
- `yarn test` passes with all updated tests
- `yarn build` completes without errors
- Planning artifacts accurately reflect the new ChatPanel architecture
