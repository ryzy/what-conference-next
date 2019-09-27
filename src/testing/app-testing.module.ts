import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { AppRootState, reducers, rootStoreConfig } from '../app/core/store/index';
import { SharedModule } from '../app/shared/shared.module';

@NgModule({
  imports: [
    NoopAnimationsModule,
    HttpClientTestingModule,
    RouterTestingModule,
    StoreModule.forRoot({} as ActionReducerMap<AppRootState>, rootStoreConfig),
    EffectsModule.forRoot([]),
    SharedModule,
  ],
})
export class AppTestingModule {
  public static withAppCoreState(): ModuleWithProviders {
    return {
      ngModule: AppTestingModule,
      providers: [StoreModule.forRoot(reducers, rootStoreConfig).providers as Provider[]],
    };
  }
}
