import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from '../../environments/environment';
import { isUnitTestContext, throwIfAlreadyLoaded } from './core-utils';
import { DatabaseService } from './services/database.service';
import { reducers, metaReducers } from './store/index';
import { RouterEffects } from './store/router/router-effects';
import { AppRouterStateSerializer } from './store/router/router-state-serializer';
import { AuthService } from './services/auth.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    // @ngrx store
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule,
    /* istanbul ignore next */
    environment.production ? [] : StoreDevtoolsModule.instrument({ name: 'what-conference-next.com' }),
    EffectsModule.forRoot([AuthService, RouterEffects]),

    // Firebase setup
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    isUnitTestContext() ? AngularFirestoreModule : AngularFirestoreModule.enablePersistence(),

    // SW
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [{ provide: RouterStateSerializer, useClass: AppRouterStateSerializer }, AuthService, DatabaseService],
})
export class CoreModule {
  public constructor(
    @Optional()
    @SkipSelf()
    parentModule?: CoreModule,
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
