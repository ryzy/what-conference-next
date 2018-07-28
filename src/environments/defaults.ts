import { AppEnvironment } from './model';

export const defaultEnvironmentConfig: AppEnvironment = {
  /**
   * Production environment
   */
  production: false,

  /**
   * Firebase config
   */
  firebase: {
    apiKey: "AIzaSyA_2Ue6zbjd821cfN4eBY8hiMt_2STVLec",
    authDomain: "dev-what-conference-next.firebaseapp.com",
    databaseURL: "https://dev-what-conference-next.firebaseio.com",
    projectId: "dev-what-conference-next",
    storageBucket: "dev-what-conference-next.appspot.com",
    messagingSenderId: "584561464783"
  },
};
