import { defaultEnvironmentConfig } from './defaults';
import { AppEnvironment } from './model';

export const environment: AppEnvironment = {
  ...defaultEnvironmentConfig,
  production: true,

  /**
   * MongoDB Stitch settings
   */
  mongo: {
    stitchAppId: 'what-conference-next-eqvxa',
    database: 'wcn-db',
  },
};
