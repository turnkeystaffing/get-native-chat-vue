# Source Tree Analysis — native-chat-vue

> Generated: 2026-02-25 | Scan level: exhaustive | Mode: full_rescan

## Annotated Directory Tree

```
native-chat-vue/
├── src/                            # ★ LIBRARY SOURCE — all published code
│   ├── index.ts                    # ★ ENTRY POINT — barrel exports (plugin, widget, factory, types)
│   ├── plugin.ts                   # Vue plugin install (registers widget globally, provides config)
│   ├── keys.ts                     # Typed InjectionKeys (CONFIG_KEY, CHAT_STATE_KEY)
│   ├── styles.css                  # Base CSS layer declaration (@layer native-chat)
│   │
│   ├── types/                      # TypeScript type definitions (public API)
│   │   ├── index.ts                # Barrel re-exports all types
│   │   ├── api.ts                  # NativeChatApiClient interface + 5 API response types
│   │   ├── chat.ts                 # ChatMessage, MessageStatus, ChatError domain types
│   │   ├── config.ts               # NativeChatPluginOptions (9 config fields)
│   │   └── __tests__/
│   │       └── types.test.ts       # Compile-time type shape validation (11 tests)
│   │
│   ├── composables/                # Vue Composition API composables
│   │   ├── useChat.ts              # ★ CORE LOGIC — chat state, messaging, pagination, error handling (227 LOC)
│   │   └── __tests__/
│   │       └── useChat.test.ts     # Comprehensive composable tests (70+ tests)
│   │
│   ├── helpers/                    # Utility/factory functions
│   │   ├── createApiClient.ts      # Axios instance → NativeChatApiClient adapter factory (49 LOC)
│   │   └── __tests__/
│   │       └── createApiClient.test.ts  # Factory validation + URL encoding tests (12 tests)
│   │
│   ├── components/                 # Vue SFC components (8 files)
│   │   ├── NativeChatWidget.vue    # ★ ROOT — theme provider, useChat init, state provider (56 LOC)
│   │   ├── FloatingButton.vue      # FAB toggle: position config, icon transition, a11y (103 LOC)
│   │   ├── ChatPanel.vue           # Panel: Teleport to body, responsive, Escape key (160 LOC)
│   │   ├── ChatHeader.vue          # Header: avatar + title + close button (46 LOC)
│   │   ├── ChatInput.vue           # Input: auto-grow textarea, Enter to send, focus mgmt (133 LOC)
│   │   ├── MessageList.vue         # Feed: v-infinite-scroll, scroll-to-bottom FAB, animations (235 LOC)
│   │   ├── MessageBubble.vue       # Message: markdown+DOMPurify, copy, error variant (303 LOC)
│   │   ├── WelcomeState.vue        # Empty state: configurable welcome message (31 LOC)
│   │   └── __tests__/              # Component unit + integration tests
│   │       ├── NativeChatWidget.test.ts  # Plugin + widget composition (13 tests)
│   │       ├── FloatingButton.test.ts    # Toggle UX + positioning (17 tests)
│   │       ├── ChatPanel.test.ts         # Visibility + child rendering + Escape (15 tests)
│   │       ├── ChatHeader.test.ts        # Header layout + close action (10 tests)
│   │       ├── ChatInput.test.ts         # Input + send logic + focus mgmt (23 tests)
│   │       ├── MessageList.test.ts       # Infinite scroll + FAB + animation (36 tests)
│   │       ├── MessageBubble.test.ts     # Markdown + copy + error + config (35 tests)
│   │       ├── WelcomeState.test.ts      # Welcome message rendering (3 tests)
│   │       └── SendReceiveFlow.test.ts   # E2E integration: send→receive→error→retry (13 tests)
│   │
│   ├── icons/                      # Inline SVG icon components (currentColor, 1em sizing)
│   │   ├── IconArrowDown.vue       # Scroll-to-bottom FAB
│   │   ├── IconCheck.vue           # Copy confirmation
│   │   ├── IconClose.vue           # Close panel/FAB
│   │   ├── IconCopy.vue            # Copy message
│   │   ├── IconSend.vue            # Send button
│   │   ├── IconStar.vue            # Assistant avatar / branding
│   │   └── IconWarning.vue         # Error message indicator
│   │
│   └── theme/
│       └── nativeChatTheme.ts      # Vuetify ThemeDefinition (brand colors + custom tokens, 29 LOC)
│
├── docs/                           # VitePress documentation site
│   ├── index.md                    # Landing page (hero + 6 feature cards)
│   ├── guide/
│   │   ├── getting-started.md      # Install, register, SSR setup
│   │   ├── configuration.md        # Plugin options reference table
│   │   └── api-client.md           # NativeChatApiClient interface + custom impl guide
│   ├── components/
│   │   ├── widget.md               # Full widget demo (live + config toggles + error simulation)
│   │   ├── message-bubble.md       # Message variant showcase
│   │   ├── chat-input.md           # Input behavior demo
│   │   └── demos/                  # Interactive demo Vue components
│   │       ├── ChatInputDemo.vue
│   │       ├── MessageBubbleDemo.vue
│   │       ├── WidgetDemo.vue
│   │       ├── WidgetConfigDemo.vue
│   │       └── WidgetErrorDemo.vue
│   ├── performance/
│   │   └── benchmark.md            # Scroll benchmark page (PerfBenchmark component)
│   └── .vitepress/
│       ├── config.ts               # VitePress + Vuetify plugin config, nav/sidebar
│       ├── components/
│       │   ├── DemoBlock.vue       # Reusable code+preview container with source toggle
│       │   └── PerfBenchmark.vue   # FPS benchmark harness (1000 messages, drift tracking)
│       ├── mock/
│       │   ├── demoConfig.ts       # Demo plugin options (reactive)
│       │   └── mockApiClient.ts    # Simulated API (40 messages, latency, error modes)
│       ├── theme/
│       │   ├── index.ts            # Theme registration (Vuetify + NativeChat plugin)
│       │   ├── Layout.vue          # Custom VitePress layout wrapper
│       │   └── overrides.css       # VitePress style overrides
│       └── styles/
│           └── vuetify-settings.scss  # Vuetify SASS variable overrides
│
├── perf/                           # Playwright performance tests
│   └── scroll-benchmark.spec.ts    # 2 tests: static 1000-msg scroll + infinite scroll FPS benchmarks
│
├── package.json                    # @turnkeystaffing/get-native-chat-vue v1.0.1
├── vite.config.ts                  # Vite library build (ES only, externals: vue/vuetify/axios)
├── vitest.config.ts                # Vitest config (jsdom, globals, Vuetify inline deps)
├── vitest.setup.ts                 # Test setup (ResizeObserver polyfill, Vuetify global plugin)
├── tsconfig.json                   # Base TS config (ES2022, strict, bundler resolution, @/ paths)
├── tsconfig.build.json             # Build-only TS config (excludes tests/docs)
├── eslint.config.ts                # ESLint 10 flat config (vue-recommended + TS + Prettier)
├── playwright.config.ts            # Playwright config (chromium headless, VitePress dev :5174)
├── .prettierrc                     # Prettier (single quotes, no semi, trailing commas, 100 width)
├── .prettierignore                 # Prettier ignores (dist, node_modules, tooling dirs)
├── .gitignore                      # Git ignores (node_modules, dist, coverage, cache, Yarn PnP)
├── .yarnrc.yml                     # Yarn 4 (node-modules linker, GitHub Packages scope)
└── yarn.lock                       # Dependency lockfile
```

