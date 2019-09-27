import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';

import { mockStitchUser } from '../../../testing/fixtures/user';
import { AppRootState, rootStoreConfig } from '../store/index';
import { StitchService } from './stitch.service';

describe('StitchService', () => {
  let stitchService: StitchService;
  let store: Store<AppRootState>;
  let httpMock: HttpTestingController;

  afterEach(() => {
    httpMock.verify();
  });

  describe('when not logged in', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, StoreModule.forRoot({} as any, rootStoreConfig)],
        providers: [StitchService],
      });

      httpMock = TestBed.get(HttpTestingController);
      stitchService = TestBed.get(StitchService);
      store = TestBed.get(Store);
    });

    it('should create Stitch Client', () => {
      expect(stitchService.client).toBeTruthy();

      const loginSpy = spyOn(stitchService.auth, 'loginWithCredential').and.returnValue(
        Promise.resolve(mockStitchUser),
      );
      stitchService.connectToDb();
      expect(loginSpy).toHaveBeenCalled();
    });

    // TODO: write more StitchService tests
    it('...', () => {
      pending('TODO: write more StitchService tests');
    });
  });
});
