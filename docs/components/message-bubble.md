# MessageBubble

The `MessageBubble` component renders individual chat messages with role-based styling. It supports three variants: user messages, assistant messages with markdown rendering, and error messages.

## Variants

- **User message** — right-aligned with primary color background and sender label
- **Assistant message** — left-aligned with surface background, markdown content rendered via `marked` + DOMPurify, and a copy button
- **Error message** — left-aligned with a calm error tone, no header

<script setup lang="ts">
import DemoBlock from '../.vitepress/components/DemoBlock.vue'
import MessageBubbleDemoSource from './demos/MessageBubbleDemo.vue?raw'
import MessageBubbleDemo from './demos/MessageBubbleDemo.vue'
</script>

<ClientOnly>
  <DemoBlock :source="MessageBubbleDemoSource">
    <MessageBubbleDemo />
  </DemoBlock>
</ClientOnly>

## Props

| Prop      | Type          | Description                                                                                                 |
| --------- | ------------- | ----------------------------------------------------------------------------------------------------------- |
| `message` | `ChatMessage` | The message object containing `id`, `conversationId`, `role`, `content`, `createdAt`, and optional `status` |

## Message Roles

| Role                                               | Alignment | Styling                                                                          |
| -------------------------------------------------- | --------- | -------------------------------------------------------------------------------- |
| `user`                                             | Right     | Primary color bubble, "You" label                                                |
| `assistant`                                        | Left      | Surface bubble with border, "AI Assistant" label, markdown rendered, copy button |
| Error (status `failed` or id starts with `error-`) | Left      | Surface bubble with border, no header label                                      |
