import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  title: 'Native Chat Vue',
  description: 'A Vue 3 chat widget plugin powered by Vuetify',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Components', link: '/components/widget' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'API Client', link: '/guide/api-client' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Full Widget', link: '/components/widget' },
          { text: 'Message Bubble', link: '/components/message-bubble' },
          { text: 'Chat Input', link: '/components/chat-input' },
        ],
      },
    ],
  },
  vite: {
    plugins: [
      vuetify({
        styles: {
          configFile: '.vitepress/styles/vuetify-settings.scss',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
      },
    },
    ssr: {
      noExternal: ['vuetify'],
    },
    css: {
      preprocessorOptions: {
        sass: { api: 'modern-compiler' },
        scss: { api: 'modern-compiler' },
      },
    },
  },
})
