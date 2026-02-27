<script setup lang="ts">
import { ref, readonly, provide, computed, nextTick, onBeforeUnmount } from 'vue'
import type { Ref, DeepReadonly } from 'vue'
import type { ChatMessage } from '@/types/chat'
import type { UseChatReturn } from '@/composables/useChat'
import { CHAT_STATE_KEY, CONFIG_KEY } from '@/keys'
import type { NativeChatPluginOptions } from '@/types/config'
import MessageList from '@/components/MessageList.vue'

// ====== Mock Message Generation ======

function generateMockMessages(count: number): ChatMessage[] {
  const messages: ChatMessage[] = []
  for (let i = 0; i < count; i++) {
    const isUser = i % 3 !== 0
    const contentLength = i % 10 === 0 ? 'long' : i % 3 === 0 ? 'medium' : 'short'

    let content: string
    if (contentLength === 'long') {
      content = `## Analysis Report\n\nHere is a detailed breakdown:\n\n- **Item 1**: Description of the first point with enough text to wrap lines\n- **Item 2**: Another detailed point\n- **Item 3**: Final consideration\n\nThis ensures messages with markdown are tested.`
    } else if (contentLength === 'medium') {
      content = `This is a medium-length response that spans a couple of lines to test typical assistant message rendering performance at scale.`
    } else {
      content = `Message ${i + 1}: short text`
    }

    messages.push({
      id: `perf-msg-${i}`,
      conversationId: 'perf-conv-1',
      role: isUser ? 'user' : 'assistant',
      content,
      createdAt: new Date(Date.now() - (count - i) * 60000).toISOString(),
      status: 'sent',
    })
  }
  return messages
}

// ====== State ======

const allMessages = generateMockMessages(1000)

const messages = ref<ChatMessage[]>([])
const hasMore = ref(false)
const isLoading = ref(false)
const isRunning = ref(false)

// Infinite scroll tracking
let nextBatchEnd = 0

// ====== Mode Control ======

function resetStaticMode() {
  messages.value = [...allMessages]
  hasMore.value = false
  isLoading.value = false
}

function resetInfiniteScrollMode() {
  messages.value = allMessages.slice(980)
  hasMore.value = true
  isLoading.value = false
  nextBatchEnd = 980
}

// Mock loadMore for infinite scroll mode
async function mockLoadMore(): Promise<void> {
  if (nextBatchEnd <= 0) {
    hasMore.value = false
    return
  }
  // Minimal delay to maintain async behavior matching real loadMore
  await new Promise((r) => setTimeout(r, 10))
  const start = Math.max(0, nextBatchEnd - 20)
  const batch = allMessages.slice(start, nextBatchEnd)
  messages.value = [...batch, ...messages.value]
  nextBatchEnd = start
  if (nextBatchEnd <= 0) hasMore.value = false
}

// ====== Provide Mock Chat State ======

const mockChatState: UseChatReturn = {
  messages: readonly(messages) as DeepReadonly<Ref<ChatMessage[]>>,
  isOpen: readonly(ref(true)),
  isLoading: readonly(isLoading),
  isSending: readonly(ref(false)),
  hasMore: readonly(hasMore),
  failedMessageText: readonly(ref<string | null>(null)),
  open: async () => {},
  close: () => {},
  sendMessage: async () => {},
  loadMore: mockLoadMore,
  retry: async () => {},
}

provide(CHAT_STATE_KEY, mockChatState)

// Provide minimal config to satisfy any downstream inject
provide(CONFIG_KEY, {
  apiClient: {
    createConversation: async () => ({ id: '', createdAt: '' }),
    getConversations: async () => ({ conversations: [], hasMore: false }),
    getMessages: async () => ({ messages: [], hasMore: false }),
    sendMessage: async () => ({
      userMessage: {
        id: '',
        conversationId: '',
        role: 'user' as const,
        content: '',
        createdAt: '',
      },
      assistantMessage: {
        id: '',
        conversationId: '',
        role: 'assistant' as const,
        content: '',
        createdAt: '',
      },
    }),
  },
} satisfies NativeChatPluginOptions)

