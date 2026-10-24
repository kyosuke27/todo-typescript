import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// 共通層からfeatureへの逆向き依存を禁止し、Bulletproof Reactの依存方向を維持する。
const sharedLayerFiles = [
  'src/components/**/*.{ts,tsx}',
  'src/hooks/**/*.{ts,tsx}',
  'src/lib/**/*.{ts,tsx}',
  'src/stores/**/*.{ts,tsx}',
  'src/types/**/*.{ts,tsx}',
  'src/utils/**/*.{ts,tsx}',
]

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: sharedLayerFiles,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/features/**'],
              message: '共通層から特定のfeatureをimportしないでください。',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/features/*/**'],
              message:
                'app層からfeature内部を参照せず、featureのindex.tsを利用してください。',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/features/*', '**/features/*/**'],
              message:
                'feature同士を直接importせず、app層で組み合わせてください。',
            },
          ],
        },
      ],
    },
  },
])
