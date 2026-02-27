# Project Documentation Index — native-chat-vue

> Generated: 2026-02-25 | Scan Level: Exhaustive | Mode: Full Rescan

## Project Overview

- **Package:** `@turnkeystaffing/get-native-chat-vue` v1.0.1
- **Type:** Monolith library
- **Primary Language:** TypeScript ^5.9 (strict, ES2022)
- **Framework:** Vue 3 ^3.5 + Vuetify 3 ^3.11
- **Architecture:** Vue Plugin + Composable (provide/inject, interface-based API client)
- **Build:** Vite 7 library mode → ES module + CSS + type declarations
- **Package Manager:** Yarn 4 (Berry)
- **Registry:** GitHub Packages (npm.pkg.github.com)

## Quick Reference

- **Entry Point:** `src/index.ts`
- **Primary Exports:** `NativeChatPlugin` (Vue plugin), `NativeChatWidget` (component), `createNativeChatApiClient` (Axios adapter)
- **Type Exports:** `NativeChatApiClient`, `ConversationResponse`, `ConversationListResponse`, `MessageResponse`, `MessageHistoryResponse`, `SendMessageResponse`, `ChatMessage`, `MessageStatus`, `ChatError`, `NativeChatPluginOptions`
- **Peer Dependencies:** `vue ^3.5.0`, `vuetify ^3.11.0`, `axios ^1.0.0` (optional)
- **Runtime Dependencies:** `dompurify ^3.3.0`, `marked ^17.0.0`
- **Build Output:** `dist/get-native-chat-vue.es.js` + `dist/get-native-chat-vue.css` + `dist/types/`
- **Test:** `yarn test` (300+ unit/integration tests)
- **Build:** `yarn build` (type-check + Vite library build)
- **Lint:** `yarn lint` (ESLint 10 + Prettier)
- **Docs:** `yarn docs:dev` (VitePress dev server)
- **Perf:** `yarn perf` (Playwright scroll benchmarks)

## Generated Documentation

- [Project Overview](./project-overview.md) — Purpose, tech stack summary, architecture overview, quick reference
- [Architecture](./architecture.md) — Plugin pattern, composable state machine, API client abstraction, component hierarchy, DI flow, theming (14 tokens), CSS architecture, public API surface (3 exports + 10 types), 9 config options, accessibility, security
- [Source Tree Analysis](./source-tree-analysis.md) — Annotated directory tree (67 files), component hierarchy diagram, data flow, file statistics
- [Component Inventory](./component-inventory.md) — All 8 components + 7 icons: props, behaviors, Vuetify dependencies, accessibility, CSS classes
- [Development Guide](./development-guide.md) — Prerequisites, scripts, build process, publishing, testing (Vitest + Playwright), linting, TypeScript config, code conventions, common dev tasks

## Existing Documentation

- [VitePress Docs Site](../../docs/index.md) — Interactive documentation with live demos
  - [Getting Started](../../docs/guide/getting-started.md) — Installation and setup
  - [Configuration](../../docs/guide/configuration.md) — Plugin options reference
  - [API Client](../../docs/guide/api-client.md) — API client interface + custom implementations
  - [Widget Demo](../../docs/components/widget.md) — Full widget interactive demo
  - [Message Bubble Demo](../../docs/components/message-bubble.md) — Message rendering demo
  - [Chat Input Demo](../../docs/components/chat-input.md) — Input component demo
- [Performance Benchmark](../../docs/performance/benchmark.md) — Scroll performance benchmark page (1000-message FPS test)

## BMAD Planning Artifacts

- [PRD](../../_bmad-output/planning-artifacts/prd.md) — Product requirements document
- [Architecture (Planning)](../../_bmad-output/planning-artifacts/architecture.md) — Planning architecture document
- [Epics](../../_bmad-output/planning-artifacts/epics.md) — Epics and stories
- [UX Design Specification](../../_bmad-output/planning-artifacts/ux-design-specification.md) — UX design spec
- [Project Context](../../_bmad-output/project-context.md) — Project context

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
import axios from 'axios'
import NativeChatPlugin, { createNativeChatApiClient } from '@turnkeystaffing/get-native-chat-vue'
import '@turnkeystaffing/get-native-chat-vue/style.css'

const axiosInstance = axios.create({
  baseURL: 'https://your-api.com',
  headers: { Authorization: `Bearer ${token}` },
})

const apiClient = createNativeChatApiClient({ axiosInstance })

const app = createApp(App)
app.use(createVuetify())
app.use(NativeChatPlugin, { apiClient })
app.mount('#app')
```

Then in any template:
```vue
<NativeChatWidget />
```

## AI-Assisted Development

When planning new features or modifications to this library:

1. **Start with this index** — it links to all architectural context
2. **Architecture doc** — understand the plugin+composable+injection pattern before modifying
3. **Component inventory** — find reusable components and understand their contracts
4. **Development guide** — follow established patterns for testing, styling, and accessibility
5. **Source tree** — locate files and understand the data flow
