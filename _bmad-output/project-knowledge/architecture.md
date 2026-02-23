# Architecture — native-chat-vue

> Generated: 2026-02-23 | Scan Level: Exhaustive | Mode: Full Rescan

## Executive Summary

native-chat-vue is a Vue 3 chat widget library distributed as an npm package. It provides an embeddable, AI-powered chat interface built on Vuetify 3, designed for integration into any Vue 3 application. The library follows a plugin architecture with dependency injection, a composable-based state machine, and an interface-driven API client abstraction that decouples the UI from any specific backend. The chat panel renders as a floating overlay via Teleport, ensuring it works independently of the host app's layout.

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Language | TypeScript | ^5.9.0 (strict, ES2022) |
| Framework | Vue 3 | ^3.5.0 (peer dependency) |
| UI Library | Vuetify 3 | ^3.11.0 (peer dependency) |
| Build | Vite 7 | Library mode, ES module output |
| Type Generation | vite-plugin-dts | ^4.5.0 |
| Unit Testing | Vitest 4 | jsdom + Vue Test Utils |
| Perf Testing | Playwright | ^1.58.2 |
| Linting | ESLint 10 + Prettier | Flat config, Vue + TS rules |
| Docs | VitePress | ^1.6.4 |
| Package Manager | Yarn 4 (Berry) | 4.12.0 via corepack |
| Dependencies | marked ^17, DOMPurify ^3.3 | Markdown rendering + XSS protection |

## Architecture Pattern

**Vue Plugin + Composable Architecture**

The library uses three core patterns working together:

### 1. Plugin Registration (Entry Point)

```
app.use(NativeChatPlugin, { apiClient, position?, welcomeMessage?, hideToggleWhenOpen?, ... })
```

- `NativeChatPlugin.install()` validates the required `apiClient` option
- Configuration is provided via `CONFIG_KEY` (typed InjectionKey) using Vue's `provide`
- `NativeChatWidget` is registered as a global component

### 2. Composable State Machine (Business Logic)

`useChat(apiClient, config)` is the sole state management layer:

**State (all readonly refs):**
- `messages: DeepReadonly<Ref<ChatMessage[]>>` — chronological message array
- `isOpen: Readonly<Ref<boolean>>` — panel visibility
- `isLoading: Readonly<Ref<boolean>>` — loading indicator (open, loadMore)
- `isSending: Readonly<Ref<boolean>>` — send in progress
- `hasMore: Readonly<Ref<boolean>>` — pagination flag
- `failedMessageText: Readonly<Ref<string | null>>` — last failed message for retry

**Actions:**
- `open()` — resolves conversation (existing or new), fetches initial messages
- `close()` — hides panel
- `sendMessage(text)` — optimistic send with error recovery
- `loadMore()` — reverse-chronological pagination
- `retry()` — resends failed message text

**Key behaviors:**
- **Optimistic UI**: User messages appear immediately with `status: 'sending'`, replaced by server response on success
- **Error recovery**: On failure, optimistic message is removed, error message displayed as assistant bubble with `status: 'failed'`, original text preserved in `failedMessageText`
- **Error history**: Previous error messages are preserved in the message array when retry succeeds (not removed, treated as conversation history)
- **Status code mapping**: 429 → rate limit, 503/504 → unavailable, other → generic fallback
- **Re-entrance guards**: Concurrent `open()`, `sendMessage()`, `loadMore()` calls are prevented via boolean checks
- **Null conversation recovery**: If `open()` fails to establish a conversation, `sendMessage()` creates one on-demand

### 3. API Client Abstraction (Backend Interface)

```typescript
interface NativeChatApiClient {
  createConversation(): Promise<ConversationResponse>
  getConversations(offset, limit): Promise<ConversationListResponse>
  getMessages(conversationId, offset, limit): Promise<MessageHistoryResponse>
  sendMessage(conversationId, message): Promise<SendMessageResponse>
}
```

- Consumers provide their own implementation or use the default `createNativeChatApiClient(baseUrl, getAccessToken)`
- Default implementation uses `fetch` with Bearer token authentication
- Conversation-scoped: all messages belong to a conversation
- Pagination: offset/limit pattern, reverse-chronological from API (reversed to chronological in UI)

## Component Architecture

