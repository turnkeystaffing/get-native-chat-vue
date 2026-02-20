import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      outDir: 'dist/types',
      tsconfigPath: './tsconfig.build.json',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NativeChatVue',
      fileName: () => 'native-chat-vue.es.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^vue/, /^vuetify/],
      output: {
        globals: {
          vue: 'Vue',
          vuetify: 'Vuetify',
        },
      },
    },
    cssCodeSplit: false,
    copyPublicDir: false,
  },
})
