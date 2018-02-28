import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import { AppRouterState } from './router';

/**
 * Custom router state serializer, provided as @ngrx RouterStateSerializer
 */
export class AppRouterStateSerializer implements RouterStateSerializer<AppRouterState> {
  public serialize(routerState: RouterStateSnapshot): AppRouterState {
    let snapshot: ActivatedRouteSnapshot = routerState.root;
    // ActivatedRouteSnapshot has more details (e.g. data field), than supplied RouterStateSnapshot.
    // Find the one for current route, which is in the last leaf of `firstChild`.
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }

    return {
      url: routerState.url,
      data: snapshot.data,
      fragment: snapshot.fragment || '',
      params: snapshot.params,
      queryParams: snapshot.queryParams,
    };
  }
}
