# Component Inventory — native-chat-vue

> Generated: 2026-02-23 | Scan Level: Exhaustive | Mode: Full Rescan

## Overview

The library contains 8 Vue single-file components and 6 inline SVG icon components, organized in a hierarchical widget structure.

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
| Focus management | Returns focus to FloatingButton when chat closes (via `watch` + `nextTick` + `useTemplateRef`) |

**Vuetify:** `VThemeProvider` (theme="nativeChat")

---

### ChatPanel

**File:** `src/components/ChatPanel.vue`
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
**Accessibility:** `role="complementary"`, `aria-label="Chat with AI Assistant"`
**CSS classes:** `nc-chat-panel`, `nc-chat-panel--mobile`, `nc-chat-panel__body`, `nc-chat-panel__loader`

---

### ChatHeader

**File:** `src/components/ChatHeader.vue`
**Role:** Title bar with branding and close button
**Injects:** `CHAT_STATE_KEY`

| Element | Details |
|---------|---------|
| Left side | Star icon (secondary color, 20px) + "AI Assistant" title (600 weight, 14px) |
| Right side | Close button: `VBtn icon variant="plain" size="default"` with IconClose (22px) |
| Divider | `border-bottom: 1px solid rgba(on-surface, 0.12)` |

**Vuetify:** `VIcon`, `VBtn`
**Accessibility:** Close button has `aria-label="Close chat"`
**CSS classes:** `nc-chat-header`, `nc-chat-header__left`, `nc-chat-header__title`

---

### ChatInput

**File:** `src/components/ChatInput.vue`
**Role:** Message composition area with auto-growing textarea and inline send/spinner button
**Injects:** `CHAT_STATE_KEY`

| Behavior | Details |
|----------|---------|
| Send triggers | Enter key (without Shift) or inline send button click |
| Shift+Enter | Inserts newline (does not send) |
| Auto-grow | 1–10 rows (`max-rows="10"`), max-height 120px via CSS, no manual resize |
| Textarea | `VTextarea` with variant="solo", density="compact", flat, rounded="lg" |
| Inline send button | Inside `#append-inner` slot — shows `VProgressCircular` during `isSending`, else `IconSend` |
| Send button color | Primary when `canSend` or `isSending`, otherwise default |
| Disabled state | Textarea disabled while `isSending`; send button disabled when no text or sending |
| Focus management | Auto-focus on chat open (`immediate: true` watcher), restore focus after send completes |
| Failed message | Watches `failedMessageText` — pre-fills input for retry/editing |

**Vuetify:** `VTextarea` (solo, compact, flat, rounded), `VBtn` (icon, text, comfortable), `VProgressCircular`, `VIcon`
**Accessibility:** `aria-label="Type a message"` (textarea), `aria-label="Send message"` (button)
**CSS classes:** `nc-chat-input`, `nc-chat-input__textarea`

---

### MessageList

**File:** `src/components/MessageList.vue`
**Role:** Scrollable message container with infinite scroll, auto-scroll, and animation tracking
**Injects:** `CHAT_STATE_KEY`

| Behavior | Details |
|----------|---------|
| Infinite scroll | `VInfiniteScroll` (side="start") triggers `loadMore()` at top |
| Auto-scroll | Scrolls to bottom on new messages if user is within 50px of bottom |
| Scroll preservation | On prepend (loadMore), adjusts `scrollTop` by delta to maintain viewport position |
| Loading indicator | `VProgressCircular` in `#loading` slot during `loadMore()` |
| Animation tracking | `knownIds` Set + `animatingIds` ref — new messages get entrance animation, prepended messages do not |
| Initial load | Seeds `knownIds` with all initial messages on mount (no animations on first load) |
| Cleanup | Removes scroll event listener on unmount |

**Vuetify:** `VInfiniteScroll`, `VProgressCircular`
**Accessibility:** `<ul role="list" aria-live="polite">`
**CSS classes:** `nc-message-list-scroll`, `nc-message-list`, `nc-message-list__loader`

---

### MessageBubble

**File:** `src/components/MessageBubble.vue`
**Role:** Individual message rendering with role-based styling and entrance animations
**Props:** `message: ChatMessage`, `animate?: boolean` (default: false)

