export interface AppEnvironment {
  /**
   * Production environment
   */
  production: boolean;

  /**
   * MongoDB Stich settings
   */
  mongo: {
    stitchAppId: string;
    database: string;
  };
}
