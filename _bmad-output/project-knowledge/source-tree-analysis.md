# Source Tree Analysis — native-chat-vue

> Generated: 2026-02-23 | Scan Level: Exhaustive | Mode: Full Rescan

## Annotated Directory Tree

```
native-chat-vue/
├── src/                           # Library source code
│   ├── index.ts                   # ★ ENTRY POINT — exports plugin, widget, API client, types
│   ├── plugin.ts                  # Vue plugin (install method, provide config, register component)
│   ├── keys.ts                    # Typed InjectionKeys (CONFIG_KEY, CHAT_STATE_KEY)
│   ├── styles.css                 # CSS @layer native-chat base isolation layer
│   │
│   ├── components/                # Vue single-file components (8 SFCs)
│   │   ├── NativeChatWidget.vue   # Root orchestrator: theme provider, useChat init, state provider
│   │   ├── ChatPanel.vue          # Floating panel: Teleport to body, responsive, Escape close, transitions
│   │   ├── ChatHeader.vue         # Title bar: star icon + "AI Assistant" title + close button + divider
│   │   ├── ChatInput.vue          # Message input: auto-grow textarea, inline send/spinner, Enter/Shift+Enter
│   │   ├── MessageList.vue        # Message display: v-infinite-scroll, auto-scroll, scroll preservation, animations
│   │   ├── MessageBubble.vue      # Message rendering: user/assistant/error, markdown+DOMPurify, copy, animations
│   │   ├── FloatingButton.vue     # FAB trigger: position config, toggle, hideToggleWhenOpen, icon transition
│   │   ├── WelcomeState.vue       # Empty state: configurable welcome message
│   │   └── __tests__/             # Component unit + integration tests (9 files, 175+ test cases)
│   │       ├── ChatHeader.test.ts         # 8 tests — rendering, close action, aria, sizing
│   │       ├── ChatInput.test.ts          # 23 tests — send, keyboard, focus, spinner, retry text
│   │       ├── ChatPanel.test.ts          # 13 tests — panel, responsive, Escape, welcome, focus
│   │       ├── FloatingButton.test.ts     # 17 tests — toggle, position, a11y, hideToggleWhenOpen
│   │       ├── MessageBubble.test.ts      # 32 tests — markdown, copy, error styling, warning icon, animations
│   │       ├── MessageList.test.ts        # 34 tests — scroll, infinite load, preservation, animation tracking
│   │       ├── NativeChatWidget.test.ts   # 11 tests — plugin, theme, provide/inject
│   │       ├── SendReceiveFlow.test.ts    # 18 tests — integration: send/receive/error/retry flow
│   │       └── WelcomeState.test.ts       # 3 tests — default/custom message
│   │
│   ├── composables/               # Vue composition functions
│   │   ├── useChat.ts             # Core state machine: messages, open/close, send, loadMore, retry, error handling
│   │   └── __tests__/
│   │       └── useChat.test.ts    # 70+ tests — exhaustive composable coverage
│   │
│   ├── helpers/                   # Utility functions
│   │   ├── createApiClient.ts     # Default NativeChatApiClient via fetch + Bearer token
│   │   └── __tests__/
│   │       └── createApiClient.test.ts  # 12 tests — HTTP methods, auth, URL encoding, errors
│   │
│   ├── icons/                     # Inline SVG icon components (6 icons)
│   │   ├── IconCheck.vue          # Checkmark (copy confirmation feedback)
│   │   ├── IconClose.vue          # X mark (close button, FAB close state)
│   │   ├── IconCopy.vue           # Clipboard (copy action on assistant messages)
│   │   ├── IconSend.vue           # Arrow (send button in ChatInput)
│   │   ├── IconStar.vue           # Star (branding: FAB, header, assistant bubble)
│   │   └── IconWarning.vue        # ▲ Triangle warning (error message indicator) [NEW]
│   │
│   ├── theme/                     # Vuetify theme configuration
│   │   └── nativeChatTheme.ts     # Custom color palette: primary=#002B38, secondary=#C4105B, etc.
│   │
│   └── types/                     # TypeScript type definitions (public API)
│       ├── index.ts               # Barrel re-exports all types
│       ├── api.ts                 # NativeChatApiClient interface + 5 response types
│       ├── chat.ts                # ChatMessage, MessageStatus, ChatError
│       ├── config.ts              # NativeChatPluginOptions (incl. hideToggleWhenOpen) [UPDATED]
│       └── __tests__/
│           └── types.test.ts      # 10 tests — type shape verification
│
├── docs/                          # VitePress documentation site
│   ├── index.md                   # Home page with feature highlights
│   ├── guide/
│   │   ├── getting-started.md     # Installation and setup
│   │   ├── configuration.md       # Plugin options reference
│   │   └── api-client.md          # API client usage and custom implementations
│   ├── components/
│   │   ├── widget.md              # Full widget demo + docs
│   │   ├── chat-input.md          # Chat input demo + docs
│   │   ├── message-bubble.md      # Message bubble demo + docs
│   │   └── demos/                 # Interactive demo components
│   │       ├── ChatInputDemo.vue
│   │       ├── MessageBubbleDemo.vue
│   │       ├── WidgetDemo.vue
│   │       └── WidgetErrorDemo.vue
│   ├── performance/
│   │   └── benchmark.md           # Scroll performance benchmark page (1000-message FPS test)
│   └── .vitepress/
│       ├── config.ts              # VitePress config: nav, sidebar, Vuetify plugin, path aliases
│       ├── theme/
│       │   ├── index.ts           # Custom theme: Vuetify + NativeChatPlugin with mock client
│       │   ├── Layout.vue         # Custom layout wrapper
│       │   └── overrides.css      # CSS overrides for VitePress resets (list styles, padding)
│       ├── mock/
│       │   └── mockApiClient.ts   # Mock API client with 50+ canned messages + error simulation
│       ├── styles/
│       │   └── vuetify-settings.scss  # Vuetify SCSS customization
│       └── components/
│           ├── DemoBlock.vue      # Reusable demo wrapper component
│           └── PerfBenchmark.vue  # Performance benchmark Vue component
│
├── perf/                          # Playwright performance tests
│   └── scroll-benchmark.spec.ts   # 2 tests: static 1000-msg scroll + infinite scroll benchmarks
│
├── design/                        # Design assets
│   └── Screenshot *.png           # UI reference screenshot (Figma)
│
├── package.json                   # Package manifest (library mode: main, module, exports, types)
├── tsconfig.json                  # TypeScript config (strict, ES2022, bundler resolution, @/ paths)
├── tsconfig.build.json            # Build TS config (extends base, excludes tests + docs)
├── vite.config.ts                 # Vite build config (library mode, vue + dts plugins, external vue/vuetify)
├── vitest.config.ts               # Vitest config (jsdom env, globals, Vuetify inline deps)
├── vitest.setup.ts                # Test setup (ResizeObserver polyfill, Vuetify global plugin)
├── playwright.config.ts           # Playwright config (chromium headless, docs dev server on :5174)
├── eslint.config.ts               # ESLint 10 flat config (Vue + TS recommended + Prettier)
├── .prettierrc                    # Prettier configuration
├── .prettierignore                # Prettier ignore patterns
├── .yarnrc.yml                    # Yarn 4 Berry configuration
├── .gitignore                     # Git ignore (node_modules, dist, coverage, cache)
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
| `src/icons/` | 6 inline SVG icon components | Used throughout UI |
| `src/theme/` | Vuetify theme customization | `nativeChatTheme.ts` |
| `docs/` | VitePress documentation site with interactive demos | `index.md`, demos/ |
| `perf/` | Playwright performance benchmarks | `scroll-benchmark.spec.ts` |

## Component Hierarchy

```
NativeChatWidget (root)
├── FloatingButton          ← FAB trigger, toggles open/close, hideToggleWhenOpen
└── ChatPanel               ← Floating panel (Teleport to body, fixed position)
    ├── ChatHeader          ← Star icon + "AI Assistant" title + close button
    ├── [Loading Spinner]   ← v-progress-circular (while loading, no messages)
    ├── [WelcomeState]      ← Empty state (no messages, not sending)
    ├── [MessageList]       ← v-infinite-scroll (when messages exist)
    │   └── MessageBubble   ← Per message: user/assistant/error bubbles
    └── ChatInput           ← Auto-grow textarea + inline send/spinner button
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
        ├── Register nativeChat Vuetify theme (merged at runtime)
        │
        └── All children inject(CHAT_STATE_KEY) for:
              ├── messages (DeepReadonly<Ref<ChatMessage[]>>)
              ├── isOpen / isLoading / isSending / hasMore (Readonly<Ref<boolean>>)
              ├── failedMessageText (Readonly<Ref<string | null>>)
              ├── open() → resolve conversation → fetch messages → isOpen=true
              ├── close() → isOpen=false → focus returns to FloatingButton
              ├── sendMessage(text) → optimistic UI → API call → replace/error
              ├── loadMore() → paginated fetch → prepend → preserve scroll position
              └── retry() → resend failedMessageText
```

## Recent Changes (since 2026-02-21)

- **Floating panel layout**: Replaced `v-navigation-drawer` with fixed-position floating panel using `Teleport to="body"`. Desktop: 420px wide, rounded corners. Mobile: full-screen slide-up.
- **Panel transitions**: Open/close animations (scale + translate from bottom-right, mobile: slide-up). `prefers-reduced-motion` respected.
- **Message bubble animations**: Entrance slide animations (user: slide-right, assistant: slide-left). Animation tracking via `knownIds` Set + `animatingIds` ref.
- **Redesigned ChatInput**: Inline send button inside `v-textarea` via `#append-inner` slot. Loading spinner replaces send icon during `isSending`.
- **Error message styling**: Warning icon (`IconWarning.vue`) + subtle red-tinted bubble background for error messages.
- **Panel header polish**: Header divider (1px border-bottom), close button using `v-btn icon variant="plain"`.
- **hideToggleWhenOpen config**: New option to hide FloatingButton when chat panel is open.
- **Theme refinements**: Added `title` and `chat-background` colors to theme definition.
- **Enriched demo**: Mock API client expanded with 20 additional Vue Q&A pairs for realistic scroll testing.
- **VitePress fixes**: CSS overrides for markdown list rendering inside message bubbles.
