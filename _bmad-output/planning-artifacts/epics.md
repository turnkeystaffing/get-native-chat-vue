---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# native-chat-vue - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for native-chat-vue, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories. Includes Epic 5 added via Correct Course workflow (2026-02-21) to address missing documentation planning. Includes Epic 6 added via Correct Course workflow (2026-02-22) to align visual implementation with the approved Figma design. Stories 6.4-6.5 added via Correct Course workflow (2026-02-22b) to document animation changes made outside BMAD workflow. Stories 6.6-6.9 added via Correct Course workflow (2026-02-22c) for input redesign, VitePress environment fixes, error message distinction, and panel/header UI polish. Epic 7 added via Correct Course workflow (2026-02-23) to rework scroll behavior to match industry-standard AI chat patterns (force-scroll on send/response, anchor-based history preservation, scroll-to-bottom FAB). Stories 6.12-6.14 added via Correct Course workflow (2026-02-24) for typography enforcement, input/header refinements, and CSS import relocation.

## Requirements Inventory

### Functional Requirements

FR1: Developer can install the plugin as an npm package
FR2: Developer can register the plugin with a Vue application via `app.use()` with a configuration object
FR3: Developer can provide an auth token through plugin configuration
FR4: Developer can provide a pre-configured API client through plugin configuration (for session management, token refresh, retry logic)
FR5: User can open the chat window by clicking a floating agent button
FR6: User can close the chat window by clicking the agent button or a close control
FR7: Chat window can display in an overlay/panel position within the host app viewport
FR8: Chat window can render on viewports ≥320px wide (mobile) through ≥1920px (desktop) without horizontal scroll, with all interactive elements maintaining ≥44px tap target size and layout adapting to available space
FR9: User can view a list of conversation messages (user and assistant roles distinguished)
FR10: User can scroll through conversation history within the message list
FR11: System can load older messages dynamically as the user scrolls up (infinite scroll, configurable batch size, default 20 messages)
FR12: System can maintain scroll position when older messages are loaded
FR13: System can display a loading indicator while fetching additional messages
FR14: User can type a message in a text input field
FR15: Input field can auto-expand vertically as the message content grows, up to a maximum height of 6 lines at default font size (approximately 120px), then scroll internally
FR16: User can send a message by clicking the send button
FR17: User can send a message by pressing Enter
FR18: System can disable the input and send controls while a response is pending
FR19: System can send user messages to the backend via the provided API client
FR20: User's sent message appears in the message list immediately upon send action (before server response)
FR21: System can display the assistant's response in the message list upon receipt
FR22: System can fetch and display existing conversation history from the server on chat open
FR23: System can support multi-turn conversations (context maintained server-side, plugin renders the full thread)
FR24: System can display error states as messages in the chat when API requests fail
FR25: System can handle network failures during message history loading without crashing
FR26: User can retry sending a failed message (re-send the same content) or compose a new message after a failure
FR27: System can recover from errors (API failures, network timeouts) without page reload — input controls re-enable after error display, user can compose new messages and scroll history during error state

### NonFunctional Requirements

NFR1: Chat window opens and renders within 200ms of button click (warm start, measured via Performance API mark from click event to first contentful paint of message list)
NFR2: Infinite scroll loads next message batch without visible UI jank (no frames >16ms) or scroll position jumping
NFR3: User's message appears in the list within one frame (16ms) of send action (optimistic UI); assistant response renders within 100ms of API client returning
NFR4: Input lag when typing in the auto-expanding textarea stays below 100ms (measured as time between keydown event and DOM update)
NFR5: Plugin maintains ≥30fps during scroll interaction with 1000+ messages loaded, with no individual frame exceeding 50ms
NFR6: Plugin production bundle (minified + gzipped) does not exceed 50KB excluding peer dependencies (Vue, Vuetify)
NFR7: No runtime dependencies beyond Vue 3.x and Vuetify 3.x as peer dependencies, plus `marked` and `dompurify` as direct dependencies
NFR8: WCAG 2.1 Level A compliance
NFR9: All interactive elements reachable and operable via keyboard (open/close chat, focus input, send message, scroll history)
NFR10: Semantic HTML structure and ARIA labels for assistive technologies (chat region, message roles, input labels)
NFR11: Visible focus indicators on all interactive elements
NFR12: Screen reader can announce new messages as they appear (ARIA live region)
NFR13: Contrast ratios of ≥4.5:1 for normal text and ≥3:1 for large text (18pt+) per WCAG 2.1 Level A
NFR14: Plugin CSS must be isolated from host app styles and must not affect host application styling
NFR15: Plugin must not modify or depend on global JavaScript state (window, document-level event listeners)
NFR16: Plugin must work with any API client that conforms to the expected interface (not coupled to a specific HTTP library)
NFR17: Plugin must operate within a host Vue SPA without state collisions or global side effects

### Additional Requirements

**From Architecture:**

- Starter template: VitePress + Vite Library Mode (manual scaffold) — project initialization using this structure should be the first implementation story
- TypeScript strict mode with `<script setup lang="ts">`
- Build tool: Vite library mode with Rollup, ESM-only output (no CJS), Vue + Vuetify externalized
- `vite-plugin-dts` generates `.d.ts` declarations for consumers
- Vuetify 3.x as deliberate peer dependency — all target host apps already use Vuetify
- `marked` (~11.8KB gzip) + `dompurify` (~6-7KB gzip) as the only runtime dependencies beyond peer deps
- API client interface defined: `NativeChatApiClient` with `createConversation()`, `getConversations()`, `getMessages()`, `sendMessage()`
- Convenience helper: `createNativeChatApiClient({ baseUrl, getAccessToken })` exported from package
- Plugin configuration API: `NativeChatPluginOptions` with required `apiClient` and optional `position`, `welcomeMessage`, `batchSize`, `conversationId`, `onError`
- Config validation during `app.use()` — missing `apiClient` logs console warning, skips registration
- Conversation management: single active conversation, `getConversations(0,1)` → use latest; if none → `createConversation()`; server is source of truth, no localStorage
- Performance strategy: `v-infinite-scroll` without virtualization for MVP, gated by explicit 1000-message benchmark (scroll FPS ≥30 in Chrome)
- MessageList public API is implementation-agnostic (`messages`, `loading`, `hasMore`, `@load-more`) — survives virtualization switch
- CSS isolation: `@layer native-chat` + Vuetify `v-theme-provider` for theme scoping + `<style scoped>` on all components
- State management: single `useChat()` composable using Vue reactive refs, provided via `provide/inject` with Symbol-based keys
- Message lifecycle state machine: `'sending'` → `'sent'` | `'failed'`
- Error handling: API errors caught in `useChat()`, mapped to `ChatError` type, rendered as `MessageBubble` with `variant="error"`
- On send failure: optimistic message removed, error shown inline, input re-populated with failed text via `failedMessageText`
- On history fetch failure: silent — loading indicator disappears, user retries by scrolling
- Markdown rendering: `marked` + DOMPurify for assistant messages only; user messages plain text
- Testing: Vitest + `@vue/test-utils`, co-located `__tests__/` folders with `.test.ts` suffix
- Linting/Formatting: ESLint + Prettier
- Package manager: Yarn
- Development: VitePress `docs:dev` as primary development server with hot reload
- Naming conventions: PascalCase components, camelCase composables/functions, kebab-case events/CSS, `nc-` CSS prefix
- Provide/inject keys: Symbol-based, centralized in `src/keys.ts`
- Props/emits defined with TypeScript generics (`defineProps<T>()`, `defineEmits<T>()`), not runtime validators
- No `reactive()` for top-level state — use individual `ref()` values
- No `!important` in CSS
- Component hierarchy: NativeChatWidget (root) → FloatingButton + ChatPanel → ChatHeader + MessageList + MessageBubble + ChatInput + WelcomeState

**From UX Design:**

