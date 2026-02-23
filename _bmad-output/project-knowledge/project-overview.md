# Project Overview — native-chat-vue

> Generated: 2026-02-23 | Scan Level: Exhaustive | Mode: Full Rescan

## Purpose

native-chat-vue is a lightweight, embeddable AI chat widget built as a Vue 3 plugin. It provides a complete chat interface — floating action button, floating overlay panel, message list with infinite scroll, markdown rendering, and error recovery with retry — that integrates into any Vue 3 + Vuetify 3 application with minimal configuration.

The library is backend-agnostic: consumers provide an API client implementation (or use the included default) that handles conversation and message CRUD operations.

## Tech Stack Summary

| Category | Technology |
|----------|-----------|
| Language | TypeScript ^5.9 (strict) |
| Framework | Vue 3 ^3.5 + Vuetify 3 ^3.11 |
| Build | Vite 7 (library mode, ES module) |
| Testing | Vitest 4 (175+ unit/integration tests) + Playwright (perf benchmarks) |
| Docs | VitePress ^1.6 |
| Package Manager | Yarn 4 (Berry) |
| Dependencies | marked (markdown), DOMPurify (XSS sanitization) |

## Architecture

**Type:** Vue Plugin + Composable (single-part monolith library)

- **Plugin registration** via `app.use(NativeChatPlugin, { apiClient })` with `provide/inject`
- **State management** via `useChat()` composable — reactive refs, optimistic UI, error recovery with retry
- **API abstraction** via `NativeChatApiClient` interface — any backend, default fetch-based implementation included
- **UI rendering** via `Teleport to="body"` — floating panel independent of host app layout
- **CSS isolation** via `@layer native-chat` + scoped styles
- **Custom Vuetify theme** (`nativeChat`) merged non-destructively with host app theme
- **Animations** — panel open/close transitions, message bubble entrance animations, FAB icon rotation (all respect `prefers-reduced-motion`)

## Repository Structure

```
native-chat-vue/          Monolith library
├── src/                   Library source (8 components, 6 icons, 1 composable, 1 helper, types)
├── dist/                  Build output (ES module + CSS + .d.ts)
├── docs/                  VitePress documentation + interactive demos
├── perf/                  Playwright performance benchmarks
└── design/                UI reference screenshot
```

## Quick Reference

- **Entry Point:** `src/index.ts`
- **Primary Export:** `NativeChatPlugin` (Vue plugin) + `NativeChatWidget` (component)
- **Helper Export:** `createNativeChatApiClient` (default fetch-based API client)
- **Peer Dependencies:** `vue ^3.5.0`, `vuetify ^3.11.0`
- **Build Output:** `dist/native-chat-vue.es.js` + `dist/native-chat-vue.css`
- **Test Command:** `yarn test`
- **Build Command:** `yarn build`
- **Docs Dev:** `yarn docs:dev`

## Detailed Documentation

- [Architecture](./architecture.md) — Full architecture, patterns, component hierarchy, public API, accessibility, security
- [Source Tree Analysis](./source-tree-analysis.md) — Annotated directory tree, data flow diagrams, recent changes
- [Component Inventory](./component-inventory.md) — All components with props, behaviors, Vuetify dependencies, accessibility
- [Development Guide](./development-guide.md) — Setup, scripts, testing, linting, common tasks