## Critical Folders

| Folder | Purpose | Key Files |
|--------|---------|-----------|
| `src/` | All library source code shipped to consumers | `index.ts` (entry), `plugin.ts` (Vue plugin) |
| `src/components/` | 8 Vue SFC components forming the chat widget UI | `NativeChatWidget.vue` (root), `MessageList.vue` (complex scroll) |
| `src/composables/` | Core business logic as Vue composable | `useChat.ts` — the heart of the library (227 LOC) |
| `src/types/` | TypeScript interfaces and public type exports | `api.ts` (NativeChatApiClient contract) |
| `src/helpers/` | Factory/adapter utilities | `createApiClient.ts` (Axios → API client adapter) |
| `src/icons/` | 7 inline SVG icon components | All use currentColor + 1em sizing |
| `src/theme/` | Vuetify theme definition | `nativeChatTheme.ts` (brand colors + custom tokens) |
| `docs/` | VitePress documentation site with live demos | `.vitepress/mock/` (simulated API) |
| `perf/` | Playwright performance benchmarks | `scroll-benchmark.spec.ts` |

## Entry Points

| Entry Point | Purpose | Build Output |
|-------------|---------|--------------|
| `src/index.ts` | Library entry — plugin + widget + factory + types | `dist/get-native-chat-vue.es.js` + `dist/types/` + `dist/get-native-chat-vue.css` |
| `docs/index.md` | Documentation site entry | VitePress static site |

