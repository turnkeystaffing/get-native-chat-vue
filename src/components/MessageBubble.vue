<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import type { ChatMessage } from '@/types/chat'
import IconStar from '@/icons/IconStar.vue'
import IconCopy from '@/icons/IconCopy.vue'
import IconCheck from '@/icons/IconCheck.vue'

interface MessageBubbleProps {
  message: ChatMessage
}

const props = defineProps<MessageBubbleProps>()

const isUser = computed(() => props.message.role === 'user')
const isError = computed(
  () => props.message.status === 'failed' || props.message.id.startsWith('error-'),
)
const isSending = computed(() => props.message.status === 'sending')
const isAssistant = computed(() => props.message.role === 'assistant' && !isError.value)

const renderedContent = computed(() => {
  if (props.message.role !== 'assistant' || isError.value) return null
  const rawHtml = marked.parse(props.message.content) as string
  return DOMPurify.sanitize(rawHtml)
})

const ariaLabel = computed(() => {
  if (isError.value) return 'Error message'
  if (isUser.value) return 'Message from you'
  return 'Message from AI Assistant'
})

const copied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.message.content)
    copied.value = true
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {
    // Silent failure per UX spec -- clipboard permission denied
  }
}

onBeforeUnmount(() => {
  if (copyTimeout) clearTimeout(copyTimeout)
})
</script>

<template>
  <li
    role="listitem"
    :aria-label="ariaLabel"
    class="nc-message-bubble"
    :class="{
      'nc-message-bubble--user': isUser,
      'nc-message-bubble--assistant': isAssistant,
      'nc-message-bubble--error': isError,
      'nc-message-bubble--sending': isSending,
    }"
  >
    <div v-if="!isError" class="nc-message-bubble__header">
      <template v-if="isUser">
        <span class="nc-message-bubble__label">You</span>
      </template>
      <template v-else>
        <IconStar class="nc-message-bubble__star" />
        <span class="nc-message-bubble__label">AI Assistant</span>
      </template>
    </div>

    <div class="nc-message-bubble__bubble">
      <div v-if="isUser || isError" class="nc-message-bubble__content">{{ message.content }}</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-else class="nc-message-bubble__content" v-html="renderedContent"></div>
    </div>

    <button
      v-if="isAssistant"
      class="nc-message-bubble__copy"
      :aria-label="copied ? 'Message copied' : 'Copy message'"
      @click="handleCopy"
    >
      <IconCheck v-if="copied" />
      <IconCopy v-else />
    </button>
  </li>
</template>

<style scoped>
@layer native-chat {
  .nc-message-bubble {
    display: flex;
    flex-direction: column;
    list-style: none;
  }

  .nc-message-bubble--user {
    align-items: flex-end;
  }

  .nc-message-bubble--assistant,
  .nc-message-bubble--error {
    align-items: flex-start;
  }

  .nc-message-bubble__header {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
  }

  .nc-message-bubble__label {
    font-size: 14px;
    font-weight: 600;
    color: rgb(var(--v-theme-on-surface));
  }

  .nc-message-bubble__star {
    font-size: 14px;
    color: rgb(var(--v-theme-secondary));
  }

  .nc-message-bubble__bubble {
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 12px;
    word-break: break-word;
  }

  .nc-message-bubble--user .nc-message-bubble__bubble {
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
  }

  .nc-message-bubble--assistant .nc-message-bubble__bubble,
  .nc-message-bubble--error .nc-message-bubble__bubble {
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
    color: rgb(var(--v-theme-on-surface));
  }

  .nc-message-bubble--sending .nc-message-bubble__bubble {
    opacity: 0.7;
  }

  .nc-message-bubble__copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-top: 4px;
    padding: 0;
    border: none;
    background: none;
    color: rgb(var(--v-theme-on-surface) / 0.4);
    cursor: pointer;
    font-size: 16px;
    border-radius: 4px;
  }

  .nc-message-bubble__copy:hover {
    color: rgb(var(--v-theme-on-surface));
  }

  /* Markdown content styling via :deep() for v-html */
  .nc-message-bubble__content :deep(h1),
  .nc-message-bubble__content :deep(h2),
  .nc-message-bubble__content :deep(h3),
  .nc-message-bubble__content :deep(h4) {
    font-size: 14px;
    font-weight: 700;
    margin: 8px 0 4px;
  }

  .nc-message-bubble__content :deep(p) {
    margin: 4px 0;
  }

  .nc-message-bubble__content :deep(ul),
  .nc-message-bubble__content :deep(ol) {
    padding-left: 20px;
    margin: 4px 0;
  }

  .nc-message-bubble__content :deep(code) {
    background: rgba(0, 0, 0, 0.05);
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 13px;
  }

  .nc-message-bubble__content :deep(pre) {
    background: rgba(0, 0, 0, 0.05);
    padding: 8px;
    border-radius: 4px;
    overflow-x: auto;
  }

  .nc-message-bubble__content :deep(a) {
    color: rgb(var(--v-theme-secondary));
    text-decoration: underline;
  }
}
</style>
