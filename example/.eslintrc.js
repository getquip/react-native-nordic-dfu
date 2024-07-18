const isCI = process.env.CI === 'true'

module.exports = {
  extends: ['universe', 'universe/shared/typescript-analysis'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['n', 'jest', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true }],
    'jest/no-focused-tests': isCI ? 'error' : 'off',
    'n/no-process-env': 'error',
    'no-unused-expressions': [2, { allowTernary: true }],
    'no-void': 'off',
    semi: [2, 'never'],
  },
  // ignorePatterns: ['plugins/**/*.js'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    {
      files: ['__tests__/**/*', '__mocks__/**/*'],
      rules: {
        'n/no-process-env': 'off',
      },
    },
  ],
}