### Hierarchy

```
NativeChatWidget                    ← Root: theme + state provider
├── FloatingButton                  ← Fixed FAB: toggle open/close, hideToggleWhenOpen
└── ChatPanel                       ← Teleport to body, floating panel (fixed position)
    ├── ChatHeader                  ← Star icon + "AI Assistant" + close button + divider
    ├── [VProgressCircular]         ← Loading (conditional: loading + no messages)
    ├── [WelcomeState]              ← Empty state (conditional: no messages + not sending)
    ├── [MessageList]               ← When messages exist (v-infinite-scroll)
    │   └── MessageBubble × N       ← Per-message: user/assistant/error bubbles
    └── ChatInput                   ← Always visible: textarea + inline send/spinner
```

### Layout Strategy

The chat panel uses `<Teleport to="body">` to render outside the host app's DOM tree:

- **Desktop**: Fixed-position panel (420px wide, right: 25px, top: 20px to bottom: 20px, rounded corners, box-shadow)
- **Mobile** (<768px): Full-screen overlay (100% width, 100dvh, no border-radius)
- **Z-index**: Panel at 10000, FloatingButton at 9999
- **Transitions**: Scale+translate from bottom-right (desktop), slide-up (mobile), `prefers-reduced-motion` respected

### Dependency Injection Flow

```
NativeChatPlugin.install()
  └── provide(CONFIG_KEY, options)          ← App-level

NativeChatWidget
  ├── inject(CONFIG_KEY) → config
  ├── useChat(config.apiClient, config) → chatState
  ├── Register nativeChat Vuetify theme (merged at runtime, idempotent)
  └── provide(CHAT_STATE_KEY, chatState)    ← Widget-level

All child components
  └── inject(CHAT_STATE_KEY) → chatState    ← Read-only access
```

### Component Responsibilities

| Component | Injects | Vuetify Components | Key Behavior |
|-----------|---------|-------------------|--------------|
| NativeChatWidget | CONFIG_KEY | VThemeProvider | Registers `nativeChat` theme, creates `useChat`, provides state, focus management (return to FAB on close) |
| ChatPanel | CONFIG_KEY, CHAT_STATE_KEY | VThemeProvider, VProgressCircular | Teleport to body, responsive breakpoint (768px), Escape key close (global keydown listener), panel transitions |
| ChatHeader | CHAT_STATE_KEY | VIcon, VBtn | Star icon + "AI Assistant" title, close button (`variant="plain"`), bottom divider |
| ChatInput | CHAT_STATE_KEY | VTextarea, VBtn, VProgressCircular, VIcon | Enter sends/Shift+Enter newline, inline send button (append-inner slot), loading spinner during send, focus on open/after send, failed text pre-fill |
| MessageList | CHAT_STATE_KEY | VInfiniteScroll, VProgressCircular | Auto-scroll when near bottom (50px threshold), scroll position preservation on prepend, entrance animation tracking (knownIds + animatingIds) |
| MessageBubble | — (props only) | VBtn, VIcon | Markdown rendering (marked + DOMPurify), copy-to-clipboard, error styling (warning icon + red tint), entrance slide animations |
| FloatingButton | CONFIG_KEY, CHAT_STATE_KEY | VBtn, VIcon | Position config (bottom-left/right), hideToggleWhenOpen option, icon rotate transition (star ↔ close), focus/expose for return focus |
| WelcomeState | — (props only) | — | Default or custom welcome message, centered layout |

## Theming

The library registers a custom Vuetify theme named `nativeChat`:

| Color Token | Value | Usage |
|-------------|-------|-------|
| primary | `#002B38` | User message bubbles, input text |
| secondary | `#C4105B` | FAB, star icon, links, send button active |
| background | `#F8F8F8` | Overall background |
| surface | `#FFFFFF` | Assistant message bubbles |
| error | `#DE3232` | Error message tint, warning icon |
| success | `#41A58D` | Copy confirmation icon |
| info | `#002B38` | Information states |
| on-primary | `#FDFDFD` | Text on primary (user messages) |
| on-secondary | `#FFFFFF` | Text on secondary (FAB icon) |
| on-surface | `#002B38` | Text on surface (assistant messages, labels) |
| welcome-text | `#B0BCC0` | Welcome state placeholder text |
| chat-background | `#EBEBED` | Chat panel body background |
| title | `#9E9E9E` | Muted UI elements (copy icon default) |

