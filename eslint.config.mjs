import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['node_modules', 'dist', '*.d.ts'],
  },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
]
