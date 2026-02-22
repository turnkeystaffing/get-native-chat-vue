# ChatInput

The `ChatInput` component provides a message input area with auto-expanding textarea and send button. It uses Vuetify's `v-textarea` with `auto-grow` for a smooth multiline experience.

## Features

- **Auto-expand** — textarea grows as you type, up to 6 lines
- **Enter to send** — press Enter to send your message
- **Shift+Enter for newline** — add line breaks without sending
- **Disabled during send** — input and button are disabled while a message is being sent

<script setup lang="ts">
import DemoBlock from '../.vitepress/components/DemoBlock.vue'
import ChatInputDemoSource from './demos/ChatInputDemo.vue?raw'
import ChatInputDemo from './demos/ChatInputDemo.vue'
</script>

<ClientOnly>
  <DemoBlock :source="ChatInputDemoSource">
    <ChatInputDemo />
  </DemoBlock>
</ClientOnly>

## Behavior

| Action            | Result                                   |
| ----------------- | ---------------------------------------- |
| Type text         | Textarea auto-grows up to 6 lines        |
| Press Enter       | Sends message, clears input              |
| Press Shift+Enter | Inserts newline                          |
| During send       | Input and send button are disabled       |
| After failed send | Failed message text is restored to input |
