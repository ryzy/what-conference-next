import { HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-auth-db.module';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { mockStitchProfileResponse } from '../../../testing/fixtures/stitch';
import { mockStitchUser, mockUser, mockUserData } from '../../../testing/fixtures/user';
import { MockStitchService } from '../../../testing/mock-stitch.service';
import { TestActionsProvider } from '../../../testing/test-actions';
import { User, UserData } from '../model/user';
import { SetUserAction, SetUserDataAction } from '../store/app/app-actions';
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
      imports: [AppTestingModule.withAppCoreState(), AppTestingAuthAndDbModule],
      providers: [TestActionsProvider],
    });

    httpMock = TestBed.get(HttpTestingController);
    authService = TestBed.get(AuthService);
    stitch = TestBed.get(StitchService);
    store = TestBed.get(Store);
  });

  afterEach(() => {
    // console.log('httpMock after', httpMock);
    httpMock.verify();
  });

  it('should dispatch user to the store', fakeAsync(() => {
    let dispatchedAction: SetUserAction | undefined;
    spyOn(store, 'dispatch').and.callFake((v) => (dispatchedAction = v));

    stitch.mockLogin();

    expect(dispatchedAction).toBeTruthy();
    expect(dispatchedAction.user).toBeTruthy();
    expect(dispatchedAction.user.email).toBe(mockStitchProfileResponse.data.email);
  }));

  it('#getUser', () => {
    let user: User | undefined;
    authService.getUser().subscribe((u) => (user = u));
    expect(user).toBe(undefined);
    expect(authService.getUserSnapshot()).toBe(undefined);

    store.dispatch(new SetUserAction(mockUser));
    expect(user).toBe(mockUser);
    expect(authService.getUserSnapshot()).toBe(mockUser);
  });

  it('#getUserData', () => {
    let data: UserData | undefined;
    authService.getUserData().subscribe((u) => (data = u));
    expect(data).toBeDefined();
    expect(data.roles.editor).toBeFalsy();

    store.dispatch(new SetUserDataAction(mockUserData));
    expect(data).toBe(mockUserData);
    expect(data.roles.editor).toBe(true);
    expect(authService.getUserDataSnapshot()).toBe(mockUserData);
  });

  it('#loginWithGoogle', () => {
    const authSpy = spyOn(stitch.auth, 'loginWithRedirect');
    authService.loginWithGoogle();
    expect(authSpy).toHaveBeenCalled();
  });

  it('#loginWithEmailAndPassword', () => {
    const authSpy = spyOn(stitch.auth, 'loginWithCredential').and.returnValue(Promise.resolve(mockStitchUser));

    authService.loginWithEmailAndPassword('email', 'password').subscribe();
    expect(authSpy).toHaveBeenCalled();
  });

  it('#loginWithUserApiKey', () => {
    const authSpy = spyOn(stitch.auth, 'loginWithCredential').and.returnValue(Promise.resolve(mockStitchUser));

    authService.loginWithUserApiKey('some api key').subscribe();
    expect(authSpy).toHaveBeenCalled();
  });

  it('#logout', () => {
    const authSpy = spyOn(stitch.auth, 'logout');
    const loginSpy = spyOn(stitch.auth, 'loginWithCredential');
    authService.logout();
    expect(authSpy).toHaveBeenCalled();
    expect(loginSpy).toHaveBeenCalled();
  });

  it('#fetchUserData$ effect', () => {
    let res: SetUserDataAction | undefined;
    authService.fetchUserData$.subscribe((v) => (res = v));
    expect(res).toBeDefined();
    expect(res.userData).toBe(undefined);

    // When new user arrives, user data should be fetched
    spyOn(authService, 'fetchUserData').and.returnValue(of(mockUserData));
    store.dispatch(new SetUserAction(mockUser));

    expect(res).toBeDefined();
    expect(res.userData).toBeDefined();
  });

  it('#fetchUserData', fakeAsync(() => {
    stitch.mockLogin();

    let res: UserData | undefined;
    authService.fetchUserData().subscribe((v) => (res = v));
    stitch.mockCollectionFindResponse('user', [mockUserData]);

    expect(res.roles).toBeDefined();
    expect(res.roles.editor).toBe(true);
  }));

  it('#navigateToLoginScreen, #navigateToAfterLoginScreen', () => {
    authService.navigateToLoginScreen();
    authService.navigateToAfterLoginScreen();
    // TODO: cover with tests when/if implemented...
    expect(true).toBe(true);
  });
});