- Responsive: 3-tier breakpoint strategy — mobile full-screen (<768px), tablet/desktop overlay (≥768px)
- Mobile: chat panel full-screen takeover, close button returns to host app
- Use Vuetify's `useDisplay()` composable for breakpoint detection
- Dynamic viewport height (`dvh`) on mobile for virtual keyboard handling
- Escape key closes chat panel, returns focus to floating button
- Focus management: opening chat → focus input field; closing chat → focus floating button; after send/error → focus stays on input
- No focus trap — `role="complementary"`, users interact with host app and chat simultaneously
- No click-outside-to-close — chat is a persistent side panel
- `aria-live="polite"` for new messages only (not history loads)
- Copy action below assistant messages: icon changes to checkmark for ~1.5s, silent failure on clipboard permission denied
- Auto-scroll rules: auto-scroll to bottom when user is at/near bottom (~50px threshold); do NOT auto-scroll if user has scrolled up
- Welcome state shown only after initial history fetch completes with zero messages; never shown during loading
- If initial history fetch fails, show welcome message as fallback
- Error messages: calm/neutral tone ("Something went wrong. You can try sending your message again."), no red backgrounds, no alert icons
- Open Sans font family (all weights)
- Color system: Primary `#002B38` (dark teal), Accent `#C4105B` (magenta), user bubble `#002B38` with `#FDFDFD` text, assistant bubble `#FFFFFF` with `#EBEBED` border, hint text `#727272`
- Chat panel: ~400px width, 20px border-radius (top corners), full viewport height
- Floating button: 56px diameter, magenta circle, white star icon, configurable position
- Message bubbles: 12-16px border radius, user right-aligned, assistant left-aligned
- Input field: pill-shaped (large border-radius), magenta send arrow icon
- ChatHeader: star icon (magenta) + "AI Assistant" title + close (X) button
- Assistant messages support rich text: bold headings, paragraphs, bullet lists via markdown rendering

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | npm package installation |
| FR2 | Epic 1 | Plugin registration via `app.use()` |
| FR3 | Epic 1 | Auth token in config |
| FR4 | Epic 1 | API client injection |
| FR5 | Epic 1 | Floating button opens chat |
| FR6 | Epic 1 | Close via button or control |
| FR7 | Epic 1 | Overlay/panel positioning |
| FR8 | Epic 1 | Responsive viewport support |
| FR9 | Epic 2 | Message list with role distinction |
| FR10 | Epic 2 | Scroll through history |
| FR11 | Epic 3 | Dynamic older message loading (infinite scroll) |
| FR12 | Epic 3 | Scroll position preservation |
| FR13 | Epic 3 | Loading indicator during fetch |
| FR14 | Epic 2 | Text input field |
| FR15 | Epic 2 | Auto-expanding input |
| FR16 | Epic 2 | Send via button |
| FR17 | Epic 2 | Send via Enter |
| FR18 | Epic 2 | Disable input during pending |
| FR19 | Epic 2 | Send via API client |
| FR20 | Epic 2 | Optimistic UI |
| FR21 | Epic 2 | Display assistant response |
| FR22 | Epic 2 | Fetch history on open |
| FR23 | Epic 2 | Multi-turn conversation |
| FR24 | Epic 4 | Error states as chat messages |
| FR25 | Epic 4 | Network failure resilience |
| FR26 | Epic 4 | Retry failed message |
| FR27 | Epic 4 | No-reload recovery |
| FR28 | Epic 7 | Scroll to bottom on send/response |
| FR29 | Epic 7 | Scroll-to-bottom control |

## Epic List

### Epic 1: Plugin Foundation & Chat Shell
Developer integrates the plugin into a Vue app; users see a floating button and can open/close a responsive chat panel.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8
**User outcome:** Developer completes integration (Journey 3). Users see the entry point and can open/close the panel. The plugin renders without breaking the host app.
**Implementation notes:** Includes project scaffold (VitePress + Vite library mode per Architecture). Establishes types, plugin install, config validation, theme, CSS isolation, FloatingButton, ChatPanel, ChatHeader, WelcomeState.

### Epic 2: Core Messaging Experience
User sends a message, sees it appear instantly, and receives an assistant response — the complete ask-and-answer loop with conversation history.
**FRs covered:** FR9, FR10, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23
**User outcome:** Full happy path (Journey 1). User opens chat, sees recent history, types a question, sends it, gets an answer. Conversation persists across sessions.
**Implementation notes:** Includes useChat() composable, MessageList, MessageBubble, ChatInput, optimistic UI, markdown rendering (marked + DOMPurify) for assistant messages, copy action, auto-scroll behavior, history fetch on open, conversation lifecycle management.

### Epic 3: Infinite Scroll & Deep History Browsing
User scrolls up through a long conversation history with seamless batch loading and no scroll jumps.
**FRs covered:** FR11, FR12, FR13
**User outcome:** Journey 2 (history browsing). Users with extended conversation histories can browse all past messages smoothly.
**Implementation notes:** Implements v-infinite-scroll with side="start", scroll position preservation on prepend, loading indicator. Includes the explicit 1000-message performance test gate from Architecture.

### Epic 4: Error Handling & Recovery
User encounters errors gracefully — failures appear as calm chat messages, input re-populates for easy retry, and the chat never breaks.
**FRs covered:** FR24, FR25, FR26, FR27
**User outcome:** Journey 2 (error recovery). The chat remains stable and usable even when things go wrong. No page reloads needed.
**Implementation notes:** Error-as-message pattern, failedMessageText retry mechanism, network failure resilience during history loading, no-reload recovery. Error states modeled in message lifecycle ('failed' status).

### Epic 5: VitePress Documentation & Interactive Playground
Developer finds comprehensive documentation with live interactive demos, enabling quick integration and exploration of the plugin's capabilities.
**FRs covered:** Supports FR1-FR4 delivery (Journey 3 — Developer Integration)
**User outcome:** Journey 3 complete. Developer reads docs, sees live demos, integrates confidently.
**Implementation notes:** DemoBlock.vue for source+preview, mock API client for demos, guide pages, component demo pages, VitePress sidebar navigation, landing page.

### Epic 6: Figma Design Alignment
The chat widget's layout, visual styling, and motion design match the approved Figma design — floating panel with edge gaps, pinned input, polished message spacing, smooth transitions, modern input area, correct theming, error distinction, refined panel/input styling, and enriched demo experience.
**FRs reinforced:** FR7 (overlay/panel position), FR8 (responsive viewports), FR12 (scroll position), FR18 (disable during pending — loading spinner), FR24 (error display — visual distinction)
**User outcome:** The widget looks and behaves exactly as designed in Figma. Input is always accessible, panel feels like a lightweight floating assistant rather than a rigid sidebar. Errors are visually recognizable. Demo site displays correctly.
**Implementation notes:** Replaces v-navigation-drawer with Teleport + positioned div for floating panel. Fixes scroll containment so only MessageList scrolls. CSS polish for bubble padding, message spacing, welcome state positioning. Stories 6.6-6.9 add input redesign (action bar pattern), VitePress theme/CSS fixes, error message distinction, and header/panel polish. Stories 6.10-6.11 add final UI refinements (solo input, panel background, copy button Vuetify refactor, new theme tokens) and demo experience improvements (richer mock data, simulated latency, smaller batch size). Stories 6.12-6.14 add typography enforcement (Open Sans font-family, explicit font-size, input-text theme token), input/header refinements (2-row default, 15px border-radius, text variant close button), and CSS import relocation to plugin install.

*Added via Correct Course workflow (2026-02-22) to align visual implementation with the approved Figma design. Extended via Correct Course workflow (2026-02-22c) with stories 6.6-6.9 for input redesign, VitePress fixes, error distinction, and UI polish. Extended via Correct Course workflow (2026-02-23) with stories 6.10-6.11 for UI refinements and demo experience enhancement. Extended via Correct Course workflow (2026-02-24) with stories 6.12-6.14 for typography enforcement, input/header refinements, and CSS import relocation.*

