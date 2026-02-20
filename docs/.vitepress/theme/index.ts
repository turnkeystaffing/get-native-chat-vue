import DefaultTheme from 'vitepress/theme'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { nativeChatTheme } from '../../../src/theme/nativeChatTheme'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import type { Theme } from 'vitepress'

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
  enhanceApp({ app }) {
    app.use(vuetify)
  },
} satisfies Theme
