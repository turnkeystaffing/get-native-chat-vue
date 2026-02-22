<script setup lang="ts">
import { ref, computed } from 'vue'

interface DemoBlockProps {
  source: string
}

const props = defineProps<DemoBlockProps>()

const expanded = ref(false)
const copied = ref(false)

const sourceLines = computed(() => props.source.split('\n'))

async function copySource() {
  try {
    await navigator.clipboard.writeText(props.source)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {
    // Silent failure on clipboard permission denied
  }
}
</script>

<template>
  <div class="nc-demo-block">
    <div class="nc-demo-block__preview">
      <slot />
    </div>
    <div class="nc-demo-block__actions">
      <button
        type="button"
        class="nc-demo-block__toggle"
        :aria-label="expanded ? 'Hide source code' : 'Show source code'"
        @click="expanded = !expanded"
      >
        <svg
          class="nc-demo-block__chevron"
          :class="{ 'nc-demo-block__chevron--expanded': expanded }"
          width="15"
          height="15"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ expanded ? 'Hide Code' : 'View Source' }}
      </button>
      <button
        type="button"
        class="nc-demo-block__copy"
        :aria-label="copied ? 'Code copied' : 'Copy source code'"
        @click="copySource"
      >
        <Transition name="nc-demo-block__icon-swap" mode="out-in">
          <svg
            v-if="!copied"
            key="clipboard"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5" />
            <path d="M3 11V3C3 2.44772 3.44772 2 4 2H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <svg
            v-else
            key="check"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            class="nc-demo-block__check-icon"
          >
            <path
              d="M3 8.5L6.5 12L13 4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Transition>
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <div
      class="nc-demo-block__source-wrapper"
      :class="{ 'nc-demo-block__source-wrapper--expanded': expanded }"
    >
      <div class="nc-demo-block__source">
        <div class="nc-demo-block__source-header">
          <span class="nc-demo-block__source-lang">.vue</span>
        </div>
        <pre class="nc-demo-block__pre"><code class="nc-demo-block__code"><span v-for="(line, i) in sourceLines" :key="i" class="nc-demo-block__line">{{ line }}
</span></code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
@layer native-chat {
  .nc-demo-block {
    border-radius: 10px;
    overflow: hidden;
    margin: 20px 0;
    box-shadow:
      0 0 0 1px rgba(var(--v-theme-on-surface), 0.08),
      0 1px 3px rgba(var(--v-theme-on-surface), 0.06),
      0 4px 12px rgba(var(--v-theme-on-surface), 0.04);
  }

  /* Preview: subtle dot-grid canvas */
  .nc-demo-block__preview {
    padding: 32px 24px;
    background:
      radial-gradient(circle, rgba(var(--v-theme-on-surface), 0.07) 1px, transparent 1px);
    background-size: 16px 16px;
    background-color: rgb(var(--v-theme-surface));
  }

  /* Action toolbar */
  .nc-demo-block__actions {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 6px 8px;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    background: rgb(var(--v-theme-surface));
  }

  .nc-demo-block__toggle,
  .nc-demo-block__copy {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12.5px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: rgba(var(--v-theme-on-surface), 0.5);
    padding: 6px 10px;
    border-radius: 6px;
    min-height: 32px;
    transition: color 0.15s ease, background-color 0.15s ease;
    user-select: none;
  }

  .nc-demo-block__toggle:hover,
  .nc-demo-block__copy:hover {
    color: rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.06);
  }

  .nc-demo-block__toggle:focus-visible,
  .nc-demo-block__copy:focus-visible {
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: -2px;
  }

  .nc-demo-block__copy {
    margin-left: auto;
  }

  /* Chevron rotation */
  .nc-demo-block__chevron {
    transition: transform 0.25s ease;
    flex-shrink: 0;
  }

  .nc-demo-block__chevron--expanded {
    transform: rotate(180deg);
  }

  /* Copied checkmark color */
  .nc-demo-block__check-icon {
    color: #41A58D;
  }

  /* Icon swap transition */
  .nc-demo-block__icon-swap-enter-active,
  .nc-demo-block__icon-swap-leave-active {
    transition: opacity 0.12s ease, transform 0.12s ease;
  }

  .nc-demo-block__icon-swap-enter-from {
    opacity: 0;
    transform: scale(0.8);
  }

  .nc-demo-block__icon-swap-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }

  /* Source panel expand/collapse via grid rows */
  .nc-demo-block__source-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease;
  }

  .nc-demo-block__source-wrapper--expanded {
    grid-template-rows: 1fr;
  }

  .nc-demo-block__source {
    overflow: hidden;
    min-height: 0;
  }

  /* Editor-style title bar */
  .nc-demo-block__source-header {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background: #00202b;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  }

  .nc-demo-block__source-lang {
    font-family: var(--vp-font-family-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: #C4105B;
    background: rgba(196, 16, 91, 0.12);
    padding: 2px 8px;
    border-radius: 4px;
  }

  /* Dark code block */
  .nc-demo-block__pre {
    margin: 0;
    padding: 16px 0;
    overflow-x: auto;
    background: #002B38;
    counter-reset: line;
  }

  .nc-demo-block__code {
    font-family: var(--vp-font-family-mono);
    font-size: 13px;
    line-height: 1.7;
    color: #e0ecef;
  }

  .nc-demo-block__line {
    display: block;
    padding: 0 16px 0 0;
    counter-increment: line;
    min-height: 1.7em;
  }

  .nc-demo-block__line::before {
    content: counter(line);
    display: inline-block;
    width: 40px;
    padding-right: 16px;
    text-align: right;
    color: rgba(224, 236, 239, 0.2);
    font-size: 12px;
    user-select: none;
    pointer-events: none;
  }
}
</style>
