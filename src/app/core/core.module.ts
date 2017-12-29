import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from '../../environments/environment';
import { throwIfAlreadyLoaded } from './core-utils';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    // Firebase setup
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,

    // Store: TODO

    // SW
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ]
})
export class CoreModule {
  public constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
