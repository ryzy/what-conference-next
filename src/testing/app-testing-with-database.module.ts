import { ModuleWithProviders, NgModule } from '@angular/core';
import { Provider } from '@angular/core/src/di/provider';
import { Type } from '@angular/core/src/type';
import { AngularFireModule, FirebaseApp } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { firestore } from 'firebase';

import { CoreModule } from '../app/core/core.module';
import { DatabaseService } from '../app/event-base/services/database.service';
import { environment } from '../environments/environment';
import { AppTestingModule } from './app-testing.module';
import { MockDatabaseService } from './mock-database.service';

let TEST_FIRESTORE_INITIALISED: firestore.Firestore | undefined;

@NgModule({
  imports: [
    AppTestingModule,

    // Firebase setup
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  providers: [{ provide: DatabaseService, useClass: MockDatabaseService }],
})
export class AppTestingAuthAndDbModule {
  public static withRealDatabaseService(): ModuleWithProviders {
    return {
      ngModule: AppTestingAuthAndDbModule,
      providers: [{ provide: DatabaseService, useClass: DatabaseService }],
    };
  }

  public constructor(fbApp: FirebaseApp) {
    // Firestore settings can be set only once, but, when running tests,
    // seems like some global state is preserved and it complains about .settings() being called again.
    const ffs = fbApp.firestore();

    if (TEST_FIRESTORE_INITIALISED !== ffs) {
      // Note: setting `timestampsInSnapshots` doesn't seem to be needed now,
      // but as soon as you call .disableNetwork() it complains, so... re-setting it.
      ffs.settings({ timestampsInSnapshots: true });
      TEST_FIRESTORE_INITIALISED = ffs;
    }

    // For now we need network for real DatabaseService tests
    // TODO: figure out how to better mock Firestore
    // ffs.disableNetwork();
  }
}
