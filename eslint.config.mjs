import perfectionist from 'eslint-plugin-perfectionist';
import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'nest',
            'internal',
            'commonLib',
            'common',
            'mainModules',
            'modules',
            'parent',
            'sibling',
          ],
          customGroups: {
            value: {
              nest: '^@nestjs/(.*)$',
              commonLib: '@common/(.*)',
              common: '(.*)/common/(.*)',
              mainModules: ['^src/(?!modules/).*'],
              modules: ['^src/modules/(.*)$', '^../../(.*)$'],
            },
          },
          newlinesBetween: 'always',
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-named-imports': [
        'warn',
        {
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-exports': [
        'warn',
        {
          type: 'line-length',
          order: 'desc',
        },
      ],
    },
  },
];