| Message Type | Rendering | Styling |
|-------------|-----------|---------|
| User | Plain text | Right-aligned, primary background, on-primary text |
| Assistant | Markdown → HTML (marked + DOMPurify) | Left-aligned, white surface, 1px border |
| Error | Plain text (no markdown) | Left-aligned, red-tinted background (`error` at 6% opacity), red border (20% opacity) |
| Sending | Same as user | 70% opacity |

| Feature | Details |
|---------|---------|
| Header labels | "You" (user), "Error" with IconWarning (error), "AI Assistant" with IconStar (assistant) |
| Warning icon | `IconWarning` shown for error messages, colored `error` at 60% opacity |
| Copy button | Visible on assistant messages only, copies raw `message.content` to clipboard |
| Copy feedback | Icon switches to `IconCheck` (success color) for 1.5 seconds, silent failure on permission denied |
| Markdown styling | Headers (14px bold), paragraphs, lists (disc/decimal), code (monospace + background), pre blocks, links (secondary color) |
| Entrance animation | `nc-bubble-slide-right` (user) / `nc-bubble-slide-left` (assistant/error), 250ms cubic-bezier, triggered by `animate` prop |
| Reduced motion | Animation set to `none` via `@media (prefers-reduced-motion: reduce)` |
| Cleanup | Clears copy timeout on `onBeforeUnmount` |

**Vuetify:** `VBtn` (icon, text, comfortable, small), `VIcon`
**Accessibility:** `role="listitem"`, dynamic `aria-label` ("Message from you" / "Message from AI Assistant" / "Error message"), copy button `aria-label` toggles ("Copy message" / "Message copied")
**CSS classes:** `nc-message-bubble`, `nc-message-bubble--user`, `nc-message-bubble--assistant`, `nc-message-bubble--error`, `nc-message-bubble--sending`, `nc-message-bubble--animate-in`, `nc-message-bubble__header`, `nc-message-bubble__label`, `nc-message-bubble__star`, `nc-message-bubble__warning-icon`, `nc-message-bubble__bubble`, `nc-message-bubble__content`

---

### FloatingButton

**File:** `src/components/FloatingButton.vue`
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
| Focus expose | `defineExpose({ focus })` — allows parent to return focus via `useTemplateRef` |

**Vuetify:** `VBtn` (icon, elevation 4, secondary color), `VIcon`
**Accessibility:** `aria-label` toggles ("Open chat" / "Close chat"), `aria-expanded` reflects open state
**CSS classes:** `nc-floating-button-wrapper`, `nc-floating-button-wrapper--right`, `nc-floating-button-wrapper--left`, `nc-floating-button__icon-wrap`

---

### WelcomeState

**File:** `src/components/WelcomeState.vue`
**Role:** Empty state shown when no messages exist and chat is not in sending state
**Props:** `message?: string`

| Behavior | Details |
|----------|---------|
| Default text | "Hello! How can I help you?" |
| Custom text | Via `message` prop (passed from `config.welcomeMessage` in ChatPanel) |
| Styling | Centered, 24px font, `welcome-text` theme color |

**Accessibility:** Standard text content
**CSS classes:** `nc-welcome-state`, `nc-welcome-state__text`

---

## Icon Components

All icons are inline SVG components using `width="1em" height="1em" fill="currentColor"` for size/color inheritance. They include `aria-hidden="true"` and `focusable="false"` for accessibility.

| Component | File | SVG | Usage |
|-----------|------|-----|-------|
| IconStar | `src/icons/IconStar.vue` | 5-pointed star | FloatingButton (closed), ChatHeader, MessageBubble (assistant) |
| IconClose | `src/icons/IconClose.vue` | X mark | ChatHeader close button, FloatingButton (open state) |
| IconCopy | `src/icons/IconCopy.vue` | Clipboard | MessageBubble copy action (assistant messages) |
| IconCheck | `src/icons/IconCheck.vue` | Checkmark | MessageBubble copy confirmation feedback |
| IconSend | `src/icons/IconSend.vue` | Arrow | ChatInput send button |
| IconWarning | `src/icons/IconWarning.vue` | Triangle with exclamation | MessageBubble error message header |

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
