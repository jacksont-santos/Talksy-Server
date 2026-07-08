const base = require('./jest.base.config');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  displayName: 'unit',
  testMatch: ['<rootDir>/tests/unit/**/*.spec.ts']
};

