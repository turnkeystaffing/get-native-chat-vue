# Sprint Change Proposal

**Project:** native-chat-vue
**Date:** 2026-02-22
**Author:** Volodymyr (via Correct Course workflow)
**Change Scope:** Minor — Direct implementation by dev team

---

## Section 1: Issue Summary

### Problem Statement

After completing Epic 6 (stories 6.1-6.5 — Figma Design Alignment), a design review identified 13 additional visual/UX issues across the chat widget. These fall into four categories: chat input area doesn't match the ChatGPT/Claude desktop action-bar pattern, VitePress demo environment doesn't apply the Vuetify theme or isolate its own CSS, error messages are visually indistinguishable from assistant messages, and several header/panel UI elements need polish.

A critical root cause was identified: `ChatPanel` uses `<Teleport to="body">` which moves the panel DOM outside the `<v-theme-provider theme="nativeChat">` wrapper. CSS custom properties from the theme don't cascade to teleported content, causing the nativeChat theme colors to not apply (falling back to Vuetify defaults like `#1867C0` for primary instead of `#002B38`).

### Discovery Context

Identified during post-implementation design review after all 6 epics (18 stories) were completed. All functional requirements (FR1-FR27) work correctly — all issues are visual/layout/environment bugs.

### Evidence

| # | Issue | Category |
|---|-------|----------|
| 1 | Chat input not full-width | Input redesign |
| 2 | No action bar at bottom (send anchored bottom-right) | Input redesign |
| 3 | Send button has circle/filled background, should be plain icon-only | Input redesign |
| 4 | No loading spinner on send — icon should become spinner during sending | Input redesign |
| 5 | VitePress styles reset ul, li, etc. breaking markdown in chat demo | Demo environment |
| 6 | Vuetify nativeChat theme not applied — default colors showing (#1867C0) | Demo environment |
| 7 | Error messages visually identical to assistant messages | Messages |
| 8 | Floating trigger button shadow bleeds through open chat panel | Panel |
| 9 | Chat panel background color missing/transparent | Panel |
| 10 | Input textarea border radius too small (24px, should be pill-shaped) | Input redesign |
| 11 | Chat header missing border-bottom divider | Header |
| 12 | Close button too small | Header |
| 13 | Close button hover shows dark background, should use plain variant | Header |

**Root cause for #6, #8, #9:** `<Teleport to="body">` breaks CSS variable inheritance from `<v-theme-provider>`. The teleported panel doesn't receive nativeChat theme variables.

---

## Section 2: Impact Analysis

### Epic Impact

- **Existing Epics 1-6:** No impact. All remain done and valid.
- **Epic 6 extended:** 4 new stories (6.6-6.9) added to existing Epic 6 (Figma Design Alignment)

### Story Impact

No existing stories require changes. Four new stories:

| Story | Description | Issues Covered |
|-------|-------------|----------------|
| 6.6 | Chat Input Redesign | #1, #2, #3, #4, #10 |
| 6.7 | VitePress Demo Environment Fixes | #5, #6 (also fixes #8, #9) |
| 6.8 | Error Message Visual Distinction | #7 |
| 6.9 | Panel & Header UI Polish | #8, #11, #12, #13 |

### Artifact Conflicts

| Artifact | Impact | Action |
|----------|--------|--------|
| PRD | No conflict — all changes are refinements within existing FRs | No change needed |
| Architecture | Error rendering described as "same visual container as assistant" | Update error description to note subtle visual distinction |
| UX Design Spec | Error feedback says "no red backgrounds, no alert icons"; input described differently | Update input area description, error feedback pattern, close button styling |
| project-context.md | May need minor update for error styling convention | Minor update |
| epics.md | Needs stories 6.6-6.9 added to Epic 6 | Add 4 stories with full acceptance criteria |
| sprint-status.yaml | Needs new story entries | Add stories 6.6-6.9 |

### Technical Impact

| File | Change Type | Stories |
|------|-------------|---------|
| `ChatInput.vue` | Template + CSS restructure (action bar layout, plain send btn, spinner) | 6.6 |
| `ChatPanel.vue` | Template (add v-theme-provider inside Teleport) + CSS (list resets) | 6.7 |
| `MessageBubble.vue` | Template (error header) + CSS (error bubble styling, list resets) | 6.7, 6.8 |
| `ChatHeader.vue` | Template (close btn size/variant) + CSS (border-bottom) | 6.9 |
| `FloatingButton.vue` | Template (dynamic elevation) | 6.9 |
| `docs/.vitepress/theme/*` | Potentially CSS overrides for VitePress | 6.7 |

**No changes to:** useChat composable, types, plugin.ts, keys.ts, helpers, API client, NativeChatWidget.vue, build config

---

## Section 3: Recommended Approach

### Selected Path: Direct Adjustment (Extend Epic 6)

Add stories 6.6-6.9 to existing Epic 6 (Figma Design Alignment).

### Rationale

- **No existing work affected** — all 18 stories across 6 epics remain done
- **Purely additive** — new stories, CSS/template changes only
- **Critical theme bug** — Teleport breaking theme provider is a functional bug, not just cosmetic
- **Consistent with Epic 6 scope** — "layout, visual styling match the approved Figma design"
- **No architectural risk** — no composable, state, or API changes

### Alternatives Considered

| Option | Verdict | Reason |
|--------|---------|--------|
| New Epic 7 | Rejected | Same concern (design alignment), avoids epic proliferation |
| Rollback | Not applicable | All functional code works, only visual fixes needed |
| MVP scope reduction | Not applicable | MVP scope unchanged |

### Effort Estimate: Low-Medium

- Story 6.6 (input redesign): Medium — template restructure + CSS
- Story 6.7 (VitePress fixes): Low-Medium — theme provider fix + CSS resets
- Story 6.8 (error distinction): Low — CSS + small template change
- Story 6.9 (panel/header polish): Low — small CSS/template tweaks

### Risk Assessment: Low

- **Main risk:** ChatInput template restructure could affect existing tests
- **Mitigation:** Component behavior (send, keyboard, focus) unchanged — only layout changes
- **No risk to:** useChat composable, API client, message lifecycle, infinite scroll, animations

---

## Section 4: Detailed Change Proposals

### Story 6.6: Chat Input Redesign

**Files:** `ChatInput.vue`
**Issues:** #1, #2, #3, #4, #10

**Layout change:**
```
OLD:
[  textarea  ] [send-btn]    (side by side)

NEW:
[  textarea (full width, pill shape)  ]
                         [send-icon] ←  (action row, anchored right)
```

**Template changes:**
- Textarea: full width, bigger border radius (28px pill)
- New action row below textarea with send button anchored bottom-right
- Send button: `variant="plain"`, icon-only, visual feedback on hover only
- Loading state: when `isSending`, replace `<IconSend>` with `<v-progress-circular indeterminate size="18">`

**CSS changes:**
- `.nc-chat-input` — flex-direction: column
- New `.nc-chat-input__actions` — flex, justify-content: flex-end
- Textarea border-radius: 24px to 28px

**Behavior preserved:** Enter-to-send, Shift+Enter newline, auto-grow 1-6 rows, disabled during sending, focus management

### Story 6.7: VitePress Demo Environment Fixes

**Files:** `ChatPanel.vue`, `MessageBubble.vue`
**Issues:** #5, #6 (also fixes #8, #9)

**Fix #6 — Theme not applied (root cause fix):**

```vue
<!-- ChatPanel.vue — wrap teleported content in theme provider -->
<Teleport to="body">
  <v-theme-provider theme="nativeChat">
    <Transition name="nc-panel">
      <div v-if="chatState.isOpen.value" class="nc-chat-panel" ...>
```

This restores nativeChat CSS variables inside the teleported panel, fixing:
- Theme colors (primary `#002B38` instead of default `#1867C0`)
- Panel background color (`--v-theme-surface` resolves to `#FFFFFF`)
- Opaque background covers FAB shadow

**Fix #5 — VitePress style bleed:**

Defensive CSS resets in `MessageBubble.vue` and `ChatPanel.vue`:
```css
.nc-message-bubble__content :deep(ul),
.nc-message-bubble__content :deep(ol) {
  list-style: revert;
}
.nc-message-bubble__content :deep(li) {
  margin: 0;
  line-height: 1.4;
}
```

### Story 6.8: Error Message Visual Distinction

**Files:** `MessageBubble.vue`
**Issues:** #7

**Template:** Add error header with small warning icon + "Error" label (currently errors have no header)

**CSS:** Split error styling from assistant styling:
```css
.nc-message-bubble--error .nc-message-bubble__bubble {
  background: rgba(var(--v-theme-error), 0.06);
  border: 1px solid rgba(var(--v-theme-error), 0.2);
}
```

Subtle 6% opacity red tint — calm, not alarming. Maintains "errors are conversations, not crises" principle while providing clear visual distinction.

### Story 6.9: Panel & Header UI Polish

**Files:** `FloatingButton.vue`, `ChatHeader.vue`
**Issues:** #8, #11, #12, #13

| Change | File | Detail |
|--------|------|--------|
| FAB shadow (#8) | `FloatingButton.vue` | `:elevation="isOpen ? 0 : 4"` — remove shadow when panel open |
| Header border (#11) | `ChatHeader.vue` | Add `border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12)` |
| Close button size (#12) | `ChatHeader.vue` | `size="small"` to `size="default"`, icon `18` to `22` |
| Close button hover (#13) | `ChatHeader.vue` | `variant="text"` to `variant="plain"` — no hover background |

---

## Section 5: Implementation Handoff

### Change Scope: Minor

Direct implementation by the development team using the standard create-story workflow.

### Handoff Recipients

| Role | Responsibility |
|------|---------------|
| Development team | Execute stories 6.6 to 6.9 |
| SM (Scrum Master agent) | Create story files via create-story workflow |

### Implementation Order

1. **Story 6.7 first** — Theme provider fix is the root cause for multiple issues. Must land first so subsequent visual changes render correctly.
2. **Story 6.6 second** — Input area redesign (largest change)
3. **Story 6.8 third** — Error message distinction
4. **Story 6.9 fourth** — Panel & header polish (smallest, cleanup)

### Success Criteria

- nativeChat theme colors apply correctly in VitePress demo (primary `#002B38`, not `#1867C0`)
- VitePress global styles don't break markdown lists in chat bubbles
- Chat input: full-width textarea with action bar below, send button plain/icon-only
- Send button shows spinner during message sending
- Error messages visually distinguishable from assistant messages at a glance
- FAB shadow not visible when chat panel is open
- Header has subtle bottom border divider
- Close button is larger, no dark hover background
- `yarn test` passes
- `yarn build` completes without errors
