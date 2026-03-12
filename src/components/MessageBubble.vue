<script setup lang="ts">
import { ref, computed, inject, onBeforeUnmount } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import type { ChatMessage } from '@/types/chat'
import { CONFIG_KEY } from '@/keys'
import IconStar from '@/icons/IconStar.vue'
import IconWarning from '@/icons/IconWarning.vue'
import IconCopy from '@/icons/IconCopy.vue'
import IconCheck from '@/icons/IconCheck.vue'

interface MessageBubbleProps {
  message: ChatMessage
  animate?: boolean
}

const props = withDefaults(defineProps<MessageBubbleProps>(), {
  animate: false,
})

const config = inject(CONFIG_KEY, undefined)
const showHeader = computed(() => config?.showBubbleHeaders ?? true)
const assistantFullWidth = computed(() => config?.assistantBubbleFullWidth ?? false)

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
      'nc-message-bubble--flat': isAssistant && assistantFullWidth,
      'nc-message-bubble--animate-in': props.animate,
    }"
  >
    <div v-if="showHeader" class="nc-message-bubble__header">
      <template v-if="isUser">
        <span class="nc-message-bubble__label">You</span>
      </template>
      <template v-else-if="isError">
        <IconWarning class="nc-message-bubble__warning-icon" />
        <span class="nc-message-bubble__label">Error</span>
      </template>
      <template v-else>
        <v-avatar color="secondary" size="29">
          <v-icon :icon="IconStar" color="white" size="15"></v-icon>
        </v-avatar>
        <span class="nc-message-bubble__label">AI Assistant</span>
      </template>
    </div>

    <div class="nc-message-bubble__bubble">
      <div v-if="isUser || isError" class="nc-message-bubble__content">{{ message.content }}</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-else class="nc-message-bubble__content" v-html="renderedContent"></div>
    </div>

    <v-btn
      v-if="isAssistant"
      icon
      variant="text"
      density="comfortable"
      size="small"
      class="mt-1"
      :aria-label="copied ? 'Message copied' : 'Copy message'"
      @click="handleCopy"
    >
      <v-icon
        :icon="copied ? IconCheck : IconCopy"
        size="small"
        :color="copied ? 'success' : 'title'"
      ></v-icon>
    </v-btn>
  </li>
</template>

<style scoped>
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
  gap: 10px;
  margin-bottom: 10px;
}

.nc-message-bubble__label {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.nc-message-bubble__bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  word-break: break-word;
  font-size: 14px;
}

