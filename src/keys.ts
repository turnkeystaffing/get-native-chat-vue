import type { InjectionKey } from 'vue'
import type { NativeChatPluginOptions } from '@/types/config'

export const CONFIG_KEY: InjectionKey<NativeChatPluginOptions> = Symbol('native-chat-config')

// TODO: Type as InjectionKey<UseChatReturn> in Story 2.1 when composable is created
export const CHAT_STATE_KEY = Symbol('native-chat-state')
