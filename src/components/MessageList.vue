<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount, inject, useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js'
import { CHAT_STATE_KEY } from '@/keys'
import MessageBubble from '@/components/MessageBubble.vue'

const chatState = inject(CHAT_STATE_KEY)!

const scrollContainerRef = useTemplateRef<ComponentPublicInstance>('scrollContainer')
const isNearBottom = ref(true)

const SCROLL_THRESHOLD = 50

function getScrollElement(): HTMLElement | null {
  const el = scrollContainerRef.value?.$el
  return el instanceof HTMLElement ? el : null
}

function checkIsNearBottom() {
  const el = getScrollElement()
  if (!el) return
  const { scrollTop, scrollHeight, clientHeight } = el
  isNearBottom.value = scrollHeight - scrollTop - clientHeight <= SCROLL_THRESHOLD
}

function scrollToBottom() {
  const el = getScrollElement()
  if (!el) return
  el.scrollTop = el.scrollHeight
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
  const el = getScrollElement()
  el?.addEventListener('scroll', checkIsNearBottom, { passive: true })
})

onBeforeUnmount(() => {
  const el = getScrollElement()
  el?.removeEventListener('scroll', checkIsNearBottom)
})

async function handleLoadMore({ done }: { done: (status: InfiniteScrollStatus) => void }) {
  const el = getScrollElement()
  const prevScrollHeight = el?.scrollHeight ?? 0

  try {
    await chatState.loadMore()
    done(!chatState.hasMore.value ? 'empty' : 'ok')
  } catch {
    done('error')
  }

  await nextTick()
  if (el) {
    const newScrollHeight = el.scrollHeight
    el.scrollTop = el.scrollTop + (newScrollHeight - prevScrollHeight)
  }
}
</script>

<template>
  <v-infinite-scroll
    ref="scrollContainer"
    side="start"
    :disabled="!chatState.hasMore.value"
    class="nc-message-list-scroll"
    @load="handleLoadMore"
  >
    <ul role="list" aria-live="polite" class="nc-message-list">
      <MessageBubble v-for="msg in chatState.messages.value" :key="msg.id" :message="msg" />
    </ul>

    <template #loading>
      <div class="nc-message-list__loader">
        <v-progress-circular indeterminate size="24" width="2" />
      </div>
    </template>

    <template #empty>
      <!-- No end-of-history indicator per spec -->
    </template>
  </v-infinite-scroll>
</template>

<style scoped>
@layer native-chat {
  .nc-message-list-scroll {
    flex: 1;
  }

  .nc-message-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    list-style: none;
    padding: 8px 16px;
    margin: 0;
  }

  .nc-message-list__loader {
    display: flex;
    justify-content: center;
    padding: 8px 0;
  }
}
</style>
