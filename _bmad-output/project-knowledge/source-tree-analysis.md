# Source Tree Analysis — native-chat-vue

## Annotated Directory Tree

```
native-chat-vue/
├── src/                           # Library source code
│   ├── index.ts                   # ★ ENTRY POINT — exports plugin, widget, API client, types
│   ├── plugin.ts                  # Vue plugin (install method, provide config, register component)
│   ├── keys.ts                    # Typed InjectionKeys (CONFIG_KEY, CHAT_STATE_KEY)
│   ├── styles.css                 # CSS @layer native-chat base isolation layer
│   │
│   ├── components/                # Vue single-file components
│   │   ├── NativeChatWidget.vue   # Root orchestrator: theme provider, useChat init, state provider
│   │   ├── ChatPanel.vue          # Navigation drawer: responsive layout, Escape close, child routing
│   │   ├── ChatHeader.vue         # Title bar: star icon + close button
│   │   ├── ChatInput.vue          # Message input: auto-grow textarea, Enter/Shift+Enter, focus mgmt
│   │   ├── MessageList.vue        # Message display: infinite scroll, auto-scroll, scroll preservation
│   │   ├── MessageBubble.vue      # Message rendering: user/assistant/error, markdown, copy-to-clipboard
│   │   ├── FloatingButton.vue     # FAB trigger: position config, toggle open/close, focus return
│   │   ├── WelcomeState.vue       # Empty state: configurable welcome message
│   │   └── __tests__/             # Component unit + integration tests (9 files)
│   │       ├── ChatHeader.test.ts         # 6 tests — rendering, close action
│   │       ├── ChatInput.test.ts          # 15 tests — send, keyboard, focus, retry
│   │       ├── ChatPanel.test.ts          # 16 tests — drawer, responsive, Escape, scrim
│   │       ├── FloatingButton.test.ts     # 11 tests — toggle, position, a11y
│   │       ├── MessageBubble.test.ts      # 22 tests — markdown, copy, error styling
│   │       ├── MessageList.test.ts        # 21 tests — scroll, infinite load, preservation
│   │       ├── NativeChatWidget.test.ts   # 9 tests — plugin, theme, provide/inject
│   │       ├── SendReceiveFlow.test.ts    # 24 tests — integration: full send/receive/error/retry
│   │       └── WelcomeState.test.ts       # 3 tests — default/custom message
│   │
│   ├── composables/               # Vue composition functions
│   │   ├── useChat.ts             # Core state machine: messages, open/close, send, loadMore, retry
│   │   └── __tests__/
│   │       └── useChat.test.ts    # 75+ tests — exhaustive composable coverage
│   │
│   ├── helpers/                   # Utility functions
│   │   ├── createApiClient.ts     # Default NativeChatApiClient via fetch + Bearer token
│   │   └── __tests__/
│   │       └── createApiClient.test.ts  # 13 tests — HTTP methods, auth, error handling
│   │
│   ├── icons/                     # Inline SVG icon components
│   │   ├── IconCheck.vue          # Checkmark (copy confirmation)
│   │   ├── IconClose.vue          # X mark (close button)
│   │   ├── IconCopy.vue           # Clipboard (copy action)
│   │   ├── IconSend.vue           # Arrow (send button)
│   │   └── IconStar.vue           # Star (branding, FAB, header)
│   │
│   ├── theme/                     # Vuetify theme configuration
│   │   └── nativeChatTheme.ts     # Custom color palette (primary, secondary, error, etc.)
│   │
│   └── types/                     # TypeScript type definitions
│       ├── index.ts               # Re-exports all types
│       ├── api.ts                 # NativeChatApiClient interface + response types
│       ├── chat.ts                # ChatMessage, MessageStatus, ChatError
│       ├── config.ts              # NativeChatPluginOptions
│       └── __tests__/
│           └── types.test.ts      # 11 tests — type shape verification
│
├── dist/                          # Build output (committed)
│   ├── native-chat-vue.es.js      # ES module bundle
│   ├── native-chat-vue.css        # Compiled CSS
│   └── types/                     # Generated .d.ts + .d.ts.map files (24 files)
│
├── docs/                          # VitePress documentation site
│   ├── index.md                   # Home page
│   ├── .vitepress/
│   │   └── config.ts              # VitePress configuration
│   └── performance/
│       └── benchmark.md           # Scroll performance benchmark page
│
├── perf/                          # Playwright performance tests
│   └── scroll-benchmark.spec.ts   # 1000-message scroll FPS benchmark (2 tests)
│
├── design/                        # Design assets
│   └── Screenshot 2026-02-19 164448.png  # UI reference screenshot
│
├── package.json                   # Package manifest (library distribution config)
├── tsconfig.json                  # TypeScript config (strict, ES2022, bundler resolution)
├── tsconfig.build.json            # Build-specific TS config (excludes tests)
├── vite.config.ts                 # Vite build config (library mode, vue + dts plugins)
├── vitest.config.ts               # Vitest config (jsdom, globals, Vuetify inline)
├── vitest.setup.ts                # Test setup (ResizeObserver polyfill, Vuetify global plugin)
├── playwright.config.ts           # Playwright config (chromium, perf test dir)
├── eslint.config.ts               # ESLint flat config (Vue + TS + Prettier)
└── yarn.lock                      # Yarn 4 lockfile
```

## Critical Folders Summary

| Folder | Purpose | Key Files |
|--------|---------|-----------|
| `src/` | All library source code | `index.ts` (entry), `plugin.ts` (Vue plugin) |
| `src/components/` | 8 Vue SFCs forming the chat widget UI | `NativeChatWidget.vue` (root) |
| `src/composables/` | Core business logic via Vue composition API | `useChat.ts` (state machine) |
| `src/helpers/` | Utility functions for consumers | `createApiClient.ts` (default API impl) |
| `src/types/` | TypeScript interfaces and type exports | `api.ts` (client contract) |
| `src/icons/` | 5 inline SVG icon components | Used throughout UI |
| `src/theme/` | Vuetify theme customization | `nativeChatTheme.ts` |
| `dist/` | Built library output (ES + CSS + types) | Distributed via npm |
| `docs/` | VitePress documentation site | `index.md` (home) |
| `perf/` | Performance benchmarks | `scroll-benchmark.spec.ts` |

## Component Hierarchy

```
NativeChatWidget (root)
├── FloatingButton          ← FAB trigger, toggles open/close
└── ChatPanel               ← VNavigationDrawer (right side)
    ├── ChatHeader          ← Title + close button
    ├── [Loading Spinner]   ← VProgressCircular (conditional)
    ├── [WelcomeState]      ← Empty state (conditional)
    ├── [MessageList]       ← When messages exist (conditional)
    │   └── MessageBubble   ← Repeated per message (v-for)
    └── ChatInput           ← Always visible at bottom
```

## Data Flow

```
Consumer App
  │
  ├── app.use(NativeChatPlugin, { apiClient, ... })
  │     └── provide(CONFIG_KEY, options)
  │     └── app.component('NativeChatWidget')
  │
  └── <NativeChatWidget />
        │
        ├── inject(CONFIG_KEY) → config
        ├── useChat(apiClient, config) → chatState
        ├── provide(CHAT_STATE_KEY, chatState)
        │
        └── All children inject(CHAT_STATE_KEY) for:
              ├── messages (readonly ref)
              ├── isOpen / isLoading / isSending (readonly refs)
              ├── open() / close()
              ├── sendMessage(text)
              ├── loadMore()
              └── retry()
```
