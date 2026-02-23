# Development Guide — native-chat-vue

> Generated: 2026-02-23 | Scan Level: Exhaustive | Mode: Full Rescan

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | ES2022-compatible (v18+) | Required by TypeScript target |
| Yarn | 4.12.0 (Berry) | Managed via corepack (`packageManager` field) |
| Corepack | Built into Node 16+ | Run `corepack enable` to activate |

## Installation

```bash
# Enable corepack (if not already)
corepack enable

# Install dependencies
yarn install
```

Yarn 4 is configured with `nodeLinker: node-modules` (`.yarnrc.yml`), so dependencies install into a standard `node_modules/` folder.

## Available Scripts

| Command | Description |
|---------|-------------|
| `yarn build` | Type-check (`vue-tsc --noEmit`) then build library via Vite |
| `yarn test` | Run all unit tests once (Vitest) |
| `yarn test:watch` | Run tests in watch mode |
| `yarn lint` | Check ESLint + Prettier formatting |
| `yarn lint:fix` | Auto-fix ESLint + Prettier issues |
| `yarn format` | Run Prettier write mode |
| `yarn typecheck` | TypeScript type checking only (`vue-tsc --noEmit`) |
| `yarn docs:dev` | Start VitePress dev server for documentation |
| `yarn docs:build` | Build VitePress static site |
| `yarn perf` | Run Playwright performance benchmarks |

## Build Process

The library is built using Vite in **library mode**:

1. **Type checking**: `vue-tsc --noEmit -p tsconfig.build.json` validates types (excludes tests)
2. **Vite build**: Produces:
   - `dist/native-chat-vue.es.js` — ES module bundle
   - `dist/native-chat-vue.css` — Compiled CSS (single file, no code splitting)
   - `dist/types/` — TypeScript declaration files (via `vite-plugin-dts`)

**Build configuration highlights** (`vite.config.ts`):
- Entry point: `src/index.ts`
- Format: ES module only (`formats: ['es']`)
- External dependencies: `vue` and `vuetify` are not bundled (peer deps, regex-matched)
- CSS: No code splitting (`cssCodeSplit: false`)
- Public directory: Disabled (`copyPublicDir: false`)
- Plugins: `@vitejs/plugin-vue` + `vite-plugin-dts` (type generation from `tsconfig.build.json`)

## Testing

### Unit Tests (Vitest)

```bash
yarn test          # Single run
yarn test:watch    # Watch mode
```

**Configuration** (`vitest.config.ts`):
- Environment: `jsdom`
- Globals: enabled (`describe`, `it`, `expect` without imports)
- Test pattern: `src/**/__tests__/**/*.test.ts`
- Setup file: `vitest.setup.ts`
  - Polyfills `ResizeObserver` for jsdom (required by Vuetify)
  - Registers global Vuetify instance with all components + directives

**Test coverage:** 175+ test cases across 12 files:

| Category | Files | Tests | Key Coverage Areas |
|----------|-------|-------|-------------------|
| Components | 9 | ~105 | Rendering, interactions, a11y, focus, animations |
| Composable | 1 | ~70 | State machine: open/close/send/loadMore/retry/error |
| Helper | 1 | ~12 | HTTP methods, auth headers, URL encoding, errors |
| Types | 1 | ~10 | Interface shape verification |

Notable integration coverage in `SendReceiveFlow.test.ts`: full send/receive/error/retry lifecycle across composable + component layers.

### Performance Tests (Playwright)

```bash
yarn perf
```

**Configuration** (`playwright.config.ts`):
- Browser: Chromium (headless)
- Test directory: `perf/`
- Timeout: 120 seconds
- Web server: Starts VitePress dev on port 5174

**Benchmarks** (`scroll-benchmark.spec.ts`):
- **Static scroll**: 1000 messages, measures FPS (target: >=30fps avg, no frame >50ms)
- **Infinite scroll**: Progressive load 20->1000 messages, measures scroll position preservation (<1px drift)

## Linting & Formatting

**ESLint** (`eslint.config.ts`):
- Flat config format (ESLint 10)
- Plugins: `eslint-plugin-vue` (flat/recommended) + `@vue/eslint-config-typescript` (recommended)
- Custom rules:
  - `vue/multi-word-component-names`: off (allows single-word component names)
  - `vue/one-component-per-file`: off in test files
