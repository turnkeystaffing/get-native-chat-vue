<script setup lang="ts">
import { ref } from 'vue'

interface DemoBlockProps {
  source: string
}

const props = defineProps<DemoBlockProps>()

const expanded = ref(false)
const copied = ref(false)

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
        aria-label="Toggle source code visibility"
        @click="expanded = !expanded"
      >
        {{ expanded ? '▲ Hide Code' : '▼ Show Code' }}
      </button>
      <button
        type="button"
        class="nc-demo-block__copy"
        :aria-label="copied ? 'Code copied' : 'Copy source code'"
        @click="copySource"
      >
        {{ copied ? '✓ Copied' : '📋 Copy' }}
      </button>
    </div>
    <div v-if="expanded" class="nc-demo-block__source">
      <pre><code class="language-vue">{{ source }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
@layer native-chat {
  .nc-demo-block {
    border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
    border-radius: 8px;
    overflow: hidden;
    margin: 16px 0;
  }

  .nc-demo-block__preview {
    padding: 24px;
  }

  .nc-demo-block__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
    background: rgba(var(--v-theme-on-surface), 0.02);
  }

  .nc-demo-block__toggle,
  .nc-demo-block__copy {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    color: rgb(var(--v-theme-primary));
    padding: 4px 8px;
    border-radius: 4px;
  }

  .nc-demo-block__toggle:hover,
  .nc-demo-block__copy:hover {
    background: rgba(var(--v-theme-primary), 0.08);
  }

  .nc-demo-block__source {
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  }

  .nc-demo-block__source pre {
    margin: 0;
    padding: 16px;
    overflow-x: auto;
    background: rgba(var(--v-theme-on-surface), 0.04);
  }

  .nc-demo-block__source code {
    font-family: var(--vp-font-family-mono);
    font-size: 13px;
    line-height: 1.6;
  }
}
</style>
