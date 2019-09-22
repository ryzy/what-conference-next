import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, CanActivateChild, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

/**
 * Guard to check if user is NOT authenticated.
 *
 * If user IS already authenticated, it redirects to the authenticated URL
 * configured inside `AuthService.LOGIN_SUCCESS_URL`.
 *
 * You can supply `canActivateRedirectUrl` option in Route's `data`
 * to override the default redirect url.
 *
 * Usage:
 * ```
 * const routes: Routes = [
 *  {
 *    path: 'login',
 *    component: AuthyLoginPageComponent,
 *    canActivate: [ IsAnonymousGuard ],
 *    data: {
 *      canActivateRedirectUrl: '/i-am-authenticated-already-url',
 *    }
 *  },
 * ];
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class IsAnonymousGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(protected authService: AuthService) {}

  /**
   * Checks to see if the route can activate
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
    return this.authService.getUser().pipe(
      // TODO: we should probably wait instead of just taking 1?
      take(1),
      map((isLoggedIn) => !isLoggedIn),
      tap((isAnonymous: boolean) => {
        if (!isAnonymous) {
          this.authService.navigateToAfterLoginScreen(redirectUrl);
        }
      }),
    );
  }
}
