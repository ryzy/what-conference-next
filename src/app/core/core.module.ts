import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Angulartics2Module, Angulartics2Settings } from 'angulartics2';

import { environment } from '../../environments/environment';
import { isUnitTestContext, throwIfAlreadyLoaded } from './core-utils';
import { StitchService } from './stitch/stitch.service';
import { reducers, metaReducers } from './store/index';
import { RouterEffects } from './services/router-effects';
import { AppRouterStateSerializer } from './store/router/router-state-serializer';
import { AuthService } from './services/auth.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    // @ngrx store
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([AuthService, RouterEffects]),
    StoreRouterConnectingModule,
    /* istanbul ignore next */
    environment.production || isUnitTestContext()
      ? []
      : StoreDevtoolsModule.instrument({ name: 'what-conference-next.com' }),

    Angulartics2Module.forRoot(<Angulartics2Settings>{
      pageTracking: { clearHash: true, clearQueryParams: true },
      ga: { transport: 'beacon' },
      developerMode: !environment.gaTrackingId, // developerMode disables tracking
    }),

    // SW
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [{ provide: RouterStateSerializer, useClass: AppRouterStateSerializer }],
})
export class CoreModule {
  public constructor(
    stitch: StitchService,
    @Optional()
    @SkipSelf()
    parentModule?: CoreModule,
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');

    // Connect to MongoDB Stitch ASAP
    stitch.connectToDb();
  }
}
