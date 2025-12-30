import pluginJs from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{ files: ['**/*.{ts,tsx}'] },
	{
		languageOptions: {
			globals: {
				...globals.browser,
				process: true,
			},
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
			},
			parser: tseslint.parser,
		},
	},
	{
		plugins: {
			...pluginJs.configs.recommended,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
	},
	...tseslint.configs.recommended,
	{
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
			'no-unused-vars': [
				'warn',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'no-undef': 'warn',
			'no-multi-spaces': 'warn',
			'object-curly-spacing': ['warn', 'always'],
			'key-spacing': ['warn', { beforeColon: false, afterColon: true }],
			'@typescript-eslint/no-explicit-any': 'warn',

			'@typescript-eslint/explicit-function-return-type': [
				'warn',
				{
					allowExpressions: false, // Allow arrow functions without return type
					allowTypedFunctionExpressions: true,
					allowHigherOrderFunctions: false,
					allowDirectConstAssertionInArrowFunctions: false, // Allow arrow functions in JSX props
				},
			],
			'@typescript-eslint/explicit-module-boundary-types': ['warn'], // Enforce explicit return types on module boundaries
			'@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'explicit' }], // Enforce explicit member accessibility
			'@typescript-eslint/typedef': [
				'warn',
				{
					parameter: true,
					propertyDeclaration: true,
					variableDeclaration: true,
					variableDeclarationIgnoreFunction: true,
					memberVariableDeclaration: true,
					objectDestructuring: true,
					// arrayDestructuring: true,
				},
			],
			// '@typescript-eslint/strict-property-initialization': ['warn'],
		},
	},
	{ ignores: ['dist'] },
];
