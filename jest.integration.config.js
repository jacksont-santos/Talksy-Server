const base = require('./jest.base.config');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  displayName: 'integration',
  testMatch: ['<rootDir>/tests/integration/**/*.spec.ts'],
  testTimeout: 30000
};

