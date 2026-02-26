<script setup lang="ts">
import { ref, watch } from 'vue'
import { demoConfig } from '../../.vitepress/mock/demoConfig'
import {
  simulateFreshConversation,
  setSimulateFreshConversation,
} from '../../.vitepress/mock/mockApiClient'

const freshConversation = ref(simulateFreshConversation)

watch(freshConversation, (val) => {
  setSimulateFreshConversation(val)
})
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
      <v-switch
        v-model="freshConversation"
        label="New Conversation (close & reopen chat)"
        color="primary"
        density="compact"
        hide-details
        class="mt-2"
      />
      <p class="nc-config-demo__hint">
        Toggle 'New Conversation' then close and reopen the chat to see the welcome state.
      </p>
    </div>
  </v-theme-provider>
</template>

<style scoped>
.nc-config-demo {
  padding: 16px;
}

.nc-config-demo__description {
  margin-bottom: 12px;
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.nc-config-demo__hint {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.5);
}
</style>