// ====== FPS Measurement ======

interface BenchmarkResults {
  avgFps: number
  minFps: number
  maxFrameDuration: number
  totalFrames: number
  passAvgFps: boolean
  passMaxFrame: boolean
  pass: boolean
  scrollDrifts?: number[]
  maxDrift?: number
}

const results = ref<BenchmarkResults | null>(null)
const liveFps = ref(0)
const benchmarkContainer = ref<HTMLElement | null>(null)

let frameTimes: number[] = []
let lastTimestamp = 0
let fpsRafId = 0

function startFpsMeasurement() {
  frameTimes = []
  lastTimestamp = 0

  function measureFrame(timestamp: number) {
    if (lastTimestamp > 0) {
      const delta = timestamp - lastTimestamp
      frameTimes.push(delta)
      liveFps.value = Math.round(1000 / delta)
    }
    lastTimestamp = timestamp
    fpsRafId = requestAnimationFrame(measureFrame)
  }

  fpsRafId = requestAnimationFrame(measureFrame)
}

function stopFpsMeasurement(
  maxFrameThreshold = 50,
): Omit<BenchmarkResults, 'scrollDrifts' | 'maxDrift'> {
  cancelAnimationFrame(fpsRafId)

  if (frameTimes.length === 0) {
    return {
      avgFps: 0,
      minFps: 0,
      maxFrameDuration: 0,
      totalFrames: 0,
      passAvgFps: false,
      passMaxFrame: false,
      pass: false,
    }
  }

  const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
  const avgFps = 1000 / avgFrameTime
  const maxFrameTime = Math.max(...frameTimes)
  const sortedTimes = [...frameTimes].sort((a, b) => b - a)
  const p1Index = Math.floor(sortedTimes.length * 0.01)
  const p1Low = sortedTimes[p1Index] || sortedTimes[0]
  const minFps = 1000 / p1Low

  const passAvgFps = avgFps >= 30
  const passMaxFrame = maxFrameTime <= maxFrameThreshold

  return {
    avgFps: Math.round(avgFps * 100) / 100,
    minFps: Math.round(minFps * 100) / 100,
    maxFrameDuration: Math.round(maxFrameTime * 100) / 100,
    totalFrames: frameTimes.length,
    passAvgFps,
    passMaxFrame,
    pass: passAvgFps && passMaxFrame,
  }
}

// ====== Scroll Helpers ======

function getScrollElement(): HTMLElement | null {
  return benchmarkContainer.value?.querySelector('.v-infinite-scroll') as HTMLElement | null
}

function scrollFromBottomToTop(container: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    // Scale scroll step to content height so benchmark completes in ~15-20 seconds
    // With 1000 messages (~113K px), step=150 gives ~755 frames (~13s at 60fps)
    const totalScroll = container.scrollHeight - container.clientHeight
    const scrollStep = Math.max(8, Math.ceil(totalScroll / 800))
    function step() {
      if (container.scrollTop <= 0) {
        resolve()
        return
      }
      container.scrollTop -= scrollStep
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })
}

// ====== Scroll Position Drift Tracking ======

const scrollDrifts: number[] = []

// ====== Static Scroll Benchmark ======

async function runStaticBenchmark() {
  isRunning.value = true
  results.value = null
  resetStaticMode()

  await nextTick()

  // Wait for DOM to stabilize with 1000 messages
  await new Promise<void>((resolve) => {
    const checkRendered = () => {
      const scrollEl = getScrollElement()
      const items = scrollEl?.querySelectorAll('.nc-message-bubble')
      if (items && items.length >= 1000) {
        resolve()
      } else {
        requestAnimationFrame(checkRendered)
      }
    }
    requestAnimationFrame(checkRendered)
  })

  const scrollEl = getScrollElement()
  if (!scrollEl) {
    isRunning.value = false
    return
  }

  // Scroll to bottom first
  scrollEl.scrollTop = scrollEl.scrollHeight
  await new Promise((r) => setTimeout(r, 500))

  // Start FPS measurement and scroll bottom-to-top
  startFpsMeasurement()
  await scrollFromBottomToTop(scrollEl)
  const fpsResults = stopFpsMeasurement()

  results.value = { ...fpsResults }
  isRunning.value = false
}

