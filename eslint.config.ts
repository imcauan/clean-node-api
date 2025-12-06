import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import unusedImports from 'eslint-plugin-unused-imports';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, 'unused-imports': unusedImports },
    extends: ['js/recommended', eslintPluginPrettierRecommended],
    languageOptions: { globals: globals.node },
    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.ts', '**/*.test.ts'],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
]);
