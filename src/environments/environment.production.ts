import { defaultEnvironmentConfig } from './defaults';
import { AppEnvironment } from './model';

export const environment: AppEnvironment = {
  ...defaultEnvironmentConfig,
  production: true,
};
