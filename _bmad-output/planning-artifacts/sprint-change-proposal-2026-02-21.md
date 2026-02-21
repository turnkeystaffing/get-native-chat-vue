# Sprint Change Proposal

**Project:** native-chat-vue
**Date:** 2026-02-21
**Author:** Volodymyr (via Correct Course workflow)
**Change Scope:** Minor — Direct implementation by dev team

---

## Section 1: Issue Summary

### Problem Statement

VitePress consumer-facing documentation and interactive playground were planned in the Architecture document but never decomposed into an epic with stories. All 4 implementation epics (10 stories) are complete. The plugin is functionally ready but not shippable without developer-facing documentation.

### Discovery Context

Discovered post-implementation — all MVP functional requirements (FR1-FR27) are implemented and tested (210+ test cases). The Architecture document (project structure section) explicitly planned a `docs/` directory with guide pages, component demo pages, and a `DemoBlock.vue` wrapper. These were never turned into actionable stories.

### Evidence

- VitePress config has an empty sidebar (`sidebar: []`)
- Planned directories `docs/guide/` and `docs/components/` do not exist
- Planned `DemoBlock.vue` (source code + live preview wrapper) does not exist
- No mock API client exists for playground demos
- PRD Journey 3 (Developer Integration) states: "She installs the package and checks the docs" — docs don't exist
- BMAD-generated project knowledge docs occupy the `docs/` folder, creating a collision with VitePress consumer content (shared `index.md`)

---

## Section 2: Impact Analysis

### Epic Impact

- **Existing Epics 1-4:** No impact. All remain done and valid.
- **New Epic 5 required:** VitePress Documentation & Interactive Playground (3 stories)

### Story Impact

No existing stories require changes. Three new stories:

| Story | Description |
|-------|-------------|
| 5.1 | DemoBlock Component & Mock API Client |
| 5.2 | Guide Documentation Pages |
| 5.3 | Component Demo Pages & Landing Page |

### Artifact Conflicts

| Artifact | Impact | Action |
|----------|--------|--------|
| PRD | No conflict — Journey 3 already justifies docs | No change needed |
| Architecture | "Nice-to-Have" lists DemoBlock + mock as deferred | Reclassify as delivered via Epic 5 |
| UX Design | No documentation-specific content | No change needed |
| `docs/` folder | BMAD project knowledge collides with VitePress content | Relocate BMAD docs to `_bmad-output/project-knowledge/` |
| BMAD config | `project_knowledge` path points to `docs/` | Update to `_bmad-output/project-knowledge` |
| sprint-status.yaml | No Epic 5 entries | Add Epic 5 + 3 stories |
| epics.md | No Epic 5 definition | Add Epic 5 with full story definitions |

### Technical Impact

- No code changes to existing `src/` files
- No build configuration changes
- Purely additive: new files in `docs/`, new VitePress components, new mock API client
- `yarn docs:build` must pass as validation gate

---

## Section 3: Recommended Approach

### Selected Path: Direct Adjustment (New Epic)

Add Epic 5 to the existing plan with 3 stories implementing the documentation structure already outlined in the Architecture document.

### Rationale

- **No existing work affected** — all 4 epics remain done
- **Purely additive** — new epic, new stories, new files only
- **Low risk** — documentation cannot break existing functionality
- **Infrastructure exists** — VitePress is scaffolded, Vuetify registered in theme, `@/` alias resolves
- **Architecture already planned this** — directory structure and DemoBlock concept are documented
- **No timeline pressure** — implementation complete, docs are the remaining deliverable

### Effort Estimate: Medium

- DemoBlock.vue and mock API client require design decisions during implementation
- 3 guide pages + 3 component demo pages + landing page = significant content authoring
- VitePress config (sidebar, navigation) is straightforward

### Risk Assessment: Low

- No impact on existing 210+ tests
- No changes to plugin source code
- Documentation is the most reversible type of change

---

## Section 4: Detailed Change Proposals

### 4.1 File System: Relocate BMAD Project Knowledge

**Action:** Move BMAD-generated files from `docs/` to `_bmad-output/project-knowledge/`

Files to move:
- `docs/index.md` (BMAD project documentation index)
- `docs/architecture.md`
- `docs/component-inventory.md`
- `docs/development-guide.md`
- `docs/project-overview.md`
- `docs/source-tree-analysis.md`
- `docs/project-scan-report.json`

Files that stay in `docs/`:
- `docs/.vitepress/` (VitePress config and theme)
- `docs/performance/benchmark.md` (VitePress content)

### 4.2 Config: Update BMAD Project Knowledge Path

**File:** `_bmad/bmm/config.yaml`

```
OLD:
project_knowledge: "{project-root}/docs"

NEW:
project_knowledge: "{project-root}/_bmad-output/project-knowledge"
```

### 4.3 Epics: Add Epic 5 Definition

**File:** `_bmad-output/planning-artifacts/epics.md`

Add complete Epic 5 definition with 3 stories:
- **Story 5.1:** DemoBlock Component & Mock API Client — infrastructure for interactive docs
- **Story 5.2:** Guide Documentation Pages — getting-started, configuration, API client
- **Story 5.3:** Component Demo Pages & Landing Page — widget demo, component demos, VitePress landing page

Full story acceptance criteria included in the epics document update.

### 4.4 Epics: Update Overview and Coverage Map

**File:** `_bmad-output/planning-artifacts/epics.md`

- Add Epic 5 to the Epic List overview section
- Add change origin note to document overview
- Epic 5 supports FR1-FR4 delivery (Journey 3)

### 4.5 Architecture: Reclassify Nice-to-Have Items

**File:** `_bmad-output/planning-artifacts/architecture.md`

Move DemoBlock.vue and mock API client from "Nice-to-Have (post-MVP)" to "Resolved via Correct Course" with references to Epic 5, Story 5.1.

### 4.6 Sprint Status: Register Epic 5

**File:** `_bmad-output/implementation-artifacts/sprint-status.yaml`

Add:
```yaml
epic-5: backlog
5-1-demoblock-component-mock-api-client: backlog
5-2-guide-documentation-pages: backlog
5-3-component-demo-pages-landing-page: backlog
epic-5-retrospective: optional
```

---

## Section 5: Implementation Handoff

### Change Scope: Minor

Direct implementation by the development team using the standard create-story workflow.

### Handoff Recipients

| Role | Responsibility |
|------|---------------|
| Development team | Execute Epic 5 stories (5.1 → 5.2 → 5.3) |
| SM (Scrum Master agent) | Create story files via create-story workflow |

### Implementation Order

1. **First:** Apply file system changes (relocate BMAD docs, update config)
2. **Then:** Apply document updates (epics, architecture, sprint-status)
3. **Then:** Begin Epic 5 implementation:
   - Story 5.1 first (DemoBlock + mock — infrastructure for all demos)
   - Story 5.2 second (guide pages — foundational content)
   - Story 5.3 third (component demos + landing page — depends on 5.1 infrastructure)

### Success Criteria

- All 3 guide pages render correctly in VitePress
- All component demo pages show live interactive demos with source code
- `yarn docs:build` completes without errors
- Landing page provides clear entry point for developers
- Mock API client supports send/receive, history, and error simulation
- BMAD project knowledge docs are accessible at new path
- VitePress `docs/` folder contains only consumer-facing content
