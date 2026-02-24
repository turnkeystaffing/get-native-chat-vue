import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { nativeChatTheme } from '../../../src/theme/nativeChatTheme'
import { NativeChatPlugin } from '@/plugin'
import { demoConfig } from '../mock/demoConfig'
import Layout from './Layout.vue'
import './overrides.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      nativeChat: nativeChatTheme,
    },
  },
})

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(vuetify)
    if (typeof window !== 'undefined') {
      app.use(NativeChatPlugin, demoConfig)
    }
  },
} satisfies Theme