## Component Hierarchy

```
NativeChatWidget (root, provides nativeChat theme + CHAT_STATE_KEY)
├── FloatingButton (FAB toggle, position config, icon transition)
└── ChatPanel (Teleport to body, responsive overlay, Escape key)
    ├── ChatHeader (avatar + "AI Assistant" title + close button)
    ├── v-progress-circular (loading state, conditional)
    ├── WelcomeState (empty state, conditional)
    ├── MessageList (v-infinite-scroll, scroll mgmt, animations)
    │   ├── MessageBubble × N (markdown, copy, error variant)
    │   │   └── Icons: IconStar, IconWarning, IconCopy, IconCheck
    │   └── IconArrowDown (scroll-to-bottom FAB)
    └── ChatInput (auto-grow textarea, Enter to send)
        └── IconSend / v-progress-circular
```

## Data Flow

```
Consumer App
  │
  ├── createNativeChatApiClient({ axiosInstance }) → NativeChatApiClient
  │     (Adapter: wraps Axios instance with domain-specific methods)
  │
  └── app.use(NativeChatPlugin, { apiClient, ...options })
        │
        ├── app.provide(CONFIG_KEY, options)
        └── app.component('NativeChatWidget', NativeChatWidget)
              │
              ├── inject(CONFIG_KEY) → config
              ├── useChat(apiClient, config) → UseChatReturn
              ├── provide(CHAT_STATE_KEY, chatState)
              │
              └── All children inject(CHAT_STATE_KEY) for:
                    ├── messages (DeepReadonly<Ref<ChatMessage[]>>)
                    ├── isOpen / isLoading / isSending / hasMore (Readonly<Ref<boolean>>)
                    ├── failedMessageText (Readonly<Ref<string | null>>)
                    ├── open()  → resolve conversation → fetch messages → isOpen=true
                    ├── close() → isOpen=false → focus returns to FloatingButton
                    ├── sendMessage(text) → optimistic UI → API → merge response or error
                    ├── loadMore() → paginated fetch → prepend → preserve scroll
                    └── retry() → resend failedMessageText
```

## File Statistics

| Category | Files | Approx. LOC |
|----------|-------|-------------|
| Core source (TS) | 10 | ~431 |
| Components (Vue SFC) | 8 | ~1,067 |
| Icons (Vue SVG) | 7 | ~98 |
| Unit/integration tests | 12 | ~2,200+ |
| Performance tests (Playwright) | 1 | ~60 |
| Documentation (MD + Vue + TS) | 18 | ~1,500+ |
| Config files | 11 | ~120 |
| **Total (excluding lockfile)** | **67** | **~5,476+** |
