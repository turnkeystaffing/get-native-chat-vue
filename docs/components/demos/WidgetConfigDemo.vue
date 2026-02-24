<script setup lang="ts">
import { demoConfig } from '../../.vitepress/mock/demoConfig'
</script>

<template>
  <v-theme-provider theme="nativeChat">
    <div class="nc-config-demo">
      <p class="nc-config-demo__description">
        Toggle widget configuration options below. Changes apply immediately to the live widget.
      </p>
      <v-switch
        v-model="demoConfig.showBubbleHeaders"
        label="Show Bubble Headers"
        color="primary"
        density="compact"
        hide-details
      />
      <v-switch
        v-model="demoConfig.assistantBubbleFullWidth"
        label="Assistant Bubble Full Width"
        color="primary"
        density="compact"
        hide-details
        class="mt-2"
      />
    </div>
  </v-theme-provider>
</template>

<style scoped>
@layer native-chat {
  .nc-config-demo {
    padding: 16px;
  }

  .nc-config-demo__description {
    margin-bottom: 12px;
    font-size: 14px;
    color: rgba(var(--v-theme-on-surface), 0.7);
  }
}
</style>