Theme merges with the host app's `light` theme (additive, non-destructive). Registration is idempotent — only created once per app.

## CSS Architecture

- All component styles use `<style scoped>` within `@layer native-chat { ... }`
- CSS layer ensures low specificity — host apps can override without `!important`
- BEM-like naming convention: `nc-{component}__{element}--{modifier}`
- Vuetify theme variables accessed via `rgb(var(--v-theme-{color}))` pattern
- Deep selectors (`:deep()`) used for Vuetify internal styling (textarea, infinite-scroll)
- Responsive breakpoint: 768px (via Vuetify's `useDisplay()`)
- Animations:
  - **Panel**: `nc-panel-enter/leave` (scale + translate, 280ms/200ms cubic-bezier)
  - **Message bubbles**: `nc-bubble-slide-left/right` (250ms cubic-bezier) for entrance
  - **FAB icon**: `nc-fab-icon` rotate transition (120ms) between star/close
  - All animations respect `prefers-reduced-motion: reduce` (set to 0ms/none)

## Public API Surface

### Exports (`src/index.ts`)

```typescript
// Plugin (default + named)
export { NativeChatPlugin }
export { NativeChatPlugin as default }

// Component
export { NativeChatWidget }

// Helper
export { createNativeChatApiClient }

// Types
export type {
  NativeChatApiClient, ConversationResponse, ConversationListResponse,
  MessageResponse, MessageHistoryResponse, SendMessageResponse,
  ChatMessage, MessageStatus, ChatError, NativeChatPluginOptions
}
```

### Configuration Options (`NativeChatPluginOptions`)

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| apiClient | NativeChatApiClient | Yes | — | Backend communication implementation |
| position | 'bottom-left' \| 'bottom-right' | No | 'bottom-right' | FAB position |
| welcomeMessage | string | No | 'Hello! How can I help you?' | Empty state message |
| batchSize | number | No | 20 | Messages per page |
| conversationId | string | No | — | Pre-set conversation (skips lookup) |
| hideToggleWhenOpen | boolean | No | false | Hide FAB when chat panel is open |
| onError | (error: ChatError) => void | No | — | Error callback (sync/async failures caught) |

## Accessibility

- **ARIA roles**: `role="complementary"` on chat panel, `role="list"` + `role="listitem"` on messages, `aria-live="polite"` on message list
- **ARIA labels**: Descriptive labels on all interactive elements (buttons, inputs, message bubbles)
- **ARIA expanded**: FloatingButton tracks `aria-expanded` based on open state
- **Keyboard navigation**: Escape closes panel, Enter sends, Shift+Enter for newline
- **Focus management**: Auto-focus textarea on open, return focus to FAB on close, refocus after send
- **Reduced motion**: All animations/transitions disabled via `@media (prefers-reduced-motion: reduce)`

## Testing Strategy

| Layer | Tool | Count | Pattern |
|-------|------|-------|---------|
| Unit (components) | Vitest + Vue Test Utils | ~105 | Mock provide/inject state |
| Unit (composable) | Vitest | ~70 | Real composable + mock API client |
| Unit (helpers) | Vitest | ~12 | Mock fetch |
| Unit (types) | Vitest | ~10 | Shape verification |
| Integration | Vitest + Vue Test Utils | ~18 | Full widget with real composable |
| Performance | Playwright | 2 | 1000-message FPS benchmark |

**Total: 175+ test cases**

## Security Considerations

- **XSS Protection**: All assistant markdown is rendered via `marked.parse()` then sanitized with `DOMPurify.sanitize()` before `v-html` injection
- **User messages**: Rendered as plain text (no `v-html`), no sanitization needed
- **Error messages**: Rendered as plain text (no markdown, no `v-html`)
- **API auth**: Bearer token via `getAccessToken()` callback (supports async token refresh)
- **URL encoding**: `encodeURIComponent()` used for path parameters in API client
- **Error isolation**: `onError` callback failures (sync throws + async rejections) are caught and silenced — callback bugs never break the chat
- **CSS isolation**: `@layer native-chat` prevents style conflicts with host application
