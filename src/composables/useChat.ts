import { ref, readonly } from 'vue'
import type { Ref, DeepReadonly } from 'vue'
import type { NativeChatApiClient } from '@/types/api'
import type { NativeChatPluginOptions } from '@/types/config'
import type { ChatMessage } from '@/types/chat'

export interface UseChatReturn {
  messages: DeepReadonly<Ref<ChatMessage[]>>
  isOpen: Readonly<Ref<boolean>>
  isLoading: Readonly<Ref<boolean>>
  isSending: Readonly<Ref<boolean>>
  hasMore: Readonly<Ref<boolean>>
  failedMessageText: Readonly<Ref<string | null>>
  open(): Promise<void>
  close(): void
  sendMessage(text: string): Promise<void>
  loadMore(): Promise<void>
  retry(): Promise<void>
}

function getErrorContent(error: unknown): string {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const statusCode = (error as { statusCode: number }).statusCode
    if (statusCode === 429) {
      return "You're sending messages too quickly. Please wait a moment and try again."
    }
    if (statusCode === 503 || statusCode === 504) {
      return 'The service is temporarily unavailable. Please try again in a moment.'
    }
  }
  return 'Something went wrong. You can try sending your message again.'
}

export function useChat(
  apiClient: NativeChatApiClient,
  config: NativeChatPluginOptions,
): UseChatReturn {
  const messages = ref<ChatMessage[]>([])
  const isOpen = ref(false)
  const isLoading = ref(false)
  const isSending = ref(false)
  const hasMore = ref(false)
  const failedMessageText = ref<string | null>(null)
  const conversationId = ref<string | null>(null)
  const messageOffset = ref(0)
  const batchSize = config.batchSize ?? 20

  async function open(): Promise<void> {
    if (isOpen.value || isLoading.value) return

    isLoading.value = true
    try {
      // Resolve conversation ID
      if (config.conversationId) {
        conversationId.value = config.conversationId
      } else {
        const listResponse = await apiClient.getConversations(0, 1)
        if (listResponse.conversations.length > 0) {
          conversationId.value = listResponse.conversations[0].id
        } else {
          const newConv = await apiClient.createConversation()
          conversationId.value = newConv.id
        }
      }

      // Fetch initial messages
      const response = await apiClient.getMessages(conversationId.value!, 0, batchSize)
      const chronological = [...response.messages].reverse()
      messages.value = chronological
      hasMore.value = response.has_more
      messageOffset.value = chronological.length
    } catch {
      // Open chat with empty state as fallback
    } finally {
      isLoading.value = false
      isOpen.value = true
    }
  }

  function close(): void {
    isOpen.value = false
  }

  async function sendMessage(text: string): Promise<void> {
    if (!text.trim() || isSending.value) return

    isSending.value = true
    const tempId = `temp-${Date.now()}`
    const optimisticMessage: ChatMessage = {
      id: tempId,
      conversationId: conversationId.value ?? '',
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
      status: 'sending',
    }
    messages.value = [...messages.value, optimisticMessage]

    // Ensure we have a conversation — create one if open() failed to establish it
    if (!conversationId.value) {
      try {
        const newConv = await apiClient.createConversation()
        conversationId.value = newConv.id
      } catch (error) {
        // Cannot establish conversation — remove optimistic, show error inline
        messages.value = messages.value.filter((m) => m.id !== tempId && !m.id.startsWith('error-'))
        const errorContent = getErrorContent(error)
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          conversationId: '',
          role: 'assistant',
          content: errorContent,
          createdAt: new Date().toISOString(),
        }
        messages.value = [...messages.value, errorMessage]
        failedMessageText.value = text
        isSending.value = false

        if (config.onError) {
          config.onError({
            message: errorContent,
            statusCode:
              error && typeof error === 'object' && 'statusCode' in error
                ? (error as { statusCode: number }).statusCode
                : undefined,
            originalError: error,
          })
        }
        return
      }
    }

    try {
      const response = await apiClient.sendMessage(conversationId.value!, text)
      // Replace optimistic message with server response, remove old error messages
      const serverUserMessage: ChatMessage = {
        ...response.userMessage,
        status: 'sent',
      }
      const assistantMessage: ChatMessage = {
        ...response.assistantMessage,
      }
      messages.value = [
        ...messages.value.filter((m) => m.id !== tempId && !m.id.startsWith('error-')),
        serverUserMessage,
        assistantMessage,
      ]
      failedMessageText.value = null
    } catch (error) {
      // Remove optimistic message and previous error messages
      messages.value = messages.value.filter((m) => m.id !== tempId && !m.id.startsWith('error-'))

      // Add error message as assistant role
      const errorContent = getErrorContent(error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        conversationId: conversationId.value!,
        role: 'assistant',
        content: errorContent,
        createdAt: new Date().toISOString(),
      }
      messages.value = [...messages.value, errorMessage]

      failedMessageText.value = text

      if (config.onError) {
        config.onError({
          message: errorContent,
          statusCode:
            error && typeof error === 'object' && 'statusCode' in error
              ? (error as { statusCode: number }).statusCode
              : undefined,
          originalError: error,
        })
      }
    } finally {
      isSending.value = false
    }
  }

  async function loadMore(): Promise<void> {
    if (!hasMore.value || isLoading.value || !conversationId.value) return

    isLoading.value = true
    try {
      const response = await apiClient.getMessages(
        conversationId.value,
        messageOffset.value,
        batchSize,
      )
      const chronological = [...response.messages].reverse()
      messages.value = [...chronological, ...messages.value]
      messageOffset.value += chronological.length
      hasMore.value = response.has_more
    } catch {
      // Silent failure per UX spec
    } finally {
      isLoading.value = false
    }
  }

  async function retry(): Promise<void> {
    if (!failedMessageText.value) return
    const text = failedMessageText.value
    failedMessageText.value = null
    await sendMessage(text)
  }

  return {
    messages: readonly(messages),
    isOpen: readonly(isOpen),
    isLoading: readonly(isLoading),
    isSending: readonly(isSending),
    hasMore: readonly(hasMore),
    failedMessageText: readonly(failedMessageText),
    open,
    close,
    sendMessage,
    loadMore,
    retry,
  }
}
