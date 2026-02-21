# Architecture — native-chat-vue

## Executive Summary

native-chat-vue is a Vue 3 chat widget library distributed as an npm package. It provides an embeddable, AI-powered chat interface built on Vuetify 3, designed for integration into any Vue 3 application. The library follows a plugin architecture with dependency injection, a composable-based state machine, and an interface-driven API client abstraction that decouples the UI from any specific backend.

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
app.use(NativeChatPlugin, { apiClient, position?, welcomeMessage?, ... })
```

- `NativeChatPlugin.install()` validates the required `apiClient` option
- Configuration is provided via `CONFIG_KEY` (typed InjectionKey) using Vue's `provide`
- `NativeChatWidget` is registered as a global component

### 2. Composable State Machine (Business Logic)

`useChat(apiClient, config)` is the sole state management layer:

**State (all readonly refs):**
- `messages: ChatMessage[]` — chronological message array
- `isOpen: boolean` — panel visibility
- `isLoading: boolean` — loading indicator (open, loadMore)
- `isSending: boolean` — send in progress
- `hasMore: boolean` — pagination flag
- `failedMessageText: string | null` — last failed message for retry

**Actions:**
- `open()` — resolves conversation (existing or new), fetches initial messages
- `close()` — hides panel
- `sendMessage(text)` — optimistic send with error recovery
- `loadMore()` — reverse-chronological pagination
- `retry()` — resends failed message text

**Key behaviors:**
- **Optimistic UI**: User messages appear immediately with `status: 'sending'`, replaced by server response on success
- **Error recovery**: On failure, optimistic message is removed, error message displayed as assistant bubble, original text preserved in `failedMessageText`
- **Error history**: Previous error messages are preserved in the message array when retry succeeds
- **Status code mapping**: 429 → rate limit, 503/504 → unavailable, other → generic
- **Re-entrance guards**: Concurrent `open()`, `sendMessage()`, `loadMore()` calls are prevented
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
├── FloatingButton                  ← Fixed FAB: toggle open/close
└── ChatPanel                       ← VNavigationDrawer (right)
    ├── ChatHeader                  ← Title bar + close
    ├── [VProgressCircular]         ← Loading (conditional)
    ├── [WelcomeState]              ← Empty state (conditional)
    ├── [MessageList]               ← When messages exist
    │   └── MessageBubble × N       ← Per-message rendering
    └── ChatInput                   ← Always visible
```

### Dependency Injection Flow

```
NativeChatPlugin.install()
  └── provide(CONFIG_KEY, options)          ← App-level

NativeChatWidget
  ├── inject(CONFIG_KEY) → config
  ├── useChat(config.apiClient, config) → chatState
  └── provide(CHAT_STATE_KEY, chatState)    ← Widget-level

All child components
  └── inject(CHAT_STATE_KEY) → chatState    ← Read-only access
```

### Component Responsibilities

| Component | Injects | Vuetify Components | Key Behavior |
|-----------|---------|-------------------|--------------|
| NativeChatWidget | CONFIG_KEY | VThemeProvider | Registers `nativeChat` theme, creates `useChat`, provides state |
| ChatPanel | CONFIG_KEY, CHAT_STATE_KEY | VNavigationDrawer, VProgressCircular | Responsive width (400px / 100% mobile), Escape key close, scrim disabled |
| ChatHeader | CHAT_STATE_KEY | VIcon, VBtn | Close button calls `chatState.close()` |
| ChatInput | CHAT_STATE_KEY | VTextarea, VBtn | Enter sends, Shift+Enter newline, focus management, failed text pre-fill |
| MessageList | CHAT_STATE_KEY | VInfiniteScroll, VProgressCircular | Auto-scroll when near bottom, scroll position preservation on prepend |
| MessageBubble | — (props only) | — | Markdown rendering (marked + DOMPurify), copy-to-clipboard, error styling |
| FloatingButton | CONFIG_KEY, CHAT_STATE_KEY | VBtn, VIcon | Position config (bottom-left/right), focus return on close |
| WelcomeState | — (props only) | — | Default or custom welcome message |

## Theming

The library registers a custom Vuetify theme named `nativeChat`:

| Color Token | Value | Usage |
|-------------|-------|-------|
| primary | `#002B38` | User message bubbles |
| secondary | `#C4105B` | Send button, star icon, links |
| background | `#F8F8F8` | Panel background |
| surface | `#FFFFFF` | Assistant message bubbles |
| error | `#DE3232` | Error states |
| success | `#41A58D` | Success states |
| on-primary | `#FDFDFD` | Text on primary |
| on-surface | `#002B38` | Text on surface |
| welcome-text | `#B0BCC0` | Welcome state text |

Theme merges with the host app's `light` theme (additive, non-destructive). Registration is idempotent.

## CSS Architecture

- All component styles use `<style scoped>` with `@layer native-chat { ... }`
- CSS layer prevents style leakage into or from the host application
- BEM-like naming: `nc-{component}__{element}--{modifier}`
- Vuetify deep selectors (`:deep()`) used for internal Vuetify component styling (e.g., textarea border-radius)
- Responsive breakpoint: 768px (mobile vs desktop)

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
| onError | (error: ChatError) => void | No | — | Error callback |

## Testing Strategy

| Layer | Tool | Count | Pattern |
|-------|------|-------|---------|
| Unit (components) | Vitest + Vue Test Utils | 127 | Mock provide/inject state |
| Unit (composable) | Vitest | 75+ | Real composable + mock API client |
| Unit (helpers) | Vitest | 13 | Mock fetch |
| Unit (types) | Vitest | 11 | Shape verification |
| Integration | Vitest + Vue Test Utils | 24 | Full widget with real composable |
| Performance | Playwright | 2 | 1000-message FPS benchmark |

**Total: 210+ test cases**

## Security Considerations

- **XSS Protection**: All assistant markdown is rendered via `marked.parse()` then sanitized with `DOMPurify.sanitize()` before `v-html` injection
- **User messages**: Rendered as plain text (no `v-html`), no sanitization needed
- **API auth**: Bearer token via `getAccessToken()` callback (supports async token refresh)
- **URL encoding**: `encodeURIComponent()` used for path parameters in API client
- **Error isolation**: `onError` callback failures (sync throws + async rejections) are caught and silenced