### Epic 7: Scroll Behavior Rework
The chat widget's scroll behavior matches industry-standard AI chat patterns — force-scroll on send/response, anchor-based history preservation, and a scroll-to-bottom affordance for manual navigation.
**FRs covered:** FR12 (rework), FR28, FR29
**User outcome:** Sending a message always takes the user to the live conversation edge. Loading older history never causes position jumps. A down-arrow button provides a one-click return from history browsing.
**Implementation notes:** All changes isolated to MessageList.vue. No composable or API changes. CSS overflow-anchor + JS anchor-element restoration.

*Added via Correct Course workflow (2026-02-23) to fix scroll behavior deviating from industry-standard AI chat patterns. Validated by multi-model consensus (Gemini 3 Pro, GPT-5.2) against ChatGPT, Claude, Gemini, and Copilot.*

## Epic 1: Plugin Foundation & Chat Shell

Developer integrates the plugin into a Vue app; users see a floating button and can open/close a responsive chat panel.

### Story 1.1: Project Scaffold & Build Configuration

As a developer,
I want a working project structure with build, test, and development tooling,
So that I can start implementing plugin components with confidence.

**Acceptance Criteria:**

**Given** a freshly cloned repository
**When** I run `yarn install`
**Then** all dependencies install without errors
**And** `package.json` declares `vue` and `vuetify` as peer dependencies

**Given** the project is set up
**When** I run `yarn build`
**Then** Vite produces `dist/native-chat-vue.es.js` (ESM-only) and `dist/native-chat-vue.css`
**And** `vite-plugin-dts` generates `.d.ts` declarations in `dist/types/`
**And** Vue and Vuetify are externalized (not bundled)

**Given** the project is set up
**When** I run `yarn test`
**Then** Vitest discovers and runs tests from co-located `__tests__/` folders

**Given** the project is set up
**When** I run `yarn docs:dev`
**Then** VitePress starts a dev server with Vuetify registered in the theme

**Given** the project is set up
**When** I run `yarn lint`
**Then** ESLint and Prettier check all source files

*Covers: FR1 (installable npm package). Establishes: Vite library mode, TypeScript strict, VitePress, Vitest, ESLint, Prettier, Yarn, project directory structure per Architecture.*

### Story 1.2: Core Types, API Client Helper & Plugin Install

As a developer,
I want to register the plugin with `app.use()` providing an API client configuration,
So that the plugin is configured and ready to render in my application.

**Acceptance Criteria:**

**Given** the plugin package is imported
**When** I call `app.use(NativeChatPlugin, { apiClient })`
**Then** the plugin registers successfully
**And** `<NativeChatWidget />` is available as a global component
**And** the configuration is provided to the component tree via `provide/inject` with Symbol-based keys

**Given** the plugin is being registered
**When** the `apiClient` property is missing from the config
**Then** the plugin logs a console warning with a clear message
**And** the plugin skips registration (no component registered)

**Given** the `createNativeChatApiClient` helper is imported
**When** I call `createNativeChatApiClient({ baseUrl, getAccessToken })`
**Then** it returns an object conforming to the `NativeChatApiClient` interface
**And** each method attaches the `Authorization: Bearer <token>` header using the `getAccessToken` callback

**Given** the package entry point `src/index.ts`
**When** a consumer imports from the package
**Then** `NativeChatPlugin`, `NativeChatWidget`, `createNativeChatApiClient`, and all public TypeScript interfaces are available

*Covers: FR2 (plugin registration), FR3 (auth token), FR4 (API client injection). Creates: `types/api.ts`, `types/chat.ts`, `types/config.ts`, `types/index.ts`, `helpers/createApiClient.ts`, `plugin.ts`, `keys.ts`, `index.ts`.*

### Story 1.3: Floating Agent Button

As a user,
I want to see a floating button in the corner of my app,
So that I can open the chat whenever I need assistance.

**Acceptance Criteria:**

**Given** the plugin is registered and `<NativeChatWidget />` is placed in the host app template
**When** the page loads
**Then** a circular floating button (56px, magenta `#C4105B`, white star icon) appears at the configured position (`bottom-right` by default)
**And** the button has a subtle elevation/shadow

**Given** the floating button is visible
**When** the user clicks the button
**Then** the `isOpen` state toggles to `true`

**Given** the chat panel is open
**When** the user clicks the floating button again
**Then** the `isOpen` state toggles to `false`

**Given** the plugin config specifies `position: 'bottom-left'`
**When** the button renders
**Then** it is positioned at the bottom-left of the viewport

**Given** the floating button is rendered
**When** a keyboard user tabs to it
**Then** a visible focus indicator appears
**And** the button has `aria-label="Open chat"` (or `"Close chat"` when open) and `aria-expanded` matching the open state

*Covers: FR5 (open via button), FR6 (close via button — partial). Creates: `NativeChatWidget.vue` (root wrapper), `FloatingButton.vue`, `theme/nativeChatTheme.ts`, CSS `@layer native-chat` setup.*

### Story 1.4: Chat Panel with Header & Welcome State

As a user,
I want the chat to open as a side panel with a title and welcome message,
So that I have a clear, familiar interface ready for conversation.

**Acceptance Criteria:**

**Given** the user clicks the floating button
**When** the chat opens
**Then** a side panel appears as a right-aligned overlay (~400px wide, 20px top border-radius)
**And** the panel contains a header with a magenta star icon, "AI Assistant" title, and a close (X) button
**And** the panel body displays a welcome message in large, light-gray text ("Hello! How can I help you?" by default, configurable via `welcomeMessage` option)

**Given** the chat panel is open
**When** the user clicks the close (X) button in the header
**Then** the panel closes
**And** focus returns to the floating button

**Given** the chat panel is open
**When** the user presses the Escape key
**Then** the panel closes
**And** focus returns to the floating button

**Given** the viewport is below 768px wide
**When** the chat opens
**Then** the panel renders as a full-screen takeover instead of an overlay
**And** dynamic viewport height (`dvh`) is used to handle virtual keyboards

**Given** the viewport is ≥768px wide
**When** the chat opens
**Then** the panel renders as a right-side overlay (~400px)
**And** the host app content remains visible and interactive alongside the panel

**Given** the chat panel is rendered
**When** inspecting the DOM
**Then** all plugin styles are wrapped in `@layer native-chat`
**And** all plugin components render within a `<v-theme-provider theme="nativeChat">`
**And** plugin styles do not affect host application elements
**And** the panel has `role="complementary"` and `aria-label="Chat with AI Assistant"`
**And** the close button has `aria-label="Close chat"` and is keyboard accessible

*Covers: FR6 (close via control), FR7 (overlay/panel position), FR8 (responsive viewports). Creates: `ChatPanel.vue`, `ChatHeader.vue`, `WelcomeState.vue`.*

## Epic 2: Core Messaging Experience

User sends a message, sees it appear instantly, and receives an assistant response — the complete ask-and-answer loop with conversation history.

### Story 2.1: useChat Composable & Conversation Lifecycle

As a user,
I want the chat to automatically find or create my conversation when I open it,
So that I can start chatting immediately without any setup.

**Acceptance Criteria:**

**Given** the user opens the chat for the first time (no conversations exist)
**When** `useChat()` initializes via `open()`
**Then** it calls `apiClient.getConversations(0, 1)`
**And** when no conversations are returned, it calls `apiClient.createConversation()`
**And** the new conversation ID is stored in state

**Given** the user opens the chat with existing conversations
**When** `useChat()` initializes via `open()`
**Then** it calls `apiClient.getConversations(0, 1)` and uses the most recent conversation
**And** it calls `apiClient.getMessages(conversationId, 0, batchSize)` to fetch the latest messages
**And** messages are reversed from newest-first (API order) to chronological (display order)

