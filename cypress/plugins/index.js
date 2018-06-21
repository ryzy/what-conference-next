const webpackPreProcessor = require('@cypress/webpack-preprocessor');
const cucumber = require('cypress-cucumber-preprocessor').default;

// ***********************************************************
// This example plugins/index.ts can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  const webpackOptions = {
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'ts-loader',
            }
          ],
        },
      ],
    },
  };

  // Must be after webpack, otherwise cucumber files are
  on('file:preprocessor', cucumber());

  // TODO: Cucumber doesn't support Typescript, so... no-go for now ;/
  // on('file:preprocessor', webpackPreProcessor({ webpackOptions }));
};
