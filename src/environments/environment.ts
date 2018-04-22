// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBEOVpgRastnqyGLxloAWcaxPoJljHWiVk',
    authDomain: 'frontend-events-dev.firebaseapp.com',
    databaseURL: 'https://frontend-events-dev.firebaseio.com',
    projectId: 'frontend-events-dev',
    storageBucket: 'frontend-events-dev.appspot.com',
    messagingSenderId: '898642869507',
  },
};