// ====== Infinite Scroll Benchmark ======

async function runInfiniteScrollBenchmark() {
  isRunning.value = true
  results.value = null
  scrollDrifts.length = 0
  resetInfiniteScrollMode()

  await nextTick()
  await new Promise((r) => setTimeout(r, 500))

  const scrollEl = getScrollElement()
  if (!scrollEl) {
    isRunning.value = false
    return
  }

  // Scroll to bottom of initial messages
  scrollEl.scrollTop = scrollEl.scrollHeight
  await new Promise((r) => setTimeout(r, 300))

  startFpsMeasurement()

  // Drive load cycles directly: scroll to top → trigger load → scroll position preserved → repeat
  // This simulates the user rapidly scrolling up through history
  while (messages.value.length < 1000) {
    // Capture reference element before load for drift measurement
    const refItems = scrollEl.querySelectorAll('.nc-message-bubble')
    let refElement: Element | null = null
    let refTop = 0
    if (refItems.length > 0) {
      const containerRect = scrollEl.getBoundingClientRect()
      for (const item of refItems) {
        const rect = item.getBoundingClientRect()
        if (rect.top >= containerRect.top && rect.top < containerRect.bottom) {
          refElement = item
          refTop = rect.top
          break
        }
      }
    }

    // Rapidly scroll to top to trigger v-infinite-scroll sentinel
    const scrollStep = Math.max(20, Math.ceil(scrollEl.scrollTop / 10))
    while (scrollEl.scrollTop > 0) {
      scrollEl.scrollTop = Math.max(0, scrollEl.scrollTop - scrollStep)
      await new Promise((r) => requestAnimationFrame(r))
    }

    // Wait for the v-infinite-scroll to fire @load and complete
    const prevCount = messages.value.length
    const waitStart = performance.now()
    while (messages.value.length === prevCount && performance.now() - waitStart < 5000) {
      // Nudge scroll to ensure sentinel stays in view
      scrollEl.scrollTop = 0
      await new Promise((r) => requestAnimationFrame(r))
    }

    if (messages.value.length === prevCount) break // Safety: load didn't fire

    // Wait for render
    await nextTick()
    await new Promise((r) => requestAnimationFrame(r))

    // Measure scroll position drift
    if (refElement) {
      const newTop = refElement.getBoundingClientRect().top
      const drift = Math.abs(newTop - refTop)
      scrollDrifts.push(Math.round(drift * 100) / 100)
    }
  }

  // Final scroll through all loaded messages
  scrollEl.scrollTop = scrollEl.scrollHeight
  await new Promise((r) => setTimeout(r, 200))
  const totalScroll = scrollEl.scrollHeight - scrollEl.clientHeight
  const finalStep = Math.max(8, Math.ceil(totalScroll / 400))
  while (scrollEl.scrollTop > 0) {
    scrollEl.scrollTop = Math.max(0, scrollEl.scrollTop - finalStep)
    await new Promise((r) => requestAnimationFrame(r))
  }

  const fpsResults = stopFpsMeasurement()
  const maxDrift = scrollDrifts.length > 0 ? Math.max(...scrollDrifts) : 0

  results.value = {
    ...fpsResults,
    scrollDrifts: [...scrollDrifts],
    maxDrift,
  }
  isRunning.value = false
}

// ====== Computed for Playwright ======

const resultsJson = computed(() => {
  if (!results.value) return null
  return JSON.stringify(results.value)
})

const messageCount = computed(() => messages.value.length)

