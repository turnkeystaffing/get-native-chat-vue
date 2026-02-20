// ResizeObserver polyfill for jsdom (required by Vuetify components)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

// Create a Vuetify instance with all components and directives for tests
const vuetify = createVuetify({
  components,
  directives,
})
config.global.plugins.push(vuetify)
