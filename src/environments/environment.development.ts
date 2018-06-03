import { enableProdMode } from '@angular/core';
import { defaultEnvironmentConfig } from './defaults';
import { AppEnvironment } from './model';

// This is dev environment, but running with enableProdMode()
export const environment: AppEnvironment = {
  ...defaultEnvironmentConfig,
  production: true,
  firebase: defaultEnvironmentConfig.firebase,
};
