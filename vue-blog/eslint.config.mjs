import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
    rules: {
      "no-undeclared-variable": "off"
    }
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/main.js'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
]
