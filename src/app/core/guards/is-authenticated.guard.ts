import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanLoad,
  Route,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { CoreService } from '../services/core.service';

/**
 * Guard to check if user is authenticated.
 * If user is NOT authenticated, it redirects to the login URL
 * configured inside `AuthService.LOGIN_URL`.
 *
 * You can supply `canActivateRedirectUrl` option in Route's `data`
 * to override the default redirect url.
 *
 * Usage:
 * ```
 * const routes: Routes = [
 *  {
 *    path: 'login',
 *    component: MySecretPageComponent,
 *    canActivate: [ IsAuthenticatedGuard ],
 *    data: {
 *      canActivateRedirectUrl: '/my-login-url',
 *    }
 *  },
 * ];
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class IsAuthenticatedGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(protected coreService: CoreService, protected authService: AuthService) {}

  /**
   * Checks to see if the route can activate
   *
   * Note: in case `route.queryParams` contains auth_token (from NEST iframe)
   * assume blindly the token is valid, and therefore we can let the user in.
   * It's OK and not a security risk, because all API calls check for a valid token.
   * Also, in case we receive any 401 Unauthorized error from API request,
   * the app invalidates the auth token nd force user to re-login.
   * @see AuthEffects.authTokenInvalidationOnUnauthorizedError$
   */
  public canActivate(route: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> {
    return this.checkLoginWithRedirect(route.data['canActivateRedirectUrl']);
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  public canLoad(route: Route): Observable<boolean> {
    return this.checkLoginWithRedirect(route.data && route.data['canActivateRedirectUrl']);
  }

  private checkLoginWithRedirect(redirectUrl?: string): Observable<boolean> {
    return this.coreService.whenAuthAndDbReady().pipe(
      // Wait for auth system to complete whatever it might be
      filter((completed) => !!completed),
      // TODO: we should probably wait instead of just taking 1?
      take(1),
      // ...then check if we're logged in.
      switchMap(() => this.authService.getCurrentUser().pipe(take(1))),
      map((user) => !!user),
      tap((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.authService.navigateToLoginScreen(redirectUrl);
        }
      }),
    );
  }
}
