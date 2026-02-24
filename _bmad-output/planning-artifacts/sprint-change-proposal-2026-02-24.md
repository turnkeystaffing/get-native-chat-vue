# Sprint Change Proposal — 2026-02-24

**Project:** native-chat-vue
**Author:** Volodymyr (via Correct Course workflow)
**Date:** 2026-02-24
**Scope Classification:** Minor

---

## Section 1: Issue Summary

Several UI polish and build hygiene changes were implemented directly in the codebase after all 7 epics were marked done, without corresponding BMAD stories. This creates a gap between the planning artifacts and the actual implementation. The changes are desirable refinements — typography enforcement, input styling, header polish, a new theme token, and CSS import relocation — but need retroactive story documentation to maintain artifact accuracy.

**Discovery context:** Post-Epic 7 completion. Changes found in uncommitted working tree across 8 files.

**Evidence:** `git diff` showing modifications to `styles.css`, `overrides.css`, `nativeChatTheme.ts`, `ChatInput.vue`, `ChatHeader.vue`, `MessageBubble.vue`, `index.ts`, `plugin.ts`.

---

## Section 2: Impact Analysis

**Epic Impact:**
- **Epic 6 (Figma Design Alignment):** Extended with 3 new stories (6.12, 6.13, 6.14). Epic scope description already covers these changes ("visual styling", "polished message spacing", "enriched demo experience").
- **All other epics:** No impact.

**Story Impact:**
- No existing stories modified. 3 new stories added retroactively.

**Artifact Conflicts:**
- **PRD:** No conflicts. No FRs or NFRs changed.
- **Architecture:** Minor note — `!important` used in `styles.css` for font-family enforcement. This is an exception to the "no `!important`" rule, justified by the need to override Vuetify's inline font-family defaults within the `@layer native-chat` isolation layer.
- **UX Design Spec:** No conflicts. Open Sans and `#727272` hint color were already specified.
- **Project Context:** New `input-text` theme token should be noted.

**Technical Impact:**
- CSS import moved from `index.ts` to `plugin.ts` — prevents side effects on bare type/helper imports.
- No API, composable, or component contract changes.

---

## Section 3: Recommended Approach

**Selected path:** Direct Adjustment — add 3 retroactive stories to Epic 6.

**Rationale:**
- Changes are already implemented and working
- Scope is small (8 files, cosmetic + build hygiene)
- All changes align with existing Epic 6 goals
- No rollback or MVP review needed — all epics are done

**Effort:** Low
**Risk:** Low
**Timeline impact:** None — changes are already in the codebase

---

## Section 4: Detailed Change Proposals

### Story 6.12: Typography & Font Enforcement

As a user,
I want the chat widget to render all text in Open Sans consistently,
So that the widget matches the approved Figma design typography across all host apps.

**Acceptance Criteria:**

**Given** the chat panel is open
**When** inspecting any text element
**Then** the font-family is `'Open Sans', sans-serif` applied via `@layer native-chat` base styles
**And** `.nc-chat-panel` and `.nc-floating-button-wrapper` both inherit the font

**Given** the VitePress docs site is running
**When** the chat widget renders
**Then** Open Sans is loaded via Google Fonts import (weights 300-700)
**And** all widget text renders in Open Sans, not the VitePress default font

**Given** a message bubble (user or assistant)
**When** rendered
**Then** the font-size is explicitly `14px` (matching the UX spec type scale)

**Given** the chat input textarea
**When** the user types
**Then** the text renders in the inherited Open Sans font-family
**And** text color uses the `input-text` theme token (`#727272`)

**Given** the nativeChatTheme definition
**When** inspecting theme colors
**Then** `input-text: '#727272'` is defined for textarea text color

*Modifies: `styles.css` (font-family rule), `docs/.vitepress/theme/overrides.css` (Google Fonts import), `MessageBubble.vue` (font-size), `ChatInput.vue` (font-family inherit, color token), `nativeChatTheme.ts` (input-text token).*

*Added via Correct Course workflow (2026-02-24) to document typography changes made outside BMAD workflow.*

---

### Story 6.13: Input Field & Header Refinements

As a user,
I want the chat input to have a taller default size and refined border radius, and the header close button to have consistent hover behavior,
So that the input area feels more inviting and the header controls behave uniformly.

**Acceptance Criteria:**

**Given** the chat input field
**When** rendered with no text
**Then** the textarea displays 2 visible rows by default (increased from 1)
**And** the border-radius is 15px (custom, replacing Vuetify `rounded="lg"`)

**Given** the chat input textarea
**When** the user types long content
**Then** the textarea auto-grows up to 10 rows with no max-height CSS constraint

**Given** the close (X) button in the header
**When** inspecting its variant
**Then** the button uses `variant="text"` (changed from `variant="plain"`)
**And** hover produces a subtle background highlight instead of opacity-only change

**Given** the existing test suite
**When** running `yarn test`
**Then** all tests pass

*Modifies: `ChatInput.vue` (rows, border-radius, removed max-height), `ChatHeader.vue` (close button variant).*

*Added via Correct Course workflow (2026-02-24) to document input and header refinements made outside BMAD workflow.*

---

### Story 6.14: CSS Import Relocation to Plugin Install

As a developer,
I want the plugin's base CSS to load during plugin installation rather than on bare import,
So that consumers who import individual exports (types, helpers) don't trigger unwanted CSS side effects.

**Acceptance Criteria:**

**Given** a consumer imports only types or helpers from the package
**When** the import resolves
**Then** no CSS side effects are triggered (no `styles.css` loaded)

**Given** a consumer calls `app.use(NativeChatPlugin, options)`
**When** the plugin installs
**Then** `styles.css` is loaded as a side effect of `plugin.ts`
**And** the `@layer native-chat` base styles (including font-family) are applied

**Given** the package entry point `src/index.ts`
**When** inspecting its imports
**Then** it no longer contains `import './styles.css'`

**Given** `src/plugin.ts`
**When** inspecting its imports
**Then** it contains `import './styles.css'` as the first line

**Given** the existing test suite and build
**When** running `yarn test && yarn build`
**Then** all tests pass and the CSS is still included in the production bundle

*Modifies: `src/index.ts` (remove CSS import), `src/plugin.ts` (add CSS import).*

*Added via Correct Course workflow (2026-02-24) to document build hygiene change made outside BMAD workflow.*

---

## Section 5: Implementation Handoff

**Change scope:** Minor — direct implementation by dev team (already implemented).

**Action items:**
1. Add Stories 6.12, 6.13, 6.14 to `epics.md`
2. Update `sprint-status.yaml` with new stories (status: done)
3. Update Epic 6 overview description in `epics.md` to reference new stories
4. Optionally update `project-context.md` with `input-text` theme token note

**Success criteria:**
- `epics.md` contains all 3 new stories with full acceptance criteria
- `sprint-status.yaml` reflects the new stories as done
- Planning artifacts accurately reflect the current codebase state
