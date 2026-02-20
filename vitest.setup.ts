import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

// Create a Vuetify instance and register globally for all component tests
const vuetify = createVuetify()
config.global.plugins.push(vuetify)
