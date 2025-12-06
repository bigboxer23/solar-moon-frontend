import js from '@eslint/js';
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

  // Test files configuration
  {
    files: [
      '**/__tests__/**/*.js',
      '**/__tests__/**/*.jsx',
      '**/*.test.js',
      '**/*.test.jsx',
      '**/*.spec.js',
      '**/*.spec.jsx',
      '**/setupTests.js',
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
