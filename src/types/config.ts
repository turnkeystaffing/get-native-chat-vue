import type { NativeChatApiClient } from './api'
import type { ChatError } from './chat'

export interface NativeChatPluginOptions {
  apiClient: NativeChatApiClient
  position?: 'bottom-left' | 'bottom-right'
  welcomeMessage?: string
  batchSize?: number
  conversationId?: string
  hideToggleWhenOpen?: boolean
  showBubbleHeaders?: boolean
  assistantBubbleFullWidth?: boolean
  onError?: (error: ChatError) => void
}
