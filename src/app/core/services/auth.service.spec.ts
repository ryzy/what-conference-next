import { HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-auth-db.module';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { mockStitchProfileResponse } from '../../../testing/fixtures/stitch';
import { mockStitchUser, mockUser } from '../../../testing/fixtures/user';
import { MockStitchService } from '../../../testing/mock-stitch.service';
import { TestActionsProvider } from '../../../testing/test-actions';
import { User } from '../model/user';
import { SetUserAction } from '../store/app/app-actions';
import { AppRootState } from '../store/index';
import { AuthService } from './auth.service';
import { StitchService } from '../stitch/stitch.service';

describe('AuthService', () => {
  let authService: AuthService;
  let stitch: MockStitchService;
  let store: Store<AppRootState>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule.withCoreStateAndEffects(), AppTestingAuthAndDbModule],
      providers: [TestActionsProvider],
    });

    httpMock = TestBed.get(HttpTestingController);
    authService = TestBed.get(AuthService);
    stitch = TestBed.get(StitchService);
    store = TestBed.get(Store);
  });

  afterEach(() => httpMock.verify());

  it(
    'should dispatch user to the store',
    fakeAsync(() => {
      let dispatchedAction: SetUserAction | undefined;
      spyOn(store, 'dispatch').and.callFake((v) => (dispatchedAction = v));

      stitch.mockLogin();

      expect(dispatchedAction).toBeTruthy();
      expect(dispatchedAction.user).toBeTruthy();
      expect(dispatchedAction.user.email).toBe(mockStitchProfileResponse.data.email);
    }),
  );

  it('#getUser', () => {
    let user: User | undefined;
    authService.getUser().subscribe((u) => (user = u));
    expect(user).toBe(undefined);

    store.dispatch(new SetUserAction(mockUser));
    expect(user).toBe(mockUser);
  });

  it('#loginWithGoogle', () => {
    const authSpy = spyOn(stitch.auth, 'loginWithRedirect');
    authService.loginWithGoogle();
    expect(authSpy).toHaveBeenCalled();
  });

  it('#signInWithEmailAndPassword', () => {
    const authSpy = spyOn(stitch.auth, 'loginWithCredential').and.returnValue(Promise.resolve(mockStitchUser));

    authService.signInWithEmailAndPassword('email', 'password').subscribe();
    expect(authSpy).toHaveBeenCalled();
  });

  it('#logout', () => {
    const authSpy = spyOn(stitch.auth, 'logout');
    authService.logout();
    expect(authSpy).toHaveBeenCalled();
  });
});
