import { ModuleWithProviders, NgModule } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { firestore } from 'firebase';

import { CoreModule } from '../app/core/core.module';
import { DatabaseService } from '../app/core/services/database.service';
import { AppTestingModule } from './app-testing.module';
import { MockDatabaseService } from './mock-database.service';

let TEST_FIRESTORE_INITIALISED: firestore.Firestore | undefined;

@NgModule({
  imports: [AppTestingModule, CoreModule],
  providers: [{ provide: DatabaseService, useClass: MockDatabaseService }],
})
export class AppTestingWithDatabaseModule {
  /**
   * By default `AppTestingWithDatabaseModule` provides mocked database service.
   * Provide it with this method to have a real `DatabaseService` instead of mocked one.
   */
  public static withRealDatabaseService(): ModuleWithProviders {
    return {
      ngModule: AppTestingWithDatabaseModule,
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
      ffs.disableNetwork();
      TEST_FIRESTORE_INITIALISED = ffs;
    }
  }
}
