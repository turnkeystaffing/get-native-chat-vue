# Development Guide — native-chat-vue

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

**Build configuration highlights:**
- Entry point: `src/index.ts`
- Format: ES module only
- External dependencies: `vue` and `vuetify` are not bundled (peer deps)
- CSS: No code splitting (`cssCodeSplit: false`)
- Public directory: Disabled (`copyPublicDir: false`)

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

**Test coverage:** 210+ test cases across 12 files:
- Component tests: 127 tests (mock provide/inject pattern)
- Composable tests: 75+ tests (exhaustive `useChat` coverage)
- Helper tests: 13 tests (API client HTTP methods)
- Type tests: 11 tests (interface shape verification)
- Integration: 24 tests (`SendReceiveFlow` — full composable + components)

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
- Static scroll: 1000 messages, measures FPS (target: ≥30fps, no frame >50ms)
- Infinite scroll: Progressive load 20→1000 messages, measures scroll position preservation (<1px drift)

## Linting & Formatting

**ESLint** (`eslint.config.ts`):
- Flat config format (ESLint 10)
- Plugins: `eslint-plugin-vue` (flat/recommended) + `@vue/eslint-config-typescript` (recommended)
- Custom rules:
  - `vue/multi-word-component-names`: off (allows single-word component names)
  - `vue/one-component-per-file`: off in test files
- Prettier integration via `eslint-config-prettier`
- Ignores: `dist/`, `node_modules/`, `docs/.vitepress/dist|cache/`, `coverage/`, `_bmad/`, `_bmad-output/`, `.claude/`, `.yarn/`, `design/`

**Prettier**: Standard configuration, check with `yarn lint`, fix with `yarn format`

## TypeScript Configuration

**Base** (`tsconfig.json`):
- Strict mode enabled
- Target: ES2022, Module: ESNext, Resolution: bundler
- Path alias: `@/*` → `./src/*`
- Globals: `vitest/globals` types included
- Source maps and declaration maps enabled

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
2. Inject `CHAT_STATE_KEY` if state access needed
3. Use scoped styles within `@layer native-chat { ... }`
4. Add to parent component's template
5. Create `src/components/__tests__/NewComponent.test.ts`
6. Export from `src/index.ts` if public API

### Adding a new type

1. Define in appropriate file under `src/types/`
2. Re-export from `src/types/index.ts`
3. Add to public exports in `src/index.ts` if consumer-facing
4. Add shape verification test in `src/types/__tests__/types.test.ts`

### Modifying the API client interface

1. Update `NativeChatApiClient` in `src/types/api.ts`
2. Update default implementation in `src/helpers/createApiClient.ts`
3. Update `useChat.ts` if new methods are used
4. Update tests in `createApiClient.test.ts` and `useChat.test.ts`

### Testing patterns

- **Component tests**: Mock `UseChatReturn` via `provide(CHAT_STATE_KEY, mockState)`
- **Composable tests**: Create real `useChat()` with mock `NativeChatApiClient`
- **Integration tests**: Use `VLayout` wrapper for Vuetify navigation drawer context
- **Keyboard events**: Use `wrapper.trigger('keydown', { key: 'Enter' })`
- **Focus testing**: Spy on `HTMLElement.prototype.focus`
