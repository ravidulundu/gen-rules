/**
 * ESLint Configuration - Good Taste Edition
 *
 * "Good taste is the ability to identify and select solutions that are
 * not only correct but also elegant, maintainable, and idiomatic."
 * — Linus Torvalds
 *
 * This config enforces:
 * - Elegance over cleverness
 * - Simplicity over complexity
 * - Early returns over nesting
 * - Small functions over monoliths
 */

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

      // ============================================
      // GOOD TASTE RULES (Linus Torvalds)
      // ============================================

      // No nested ternary - hard to read
      'no-nested-ternary': 'error',

      // No else after return - use early returns
      'no-else-return': ['error', { allowElseIf: false }],

      // No lonely if inside else - flatten it
      'no-lonely-if': 'error',

      // No unneeded ternary - simplify
      'no-unneeded-ternary': 'error',

      // Prefer template literals over concat
      'prefer-template': 'error',

      // Object shorthand syntax
      'object-shorthand': ['error', 'always'],

      // Prefer arrow callbacks
      'prefer-arrow-callback': 'error',

      // Arrow function style - concise when possible
      'arrow-body-style': ['error', 'as-needed'],

      // No useless string concat
      'no-useless-concat': 'error',

      // Prefer destructuring
      'prefer-destructuring': ['error', {
        array: false,
        object: true,
      }],

      // No confusing arrow functions
      'no-confusing-arrow': 'error',

      // Consistent return - all paths must return
      'consistent-return': 'error',
    },
  },
);
