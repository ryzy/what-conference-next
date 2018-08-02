import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StitchAuth, UserPasswordCredential, StitchUser, GoogleRedirectCredential } from 'mongodb-stitch-browser-sdk';
import { Observable, defer, from } from 'rxjs';

import { AppRootState } from '../store/index';
import { User } from '../model/user';
import { SetUserAction } from '../store/app/app-actions';
import * as appSelectors from '../store/app/app-selectors';
import { StitchService } from '../stitch/stitch.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public constructor(private stitch: StitchService, private store: Store<AppRootState>) {
    // Register Stitch auth listener, so we're notified about changes in the auth
    // and we can push the user to our Store
    this.stitch.auth.addAuthListener({ onAuthEvent: this.onStitchAuthEvent.bind(this) });
  }

  /**
   * Get currently logged in user
   * Note: Safe to call before DB is connected.
   */
  public getCurrentUser(): Observable<User | undefined> {
    return this.store.select(appSelectors.selectUser);
  }

  /**
   * Log in the user
   */
  public signInWithEmailAndPassword(email: string, password: string): Observable<StitchUser> {
    const credential = new UserPasswordCredential(email, password);
    return defer(() => from(this.stitch.auth.loginWithCredential(credential)));
  }

  /**
   * Log in the user
   */
  public loginWithGoogle(): void {
    const credential = new GoogleRedirectCredential();
    return this.stitch.auth.loginWithRedirect(credential);
  }

  /**
   * Log out the user
   */
  public logout(): void {
    this.stitch.auth.logout();
  }

  public navigateToLoginScreen(url?: string): void {
    console.warn('AuthService TODO: navigateToLoginScreen');
  }

  public navigateToAfterLoginScreen(url?: string): void {
    console.warn('AuthService TODO: navigateToAfterLoginScreen');
  }

  private onStitchAuthEvent(auth: StitchAuth): void {
    // console.log('AuthService#onStitchAuthEvent', auth);
    if (auth.user && auth.user.loggedInProviderType !== 'anon-user') {
      // real user present
      this.store.dispatch(new SetUserAction(auth.user ? User.fromStitch(auth.user) : undefined));
    } else {
      // no real user... or user just logged out
      this.store.dispatch(new SetUserAction(undefined));
    }
  }
}