.nc-message-bubble--user .nc-message-bubble__bubble {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.nc-message-bubble--assistant .nc-message-bubble__bubble {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  color: rgb(var(--v-theme-on-surface));
}

.nc-message-bubble--error .nc-message-bubble__bubble {
  background: rgba(var(--v-theme-error), 0.06);
  border: 1px solid rgba(var(--v-theme-error), 0.2);
  color: rgb(var(--v-theme-on-surface));
}

.nc-message-bubble__warning-icon {
  font-size: 14px;
  color: rgba(var(--v-theme-error), 0.6);
}

.nc-message-bubble--sending .nc-message-bubble__bubble {
  opacity: 0.7;
}

.nc-message-bubble--flat .nc-message-bubble__bubble {
  max-width: 100%;
  background: transparent;
  border: none;
  border-radius: 0;
}

.nc-message-bubble--flat > .v-btn {
  margin-left: 10px;
}

/* Markdown content styling via :deep() for v-html */

.nc-message-bubble__content {
  line-height: 1.6;
}

/* Heading typographic scale */
.nc-message-bubble__content :deep(h1) {
  font-size: 1.44em;
  font-weight: 700;
  line-height: 1.3;
  margin: 24px 0 8px 0;
  letter-spacing: -0.01em;
}

.nc-message-bubble__content :deep(h2) {
  font-size: 1.2em;
  font-weight: 700;
  line-height: 1.35;
  margin: 20px 0 6px 0;
}

.nc-message-bubble__content :deep(h3) {
  font-size: 1.05em;
  font-weight: 600;
  line-height: 1.4;
  margin: 16px 0 4px 0;
}

.nc-message-bubble__content :deep(h4) {
  font-size: 0.9em;
  font-weight: 700;
  line-height: 1.45;
  margin: 16px 0 4px 0;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.nc-message-bubble__content :deep(h1:first-child),
.nc-message-bubble__content :deep(h2:first-child),
.nc-message-bubble__content :deep(h3:first-child),
.nc-message-bubble__content :deep(h4:first-child) {
  margin-top: 0;
}

/* Paragraphs */
.nc-message-bubble__content :deep(p) {
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.nc-message-bubble__content :deep(p:last-child) {
  margin-bottom: 0;
}

/* Lists */
.nc-message-bubble__content :deep(ul),
.nc-message-bubble__content :deep(ol) {
  padding-left: 20px;
  margin: 8px 0 12px 0;
  list-style-position: outside;
}

.nc-message-bubble__content :deep(ul) {
  list-style-type: disc;
}

.nc-message-bubble__content :deep(ol) {
  list-style-type: decimal;
}

.nc-message-bubble__content :deep(li) {
  display: list-item;
  margin-bottom: 4px;
}

.nc-message-bubble__content :deep(li:last-child) {
  margin-bottom: 0;
}

/* Inline code */
.nc-message-bubble__content :deep(code) {
  font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875em;
  background: rgba(var(--v-theme-on-surface), 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  word-break: break-word;
}

/* Code blocks */
.nc-message-bubble__content :deep(pre) {
  background: rgb(var(--v-theme-primary));
  color: rgba(255, 255, 255, 0.85);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
  border-left: 3px solid rgb(var(--v-theme-secondary));
}

.nc-message-bubble__content :deep(pre code) {
  background: transparent;
  padding: 0;
  border: none;
  border-radius: 0;
  font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  line-height: 1.55;
  color: inherit;
  word-break: normal;
  white-space: pre;
}

/* Flat mode overrides */
.nc-message-bubble--flat :deep(code) {
  background: rgba(var(--v-theme-on-surface), 0.07);
  border-color: rgba(var(--v-theme-on-surface), 0.12);
}

.nc-message-bubble--flat :deep(pre) {
  background: rgb(var(--v-theme-primary));
  border-left-color: rgb(var(--v-theme-secondary));
}

/* Links */
.nc-message-bubble__content :deep(a) {
  color: rgb(var(--v-theme-secondary));
  text-decoration: underline;
}

/* Blockquotes */
.nc-message-bubble__content :deep(blockquote) {
  margin: 12px 0;
  padding: 8px 16px;
  border-left: 3px solid rgba(var(--v-theme-on-surface), 0.2);
  color: rgba(var(--v-theme-on-surface), 0.75);
  background: rgba(var(--v-theme-on-surface), 0.03);
  border-radius: 0 4px 4px 0;
}

.nc-message-bubble__content :deep(blockquote p) {
  margin: 0;
}

/* Tables */
.nc-message-bubble__content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 13px;
}

.nc-message-bubble__content :deep(th) {
  text-align: left;
  font-weight: 600;
  padding: 8px 12px;
  border-bottom: 2px solid rgba(var(--v-theme-on-surface), 0.15);
  color: rgba(var(--v-theme-on-surface), 0.85);
}

.nc-message-bubble__content :deep(td) {
  padding: 6px 12px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* Horizontal rule */
.nc-message-bubble__content :deep(hr) {
  border: none;
  height: 1px;
  background: rgba(var(--v-theme-on-surface), 0.12);
  margin: 16px 0;
}

/* Strong and emphasis */
.nc-message-bubble__content :deep(strong) {
  font-weight: 600;
}

.nc-message-bubble__content :deep(em) {
  font-style: italic;
}

/* Flat mode overrides for new elements */
.nc-message-bubble--flat :deep(blockquote) {
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.nc-message-bubble--flat :deep(th) {
  border-bottom-color: rgba(var(--v-theme-on-surface), 0.2);
}

.nc-message-bubble--flat :deep(td) {
  border-bottom-color: rgba(var(--v-theme-on-surface), 0.1);
}

/* Message entrance animations */
@keyframes nc-bubble-slide-right {
  from {
    opacity: 0;
    transform: translateX(16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes nc-bubble-slide-left {
  from {
    opacity: 0;
    transform: translateX(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nc-message-bubble--animate-in.nc-message-bubble--user {
  animation: nc-bubble-slide-right 250ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.nc-message-bubble--animate-in.nc-message-bubble--assistant,
.nc-message-bubble--animate-in.nc-message-bubble--error {
  animation: nc-bubble-slide-left 250ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .nc-message-bubble--animate-in.nc-message-bubble--user,
  .nc-message-bubble--animate-in.nc-message-bubble--assistant,
  .nc-message-bubble--animate-in.nc-message-bubble--error {
    animation: none;
  }
}
</style>
