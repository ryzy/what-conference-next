import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { deburr, kebabCase } from 'lodash-es';
import {
  StitchAuth,
  UserPasswordCredential,
  StitchUser,
  GoogleRedirectCredential,
  FacebookRedirectCredential,
  UserApiKeyCredential,
  UserApiKey,
  UserApiKeyAuthProviderClient,
} from 'mongodb-stitch-browser-sdk';
import { Observable, defer, of, from, EMPTY } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { uuid } from '../core-utils';

import { AppRootState } from '../store/index';
import { User, UserData } from '../model/user';
import { SetUserAction, SetUserDataAction } from '../store/app/app-actions';
import { defaultUserData } from '../store/app/app-reducer';
import * as appSelectors from '../store/app/app-selectors';
import { StitchService } from '../stitch/stitch.service';
import { RouterEffects } from './router-effects';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * When user arrives, fetch its meta data (e.g. roles)
   */
  @Effect()
  public fetchUserData$: Observable<SetUserDataAction> = this.getUser().pipe(
    switchMap((u) => (u ? this.fetchUserData() : of(undefined))),
    map((ud: UserData | undefined) => new SetUserDataAction(ud)),
  );

  public constructor(
    private stitch: StitchService,
    private store: Store<AppRootState>,
    private routerEffects: RouterEffects,
  ) {
    // Register Stitch auth listener, so we're notified about changes in the auth
    // and we can push the user to our Store
    this.stitch.auth.addAuthListener({ onAuthEvent: this.onStitchAuthEvent.bind(this) });
  }

  /**
   * Get currently logged in user
   * Note: Safe to call before DB is connected.
   */
  public getUser(): Observable<User | undefined> {
    return this.store.select(appSelectors.selectUser);
  }

  public getUserSnapshot(): User | undefined {
    let user: User | undefined;

    this.getUser()
      .pipe(take(1))
      .subscribe((u) => (user = u));

    return user;
  }

  /**
   * Get currently authenticated user data
   * @see fetchUserData$ where this data is fetched
   */
  public getUserData(): Observable<UserData> {
    return this.store.select(appSelectors.selectUserData);
  }
  public getUserDataSnapshot(): UserData {
    let data: UserData = defaultUserData;

    this.getUserData()
      .pipe(take(1))
      .subscribe((v) => (data = v));

    return data;
  }
  /**
   * Log in the user
   */
  public loginWithEmailAndPassword(email: string, password: string): Observable<StitchUser> {
    const credential = new UserPasswordCredential(email, password);
    return defer(() => from(this.stitch.auth.loginWithCredential(credential)));
  }

  public loginWithUserApiKey(apiKey: string): Observable<StitchUser> {
    const credential = new UserApiKeyCredential(apiKey);
    return defer(() => from(this.stitch.auth.loginWithCredential(credential)));
  }

  /**
   * Create new user API key (for already authenticated user)
   */
  public createUserApiKey(apiKeyName: string): Promise<UserApiKey> {
    apiKeyName = kebabCase(deburr(apiKeyName)) + '-' + uuid(5);
    const apiKeyClient = this.stitch.auth.getProviderClient(UserApiKeyAuthProviderClient.factory);
    return apiKeyClient.createApiKey(apiKeyName);
  }

  public fetchUserApiKeys(): Promise<UserApiKey[]> {
    const apiKeyClient = this.stitch.auth.getProviderClient(UserApiKeyAuthProviderClient.factory);
    return apiKeyClient.fetchApiKeys();
  }

  /**
   * Log in the user
   */
  public loginWithGoogle(): void {
    const credential = new GoogleRedirectCredential();
    return this.stitch.auth.loginWithRedirect(credential);
  }

  public loginWithFacebook(): void {
    const credential = new FacebookRedirectCredential();
    return this.stitch.auth.loginWithRedirect(credential);
  }

  /**
   * Log out the user
   */
  public logout(): void {
    this.stitch.logout();
  }

  public navigateToLoginScreen(url: string = '/user'): void {
    this.routerEffects.navigate([url]);
  }

  public navigateToAfterLoginScreen(url: string = '/'): void {
    this.routerEffects.navigate([url]);
  }

  /**
   * Get authenticated user's data (e.g. roles)
   */
  public fetchUserData(): Observable<UserData | undefined> {
    return defer(() =>
      from(
        this.stitch.db
          .collection<UserData>('usersData')
          .find()
          .first(),
      ),
    ).pipe(
      catchError((err: Error) => {
        console.log('AuthService#fetchUserData() error', err);
        return of(undefined);
      }),
    );
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
