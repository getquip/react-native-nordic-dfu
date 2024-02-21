module.exports = {
  extends: ['@react-native'],
  ignorePatterns: [],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
  root: true,
  rules: {
    semi: [2, 'never'],
  },
}