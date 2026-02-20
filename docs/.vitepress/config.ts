import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Native Chat Vue',
  description: 'A Vue 3 chat widget plugin powered by Vuetify',
  themeConfig: {
    nav: [{ text: 'Home', link: '/' }],
    sidebar: [],
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
      },
    },
  },
})
