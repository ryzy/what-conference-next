// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDq4EtvqFmf0wCvqNYuZxq-5IdcA6OPYhc",
    authDomain: "frontend-events.firebaseapp.com",
    databaseURL: "https://frontend-events.firebaseio.com",
    projectId: "frontend-events",
    storageBucket: "frontend-events.appspot.com",
    messagingSenderId: "964595802365"
  }
};
