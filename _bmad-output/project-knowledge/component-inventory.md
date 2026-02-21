# Component Inventory — native-chat-vue

## Overview

The library contains 8 Vue single-file components and 5 inline SVG icon components, organized in a hierarchical widget structure.

## Widget Components

### NativeChatWidget

**File:** `src/components/NativeChatWidget.vue`
**Role:** Root orchestrator — theme registration, state initialization, state provision
**Injects:** `CONFIG_KEY`
**Provides:** `CHAT_STATE_KEY`
**Children:** FloatingButton, ChatPanel

| Behavior | Details |
|----------|---------|
| Theme registration | Registers `nativeChat` Vuetify theme (idempotent, merges with host `light` theme) |
| State creation | Calls `useChat(apiClient, config)` and provides result to all descendants |
| Focus management | Returns focus to FloatingButton when chat closes (via `watch` + `nextTick`) |

**Vuetify:** `VThemeProvider` (theme="nativeChat")

---

### ChatPanel

**File:** `src/components/ChatPanel.vue`
**Role:** Slide-out navigation drawer containing the chat interface
**Injects:** `CONFIG_KEY`, `CHAT_STATE_KEY`

| Behavior | Details |
|----------|---------|
| Drawer model | Computed proxy — reads `isOpen`, setter is no-op (prevents Vuetify click-outside close) |
| Responsive width | 400px desktop, 100% on mobile (<768px via `useDisplay()`) |
| Escape key | Global `keydown` listener added when open, removed when closed/unmounted |
| Scrim | Disabled (`:scrim="false"`) |
| Conditional rendering | Loading spinner → WelcomeState → MessageList based on state |

**Vuetify:** `VNavigationDrawer` (right, temporary), `VProgressCircular`
**Accessibility:** `role="complementary"`, `aria-label="Chat with AI Assistant"`

---

### ChatHeader

**File:** `src/components/ChatHeader.vue`
**Role:** Title bar with branding and close button
**Injects:** `CHAT_STATE_KEY`

| Element | Details |
|---------|---------|
| Title | "AI Assistant" with star icon |
| Close button | `VBtn` icon, calls `chatState.close()` |

**Vuetify:** `VIcon`, `VBtn`
**Accessibility:** Close button has `aria-label="Close chat"`

---

### ChatInput

**File:** `src/components/ChatInput.vue`
**Role:** Message composition area with auto-growing textarea and send button
**Injects:** `CHAT_STATE_KEY`

| Behavior | Details |
|----------|---------|
| Send triggers | Enter key (without Shift) or send button click |
| Shift+Enter | Inserts newline (does not send) |
| Auto-grow | 1–6 rows, max-height 120px, no manual resize |
| Disabled state | Both textarea and send button disabled while `isSending` |
| Send button | Enabled only when input has non-whitespace text and not sending |
| Focus management | Auto-focus on chat open, restore focus after send completes |
| Failed message | Watches `failedMessageText` — pre-fills input for retry/editing |

**Vuetify:** `VTextarea` (outlined, compact), `VBtn` (icon, flat, secondary)
**Accessibility:** `aria-label="Type a message"` (textarea), `aria-label="Send message"` (button)

---

### MessageList

**File:** `src/components/MessageList.vue`
**Role:** Scrollable message container with infinite scroll and auto-scroll
**Injects:** `CHAT_STATE_KEY`

| Behavior | Details |
|----------|---------|
| Infinite scroll | `VInfiniteScroll` (side="start") triggers `loadMore()` at top |
| Auto-scroll | Scrolls to bottom on new messages if user is within 50px of bottom |
| Scroll preservation | On prepend (loadMore), adjusts `scrollTop` by delta to maintain viewport position |
| Loading indicator | `VProgressCircular` shown during `loadMore()` |
| Cleanup | Removes scroll event listener on unmount |

**Vuetify:** `VInfiniteScroll`, `VProgressCircular`
**Accessibility:** `<ul role="list" aria-live="polite">`

---

### MessageBubble

**File:** `src/components/MessageBubble.vue`
**Role:** Individual message rendering with role-based styling
**Props:** `message: ChatMessage`

| Message Type | Rendering | Styling |
|-------------|-----------|---------|
| User | Plain text | Right-aligned, primary background, light text |
| Assistant | Markdown → HTML (marked + DOMPurify) | Left-aligned, white surface, bordered |
| Error | Plain text (no markdown) | Left-aligned, same as assistant, no header/star |
| Sending | Same as user | 70% opacity |

| Feature | Details |
|---------|---------|
| Copy button | Visible on assistant messages only, copies raw content to clipboard |
| Copy feedback | Icon switches to checkmark for 1.5 seconds, silent failure on permission denied |
| Markdown styling | Headers, paragraphs, lists, code blocks, links styled via `:deep()` selectors |
| Cleanup | Clears copy timeout on unmount |

**Accessibility:** `role="listitem"`, dynamic `aria-label` ("Message from you" / "Message from AI Assistant" / "Error message")

---

### FloatingButton

**File:** `src/components/FloatingButton.vue`
**Role:** Floating action button to toggle chat open/close
**Injects:** `CONFIG_KEY`, `CHAT_STATE_KEY`
**Exposes:** `focus()` method (called by NativeChatWidget on close)

| Behavior | Details |
|----------|---------|
| Toggle | Calls `chatState.open()` or `chatState.close()` |
| Position | Fixed, configurable via `config.position` ('bottom-right' default, 'bottom-left') |
| Size | 56px circular button |

**Vuetify:** `VBtn` (icon, elevation 4, secondary color), `VIcon`
**Accessibility:** `aria-label` toggles ("Open chat" / "Close chat"), `aria-expanded` reflects state

---

### WelcomeState

**File:** `src/components/WelcomeState.vue`
**Role:** Empty state shown when no messages exist
**Props:** `message?: string`

| Behavior | Details |
|----------|---------|
| Default text | "Hello! How can I help you?" |
| Custom text | Via `message` prop from `config.welcomeMessage` |

**Accessibility:** Standard text content, no special ARIA attributes needed

---

## Icon Components

All icons are inline SVG components with `aria-hidden="true"` and `focusable="false"`. They use `fill="currentColor"` for theme integration.

| Component | File | Usage |
|-----------|------|-------|
| IconCheck | `src/icons/IconCheck.vue` | Copy confirmation in MessageBubble |
| IconClose | `src/icons/IconClose.vue` | Close button in ChatHeader |
| IconCopy | `src/icons/IconCopy.vue` | Copy action in MessageBubble |
| IconSend | `src/icons/IconSend.vue` | Send button in ChatInput |
| IconStar | `src/icons/IconStar.vue` | Branding in FloatingButton, ChatHeader, MessageBubble |

## CSS Class Convention

All components use BEM-like naming under `@layer native-chat`:

```
nc-{component}                    → Block
nc-{component}__{element}         → Element
nc-{component}--{modifier}        → Modifier
```

Examples:
- `nc-chat-panel`, `nc-chat-panel__body`, `nc-chat-panel--mobile`
- `nc-message-bubble`, `nc-message-bubble__bubble`, `nc-message-bubble--user`
- `nc-chat-input`, `nc-chat-input__textarea`, `nc-chat-input__send-btn`
