import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import type { Linter } from 'eslint'

export default [
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
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
] satisfies Linter.Config[]
