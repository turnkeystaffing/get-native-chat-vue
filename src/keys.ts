import type { InjectionKey } from 'vue'
import type { NativeChatPluginOptions } from '@/types/config'
import type { UseChatReturn } from '@/composables/useChat'

export const CONFIG_KEY: InjectionKey<NativeChatPluginOptions> = Symbol('native-chat-config')

export const CHAT_STATE_KEY: InjectionKey<UseChatReturn> = Symbol('native-chat-state')
