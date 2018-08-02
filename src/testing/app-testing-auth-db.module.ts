import { ModuleWithProviders, NgModule } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CoreService } from '../app/core/services/core.service';

import { StitchService } from '../app/core/stitch/stitch.service';
import { DatabaseService } from '../app/event-base/services/database.service';
import { AppTestingModule } from './app-testing.module';
import { MockDatabaseService } from './mock-database.service';
import { MockStitchService } from './mock-stitch.service';

@NgModule({
  imports: [AppTestingModule.withCoreStateAndEffects()],
  providers: [
    { provide: StitchService, useClass: MockStitchService },
    { provide: DatabaseService, useClass: MockDatabaseService },
  ],
})
export class AppTestingAuthAndDbModule {
  /**
   * Provide a database, but real one (by default this module provides mocked db with mocked data)
   */
  public static withRealDatabaseService(): ModuleWithProviders {
    return {
      ngModule: AppTestingAuthAndDbModule,
      providers: [{ provide: DatabaseService, useClass: DatabaseService }],
    };
  }

  /**
   * Make CoreService.whenAuthAndDbReady() returning always true
   */
  public static withAuthAndDbReady(): ModuleWithProviders {
    return {
      ngModule: AppTestingAuthAndDbModule,
      providers: [
        {
          provide: CoreService,
          useClass: class extends CoreService {
            public whenAuthAndDbReady(): Observable<boolean> {
              return of(true);
            }
          },
        },
      ],
    };
  }

  public constructor(stitch: StitchService) {
    // TODO: do we need that in tests?
    // stitch.connectToDb();
  }
}
