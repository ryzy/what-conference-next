import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map } from 'rxjs/operators';

import { AppRootState } from '../store/index';
import { User } from '../model/user';
import { SetUserAction } from '../store/app/app-actions';
import * as appSelectors from '../store/app/app-selectors';

@Injectable()
export class AuthService {

  /**
   * Puts user in @ngrx store
   */
  @Effect()
  public userIntoStore$: Observable<SetUserAction> = defer(() => this.afAuth.authState)
    .pipe(
      map(user => new SetUserAction(User.fromFirebase(user || undefined))),
    );

  public constructor(
    private actions$: Actions,
    private afAuth: AngularFireAuth,
    private store: Store<AppRootState>,
  ) {
  }

  /**
   * Get currently logged in user
   */
  public getCurrentUser(): Observable<any> {
    return this.store.select(appSelectors.getUser);
  }

  /**
   * Log in the user
   */
  public loginWithDefaultMethod(): Observable<firebase.auth.UserCredential> {
    return fromPromise(this.afAuth.auth.signInWithRedirect(new firebase.auth.TwitterAuthProvider()));
  }

  /**
   * Log out the user
   */
  public logout(): Observable<boolean> {
    return fromPromise(this.afAuth.auth.signOut()).pipe(map(() => true));
  }
}
