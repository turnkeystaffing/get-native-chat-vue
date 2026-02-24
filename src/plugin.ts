import './styles.css'
import type { App, Plugin } from 'vue'
import type { NativeChatPluginOptions } from '@/types/config'
import { CONFIG_KEY } from '@/keys'
import NativeChatWidget from '@/components/NativeChatWidget.vue'

export const NativeChatPlugin: Plugin<[NativeChatPluginOptions?]> = {
  install(app: App, options?: NativeChatPluginOptions) {
    if (!options?.apiClient) {
      console.warn(
        '[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped.',
      )
      return
    }

    app.provide(CONFIG_KEY, options)
    app.component('NativeChatWidget', NativeChatWidget)
  },
}
