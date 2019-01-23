import { defaultEnvironmentConfig } from './defaults';
import { AppEnvironment } from './model';
// import { environment as prodEnvironment } from './environment.production';

export const environment: AppEnvironment = {
  ...defaultEnvironmentConfig,

  // production: true,
  // mongo: prodEnvironment.mongo,
  // gaTrackingId: prodEnvironment.gaTrackingId,
};
