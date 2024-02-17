/** @type {import('jest').Config} */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testEnvironment: 'node',
  testTimeout: 10000,
  verbose: true,
}
