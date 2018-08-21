import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Provider } from '@angular/core/src/di/provider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AuthService } from '../app/core/services/auth.service';
import { reducers } from '../app/core/store/index';
import { SharedModule } from '../app/shared/shared.module';

@NgModule({
  imports: [
    NoopAnimationsModule,
    HttpClientTestingModule,
    RouterTestingModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SharedModule,
  ],
})
export class AppTestingModule {
  public static withAppCoreState(): ModuleWithProviders {
    return {
      ngModule: AppTestingModule,
      providers: [StoreModule.forRoot(reducers).providers as Provider[]],
    };
  }
}
