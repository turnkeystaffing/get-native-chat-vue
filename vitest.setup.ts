// ResizeObserver polyfill for jsdom (required by Vuetify components)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// matchMedia polyfill for jsdom (required by WelcomeState typewriter animation)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

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
