export interface AppEnvironment {
  /**
   * Production environment
   */
  production: boolean;

  /**
   * Firebase config
   */
  firebase: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
  };
}
