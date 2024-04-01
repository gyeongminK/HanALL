module.exports = {
  root: true,
  plugins: ['import', 'react', 'react-hooks'],
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'plugin:import/typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'sort-imports': [
      'error',
      { ignoreDeclarationSort: true, ignoreCase: true },
    ],
    'import/order': [
      'warn',
      {
        alphabetize: { order: 'asc' },
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
