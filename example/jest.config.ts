import type { Config } from 'jest'

const config: Config = {
  collectCoverage: false,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js',
  ],
  errorOnDeprecated: true,
  preset: 'jest-expo',
  // setupFiles: ['<rootDir>/__tests__/setup.ts'],
  // setupFilesAfterEnv: ['<rootDir>/__tests__/setupAfterEnv.ts'],
  // prettier-ignore
  // eslint-disable-next-line no-useless-escape
  testRegex: ['(/__tests__/.*(\.)(test|spec))\.[jt]sx?$'],
  // transformIgnorePatterns: ['node_modules/uuid'],
  transform: {
    '^.+\\.(t)s$': [
      'ts-jest',
      {
        diagnostics: {
          warnOnly: true, // Tries tests even if there are type errors
        },
      },
    ],
  },
}

export default config