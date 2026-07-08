const base = require('./jest.base.config');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  displayName: 'e2e',
  testMatch: ['<rootDir>/tests/e2e/**/*.spec.ts'],
  testTimeout: 30000
};

