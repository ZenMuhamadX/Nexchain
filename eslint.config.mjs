/** @format */

import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
	{
		ignores: ['node_modules', 'dist', '*.d.ts'],
	},
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: globals.node } },
	...tseslint.configs.recommended,
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 0,
		},
	},
]