**Given** the plugin config includes `conversationId`
**When** `useChat()` initializes
**Then** it skips `getConversations()` and uses the provided conversation ID directly

**Given** `useChat()` is created
**When** any component in the tree calls `inject(CHAT_STATE_KEY)`
**Then** it receives the full `UseChatReturn` interface: `messages`, `isOpen`, `isLoading`, `isSending`, `hasMore`, `failedMessageText` (readonly refs) and `open()`, `close()`, `sendMessage()`, `loadMore()`, `retry()` (actions)

**Given** `useChat()` state is exposed
**When** a component reads any state ref
**Then** the ref is `Readonly<Ref<T>>` — components cannot mutate state directly

*Covers: FR22 (fetch history on open), FR23 (multi-turn conversation). Creates: `composables/useChat.ts` with conversation lifecycle, state management, provide/inject integration.*

### Story 2.2: Message List & Message Bubbles

As a user,
I want to see my conversation as a list of messages with clear visual distinction between my messages and the assistant's,
So that I can follow the conversation naturally.

**Acceptance Criteria:**

**Given** the chat is open and messages have been fetched
**When** the message list renders
**Then** user messages appear right-aligned with dark teal (`#002B38`) background and white (`#FDFDFD`) text, with user name and avatar above
**And** assistant messages appear left-aligned with white background and `#EBEBED` border, with "AI Assistant" label and star icon above
**And** each message is rendered as a `<li>` within a `<ul>` container

**Given** an assistant message contains markdown (headings, paragraphs, lists)
**When** the message renders
**Then** the content is parsed with `marked` and sanitized with DOMPurify before rendering via `v-html`
**And** user messages render as plain text (no markdown parsing)

**Given** an assistant message is displayed
**When** the user clicks the copy icon below the message
**Then** the message text is copied to the clipboard
**And** the icon changes to a checkmark for ~1.5 seconds then reverts
**And** if clipboard write fails (permission denied), the failure is silent

**Given** the message list is rendered
**When** inspecting accessibility
**Then** the list has `role="list"` and `aria-live="polite"`
**And** each message has `role="listitem"` with `aria-label` indicating the sender role

