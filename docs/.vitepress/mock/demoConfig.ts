import { reactive } from 'vue'
import type { NativeChatPluginOptions } from '@/types/config'
import { mockApiClient } from './mockApiClient'

export const demoConfig: NativeChatPluginOptions = reactive({
  apiClient: mockApiClient,
  batchSize: 5,
  showBubbleHeaders: true,
  assistantBubbleFullWidth: false,
})
