# Component Inventory — native-chat-vue

> Generated: 2026-02-25 | Scan Level: Exhaustive | Mode: Full Rescan

## Overview

The library contains 8 Vue single-file components and 7 inline SVG icon components, organized in a hierarchical widget structure.

## Widget Components

### NativeChatWidget

**File:** `src/components/NativeChatWidget.vue` (56 LOC)
**Role:** Root orchestrator — theme registration, state initialization, state provision
**Injects:** `CONFIG_KEY`
**Provides:** `CHAT_STATE_KEY`
**Children:** FloatingButton, ChatPanel

| Behavior | Details |
|----------|---------|
| Theme registration | Registers `nativeChat` Vuetify theme (idempotent, merges with host `light` theme via `useTheme()`) |
| State creation | Calls `useChat(apiClient, config)` and provides result to all descendants |
| Focus management | Returns focus to FloatingButton when chat closes (via `watch(isOpen)` + template ref) |

**Vuetify:** `VThemeProvider` (theme="nativeChat")

---

### ChatPanel

**File:** `src/components/ChatPanel.vue` (160 LOC)
**Role:** Floating overlay panel containing the chat interface, rendered via Teleport
**Injects:** `CONFIG_KEY`, `CHAT_STATE_KEY`

| Behavior | Details |
|----------|---------|
| Rendering | `<Teleport to="body">` — renders outside host app DOM tree |
| Visibility | `v-if="chatState.isOpen.value"` with `<Transition name="nc-panel">` |
| Desktop layout | Fixed position: 420px wide, right: 25px, top/bottom: 20px, rounded 20px, box-shadow |
| Mobile layout | Full-screen: top/left/right/bottom: 0, 100dvh, no border-radius (<768px via `useDisplay()`) |
| Z-index | 10000 |
| Transitions | Desktop: scale(0.9) + translateY(20px) with opacity; Mobile: translateY(100%) slide-up |
| Escape key | Global `keydown` listener added when open, removed when closed/unmounted |
| Conditional rendering | Loading spinner → WelcomeState → MessageList based on state |

**Vuetify:** `VThemeProvider` (with-background), `VProgressCircular`
**CSS classes:** `nc-chat-panel`, `nc-chat-panel--mobile`, `nc-chat-panel__body`, `nc-chat-panel__loader`

---

### ChatHeader

**File:** `src/components/ChatHeader.vue` (46 LOC)
**Role:** Title bar with branding and close button
**Injects:** `CHAT_STATE_KEY`

| Element | Details |
|---------|---------|
| Left side | `VAvatar` (secondary, size 44) with IconStar + "AI Assistant" title (600 weight, 14px) |
| Right side | Close button: `VBtn icon variant="text" size="default"` with IconClose (22px) |
| Divider | `border-bottom: 1px solid rgba(on-surface, 0.12)` |

**Vuetify:** `VAvatar`, `VIcon`, `VBtn`
**Accessibility:** Close button has `aria-label="Close chat"`
**CSS classes:** `nc-chat-header`, `nc-chat-header__left`, `nc-chat-header__title`

---

### ChatInput

**File:** `src/components/ChatInput.vue` (133 LOC)
**Role:** Message composition area with auto-growing textarea and inline send/spinner button
**Injects:** `CHAT_STATE_KEY`

| Behavior | Details |
|----------|---------|
| Send triggers | Enter key (without Shift) or inline send button click |
| Shift+Enter | Inserts newline (does not send) |
| Auto-grow | 2–10 rows (`min-rows="2" max-rows="10"`), no manual resize |
| Textarea | `VTextarea` with variant="solo", density="compact", flat |
| Inline send button | Inside `#append-inner` slot — shows `VProgressCircular` (size 16) during `isSending`, else `IconSend` |
| Disabled state | Textarea disabled while `isSending`; send button disabled when no text or sending |
| Focus management | Auto-focus on chat open (`immediate: true` watcher with `nextTick`), restore focus after send completes |
| Failed message | Watches `failedMessageText` — pre-fills input for retry/editing |

