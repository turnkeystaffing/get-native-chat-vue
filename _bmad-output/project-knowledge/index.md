# Project Documentation Index — native-chat-vue

> Generated: 2026-02-21 | Scan Level: Exhaustive | Mode: Full Rescan

## Project Overview

- **Type:** Monolith library
- **Primary Language:** TypeScript ^5.9 (strict)
- **Framework:** Vue 3 ^3.5 + Vuetify 3 ^3.11
- **Architecture:** Vue Plugin + Composable (provide/inject, interface-based API client)
- **Build:** Vite 7 library mode → ES module + CSS + type declarations
- **Package Manager:** Yarn 4 (Berry)

## Quick Reference

- **Entry Point:** `src/index.ts`
- **Primary Exports:** `NativeChatPlugin` (Vue plugin), `NativeChatWidget` (component), `createNativeChatApiClient` (helper)
- **Peer Dependencies:** `vue ^3.5.0`, `vuetify ^3.11.0`
- **Build Output:** `dist/native-chat-vue.es.js` + `dist/native-chat-vue.css`
- **Test:** `yarn test` (210+ unit/integration tests)
- **Build:** `yarn build` (type-check + Vite library build)
- **Lint:** `yarn lint` (ESLint 10 + Prettier)

## Generated Documentation

- [Project Overview](./project-overview.md) — Purpose, tech stack summary, architecture overview
- [Architecture](./architecture.md) — Plugin pattern, composable state machine, API abstraction, component hierarchy, theming, public API, security
- [Source Tree Analysis](./source-tree-analysis.md) — Annotated directory tree, component hierarchy diagram, data flow
- [Component Inventory](./component-inventory.md) — All 8 components + 5 icons: props, behaviors, Vuetify dependencies, accessibility
- [Development Guide](./development-guide.md) — Prerequisites, scripts, build process, testing (Vitest + Playwright), linting, TypeScript config, common tasks

## Existing Documentation

- [Performance Benchmark](./performance/benchmark.md) — Scroll performance benchmark page (1000-message FPS test)

## Getting Started

```bash
# 1. Enable corepack (for Yarn 4)
corepack enable

# 2. Install dependencies
yarn install

# 3. Run tests
yarn test

# 4. Build the library
yarn build

# 5. Start docs site
yarn docs:dev
```

### Consumer Usage

```typescript
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import NativeChatPlugin, { createNativeChatApiClient } from 'native-chat-vue'
import 'native-chat-vue/style.css'

const apiClient = createNativeChatApiClient({
  baseUrl: 'https://your-api.com/chat',
  getAccessToken: () => 'your-token',
})

const app = createApp(App)
app.use(createVuetify())
app.use(NativeChatPlugin, { apiClient })
app.mount('#app')
```

Then in any template:
```vue
<NativeChatWidget />
```