**Given** the user is at or near the bottom of the list (~50px threshold)
**When** a new message appears (user's own or assistant response)
**Then** the list auto-scrolls to the bottom

**Given** the user has scrolled up to read history
**When** a new message appears
**Then** the list does NOT auto-scroll — the user's scroll position is preserved

*Covers: FR9 (message list with role distinction), FR10 (scroll through history). Creates: `MessageList.vue`, `MessageBubble.vue`. Adds `marked` and `dompurify` dependencies.*

### Story 2.3: Chat Input & Send Message

As a user,
I want to type a message and send it with Enter or a send button,
So that I can ask questions quickly without extra steps.

**Acceptance Criteria:**

**Given** the chat is open and the input is focused
**When** the user types text
**Then** the textarea auto-expands vertically up to 6 lines (approximately 120px)
**And** beyond 6 lines, the textarea scrolls internally
**And** input lag stays below 100ms

**Given** the user has typed a message
**When** they press Enter
**Then** the message is sent
**And** the input clears

**Given** the user is typing a multi-line message
**When** they press Shift+Enter
**Then** a newline is inserted (message is NOT sent)

**Given** the user has typed a message
**When** they click the send button (magenta arrow icon)
**Then** the message is sent
**And** the input clears

**Given** the input field is empty
**When** the user presses Enter or clicks the send button
**Then** nothing happens (no empty message sent)
**And** the send button appears disabled/muted

**Given** the chat input is rendered
**When** a keyboard user tabs to it
**Then** it has `aria-label="Type a message"`
**And** the send button has `aria-label="Send message"`

*Covers: FR14 (text input), FR15 (auto-expand), FR16 (send via button), FR17 (send via Enter). Creates: `ChatInput.vue`.*

### Story 2.4: Send & Receive Message Flow (Optimistic UI)

As a user,
I want my message to appear instantly when I send it and see the assistant's response when it arrives,
So that the conversation feels responsive and natural.

**Acceptance Criteria:**

**Given** the user sends a message
**When** the send action executes
**Then** the user's message appears in the message list within one frame (16ms) with status `'sending'`
**And** the input clears and disables (along with the send button)
**And** `apiClient.sendMessage(conversationId, text)` is called

**Given** the API client returns a successful response
**When** the assistant's response is received
**Then** the user's message status updates to `'sent'`
**And** the assistant's response appears in the message list below the user's message
**And** the input and send button re-enable
**And** focus remains on the input field

**Given** the chat opens with existing history
**When** the initial message fetch completes
**Then** a loading indicator is shown while fetching
**And** messages render in chronological order (oldest at top, newest at bottom)
**And** the welcome state is replaced by the message list
**And** the view scrolls to the bottom (most recent messages)

**Given** the chat opens with no conversation history
**When** the initial fetch completes with zero messages
**Then** the welcome message remains visible
**And** the input is focused and ready

**Given** the initial history fetch fails
**When** the error occurs
**Then** the welcome message is shown as fallback
**And** the chat remains usable for new messages

*Covers: FR18 (disable during pending), FR19 (send via API client), FR20 (optimistic UI), FR21 (display response), FR22 (fetch history on open — integration), FR23 (multi-turn — integration).*

## Epic 3: Infinite Scroll & Deep History Browsing

User scrolls up through a long conversation history with seamless batch loading and no scroll jumps.

### Story 3.1: Infinite Scroll with History Loading

As a user,
I want older messages to load automatically as I scroll up,
So that I can browse my full conversation history without manual actions.

**Acceptance Criteria:**

**Given** the chat is open with messages loaded and more history exists on the server
**When** the user scrolls near the top of the message list
**Then** `v-infinite-scroll` (with `side="start"`) triggers a fetch for the next batch
**And** `apiClient.getMessages(conversationId, offset, batchSize)` is called with the correct offset
**And** a subtle loading indicator (`v-progress-circular`) appears at the top of the message list

**Given** the older message batch is returned successfully
**When** the messages are prepended to the list
**Then** the messages are reversed from newest-first to chronological order and added at the top
**And** the user's current scroll position is preserved — the view does not jump (achieved via `scrollTop` adjustment after prepend)
**And** the loading indicator disappears

**Given** the server returns `has_more: false`
**When** the response is processed
**Then** no further fetch requests are triggered when scrolling to the top
**And** `hasMore` state is set to `false`

**Given** a history fetch fails (network error, server error)
**When** the error occurs
**Then** the loading indicator disappears silently (no error message shown)
**And** the user can retry by scrolling up again

**Given** a fetch is already in progress
**When** the user continues scrolling
**Then** no duplicate requests are made (`v-infinite-scroll` handles debounce)

*Covers: FR11 (dynamic older message loading, configurable batch size), FR12 (scroll position preservation), FR13 (loading indicator).*

### Story 3.2: Performance Validation (1000-Message Benchmark)

As a developer,
I want to verify the chat maintains smooth scrolling with 1000+ messages loaded,
So that I can confirm the MVP scroll strategy meets performance requirements.

**Acceptance Criteria:**

**Given** a test environment with 1000 messages rendered in the MessageList
**When** the user scrolls through the list in Chrome
**Then** scroll interaction maintains ≥30fps
**And** no individual frame exceeds 50ms

**Given** the 1000-message benchmark
**When** older messages are loaded via infinite scroll
**Then** the scroll remains smooth with no visible jank (no frames >16ms)
**And** scroll position is preserved without jumping

**Given** the benchmark results
**When** the test completes
**Then** results are documented (pass/fail with FPS measurements)
**And** if the test fails, a follow-up story is created to replace `v-infinite-scroll` internals with a virtual scroller (the MessageList public API remains unchanged)

*Covers: NFR2 (no jank), NFR5 (≥30fps with 1000+ messages). Implements the explicit performance gate from Architecture.*

## Epic 4: Error Handling & Recovery

User encounters errors gracefully — failures appear as calm chat messages, input re-populates for easy retry, and the chat never breaks.

### Story 4.1: Error Display as Chat Messages

As a user,
I want errors to appear as calm messages in the chat stream,
So that I understand something went wrong without feeling alarmed or losing my place.

**Acceptance Criteria:**

**Given** the user sends a message and the API request fails (network error, HTTP 4xx/5xx)
**When** the error is caught in `useChat()`
**Then** the optimistic user message is removed from the message list
**And** an error message appears inline in the chat as a `MessageBubble` with `variant="error"`
**And** the error message is left-aligned, using the same visual container as assistant messages
**And** the error text is calm and informational (e.g., "Something went wrong. You can try sending your message again.")
**And** there are no red backgrounds, alert icons, or exclamation marks

**Given** the API returns specific HTTP status codes
**When** the error is mapped in `useChat()`
**Then** 429 maps to a rate-limit message
**And** 503/504 maps to a service unavailable message
**And** other errors map to a generic error message

**Given** the `onError` callback is configured in plugin options
**When** any API error occurs
**Then** the `onError(error: ChatError)` callback is invoked with the error details
**And** the inline error message still displays regardless of the callback

**Given** an error message is rendered
**When** a screen reader encounters it
**Then** the error message is announced via the existing `aria-live="polite"` region
**And** the message has an appropriate `aria-label` indicating it is an error

*Covers: FR24 (error states as chat messages).*

### Story 4.2: Message Retry & Error Recovery

As a user,
I want my failed message text to reappear in the input so I can retry easily,
So that I don't have to retype my question after a failure.

**Acceptance Criteria:**

**Given** a message send has failed
**When** the error is displayed
**Then** the input field re-enables immediately
**And** the input is pre-populated with the failed message text (via `failedMessageText` state)
**And** focus remains on the input field

**Given** the input is pre-populated with failed text
**When** the user presses Enter
**Then** the message is re-sent (same send flow: optimistic UI → API call)
**And** `failedMessageText` is cleared

**Given** the input is pre-populated with failed text
**When** the user edits the text and sends
**Then** the edited message is sent as a new message
**And** `failedMessageText` is cleared

**Given** an error has occurred
**When** the user scrolls through history, closes and reopens the chat, or performs any other action
**Then** the chat remains fully functional — no page reload needed
**And** the input stays enabled and usable
**And** scroll and panel toggle continue to work normally

**Given** a network failure occurs during message history loading (infinite scroll)
**When** the fetch fails
**Then** the loading indicator disappears silently
**And** no error message is shown in the chat
**And** the user can retry by scrolling up again

**Given** the chat is in an error state
**When** the user successfully sends a new message
**Then** the previous error message remains in the chat history (as a record)
**And** the new message flow proceeds normally

*Covers: FR25 (network failure resilience), FR26 (retry failed message), FR27 (no-reload recovery).*

## Epic 5: VitePress Documentation & Interactive Playground

Developer finds comprehensive documentation with live interactive demos, enabling quick integration and exploration of the plugin's capabilities.

*Added via Correct Course workflow (2026-02-21) to address missing documentation planning.*

### Story 5.1: DemoBlock Component & Mock API Client

As a developer browsing the docs,
I want to see live interactive demos with their source code displayed alongside,
So that I can understand how each component works and copy working examples.

**Acceptance Criteria:**

**Given** a VitePress documentation page uses `<DemoBlock>`
**When** the page renders
**Then** a live preview of the plugin component renders inside the block
**And** the source code is displayed below/beside the preview with syntax highlighting
**And** the demo is interactive (buttons click, input accepts text, messages display)

**Given** the docs site needs a working chat widget in demos
**When** a demo page renders `<NativeChatWidget />`
**Then** a mock API client provides simulated responses without a real backend
**And** the mock supports: returning canned conversations, simulating send/response, simulating errors

**Given** the VitePress theme setup
**When** the docs site loads
**Then** the plugin is registered in the VitePress app via `app.use(NativeChatPlugin, { apiClient: mockApiClient })`
**And** `<NativeChatWidget />` and all plugin components are available in demo pages

*Creates: `docs/.vitepress/components/DemoBlock.vue`, `docs/.vitepress/mock/mockApiClient.ts`, updates `docs/.vitepress/theme/index.ts`.*

### Story 5.2: Guide Documentation Pages

As a developer integrating the plugin,
I want clear documentation covering installation, configuration, and API client setup,
So that I can integrate the plugin into my application without guesswork.

**Acceptance Criteria:**

**Given** the docs site
**When** a developer navigates to the Getting Started guide
**Then** the page covers: installation (`yarn add`), peer dependency requirements (Vue 3, Vuetify 3), basic `app.use()` registration, placing `<NativeChatWidget />` in a template, and a minimal working example

**Given** the docs site
**When** a developer navigates to the Configuration guide
**Then** the page documents all `NativeChatPluginOptions` properties with types, defaults, and descriptions
**And** includes code examples for common configuration scenarios (custom position, welcome message, error callback)

**Given** the docs site
**When** a developer navigates to the API Client guide
**Then** the page documents the `NativeChatApiClient` interface with all method signatures
**And** explains the `createNativeChatApiClient` helper with usage example
**And** shows how to provide a custom API client implementation

**Given** the VitePress config
**When** the site renders
**Then** a sidebar navigation shows: Getting Started, Configuration, API Client under a "Guide" group

*Creates: `docs/guide/getting-started.md`, `docs/guide/configuration.md`, `docs/guide/api-client.md`. Updates `docs/.vitepress/config.ts` sidebar.*

### Story 5.3: Component Demo Pages & Landing Page

As a developer exploring the plugin,
I want interactive demos of key components with live playground,
So that I can see the plugin in action and experiment before integrating.

**Acceptance Criteria:**

**Given** the docs site
**When** a developer navigates to the Full Widget demo page
**Then** a complete `<NativeChatWidget />` renders with mock API client
**And** the developer can open the chat, send messages, receive simulated responses, scroll history, and trigger errors
**And** the source code for the demo setup is visible via DemoBlock

**Given** the docs site
**When** a developer navigates to individual component demo pages
**Then** MessageBubble demos show user, assistant, and error variants with markdown rendering
**And** ChatInput demo shows auto-expand, send, and keyboard behavior
**And** each demo includes source code via DemoBlock

**Given** the docs landing page (`docs/index.md`)
**When** a developer visits the docs site root
**Then** a VitePress hero section with plugin name, tagline, and quick-start links renders
**And** feature highlights summarize key capabilities

**Given** the VitePress config
**When** the site renders
**Then** sidebar navigation shows component demos under a "Components" group
**And** `yarn docs:build` completes without errors

*Creates: `docs/index.md` (new consumer-facing landing page), `docs/components/widget.md`, `docs/components/message-bubble.md`, `docs/components/chat-input.md`. Updates `docs/.vitepress/config.ts` sidebar.*

## Epic 6: Figma Design Alignment

The chat widget's layout and visual styling match the approved Figma design — floating panel with edge gaps, pinned input, and polished message spacing.

*Added via Correct Course workflow (2026-02-22) to align visual implementation with the approved Figma design.*

### Story 6.1: Floating Panel Layout & Scroll Containment

As a user,
I want the chat panel to float with gaps from the window edges and the input to always stay pinned at the bottom,
So that the widget feels like a lightweight overlay and I can always type without scrolling.

**Acceptance Criteria:**

**Given** the chat is open on desktop (>=768px)
**When** inspecting the panel
**Then** it has ~24px gaps from the right, top, and bottom window edges
**And** all four corners are rounded (20px border-radius)
**And** a prominent drop shadow is visible (`box-shadow: 0 8px 40px rgba(0,0,0,0.12)`)

**Given** the chat is open with messages
**When** messages fill the panel beyond its height
**Then** only the message list area scrolls
**And** the header remains fixed at the top
**And** the input remains fixed at the bottom
**And** the input never scrolls away regardless of message content length

**Given** the chat is open on mobile (<768px)
**When** inspecting the panel
**Then** it renders as a full-screen takeover with no edge gaps
**And** height is `100dvh`
**And** border-radius is 0

**Given** the chat panel is open
**When** the user presses Escape
**Then** the panel closes and focus returns to the floating button

**Given** the panel implementation
**When** inspecting the DOM
**Then** `v-navigation-drawer` is no longer used
**And** the panel is rendered via `Teleport` to body with a fixed-positioned div

**Given** the existing test suite
**When** running `yarn test`
**Then** all ChatPanel and integration tests pass with updated selectors

*Modifies: `ChatPanel.vue`, `ChatPanel.test.ts`, `SendReceiveFlow.test.ts`. Removes: `v-navigation-drawer` dependency from ChatPanel.*

### Story 6.2: Visual Polish & Figma Spacing

As a user,
I want message bubbles, spacing, and input to match the Figma design precisely,
So that the chat feels polished and professional.

**Acceptance Criteria:**

**Given** a user or assistant message bubble
**When** rendered
**Then** the bubble has `12px 16px` padding (increased from `8px 12px`)

**Given** the message list with multiple messages
**When** displayed
**Then** the vertical gap between messages is `16px` (increased from `14px`)

**Given** the chat input field
**When** rendered with no text
**Then** the placeholder reads "How can I help you? Ask me anything..."

**Given** the welcome state (no messages, first open)
**When** displayed
**Then** the greeting text is positioned in the upper area of the panel (not vertically centered)
**And** there is approximately `48px` top padding

**Given** all visual changes
**When** running `yarn test`
**Then** all tests pass

*Modifies: `MessageBubble.vue` (CSS), `MessageList.vue` (CSS), `ChatInput.vue` (template), `WelcomeState.vue` (CSS).*

### Story 6.3: Update Planning Artifacts

As a project maintainer,
I want the architecture, UX spec, and project context documents to reflect the ChatPanel architectural change,
So that future implementation work references accurate component descriptions.

**Acceptance Criteria:**

**Given** `architecture.md`
**When** reading the ChatPanel component description and hierarchy diagram
**Then** it describes `Teleport` + positioned div (not `v-navigation-drawer`)
**And** the Vuetify components table for ChatPanel is updated

**Given** `ux-design-specification.md`
**When** reading Component Strategy > ChatPanel
**Then** it describes the floating panel approach with Teleport + positioned div
**And** the Vuetify components table no longer lists `v-navigation-drawer` for the chat panel

**Given** `project-context.md`
**When** reading the Vuetify components or Vue rules section
**Then** `v-navigation-drawer` is not listed as a ChatPanel dependency

**Given** `epics.md`
**When** reading the document
**Then** Epic 6 with all stories and full acceptance criteria is present

*Modifies: `architecture.md`, `ux-design-specification.md`, `project-context.md`. Already partially updated: `epics.md`, `sprint-status.yaml`.*

### Story 6.4: Chat Panel & FAB Transitions

As a user,
I want the chat panel to animate smoothly when opening and closing, and the floating button icon to transition between states,
So that the widget feels polished and responsive rather than abruptly appearing/disappearing.

**Acceptance Criteria:**

**Given** the user clicks the floating button to open the chat
**When** the panel appears
**Then** it scales up from the bottom-right with an opacity fade (280ms, easeOutExpo)
**And** the floating button icon transitions from star to close (X) with a rotate+scale animation (120ms)

**Given** the user closes the chat (via close button, floating button, or Escape)
**When** the panel disappears
**Then** it scales down with an opacity fade (200ms, easeInExpo)
**And** the floating button icon transitions from close (X) back to star

**Given** the viewport is below 768px (mobile)
**When** the chat opens or closes
**Then** the panel slides up from the bottom (translateY) instead of scaling

**Given** the user has `prefers-reduced-motion: reduce` enabled
**When** any transition fires
**Then** the transition duration is 0ms (instant, no animation)

**Given** the existing test suite
**When** running `yarn test`
**Then** all tests pass with the Transition wrapper

*Modifies: `ChatPanel.vue` (adds `<Transition>`), `FloatingButton.vue` (adds icon swap + `<Transition>`). Restores transitions lost when Story 6.1 replaced `v-navigation-drawer`.*

*Added via Correct Course workflow (2026-02-22b) to document animation changes made outside BMAD workflow.*

### Story 6.5: Message Bubble Entrance Animations

As a user,
I want new messages to slide into view when they appear in the conversation,
So that I have a clear visual cue of new content arriving.

**Acceptance Criteria:**

**Given** the user sends a message
**When** it appears in the message list (optimistic UI)
**Then** the bubble slides in from the right (16px translateX, 250ms, easeOutExpo)

**Given** the assistant responds
**When** the response appears in the message list
**Then** the bubble slides in from the left (16px translateX, 250ms, easeOutExpo)

**Given** the chat opens and initial history loads
**When** messages render for the first time
**Then** no entrance animation plays — messages appear instantly

**Given** the user scrolls up and triggers loadMore (infinite scroll)
**When** older messages prepend to the list
**Then** no entrance animation plays — messages appear instantly

**Given** the user has `prefers-reduced-motion: reduce` enabled
**When** any message animation would fire
**Then** the animation is disabled (CSS `animation: none`)

**Given** the MessageBubble component
**When** the `animate` prop is `false` (default)
**Then** no `nc-message-bubble--animate-in` class is applied

*Modifies: `MessageBubble.vue` (adds `animate` prop + CSS keyframes), `MessageList.vue` (adds watcher-based animation tracking with `knownIds`/`animatingIds`). Tests added for animation prop toggling and suppression.*

*Added via Correct Course workflow (2026-02-22b) to document animation changes made outside BMAD workflow.*

### Story 6.6: Chat Input Redesign

As a user,
I want the chat input to have a full-width textarea with an action bar below and a clean icon-only send button,
So that the input area feels modern and uncluttered like ChatGPT or Claude desktop.

**Acceptance Criteria:**

**Given** the chat is open
**When** the input area renders
**Then** the textarea spans the full width of the chat panel
**And** the textarea has a pill-shaped border radius (28px)
**And** the send button sits on a separate action row below the textarea, anchored to the bottom-right

**Given** the send button is visible
**When** inspecting its styling
**Then** it uses `variant="plain"` (no background by default)
**And** visual feedback (opacity change) appears only on hover, focus, or click
**And** the button uses `color="secondary"` (magenta icon)

**Given** the user sends a message
**When** `isSending` is true
**Then** the send icon (`IconSend`) is replaced by a `v-progress-circular` spinner (indeterminate, size 18)
**And** the spinner uses `color="secondary"`

**Given** the send completes (success or error)
**When** `isSending` returns to false
**Then** the spinner is replaced by the send icon

**Given** the input area is rendered
**When** testing keyboard and focus behavior
**Then** Enter-to-send, Shift+Enter for newline, auto-grow (1-6 rows), disabled during sending, and focus management all work identically to before

**Given** the existing test suite
**When** running `yarn test`
**Then** all ChatInput tests pass (selectors may need updating for new DOM structure)

*Modifies: `ChatInput.vue` (template restructure + CSS). No composable or state changes.*

*Added via Correct Course workflow (2026-02-22c) to align input area with ChatGPT/Claude desktop action-bar pattern.*

### Story 6.7: VitePress Demo Environment Fixes

As a developer viewing the docs site,
I want the chat widget to display with correct theme colors and unbroken markdown rendering,
So that the demo accurately represents how the plugin looks in production.

**Acceptance Criteria:**

**Given** the VitePress docs site is running (`yarn docs:dev`)
**When** the chat widget opens
**Then** user message bubbles use primary color `#002B38` (not Vuetify default `#1867C0`)
**And** the send button and floating button use secondary color `#C4105B`
**And** the chat panel has a white (`#FFFFFF`) background
**And** all theme token CSS variables resolve to nativeChatTheme values

**Given** the chat panel is rendered via Teleport to body
**When** inspecting the DOM
**Then** the teleported content is wrapped in `<v-theme-provider theme="nativeChat">`
**And** theme CSS variables (`--v-theme-primary`, `--v-theme-surface`, etc.) are available inside the panel

**Given** an assistant message contains markdown with bullet lists (`ul`, `li`)
**When** rendered in the VitePress docs site
**Then** the list renders with proper bullet markers (not stripped by VitePress global CSS)
**And** list item spacing matches the plugin's own styles, not VitePress defaults

**Given** the chat panel is open
**When** inspecting the panel background
**Then** the background is fully opaque (`rgb(var(--v-theme-surface))` resolves to `#FFFFFF`)
**And** the floating button shadow is not visible through the panel

**Given** the existing test suite
**When** running `yarn test`
**Then** all tests pass

*Modifies: `ChatPanel.vue` (add v-theme-provider inside Teleport, CSS list resets), `MessageBubble.vue` (CSS list style resets).*

*Added via Correct Course workflow (2026-02-22c) to fix Teleport-breaks-theme-provider root cause and VitePress CSS bleed.*

### Story 6.8: Error Message Visual Distinction

As a user,
I want error messages to look visually different from assistant messages,
So that I can immediately recognize when something went wrong.

**Acceptance Criteria:**

**Given** an error message is displayed in the chat
**When** comparing it to an assistant message
**Then** the error bubble has a subtle red-tinted background (`rgba(error, 0.06)`)
**And** the error bubble has a red-tinted border (`rgba(error, 0.2)`)
**And** the styling is calm and not alarming — no solid red backgrounds or large alert icons

**Given** an error message is displayed
**When** inspecting its header
**Then** it shows a small muted warning icon and "Error" label (left-aligned)
**And** the icon uses the error theme color at reduced opacity

**Given** the error styling
**When** the nativeChat theme is applied
**Then** the error color (`#DE3232`) is used via theme tokens, not hardcoded

**Given** the existing calm tone principle
**When** evaluating the error visual treatment
**Then** the distinction is subtle enough to not feel alarming
**And** the error text content remains calm and informational

**Given** the existing test suite
**When** running `yarn test`
**Then** all MessageBubble tests pass (new selectors may need tests added)

*Modifies: `MessageBubble.vue` (template: add error header; CSS: split error from assistant bubble styling).*

*Added via Correct Course workflow (2026-02-22c). Note: This is a refinement of the UX spec's "no red backgrounds" guideline — the 6% opacity tint is nearly invisible but provides the needed distinction.*

### Story 6.9: Panel & Header UI Polish

As a user,
I want the chat header and panel to have polished visual details,
So that the widget feels refined and professional.

**Acceptance Criteria:**

**Given** the chat panel is open
**When** inspecting the floating trigger button
**Then** its elevation is `0` (no shadow)
**And** the button shadow does not bleed through the panel

**Given** the chat panel is closed
**When** inspecting the floating trigger button
**Then** its elevation is `4` (normal shadow)

**Given** the chat header is rendered
**When** inspecting the bottom edge
**Then** a subtle divider line is visible (`1px solid` at 12% opacity of the on-surface color)

**Given** the close (X) button in the header
**When** inspecting its size
**Then** the button uses `size="default"` (not `size="small"`)
**And** the icon uses `size="22"` (not `size="18"`)
**And** the button meets the 44px minimum tap target

**Given** the close button
**When** the user hovers over it
**Then** no dark background appears
**And** the button uses `variant="plain"` (opacity change only on hover)

**Given** the existing test suite
**When** running `yarn test`
**Then** all tests pass

*Modifies: `FloatingButton.vue` (dynamic elevation), `ChatHeader.vue` (border-bottom, close button size and variant).*

*Added via Correct Course workflow (2026-02-22c) for UI polish items identified during design review.*

### Story 6.10: UI Polish & Theme Refinements

As a user,
I want the chat panel, input field, and copy button to have refined visual styling,
So that the widget feels more polished and visually cohesive.

**Acceptance Criteria:**

**Given** the chat panel is open on desktop (>=768px)
**When** inspecting the panel
**Then** it has a visible border (`border-md` class)
**And** edge gaps are 25px right, 20px top and bottom
**And** the background uses the `chat-background` theme token (`#EBEBED`) instead of surface white

**Given** the chat input field
**When** rendered
**Then** it uses `variant="solo"` with `flat` (no outline border, clean inset look)
**And** rounding is `lg` (not `xl`)
**And** placeholder text remains "How can I help you? Ask me anything..."

**Given** an assistant message with a copy button
**When** inspecting the copy action
**Then** it uses a Vuetify `<v-btn icon variant="text" size="small">` instead of a custom HTML button
**And** the icon uses `color="title"` (`#9E9E9E`) by default, `color="success"` after copy
**And** custom `.nc-message-bubble__copy` CSS is removed (Vuetify handles styling)

**Given** the nativeChatTheme definition
**When** inspecting theme colors
**Then** `chat-background: #EBEBED` is defined for panel background
**And** `title: #9E9E9E` is defined for muted icon colors
**And** `theme-overlay-multiplier: 1` is set in variables

**Given** the existing test suite
**When** running `yarn test`
**Then** all MessageBubble copy button tests pass with updated selectors
**And** all other tests pass

*Modifies: `ChatInput.vue` (variant, flat, rounded), `ChatPanel.vue` (border, gaps, background), `MessageBubble.vue` (copy button refactor + CSS removal), `nativeChatTheme.ts` (new colors + variable), `MessageBubble.test.ts` (selector updates for 5 tests).*

*Added via Correct Course workflow (2026-02-23) to document UI polish changes made outside BMAD workflow.*

### Story 6.11: Demo Experience Enhancement

As a developer browsing the docs site,
I want the demo to have a rich conversation history with realistic loading behavior,
So that I can experience infinite scroll and evaluate the plugin's performance with realistic data.

**Acceptance Criteria:**

**Given** the VitePress docs site is running (`yarn docs:dev`)
**When** the chat widget opens and the user scrolls up
**Then** 40+ older messages are available via infinite scroll (20 user/assistant pairs)
**And** message content covers realistic Vue development topics (refs, routing, composables, testing, etc.)
**And** each pair has timestamps spaced 1 minute apart, counting backwards

**Given** the mock API client's getMessages method
**When** called during infinite scroll
**Then** it simulates 300ms–1s network latency before returning results
**And** the loading indicator is visible during the delay, providing realistic UX feedback

**Given** the VitePress plugin configuration
**When** the docs site loads
**Then** `batchSize` is set to `5` (not the default 20)
**And** infinite scroll triggers frequently, making it easy to test pagination behavior

**Given** the existing hand-written mock messages (10 messages)
**When** combined with the generated older messages
**Then** older generated messages appear first (earliest timestamps)
**And** the 10 hand-written messages appear last (most recent)
**And** message ordering is correct throughout

**Given** the existing test suite
**When** running `yarn test`
**Then** all tests pass (mock changes are docs-only, no impact on source tests)

*Modifies: `docs/.vitepress/mock/mockApiClient.ts` (older message generation + latency simulation), `docs/.vitepress/theme/index.ts` (batchSize config).*

*Added via Correct Course workflow (2026-02-23) to document demo improvements made outside BMAD workflow.*

### Story 6.12: Typography & Font Enforcement

As a user,
I want the chat widget to render all text in Open Sans consistently,
So that the widget matches the approved Figma design typography across all host apps.

**Acceptance Criteria:**

**Given** the chat panel is open
**When** inspecting any text element
**Then** the font-family is `'Open Sans', sans-serif` applied via `@layer native-chat` base styles
**And** `.nc-chat-panel` and `.nc-floating-button-wrapper` both inherit the font

**Given** the VitePress docs site is running
**When** the chat widget renders
**Then** Open Sans is loaded via Google Fonts import (weights 300-700)
**And** all widget text renders in Open Sans, not the VitePress default font

**Given** a message bubble (user or assistant)
**When** rendered
**Then** the font-size is explicitly `14px` (matching the UX spec type scale)

**Given** the chat input textarea
**When** the user types
**Then** the text renders in the inherited Open Sans font-family
**And** text color uses the `input-text` theme token (`#727272`)

**Given** the nativeChatTheme definition
**When** inspecting theme colors
**Then** `input-text: '#727272'` is defined for textarea text color

*Modifies: `styles.css` (font-family rule), `docs/.vitepress/theme/overrides.css` (Google Fonts import), `MessageBubble.vue` (font-size), `ChatInput.vue` (font-family inherit, color token), `nativeChatTheme.ts` (input-text token).*

*Added via Correct Course workflow (2026-02-24) to document typography changes made outside BMAD workflow.*

### Story 6.13: Input Field & Header Refinements

As a user,
I want the chat input to have a taller default size and refined border radius, and the header close button to have consistent hover behavior,
So that the input area feels more inviting and the header controls behave uniformly.

**Acceptance Criteria:**

**Given** the chat input field
**When** rendered with no text
**Then** the textarea displays 2 visible rows by default (increased from 1)
**And** the border-radius is 15px (custom, replacing Vuetify `rounded="lg"`)

**Given** the chat input textarea
**When** the user types long content
**Then** the textarea auto-grows up to 10 rows with no max-height CSS constraint

**Given** the close (X) button in the header
**When** inspecting its variant
**Then** the button uses `variant="text"` (changed from `variant="plain"`)
**And** hover produces a subtle background highlight instead of opacity-only change

**Given** the existing test suite
**When** running `yarn test`
**Then** all tests pass

*Modifies: `ChatInput.vue` (rows, border-radius, removed max-height), `ChatHeader.vue` (close button variant).*

*Added via Correct Course workflow (2026-02-24) to document input and header refinements made outside BMAD workflow.*

### Story 6.14: CSS Import Relocation to Plugin Install

As a developer,
I want the plugin's base CSS to load during plugin installation rather than on bare import,
So that consumers who import individual exports (types, helpers) don't trigger unwanted CSS side effects.

**Acceptance Criteria:**

**Given** a consumer imports only types or helpers from the package
**When** the import resolves
**Then** no CSS side effects are triggered (no `styles.css` loaded)

**Given** a consumer calls `app.use(NativeChatPlugin, options)`
**When** the plugin installs
**Then** `styles.css` is loaded as a side effect of `plugin.ts`
**And** the `@layer native-chat` base styles (including font-family) are applied

**Given** the package entry point `src/index.ts`
**When** inspecting its imports
**Then** it no longer contains `import './styles.css'`

**Given** `src/plugin.ts`
**When** inspecting its imports
**Then** it contains `import './styles.css'` as the first line

**Given** the existing test suite and build
**When** running `yarn test && yarn build`
**Then** all tests pass and the CSS is still included in the production bundle

*Modifies: `src/index.ts` (remove CSS import), `src/plugin.ts` (add CSS import).*

*Added via Correct Course workflow (2026-02-24) to document build hygiene change made outside BMAD workflow.*

## Epic 7: Scroll Behavior Rework

The chat widget's scroll behavior matches industry-standard AI chat patterns — force-scroll on send/response, anchor-based history preservation, and a scroll-to-bottom affordance for manual navigation.

*Added via Correct Course workflow (2026-02-23) to fix scroll behavior deviating from industry-standard AI chat patterns. Validated by multi-model consensus (Gemini 3 Pro, GPT-5.2) against ChatGPT, Claude, Gemini, and Copilot.*

### Story 7.1: Event-Driven Scroll Policy

As a user,
I want the chat to scroll to my newest message when I send one and to the assistant's response when it arrives,
So that I always see the active conversation without manually scrolling down.

**Acceptance Criteria:**

**Given** the user is scrolled to the middle of chat history
**When** they send a message
**Then** the message list scrolls to the bottom showing the new message
**And** this happens regardless of how far up the user had scrolled

**Given** the user sent a message and is waiting for a response
**When** the assistant response arrives (complete message, MVP)
**Then** the message list scrolls to the bottom showing the response
**And** this happens regardless of current scroll position

**Given** older messages are being loaded via infinite scroll
**When** the messages prepend to the list
**Then** the scroll position is preserved — no scroll to bottom occurs
**And** the user continues viewing the same messages they were reading

**Given** the existing auto-scroll watcher in MessageList.vue
**When** refactored
**Then** scroll policy is event-driven: separate handling for user-send, assistant-response, and history-prepend
**And** the single isNearBottom gate is no longer the sole scroll controller

**Given** the existing test suite
**When** running `yarn test`
**Then** all tests pass (scroll behavior tests updated for new policy)

*Covers: FR28 (scroll on send/response). Modifies: `MessageList.vue` (scroll watcher refactor).*

### Story 7.2: Anchor-Based Scroll Preservation

As a user,
I want loading older messages to never jump my scroll position,
So that I can browse history smoothly without losing my place.

**Acceptance Criteria:**

**Given** the user is reading messages in the middle of the list
**When** infinite scroll triggers and older messages load
**Then** the message the user was reading stays in exactly the same viewport position
**And** no visible jump occurs — the content above expands upward only

**Given** the scroll container
**When** inspecting CSS
**Then** `overflow-anchor: auto` is applied as a baseline browser-native anchor

**Given** the handleLoadMore function
**When** older messages prepend
**Then** anchor-based restoration is used:
  1. Before prepend: capture the first visible message element and its `getBoundingClientRect().top`
  2. After prepend + render: measure the same element's new `.top`
  3. Adjust `scrollTop` by the delta
**And** this technique is robust against Vuetify spinner insertion/removal

**Given** the v-infinite-scroll loading spinner
**When** it appears and disappears during a load cycle
**Then** no scroll position shift occurs from spinner DOM changes

**Given** the existing test suite
**When** running `yarn test`
**Then** all tests pass

*Covers: FR12 (scroll position preservation — rework). Modifies: `MessageList.vue` (handleLoadMore refactor, CSS addition).*

### Story 7.3: Scroll-to-Bottom FAB Button

As a user,
I want a down-arrow button to appear when I've scrolled up in the chat,
So that I can quickly return to the most recent messages with one click.

**Acceptance Criteria:**

**Given** the user has scrolled up past the ~50px near-bottom threshold
**When** the message list renders
**Then** a small circular down-arrow button appears overlaid on the bottom-right of the message list area
**And** the button uses `v-btn` with `icon`, `variant="elevated"`, `color="secondary"`, `size="small"`
**And** the button transitions in with an opacity fade

**Given** the scroll-to-bottom button is visible
**When** the user clicks it
**Then** the message list scrolls to the most recent message
**And** the button disappears (user is now at bottom)

**Given** the user is at or near the bottom of the message list
**When** the message list renders
**Then** no scroll-to-bottom button is visible

**Given** the scroll-to-bottom button
**When** inspecting accessibility
**Then** the button has `aria-label="Scroll to latest messages"`

**Given** the user has `prefers-reduced-motion: reduce` enabled
**When** the button appears or disappears
**Then** the transition is instant (no fade animation)

**Given** the existing test suite
**When** running `yarn test`
**Then** all tests pass with new tests for the FAB button

*Covers: FR29 (scroll-to-bottom control). Modifies: `MessageList.vue` (add FAB element + visibility logic).*
