import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

import { CoreService } from '../services/core.service';

/**
 * Guard to check if initial essential app data
 * (e.g. topics list) has been fetched from db.
 *
 * Usage:
 * ```
 * const routes: Routes = [
 *  {
 *    path: 'page-x',
 *    component: MyPageComponent,
 *    canActivate: [ IsInitDataFetchedGuard ],
 *  },
 * ];
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class IsInitDataFetchedGuard implements CanActivate, CanActivateChild {
  constructor(protected coreService: CoreService) {}

  /**
   * Checks to see if the route can activate
   */
  public canActivate(route: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> {
    return this.coreService.whenInitDataFetched();
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
