---
project_name: 'native-chat-vue'
user_name: 'Volodymyr'
date: '2026-02-25'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 57
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Technology | Version | Role |
|---|---|---|
| Vue | ^3.5.0 | Peer dependency |
| Vuetify | ^3.11.0 | Peer dependency (UI components + theme) |
| TypeScript | ^5.9.0 | Strict mode, ES2022, bundler resolution |
| Vite | ^7.3.0 | Library mode build (ESM-only) |
| marked | ^17.0.0 | Runtime dep — markdown parsing |
| dompurify | ^3.3.0 | Runtime dep — HTML sanitization |
| Vitest | ^4.0.0 | Test runner (jsdom, globals) |
| @vue/test-utils | ^2.4.6 | Component mounting in tests |
| Prettier | ^3.8.0 | single quotes, no semi, trailing commas, 100 width |
| Playwright | ^1.58.2 | Performance benchmarking (`yarn perf`) |
| Yarn | 4.12.x | Package manager |

**Constraints:**
- No runtime dependencies beyond `marked` and `dompurify` — budget is <50KB gzipped
- ESM-only output — no CJS consumers
- Vue and Vuetify are externalized (never bundled)
- Axios externalized in rollup config (`/^axios/`) — optional peer dependency, never bundled

## Critical Implementation Rules

### TypeScript Rules

- **Strict mode enforced** — no `any`, no implicit nulls, no skipping property init
- **Always use `@/` alias** for imports — never relative paths (`./`, `../`)
- **Import order**: Vue core → third-party → `@/` project imports
- **Use `import type`** for type-only imports
- **Only `src/index.ts` exports publicly** — internal modules are not re-exported
- **`vitest/globals` in tsconfig** — no need to import `describe`, `it`, `vi`, `expect` in tests
- **Timer types**: `ReturnType<typeof setTimeout>` for timer IDs — never `number` or `NodeJS.Timeout`
- **`tsconfig.build.json`** excludes `__tests__/`, `docs/`, config files from declaration output

### Vue & Vuetify Rules

- **`<script setup lang="ts">` only** — no Options API, no `defineComponent()`
- **Props**: `defineProps<{ComponentName}Props>()` — typed interface, no runtime validators
- **Emits**: `defineEmits<T>()` — TypeScript generics only
- **State**: single `useChat()` composable → `provide/inject` — no Pinia/Vuex
- **Injection keys**: `Symbol`-based, typed with `InjectionKey<T>`, all in `src/keys.ts`
- **Readonly state**: all refs returned from `useChat()` wrapped in `readonly()` or `DeepReadonly`
- **No `reactive()`** for top-level state — use individual `ref()` values
- **Components never mutate state directly** — always call `useChat()` action functions
- **Vuetify components used directly** — never wrapped or re-exported
- **Colors via theme tokens only**: `rgb(var(--v-theme-primary))` — no hardcoded hex values
- **Theme**: `nativeChatTheme` registered lazily, merged with Vuetify light defaults
- **Responsive**: use Vuetify `useDisplay()` — no custom media query JS
- **Props with defaults**: `withDefaults(defineProps<Props>(), { ... })` — keeps type-only props while providing default values
- **Animations**: use Vue `<Transition>` for enter/leave, CSS `@keyframes` for element animations. Always include `@media (prefers-reduced-motion: reduce)` block to disable. Naming: `nc-{name}` prefix for transition names and keyframes

### Testing Rules

- **Co-located tests**: `__tests__/` folder next to source, `.test.ts` suffix (not `.spec.ts`)
- **Globals enabled**: `describe`, `it`, `expect`, `vi` available without imports
- **Mount helper per file**: `mount{ComponentName}()` encapsulates Vuetify + provide setup
- **Inject keys cast**: `{ [CHAT_STATE_KEY as symbol]: chatState }` — `as symbol` required in provide
- **Full mock state**: construct complete `UseChatReturn` with `readonly(ref(...))` + `vi.fn()` for actions
- **Mock API client**: use `createMockApiClient()` helper returning `vi.fn()` for each method
- **Async mocks**: `vi.fn().mockResolvedValue(...)` for API responses
- **Vuetify inlined**: `server.deps.inline: ['vuetify']` in vitest config — required for component rendering
- **Behavior-focused**: test what renders and what happens on interaction, not implementation

### Code Quality & Style Rules

- **Prettier**: single quotes, no semicolons, trailing commas, 100 char width
- **ESLint**: flat config, Vue recommended + TS recommended + Prettier override
- **Component files**: PascalCase — `FloatingButton.vue`
- **Icon files**: PascalCase with `Icon` prefix in `src/icons/` — `IconStar.vue`
- **Composable files**: camelCase with `use` prefix — `useChat.ts`
- **Type files**: camelCase — `api.ts`, `chat.ts`, `config.ts`
- **CSS classes**: BEM with `nc-` prefix — `nc-component__element--modifier`
- **Events**: kebab-case — `@load-more`
- **Booleans**: `is`/`has`/`should` prefix — `isOpen`, `hasMore`
- **Components flat**: all in `src/components/`, no nested subfolders
- **No external icon deps**: custom SVG icon components in `src/icons/`

### Development Workflow Rules

- **Commits**: `feat: {description} (Story X.Y)` — conventional commits with story reference
- **Primary dev**: `yarn docs:dev` — VitePress with live plugin preview
- **Build gates typecheck**: `vue-tsc --noEmit` must pass before `vite build` runs
- **Always run before PR**: `yarn lint && yarn test && yarn build`
- **Package manager**: Yarn 4.x — use `yarn` not `npm` or `pnpm`
- **Single CSS output**: `cssCodeSplit: false` — all styles in one file
- **Performance tests**: `yarn perf` runs Playwright benchmarks via `playwright.config.ts` — separate from unit tests
- **Docs structure**: VitePress docs in `docs/` with `guide/`, `components/`, `performance/` sections — `yarn docs:dev` for local preview, `yarn docs:build` for static output
- **Exports map**: `"."` for JS, `"./style.css"` for CSS — consumers must import CSS separately

### Critical Don't-Miss Rules

**Never do:**
- `reactive()` for top-level state — use `ref()`
- `<style>` without `scoped`
- Hardcoded color values — use Vuetify theme tokens
- String-based inject keys — use Symbols from `src/keys.ts`
- Direct API client calls from components — go through `useChat()` actions
- `defineComponent()` or Options API
- Add runtime `dependencies` beyond `marked` + `dompurify`
- Relative imports — always `@/` alias
- `!important` in CSS
- CSS animations without `prefers-reduced-motion: reduce` fallback

**CSS isolation (all four layers required):**
1. `@layer native-chat { ... }` wrapping all styles
2. `<style scoped>` on every component
3. `nc-` prefix on all custom CSS classes and transition/keyframe names
4. `<v-theme-provider theme="nativeChat">` at root

**Error handling:**
- Errors are `ChatMessage` objects (id: `error-*`), not separate UI
- Send failure: remove optimistic msg → error inline → `failedMessageText` repopulates input
- History failure: silent, user retries by scrolling

**Security:**
- Plugin never touches auth tokens — host app provides authenticated `apiClient`
- All `v-html` content sanitized via DOMPurify
- Only assistant messages rendered as markdown — user messages are plain text

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-02-25
