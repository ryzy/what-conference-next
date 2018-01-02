import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from '../../environments/environment';
import { throwIfAlreadyLoaded } from './core-utils';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    StoreModule.forRoot({}),
    StoreRouterConnectingModule,
    !environment.production ? StoreDevtoolsModule.instrument({ name: 'what-conference-next.com' }) : [],
    EffectsModule.forRoot([]),

    // Firebase setup
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,

    // Store: TODO

    // SW
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
})
export class CoreModule {
  public constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
