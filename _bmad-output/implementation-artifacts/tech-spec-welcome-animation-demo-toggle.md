---
title: 'Welcome Message Animation & Demo Toggle'
slug: 'welcome-animation-demo-toggle'
created: '2026-02-26'
status: 'implementation-complete'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Vue 3.5+', 'Vuetify 3.11+', 'TypeScript 5.9+ (strict)', 'Vite 7.3+ (library mode)', 'VitePress (docs)', 'Vitest 4+ (jsdom)', '@vue/test-utils 2.4+']
files_to_modify: ['src/components/WelcomeState.vue', 'src/components/ChatInput.vue', 'src/types/config.ts', 'docs/.vitepress/mock/mockApiClient.ts', 'docs/components/demos/WidgetConfigDemo.vue', 'src/components/__tests__/WelcomeState.test.ts', 'src/components/__tests__/ChatInput.test.ts', 'vitest.setup.ts']
code_patterns: ['nc- prefix for CSS classes/animations/keyframes', 'prefers-reduced-motion: reduce on all animations', '<script setup lang="ts"> only', 'defineProps<Interface>() typed interfaces', 'provide/inject via Symbol keys from src/keys.ts', '@/ alias imports (never relative)', 'scoped styles on all components', 'Vuetify theme tokens rgb(var(--v-theme-*))']
test_patterns: ['co-located __tests__/ folders', '.test.ts suffix', 'mountComponentName() helper per file', 'createMockChatState() for injection', '[CHAT_STATE_KEY as symbol] cast in provide', 'behavior-focused assertions', 'vi.fn() for action mocks', 'vitest globals (no imports for describe/it/expect/vi)']
---

# Tech-Spec: Welcome Message Animation & Demo Toggle

**Created:** 2026-02-26

## Overview

### Problem Statement

The welcome message in `WelcomeState.vue` is static and unengaging — it just appears instantly when the chat opens with no history. The welcome text ("Hello! How can I help you?") and the input placeholder ("How can I help you? Ask me anything...") are nearly identical, creating redundant copy. Additionally, the demo environment always loads 30 messages of conversation history, so there's no way to showcase the empty/welcome state to consumers.

### Solution

Add a typewriter animation to the welcome message for an engaging first impression, differentiate the welcome and placeholder copy with distinct purposes, make the placeholder configurable via `NativeChatPluginOptions`, and add a toggle in the demo to switch between a fresh conversation (showing the welcome state) and the existing conversation history.

### Scope

**In Scope:**
- Typewriter animation on `WelcomeState.vue` using CSS/JS, following `nc-` naming prefix and `prefers-reduced-motion: reduce` fallback
- Updated default welcome text: "What can I help you with today?"
- Updated default placeholder text: "Type your message..."
- New `placeholder` property on `NativeChatPluginOptions`
- Piping `placeholder` config through to `ChatInput.vue`
- Demo toggle in `WidgetConfigDemo.vue` that wipes/restores messages to show the welcome state

**Out of Scope:**
- Redesigning WelcomeState layout beyond the animation
- Changing other demo pages (error demo, input demo, etc.)
- Modifying existing message bubble animations
- New mock conversation data

## Context for Development

### Codebase Patterns

