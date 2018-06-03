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
    apiKey: 'AIzaSyBEOVpgRastnqyGLxloAWcaxPoJljHWiVk',
    authDomain: 'frontend-events-dev.firebaseapp.com',
    databaseURL: 'https://frontend-events-dev.firebaseio.com',
    projectId: 'frontend-events-dev',
    storageBucket: 'frontend-events-dev.appspot.com',
    messagingSenderId: '898642869507',
  },
};
