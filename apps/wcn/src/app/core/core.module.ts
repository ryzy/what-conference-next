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
import { throwIfAlreadyLoaded } from './core-utils';
import { StitchService } from './stitch/stitch.service';
import { reducers, rootStoreConfig } from './store/index';
import { RouterEffects } from './services/router-effects';
import { AppRouterStateSerializer } from './store/router/router-state-serializer';
import { AuthService } from './services/auth.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    // @ngrx store
    StoreModule.forRoot(reducers, rootStoreConfig),
    EffectsModule.forRoot([AuthService, RouterEffects]),
    StoreRouterConnectingModule.forRoot({
      serializer: AppRouterStateSerializer,
    }),
    StoreDevtoolsModule.instrument({
      name: 'what-conference-next.com',
      maxAge: 99,
      logOnly: environment.production,
    }),

    Angulartics2Module.forRoot(<Angulartics2Settings>{
      pageTracking: { clearHash: true, clearQueryParams: true },
      ga: { transport: 'beacon' },
      developerMode: !environment.gaTrackingId, // developerMode disables tracking
    }),
  ],
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