// ====== Cleanup ======

onBeforeUnmount(() => {
  cancelAnimationFrame(fpsRafId)
})

// Initialize with static mode
resetStaticMode()
</script>

<template>
  <div ref="benchmarkContainer" class="nc-perf-benchmark">
    <div class="nc-perf-benchmark__controls">
      <h2>Performance Benchmark</h2>
      <p>
        Messages loaded: <span data-testid="message-count">{{ messageCount }}</span>
      </p>
      <div class="nc-perf-benchmark__buttons">
        <button
          data-testid="run-static-benchmark"
          :disabled="isRunning"
          @click="runStaticBenchmark"
        >
          Run Scroll Benchmark
        </button>
        <button
          data-testid="run-infinite-benchmark"
          :disabled="isRunning"
          @click="runInfiniteScrollBenchmark"
        >
          Run Infinite Scroll Benchmark
        </button>
      </div>
      <div v-if="isRunning" class="nc-perf-benchmark__live">
        Live FPS: <span data-testid="live-fps">{{ liveFps }}</span>
      </div>
    </div>

    <div
      v-if="results"
      class="nc-perf-benchmark__results"
      data-testid="benchmark-results"
      :data-results="resultsJson"
    >
      <h3>Results</h3>
      <table>
        <tbody>
          <tr>
            <td>Average FPS</td>
            <td data-testid="avg-fps">{{ results.avgFps }}</td>
            <td>{{ results.passAvgFps ? 'PASS' : 'FAIL' }} (&ge;30)</td>
          </tr>
          <tr>
            <td>Min FPS (1% low)</td>
            <td data-testid="min-fps">{{ results.minFps }}</td>
            <td>&mdash;</td>
          </tr>
          <tr>
            <td>Max Frame Duration</td>
            <td data-testid="max-frame">{{ results.maxFrameDuration }}ms</td>
            <td>{{ results.passMaxFrame ? 'PASS' : 'FAIL' }} (&le;50ms)</td>
          </tr>
          <tr>
            <td>Total Frames</td>
            <td data-testid="total-frames">{{ results.totalFrames }}</td>
            <td>&mdash;</td>
          </tr>
          <tr v-if="results.maxDrift !== undefined">
            <td>Max Scroll Drift</td>
            <td data-testid="max-drift">{{ results.maxDrift }}px</td>
            <td>{{ results.maxDrift === 0 ? 'PASS' : 'INFO' }} (0px ideal)</td>
          </tr>
        </tbody>
      </table>
      <div class="nc-perf-benchmark__verdict" data-testid="verdict">
        {{ results.pass ? 'BENCHMARK PASSED' : 'BENCHMARK FAILED' }}
      </div>
    </div>

    <v-theme-provider theme="nativeChat">
      <div class="nc-perf-benchmark__message-area">
        <MessageList />
      </div>
    </v-theme-provider>
  </div>
</template>

<style scoped>
.nc-perf-benchmark {
  padding: 16px;
}

.nc-perf-benchmark__controls {
  margin-bottom: 16px;
}

.nc-perf-benchmark__buttons {
  display: flex;
  gap: 8px;
  margin: 8px 0;
}

.nc-perf-benchmark__buttons button {
  padding: 8px 16px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.nc-perf-benchmark__buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nc-perf-benchmark__live {
  font-size: 18px;
  font-weight: bold;
  padding: 8px;
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 4px;
  margin-top: 8px;
}

.nc-perf-benchmark__results {
  margin: 16px 0;
  padding: 16px;
  background: rgba(var(--v-theme-on-surface), 0.04);
  border-radius: 8px;
}

.nc-perf-benchmark__results table {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
}

.nc-perf-benchmark__results td {
  padding: 4px 8px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.nc-perf-benchmark__verdict {
  font-size: 20px;
  font-weight: bold;
  margin-top: 16px;
  text-align: center;
}

.nc-perf-benchmark__message-area {
  height: 600px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