**Vuetify:** `VTextarea` (solo, compact, flat), `VBtn` (icon, text, comfortable), `VProgressCircular`, `VIcon`
**Accessibility:** `aria-label="Type a message"` (textarea), `aria-label="Send message"` (button)
**CSS classes:** `nc-chat-input`, `nc-chat-input__textarea`

---

### MessageList

**File:** `src/components/MessageList.vue` (235 LOC)
**Role:** Scrollable message container with infinite scroll, auto-scroll, and animation tracking
**Injects:** `CHAT_STATE_KEY`

| Behavior | Details |
|----------|---------|
| Infinite scroll | `VInfiniteScroll` (side="start") triggers `loadMore()` at top |
| Auto-scroll | Scrolls to bottom on new messages if user is within 50px of bottom |
| Scroll preservation | On prepend (loadMore), uses tail-ID tracking to detect appends vs prepends and adjusts `scrollTop` accordingly |
| Deferred scroll | Handles race condition: if response arrives during loadMore, scrolls to bottom after load completes |
| Loading indicator | `VProgressCircular` in `#loading` slot during `loadMore()` |
| Animation tracking | `knownIds` Set + `animatingIds` ref — new messages get entrance animation, prepended messages do not |
| Initial load | `initialLoadComplete` flag suppresses animations on first mount |
| Scroll-to-bottom FAB | `VBtn` with `IconArrowDown`, visible when scrolled up >50px from bottom, `<Transition name="nc-scroll-fab">` |
| Cleanup | Removes scroll event listener on unmount |

**Vuetify:** `VInfiniteScroll`, `VProgressCircular`, `VBtn`, `VIcon`
**Accessibility:** `<ul role="list" aria-live="polite">`, FAB has `aria-label="Scroll to latest messages"`
**CSS classes:** `nc-message-list-scroll`, `nc-message-list`, `nc-message-list__loader`

---

### MessageBubble

**File:** `src/components/MessageBubble.vue` (303 LOC)
**Role:** Individual message rendering with role-based styling and entrance animations
**Props:** `message: ChatMessage`, `animate?: boolean` (default: false)
**Injects:** `CONFIG_KEY` (optional — for `showBubbleHeaders` and `assistantBubbleFullWidth`)

| Message Type | Detection | Rendering | Styling |
|-------------|-----------|-----------|---------|
| User | `role === 'user'` | Plain text | Right-aligned, primary background, on-primary text |
| Assistant | `role === 'assistant'` && not error | Markdown → HTML (marked + DOMPurify) | Left-aligned, white surface, 1px border |
| Error | `status === 'failed'` or `id.startsWith('error-')` | Plain text (no markdown) | Left-aligned, red-tinted background (`error` at 6% opacity), red border (20% opacity) |
| Sending | `status === 'sending'` | Same as user | 70% opacity |

| Feature | Details |
|---------|---------|
| Header labels | "You" (user), "Error" with IconWarning (error), "AI Assistant" with VAvatar+IconStar (assistant). Controlled by `config.showBubbleHeaders` (default: true) |
| Full-width mode | `config.assistantBubbleFullWidth` — applies `--flat` class to assistant bubbles (no bubble chrome, transparent) |
| Copy button | Visible on assistant messages only, copies raw `message.content` to clipboard via `navigator.clipboard.writeText()` |
| Copy feedback | Icon switches to `IconCheck` (success color) for 1500ms, silent failure on permission denied |
| Markdown styling | Headers (14px bold), paragraphs, lists (disc/decimal), code (monospace + background), pre blocks, links (secondary color) — all via `:deep()` selectors |
| Entrance animation | `nc-bubble-slide-right` (user) / `nc-bubble-slide-left` (assistant/error), 250ms cubic-bezier, triggered by `animate` prop |
| Reduced motion | Animation set to `none` via `@media (prefers-reduced-motion: reduce)` |
| Cleanup | Clears copy timeout on `onBeforeUnmount` |

