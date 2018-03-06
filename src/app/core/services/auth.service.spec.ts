import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs/observable/of';
import * as firebase from 'firebase/app';

import { mockUser } from '../../../testing/fixtures/user';
import { TestActions } from '../../../testing/test-actions';
import { CoreModule } from '../core.module';
import { User } from '../model/user';
import { SetUserAction } from '../store/app/app-actions';
import { AppRootState } from '../store/index';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let actions$: TestActions;
  let afAuth: AngularFireAuth;
  let store: Store<AppRootState>;

  const mockFirebaseUser: firebase.User = {} as firebase.User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CoreModule,
      ],
      providers: [
        { provide: Actions, useFactory: () => new TestActions() },
      ],
    });

    authService = TestBed.get(AuthService);
    actions$ = TestBed.get(Actions);
    afAuth = TestBed.get(AngularFireAuth);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('#userIntoStore$ @Effect should work', () => {
    (afAuth as any).authState = of(mockFirebaseUser);
    actions$.stream = hot('-');
    const expected = cold('(c|)', { c: new SetUserAction(User.fromFirebase(mockFirebaseUser)) });
    expect(authService.userIntoStore$).toBeObservable(expected);
  });

  it('#getCurrentUser', () => {
    let user: User|undefined;
    authService.getCurrentUser().subscribe(u => user = u);
    expect(user).toBe(undefined);

    store.dispatch(new SetUserAction(mockUser));
    expect(user).toBe(mockUser);
  });

  it('#loginWithDefaultMethod', (done) => {
    const mockFirebaseCredentials = { user: mockFirebaseUser };
    const signInSpy = spyOn(afAuth.auth, 'signInWithRedirect').and.returnValue(Promise.resolve(mockFirebaseCredentials));

    authService.loginWithDefaultMethod().subscribe(v => {
      expect(v).toEqual(mockFirebaseCredentials as any);
      done();
    });

    expect(signInSpy).toHaveBeenCalled();
  });

  it('#loginWithDefaultMethod', (done) => {
    const signOutSpy = spyOn(afAuth.auth, 'signOut').and.returnValue(Promise.resolve());

    authService.logout().subscribe(v => {
      expect(v).toEqual(true);
      done();
    });
    expect(signOutSpy).toHaveBeenCalled();
  });
});
