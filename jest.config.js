// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  cache: false,

  testMatch: ['**/+(loader.component|event-details-page)(*.)+(spec|test).+(ts|js)?(x)'],

  transform: {
    '^.+\\.js$': 'babel-jest',
    // '^.+\\.(ts|html)$': 'ts-jest',
  },

  coverageThreshold: {
    global: {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage/wcn-app',

  /**
   * Respect package.json `browser` field.
   * Needed eg. for bugsnag, which provides both browser and nodejs implementation.
   */
  browser: true,

  /**
   * Provide our mocks, apart of what jest-preset-angular and /@angular-builders/jest provides
   */
  // setupFiles: ['./jest-mocks.js'],

  /**
   * `node_modules` dir is NOT processed by default by ts-jest
   * But some modules aren't provided as ES5 and therefore needs
   * to be transpiled. List them here.
   * NOTE: because these are .js files, tsconfig.spec.json needs to have `allowJS: true`.
   */
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es|ngx-webstorage)'],

  /**
   * Build artefacts collide with actual libs/, so exclude them here
   */
  modulePathIgnorePatterns: ['<rootDir>/dist'],

  /**
   * Sets everything which is needed for Angular testing
   * incl. mocks, tsConfigFile path, setupTestFrameworkScriptFile etc.
   */
  preset: 'jest-preset-angular',
};
