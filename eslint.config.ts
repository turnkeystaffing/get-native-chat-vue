import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettierConfig from 'eslint-config-prettier'

export default defineConfigWithVueTs(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'docs/.vitepress/dist/**',
      'docs/.vitepress/cache/**',
      'coverage/**',
      '_bmad/**',
      '_bmad-output/**',
      '.claude/**',
      '.yarn/**',
      'design/**',
    ],
  },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['src/**/__tests__/**/*.ts'],
    rules: {
      'vue/one-component-per-file': 'off',
    },
  },
  prettierConfig,
)
