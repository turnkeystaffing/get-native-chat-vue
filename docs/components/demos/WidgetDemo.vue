<script setup lang="ts">
// The NativeChatWidget is globally registered via the plugin in theme/index.ts.
// This wrapper exists so DemoBlock can show the source code for the demo.
</script>

<template>
  <div class="nc-widget-demo">
    <p>
      The chat widget renders as a floating overlay anchored to the bottom-right of the viewport.
      Click the floating button to open the chat panel with mock API responses.
    </p>
  </div>
</template>

<style scoped>
@layer native-chat {
  .nc-widget-demo {
    padding: 16px;
    text-align: center;
    color: rgba(var(--v-theme-on-surface), 0.7);
    font-size: 14px;
  }
}
</style>