**Vuetify:** `VAvatar`, `VBtn` (icon, text), `VIcon`
**Accessibility:** `role="listitem"`, dynamic `aria-label` ("Message from you" / "Message from AI Assistant" / "Error message"), copy button `aria-label` toggles ("Copy message" / "Message copied")
**CSS classes:** `nc-message-bubble`, `nc-message-bubble--user`, `nc-message-bubble--assistant`, `nc-message-bubble--error`, `nc-message-bubble--sending`, `nc-message-bubble--flat`, `nc-message-bubble--animate-in`, `nc-message-bubble__header`, `nc-message-bubble__label`, `nc-message-bubble__star`, `nc-message-bubble__warning-icon`, `nc-message-bubble__bubble`, `nc-message-bubble__content`

---

### FloatingButton

**File:** `src/components/FloatingButton.vue` (103 LOC)
**Role:** Floating action button to toggle chat open/close
**Injects:** `CONFIG_KEY`, `CHAT_STATE_KEY`
**Exposes:** `focus()` method (called by NativeChatWidget on close)

| Behavior | Details |
|----------|---------|
| Toggle | Calls `chatState.open()` or `chatState.close()` |
| Position | Fixed, configurable via `config.position` ('bottom-right' default, 'bottom-left'), bottom: 24px |
| Size | 56px circular button, elevation 4, secondary color |
| Hide when open | `v-show="!isHidden"` — hidden when `isOpen && config.hideToggleWhenOpen` |
| Icon transition | `<Transition name="nc-fab-icon" mode="out-in">` — rotates between IconStar (closed) and IconClose (open), 120ms |
| Z-index | 9999 (below panel at 10000) |
| Focus expose | `defineExpose({ focus })` — allows parent to return focus via template ref |

**Vuetify:** `VBtn` (icon, elevation 4, secondary color), `VIcon`
**Accessibility:** `aria-label` toggles ("Open chat" / "Close chat"), `aria-expanded` reflects open state
**CSS classes:** `nc-floating-button-wrapper`, `nc-floating-button-wrapper--right`, `nc-floating-button-wrapper--left`, `nc-floating-button__icon-wrap`

---

### WelcomeState

**File:** `src/components/WelcomeState.vue` (31 LOC)
**Role:** Empty state shown when no messages exist and chat is not in sending state
**Props:** `message?: string`

| Behavior | Details |
|----------|---------|
| Default text | "Hello! How can I help you?" |
| Custom text | Via `message` prop (passed from `config.welcomeMessage` in ChatPanel) |
| Styling | Centered, 24px font, `welcome-text` theme color |

**CSS classes:** `nc-welcome-state`, `nc-welcome-state__text`

---

## Icon Components

All icons are inline SVG components using `width="1em" height="1em" fill="currentColor"` for size/color inheritance. They include `aria-hidden="true"` and `focusable="false"` for accessibility.

| Component | File | SVG | Usage |
|-----------|------|-----|-------|
| IconStar | `src/icons/IconStar.vue` | Star outline | FloatingButton (closed), ChatHeader avatar, MessageBubble (assistant header) |
| IconClose | `src/icons/IconClose.vue` | X mark | ChatHeader close button, FloatingButton (open state) |
| IconCopy | `src/icons/IconCopy.vue` | Clipboard | MessageBubble copy action (assistant messages) |
| IconCheck | `src/icons/IconCheck.vue` | Checkmark | MessageBubble copy confirmation feedback |
| IconSend | `src/icons/IconSend.vue` | Paper airplane | ChatInput send button |
| IconWarning | `src/icons/IconWarning.vue` | Triangle with exclamation | MessageBubble error message header |
| IconArrowDown | `src/icons/IconArrowDown.vue` | Downward arrow | MessageList scroll-to-bottom FAB |

## CSS Class Convention

All components use BEM-like naming under `@layer native-chat`:

```
nc-{component}                    → Block
nc-{component}__{element}         → Element
nc-{component}--{modifier}        → Modifier
```

Examples:
- `nc-chat-panel`, `nc-chat-panel__body`, `nc-chat-panel--mobile`
- `nc-message-bubble`, `nc-message-bubble__bubble`, `nc-message-bubble--user`, `nc-message-bubble--animate-in`
- `nc-chat-input`, `nc-chat-input__textarea`
- `nc-floating-button-wrapper`, `nc-floating-button-wrapper--right`
