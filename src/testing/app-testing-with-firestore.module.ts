import { ModuleWithProviders, NgModule } from '@angular/core';
import { FirebaseApp } from 'angularfire2';

import { CoreModule } from '../app/core/core.module';
import { FirestoreDbService } from '../app/core/services/firestore-db.service';
import { AppTestingModule } from './app-testing.module';
import { FirestoreDbTestingService } from './firestore-db-testing.service';

@NgModule({
  imports: [AppTestingModule, CoreModule],
  providers: [],
})
export class AppTestingWithFirestoreModule {
  public static mockFirebaseDb(): ModuleWithProviders {
    return {
      ngModule: AppTestingWithFirestoreModule,
      providers: [{ provide: FirestoreDbService, useClass: FirestoreDbTestingService }],
    };
  }

  public constructor(fbApp: FirebaseApp) {
    fbApp.firestore().disableNetwork();
  }
}
