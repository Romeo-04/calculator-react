// jest.config.js
// Configuration for Jest testing framework

const nextJest = require('next/jest');

// Provide the path to your Next.js app which enables loading next.config.js and .env files
const createJestConfig = nextJest({
  dir: './',
});

// Custom Jest configuration
const customJestConfig = {
  // Setup files to run before each test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Test environment (jsdom simulates browser)
  testEnvironment: 'jest-environment-jsdom',
  
  // Module name mapper for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Where to find test files
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Coverage settings (optional)
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    '!app/**/*.test.{js,jsx}',
    '!app/layout.js',
  ],
};

// Export config for Jest
module.exports = createJestConfig(customJestConfig);
