import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwindcss from 'eslint-plugin-tailwindcss';

export default [
  // Global ignores
  {
    ignores: [
      '**/aws-exports.js',
      'amplify-codegen-temp/models/models/**',
      'coverage/**',
      'node_modules/**',
      'build/**',
      'src/graphql/**',
      'src/types/react-csv-core.d.ts',
    ],
  },

  // Base config for all files
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        Blob: 'readonly',
        URLSearchParams: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
        // Node globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        // ES2021 globals
        Promise: 'readonly',
        Symbol: 'readonly',
        WeakMap: 'readonly',
        WeakSet: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
        Proxy: 'readonly',
        Reflect: 'readonly',
      },
    },
    plugins: {
      react,
      prettier,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      tailwindcss,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...tailwindcss.configs.recommended.rules,

      // Sort rules
      'sort-vars': 'error',
      'react/jsx-sort-props': ['error'],

      // React rules
      'react/prop-types': 0,

      // Prettier
      'prettier/prettier': 'error',

      // JSX rules
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'ignore', propElementValues: 'always' },
      ],

      // Tailwind
      'tailwindcss/no-custom-classname': 0,

      // Variables
      'no-unused-vars': 0,

      // Import rules
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'simple-import-sort/imports': 'error',

      // Syntax preferences
      'prefer-template': 'error',
      'prefer-destructuring': 'error',
      'prefer-arrow-callback': 'error',
      'no-iterator': 'error',
      'no-restricted-syntax': 'error',
      'no-undef': 'error',
      'prefer-const': 'error',
      'no-unneeded-ternary': 'error',
      'no-nested-ternary': 'error',
      'spaced-comment': 'error',
      'no-new-wrappers': 'error',
      camelcase: 'error',
      'no-restricted-globals': 'error',
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.eslint.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      prettier,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      tailwindcss,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...tailwindcss.configs.recommended.rules,

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn', // Allow for Chart.js compatibility

      'sort-vars': 'error',
      'react/jsx-sort-props': ['error'],

      'react/prop-types': 0,

      'prettier/prettier': 'error',

      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'ignore', propElementValues: 'always' },
      ],

      'tailwindcss/no-custom-classname': 0,

      'no-unused-vars': 'off',

      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'simple-import-sort/imports': 'error',

      'prefer-template': 'error',
      'prefer-destructuring': 'error',
      'prefer-arrow-callback': 'error',
      'no-iterator': 'error',
      'no-restricted-syntax': 'error',
      'no-undef': 'off', // TypeScript handles this
      'prefer-const': 'error',
      'no-unneeded-ternary': 'error',
      'no-nested-ternary': 'error',
      'spaced-comment': 'error',
      'no-new-wrappers': 'error',
      camelcase: 'error',
      'no-restricted-globals': 'error',
    },
  },

  // Test files configuration
  {
    files: [
      '**/__tests__/**/*.js',
      '**/__tests__/**/*.jsx',
      '**/__tests__/**/*.ts',
      '**/__tests__/**/*.tsx',
      '**/*.test.js',
      '**/*.test.jsx',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.js',
      '**/*.spec.jsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/setupTests.js',
      '**/setupTests.ts',
    ],
    languageOptions: {
      globals: {
        // Jest globals
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        // JSDOM globals
        Node: 'readonly',
        Storage: 'readonly',
      },
    },
  },

  // Prettier config (must be last to override other configs)
  eslintConfigPrettier,
];
