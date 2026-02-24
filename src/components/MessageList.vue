<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount, inject, useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js'
import { CHAT_STATE_KEY } from '@/keys'
import MessageBubble from '@/components/MessageBubble.vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const chatState = inject(CHAT_STATE_KEY)!

const scrollContainerRef = useTemplateRef<ComponentPublicInstance>('scrollContainer')
const isNearBottom = ref(true)

const SCROLL_THRESHOLD = 50

// Animation tracking — watcher-based approach (no side effects during render).
// knownIds tracks all message IDs that have been seen; animatingIds holds only
// the IDs that should play their entrance animation on the current render.
const knownIds = new Set<string>()
const animatingIds = ref(new Set<string>())
let initialLoadComplete = false
let suppressAnimation = false

watch(
  () => chatState.messages.value,
  (messages) => {
    const newAnimating = new Set<string>()
    if (initialLoadComplete && !suppressAnimation) {
      messages.forEach((msg) => {
        if (!knownIds.has(msg.id)) {
          newAnimating.add(msg.id)
        }
      })
    }
    messages.forEach((msg) => knownIds.add(msg.id))
    animatingIds.value = newAnimating
  },
)

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

// Event-driven scroll policy: detect appends vs prepends via tail-ID tracking.
// If the last message ID changes → append (user-send or assistant-response) → scroll to bottom.
// If unchanged → prepend (loadMore) → no scroll (handleLoadMore manages position).
let lastTailId: string | null =
  chatState.messages.value.length > 0
    ? chatState.messages.value[chatState.messages.value.length - 1].id
    : null
let isLoadingMore = false
let pendingScrollToBottom = false

watch(
  () => chatState.messages.value,
  (messages) => {
    const currentTailId = messages.length > 0 ? messages[messages.length - 1].id : null
    const wasAppended = currentTailId !== null && currentTailId !== lastTailId
    lastTailId = currentTailId

    if (wasAppended) {
      if (isLoadingMore) {
        // Response arrived during active loadMore — defer scroll until position adjustment completes
        pendingScrollToBottom = true
      } else {
        nextTick(scrollToBottom)
      }
    }
  },
)

onMounted(() => {
  // Seed known IDs with all initial messages — they should not animate
  chatState.messages.value.forEach((msg) => knownIds.add(msg.id))
  nextTick(() => {
    initialLoadComplete = true
  })

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
  suppressAnimation = true
  isLoadingMore = true

  // Scroll preservation is handled natively by VInfiniteScroll for side="start".
  // It captures scrollHeight before load and adjusts scrollTop after done() via nextTick.
  try {
    await chatState.loadMore()
    done(!chatState.hasMore.value ? 'empty' : 'ok')
  } catch {
    done('error')
  }

  await nextTick()
  suppressAnimation = false
  isLoadingMore = false

  if (pendingScrollToBottom) {
    pendingScrollToBottom = false
    nextTick(scrollToBottom)
  }
}
</script>

<template>
  <div class="nc-message-list-wrapper">
    <v-infinite-scroll
      ref="scrollContainer"
      side="start"
      :disabled="!chatState.hasMore.value"
      class="nc-message-list-scroll"
      @load="handleLoadMore"
    >
      <ul role="list" aria-live="polite" class="nc-message-list">
        <MessageBubble
          v-for="msg in chatState.messages.value"
          :key="msg.id"
          :message="msg"
          :animate="animatingIds.has(msg.id)"
        />
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

    <Transition name="nc-scroll-fab">
      <div v-show="!isNearBottom" class="nc-scroll-fab">
        <v-btn
          icon
          variant="elevated"
          color="surface"
          size="small"
          aria-label="Scroll to latest messages"
          @click="scrollToBottom"
        >
          <v-icon :icon="IconArrowDown"></v-icon>
        </v-btn>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@layer native-chat {
  .nc-message-list-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .nc-message-list-scroll {
    flex: 1;
    overflow-y: auto;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  }

  .nc-message-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    list-style: none;
    padding: 8px 16px;
    margin: 0;
  }

  .nc-message-list__loader {
    display: flex;
    justify-content: center;
    padding: 8px 0;
  }

  .nc-scroll-fab {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }

  .nc-scroll-fab-enter-active,
  .nc-scroll-fab-leave-active {
    transition:
      opacity 200ms ease,
      transform 200ms ease;
  }

  .nc-scroll-fab-enter-from,
  .nc-scroll-fab-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(8px) scale(0.9);
  }

  @media (prefers-reduced-motion: reduce) {
    .nc-scroll-fab-enter-active,
    .nc-scroll-fab-leave-active {
      transition-duration: 0ms;
    }
  }
}
</style>
