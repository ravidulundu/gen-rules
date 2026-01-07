import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'drizzle', 'node_modules', '.husky'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // ============================================
      // ANTI-SPAGHETTI RULES (MUTLAK - DEĞİŞTİRİLEMEZ)
      // ============================================

      // Complexity: Max 10 branches per function
      'complexity': ['error', { max: 10 }],

      // File size: Max 300 lines (excluding blanks and comments)
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],

      // Function size: Max 100 lines
      'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],

      // Nesting: Max 3 levels deep
      'max-depth': ['error', { max: 3 }],

      // Max parameters per function
      'max-params': ['error', { max: 4 }],

      // ============================================
      // TYPE SAFETY (MUTLAK - DEĞİŞTİRİLEMEZ)
      // ============================================

      // NO ANY - ever
      '@typescript-eslint/no-explicit-any': 'error',

      // No ts-ignore
      '@typescript-eslint/ban-ts-comment': 'error',

      // Explicit return types for exported functions
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
      }],

      // No unused variables
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // ============================================
      // CODE QUALITY
      // ============================================

      // No console.log - use Logger
      'no-console': 'error',

      // No debugger
      'no-debugger': 'error',

      // Prefer const
      'prefer-const': 'error',

      // No var
      'no-var': 'error',

      // Eqeqeq
      'eqeqeq': ['error', 'always'],

      // No magic numbers
      'no-magic-numbers': ['warn', {
        ignore: [-1, 0, 1, 2],
        ignoreArrayIndexes: true,
        enforceConst: true,
      }],
    },
  },
);