- Prettier integration via `eslint-config-prettier`
- Ignores: `dist/`, `node_modules/`, `docs/.vitepress/dist|cache/`, `coverage/`, `_bmad/`, `_bmad-output/`, `.claude/`, `.yarn/`, `design/`

**Prettier** (`.prettierrc`):
- Single quotes, no semicolons, trailing commas (all), print width 100

## TypeScript Configuration

**Base** (`tsconfig.json`):
- Strict mode enabled
- Target: ES2022, Module: ESNext, Resolution: bundler
- Path alias: `@/*` -> `./src/*`
- Globals: `vitest/globals` types included
- Source maps and declaration maps enabled
- Includes: `src/**/*`, `src/**/*.vue`, `docs/**/*`, `*.config.ts`, `vitest.setup.ts`

**Build** (`tsconfig.build.json`):
- Extends base config
- Includes: `src/**/*`, `src/**/*.vue`
- Excludes: `__tests__/`, `docs/`, config files, test setup

## Environment & Configuration

- **No `.env` files** — The library has no runtime environment configuration
- **No CI/CD pipelines** — No `.github/workflows/`, Jenkinsfile, or similar
- **No Docker** — No containerization setup
- **No deployment config** — Library is distributed as an npm package via `dist/`

## Common Development Tasks

### Adding a new component

1. Create `src/components/NewComponent.vue` using `<script setup lang="ts">`
2. Inject `CHAT_STATE_KEY` if state access needed: `const chatState = inject(CHAT_STATE_KEY)!`
3. Use scoped styles within `@layer native-chat { ... }` for CSS isolation
4. Use Vuetify theme variables: `rgb(var(--v-theme-primary))`, etc.
5. Add to parent component's template
6. Create `src/components/__tests__/NewComponent.test.ts`
7. Export from `src/index.ts` if public API

### Adding a new icon

1. Create `src/icons/IconName.vue` as a simple SVG template component
2. Use `width="1em" height="1em" fill="currentColor"` for consistent sizing
3. Add `aria-hidden="true" focusable="false"` for a11y
4. Import in the component that uses it: `import IconName from '@/icons/IconName.vue'`
5. Pass to Vuetify `<v-icon :icon="IconName" />`

### Adding a new config option

1. Add the property to `NativeChatPluginOptions` in `src/types/config.ts`
2. Access via `inject(CONFIG_KEY)` in the consuming component
3. Add shape test in `src/types/__tests__/types.test.ts`
4. Document in `docs/guide/configuration.md`

### Modifying the API client interface

1. Update `NativeChatApiClient` in `src/types/api.ts`
2. Update default implementation in `src/helpers/createApiClient.ts`
3. Update `useChat.ts` if new methods are used
4. Update mock in `docs/.vitepress/mock/mockApiClient.ts`
5. Update tests in `createApiClient.test.ts` and `useChat.test.ts`

### Testing patterns

- **Component tests**: Mock `UseChatReturn` via `provide(CHAT_STATE_KEY, mockState)` and `provide(CONFIG_KEY, mockConfig)`
- **Composable tests**: Create real `useChat()` with mock `NativeChatApiClient`
- **Integration tests**: Full component tree with real composable for end-to-end flows
- **Teleport testing**: ChatPanel uses `<Teleport to="body">` — test with `document.body.innerHTML` assertions
- **Keyboard events**: Use `wrapper.trigger('keydown', { key: 'Enter' })`
- **Focus testing**: Spy on `HTMLElement.prototype.focus`
- **Animation testing**: Check CSS classes (`nc-message-bubble--animate-in`)

### Working with the docs site

1. Start dev server: `yarn docs:dev`
2. Edit pages in `docs/` (markdown + Vue components)
3. Demo components live in `docs/components/demos/`
4. Mock API client in `docs/.vitepress/mock/mockApiClient.ts` — provides canned data with simulated latency
5. CSS overrides for VitePress resets in `docs/.vitepress/theme/overrides.css`
6. Build static site: `yarn docs:build` (output: `docs/.vitepress/dist/`)