- All animations use `nc-` prefix for transition names and `@keyframes` names
- Every animation includes `@media (prefers-reduced-motion: reduce)` block to disable
- Vue `<Transition>` for enter/leave, CSS `@keyframes` for element animations
- Existing durations: 120ms–280ms, cubic-bezier easing `(0.16, 1, 0.3, 1)` for enter, `(0.4, 0, 1, 1)` for leave
- Components use `<script setup lang="ts">` exclusively
- Props via `defineProps<Interface>()` with typed interfaces
- State managed via `useChat()` composable → `provide/inject`
- All `<style>` blocks are `scoped`
- Colors via Vuetify theme tokens: `rgb(var(--v-theme-*))`
- Imports use `@/` alias, never relative paths

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/components/WelcomeState.vue` | Welcome message component — add typewriter animation here |
| `src/components/ChatInput.vue` | Chat input — update placeholder to use config prop |
| `src/types/config.ts` | Plugin options type — add `placeholder` property |
| `src/plugin.ts` | Plugin install — provides config via injection |
| `src/components/ChatPanel.vue` | Parent that renders WelcomeState and ChatInput, passes config |
| `src/keys.ts` | Injection key symbols |
| `docs/.vitepress/mock/demoConfig.ts` | Demo configuration |
| `docs/components/demos/WidgetConfigDemo.vue` | Demo page with config toggles — add fresh/history toggle |
| `docs/.vitepress/mock/mockApiClient.ts` | Mock API client with conversation data |
| `src/components/MessageBubble.vue` | Reference for existing animation patterns |
| `src/components/FloatingButton.vue` | Reference for existing transition patterns |

### Technical Decisions

- **Typewriter approach**: JS-driven character-by-character reveal using `setInterval` in `<script setup>`, with CSS for the blinking cursor. Pure CSS typewriter requires fixed `ch` width which won't work with configurable messages. Use `ref<string>` for displayed text, `setInterval` at ~70ms per char (~14 chars/sec), cleanup via `onUnmounted`. _(Originally spec'd at 40ms; increased to 70ms after user testing for a more readable animation pace.)_
- **Cursor**: Blinking pipe (`|`) cursor via CSS `@keyframes nc-typewriter-cursor` with `border-right` on a `<span>`. Cursor blinks during typing, disappears (or stops blinking) after typing completes. Use `animation: nc-typewriter-cursor 0.7s step-end infinite`.
- **Reduced motion**: Detect via `window.matchMedia('(prefers-reduced-motion: reduce)')`. When active, set displayed text to full message immediately on mount — no typewriter, no cursor blink.
- **Placeholder config**: Add optional `placeholder?: string` to `NativeChatPluginOptions`. ChatInput already injects `CHAT_STATE_KEY`; add `CONFIG_KEY` inject to read `config.placeholder`. Default to `"Type your message..."` when not provided.
- **ChatPanel passthrough**: ChatPanel already injects `CONFIG_KEY` and reads `welcomeMessage`. No changes needed there — ChatInput reads config directly.
- **Demo toggle**: Follow existing `simulateErrorCode` / `setSimulateError()` pattern in `mockApiClient.ts`. Export `simulateFreshConversation` boolean + `setSimulateFreshConversation()` setter. When true: `getConversations` returns empty list (triggers `createConversation`), `getMessages` returns `{ messages: [], has_more: false }`. User closes/reopens chat to see the welcome state. WidgetConfigDemo can't access `CHAT_STATE_KEY` (outside widget tree), so manual close/reopen is the correct UX — add hint text in the demo.
- **Animation plays once**: The typewriter runs on mount only. If the component re-mounts (chat close/open cycle), it replays — this is correct behavior since the user is seeing a "fresh" welcome.

## Implementation Plan

### Tasks

- [x] Task 1: Add `placeholder` to plugin options type
  - File: `src/types/config.ts`
  - Action: Add `placeholder?: string` property to `NativeChatPluginOptions` interface, after `welcomeMessage`
  - Notes: Optional string, no default value in the type — default is applied at the component level

- [x] Task 2: Rewrite `WelcomeState.vue` with typewriter animation
  - File: `src/components/WelcomeState.vue`
  - Action:
    1. Keep existing `message` prop (optional string)
    2. Add `const fullText = computed(() => props.message ?? 'What can I help you with today?')`
    3. Add `const displayedText = ref('')` and `const isTyping = ref(true)`
    4. On `onMounted`: check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
       - If reduced motion: set `displayedText.value = fullText.value`, `isTyping.value = false`, return
       - Otherwise: start `setInterval` at 70ms, append one character per tick from `fullText.value`
       - When all characters revealed: `clearInterval`, set `isTyping.value = false`
    5. Store interval ID as `ReturnType<typeof setInterval>` (project convention — never `number` or `NodeJS.Timeout`)
    6. On `onUnmounted`: clear the interval if still running
    7. Template structure (accessibility-first):
       - Add a `<span class="nc-welcome-state__sr-only" role="status" aria-live="polite">{{ fullText }}</span>` — screen readers get the full text immediately, no partial announcements
       - Add a `<span class="nc-welcome-state__text" aria-hidden="true">{{ displayedText }}</span>` — the animated visual text is hidden from screen readers
       - Add a `<span v-if="isTyping" class="nc-welcome-state__cursor" aria-hidden="true"></span>` — blinking cursor, also hidden from screen readers
    8. CSS: keep existing `.nc-welcome-state` flexbox layout. Add `.nc-welcome-state__text` with `display: inline` (text element is now a `<span>`, inline is correct since the parent flexbox div handles centering). Add `.nc-welcome-state__sr-only` with standard sr-only pattern: `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0`. Add `.nc-welcome-state__cursor` with `display: inline-block; width: 2px; height: 1.1em; vertical-align: text-bottom; background-color: rgb(var(--v-theme-welcome-text))` and `animation: nc-typewriter-cursor 0.7s step-end infinite`
    9. Add `@keyframes nc-typewriter-cursor` that toggles `opacity` between `1` and `0`
    10. Add `@media (prefers-reduced-motion: reduce)` block: set `animation: none` on cursor, though cursor won't render when `isTyping` is false
  - Notes: The `<p>` tag is replaced with `<span>` elements inside the existing `.nc-welcome-state` div. The parent div remains a flex container with `align-items: center; justify-content: center` which handles centering regardless of child element type. The sr-only span provides the full text to screen readers while the animated text is `aria-hidden`.

- [x] Task 3: Wire placeholder config into `ChatInput.vue`
  - File: `src/components/ChatInput.vue`
  - Action:
    1. Add `import { CONFIG_KEY } from '@/keys'` (already imports `CHAT_STATE_KEY` from same file)
    2. Add `const config = inject(CONFIG_KEY)` after the existing `chatState` inject
    3. Add `const placeholder = computed(() => config?.placeholder ?? 'Type your message...')`
    4. Replace hardcoded `placeholder="How can I help you? Ask me anything..."` with `:placeholder="placeholder"`
  - Notes: `inject(CONFIG_KEY)` returns `NativeChatPluginOptions | undefined` — optional chain handles missing config gracefully

- [x] Task 4: Add `simulateFreshConversation` flag to mock API client
  - File: `docs/.vitepress/mock/mockApiClient.ts`
  - Action:
    1. After the existing `simulateErrorCode` / `setSimulateError` block (lines 12-16), add:
       ```ts
       export let simulateFreshConversation = false
       export function setSimulateFreshConversation(value: boolean) {
         simulateFreshConversation = value
       }
       ```
    2. In `getConversations`: add early check — if `simulateFreshConversation` is true, return `{ conversations: [], has_more: false }`
    3. In `getMessages`: add early check — if `simulateFreshConversation` is true, return `{ messages: [], has_more: false }` (after the existing `checkError()` call and delay)
    4. In `sendMessage`: no changes needed — sending works normally in fresh mode. Messages sent during fresh mode will appear in the chat but vanish on close/reopen (since `getMessages` returns empty). This is expected demo behavior.
    5. In `createConversation`: no changes needed — it already returns a mock conversation ID, which is correct for fresh conversations
  - Notes: Follows the exact same pattern as the existing error simulation. The delay in `getMessages` should still apply so the loading spinner shows briefly. **Demo limitation**: messages sent while fresh mode is active are ephemeral — they persist in the `useChat` messages array for the current session but are not returned by `getMessages` on reopen. This matches the intent of demoing the welcome state, not a full fresh-conversation flow.

- [x] Task 5: Add demo toggle to `WidgetConfigDemo.vue`
  - File: `docs/components/demos/WidgetConfigDemo.vue`
  - Action:
    1. Add import: `import { simulateFreshConversation, setSimulateFreshConversation } from '../../.vitepress/mock/mockApiClient'`
    2. Add a `ref` to track the toggle state: `const freshConversation = ref(simulateFreshConversation)`
    3. Add a `watch` on `freshConversation` that calls `setSimulateFreshConversation(val)`
    4. Add a third `v-switch` after the existing two:
       ```vue
       <v-switch
         v-model="freshConversation"
         label="New Conversation (close & reopen chat)"
         color="primary"
         density="compact"
         hide-details
         class="mt-2"
       />
       ```
    5. Add a `<p>` hint below the switches: `"Toggle 'New Conversation' then close and reopen the chat to see the welcome state."`
  - Notes: The label includes the "(close & reopen chat)" hint so the user knows the action required

- [x] Task 6: Update `WelcomeState.test.ts`
  - File: `src/components/__tests__/WelcomeState.test.ts`
  - Action:
    1. Update the default message test: change expected text from `'Hello! How can I help you?'` to `'What can I help you with today?'`
    2. Add test: "displays full message immediately when prefers-reduced-motion is reduce"
       - Mock `window.matchMedia` to return `{ matches: true }`
       - Mount component, assert full text is visible immediately
    3. Add test: "reveals text character by character with typewriter animation"
       - Use `vi.useFakeTimers()`
       - Mount component
       - Assert initial `displayedText` is empty (or first char)
       - Advance timers by N * 40ms
       - Assert text grows progressively
       - Advance until complete
       - Assert `isTyping` cursor element disappears
    4. Add test: "cleans up interval on unmount"
       - Use `vi.useFakeTimers()` and `vi.spyOn(globalThis, 'clearInterval')`
       - Mount, then unmount
       - Assert `clearInterval` was called
    5. Keep existing custom message prop test (update to verify typewriter with custom text)
  - Notes: Use `vi.stubGlobal('matchMedia', ...)` for reduced-motion mock. Remember to restore after each test.

- [x] Task 7: Update `ChatInput.test.ts`
  - File: `src/components/__tests__/ChatInput.test.ts`
  - Action:
    1. Update `mountChatInput` helper to accept optional config and provide `CONFIG_KEY`:
       ```ts
       function mountChatInput(chatState?: UseChatReturn, config?: Partial<NativeChatPluginOptions>) {
         const state = chatState ?? createMockChatState()
         const wrapper = mount(ChatInput, {
           global: {
             provide: {
               [CHAT_STATE_KEY as symbol]: state,
               [CONFIG_KEY as symbol]: config ?? {},
             },
           },
         })
         return { wrapper, chatState: state }
       }
       ```
    2. Add test: "renders default placeholder 'Type your message...' when no config placeholder"
       - Mount without config placeholder
       - Assert `textarea.attributes('placeholder')` equals `'Type your message...'`
    3. Add test: "renders custom placeholder from config"
       - Mount with `config: { placeholder: 'Ask anything...' }`
       - Assert placeholder matches
    4. Update existing tests if any assert the old placeholder text (none do — they test aria-label, not placeholder)
  - Notes: Import `CONFIG_KEY` from `@/keys` and `NativeChatPluginOptions` type

### Acceptance Criteria

- [x] AC 1: Given the chat opens with no message history, when the WelcomeState component mounts, then the text "What can I help you with today?" appears character by character with a blinking cursor, completing in approximately 2.17 seconds (31 chars × 70ms — adjusted from 40ms after user testing)
- [x] AC 2: Given the typewriter animation is in progress, when all characters have been revealed, then the blinking cursor disappears
- [x] AC 3: Given the user has `prefers-reduced-motion: reduce` enabled, when the WelcomeState component mounts, then the full message appears instantly with no typewriter animation and no cursor
- [x] AC 4: Given the WelcomeState is animating, when the component unmounts (e.g., user sends a message), then the interval timer is cleared (no memory leak)
- [x] AC 5: Given a custom `welcomeMessage` is provided via config, when the chat opens with no history, then the typewriter animates the custom text (not the default)
- [x] AC 6: Given no `placeholder` is configured in plugin options, when ChatInput renders, then the textarea shows "Type your message..." as placeholder
- [x] AC 7: Given `placeholder: 'Ask me anything...'` is configured in plugin options, when ChatInput renders, then the textarea shows "Ask me anything..." as placeholder
- [x] AC 8: Given the demo page with config toggles, when the user enables the "New Conversation" toggle and closes/reopens the chat, then the chat opens with no messages and shows the WelcomeState with typewriter animation
- [x] AC 9: Given the "New Conversation" toggle is enabled, when the user disables it and closes/reopens the chat, then the chat loads the normal conversation history
- [x] AC 10: Given the welcome message text and the input placeholder, when both are visible simultaneously, then they convey distinct purposes (welcome = greeting/invitation, placeholder = action prompt) with no redundant phrasing
- [x] AC 11: Given a screen reader is active, when WelcomeState mounts with typewriter animation, then the full message text is announced immediately via an `aria-live="polite"` sr-only element (not the partial animated text)
- [x] AC 12: Given the demo "New Conversation" toggle is enabled, when the user sends a message and then closes/reopens the chat, then the welcome state reappears (sent messages are ephemeral in fresh mode — this is expected demo behavior)

## Additional Context

### Dependencies

- No new runtime dependencies — stays within the <50KB gzipped budget
- Uses existing Vue APIs: `ref()`, `computed()`, `onMounted()`, `onUnmounted()`, `inject()`
- Uses existing `window.matchMedia` browser API for reduced-motion detection
- Uses existing `@media (prefers-reduced-motion)` CSS pattern established in ChatPanel, FloatingButton, MessageBubble

### Testing Strategy

**Unit Tests:**
- `WelcomeState.test.ts`: 5 tests (default text, custom text, typewriter progression, reduced motion instant display, interval cleanup on unmount)
- `ChatInput.test.ts`: 2 new tests (default placeholder, custom placeholder from config)

**Manual Testing:**
- Open chat with no history → verify typewriter animation plays smoothly
- Open chat with history → verify WelcomeState doesn't appear
- Toggle reduced motion in OS settings → verify instant display
- Demo page: toggle "New Conversation" → close/reopen → verify welcome state appears
- Demo page: toggle back → close/reopen → verify history loads
- Verify no console errors or warnings during animation lifecycle

### Notes

- **Timer type**: Must use `ReturnType<typeof setInterval>` per project convention — never `number` or `NodeJS.Timeout`
- **No `reactive()`**: Use individual `ref()` values for `displayedText` and `isTyping` — project convention prohibits `reactive()` for top-level state
- **`!important` banned**: The existing `border-radius: 15px !important` in ChatInput is a pre-existing exception — do not add new `!important` rules
- **Typing speed**: 70ms/char is ~14 chars/sec — adjusted from 40ms after testing for a more readable pace. For the default 31-char message ("What can I help you with today?"), total animation time is ~2.17s
- **Future consideration**: If a typing sound effect is desired later, the `setInterval` callback is the natural hook point (out of scope)
