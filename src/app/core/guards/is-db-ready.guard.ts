import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

import { CoreService } from '../services/core.service';

/**
 * Guard to check if Stitch DB is ready to use.
 * Can be used to wait when loading components
 * which gets some data from DB on start.
 *
 * Usage:
 * ```
 * const routes: Routes = [
 *  {
 *    path: 'page-x',
 *    component: MyPageComponent,
 *    canActivate: [ IsDbReadyGuard ],
 *  },
 * ];
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class IsDbReadyGuard implements CanActivate, CanActivateChild {
  constructor(protected coreService: CoreService) {}

  /**
   * Checks to see if the route can activate
   */
  public canActivate(route: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> {
    return this.coreService.whenAuthAndDbReady();
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
