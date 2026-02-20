<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount, inject } from 'vue'
import { CHAT_STATE_KEY } from '@/keys'
import MessageBubble from '@/components/MessageBubble.vue'

const chatState = inject(CHAT_STATE_KEY)!

const listRef = ref<HTMLUListElement | null>(null)
const isNearBottom = ref(true)

const SCROLL_THRESHOLD = 50

function checkIsNearBottom() {
  const el = listRef.value
  if (!el) return
  const { scrollTop, scrollHeight, clientHeight } = el
  isNearBottom.value = scrollHeight - scrollTop - clientHeight <= SCROLL_THRESHOLD
}

function scrollToBottom() {
  const el = listRef.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

function handleScroll() {
  checkIsNearBottom()
}

watch(
  () => chatState.messages.value,
  () => {
    if (isNearBottom.value) {
      nextTick(scrollToBottom)
    }
  },
)

onMounted(() => {
  if (chatState.messages.value.length > 0) {
    nextTick(scrollToBottom)
  }
  listRef.value?.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  listRef.value?.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <ul ref="listRef" role="list" aria-live="polite" class="nc-message-list">
    <MessageBubble v-for="msg in chatState.messages.value" :key="msg.id" :message="msg" />
  </ul>
</template>

<style scoped>
@layer native-chat {
  .nc-message-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
    overflow-y: auto;
    list-style: none;
    padding: 8px 16px;
    margin: 0;
  }
}
</style>
