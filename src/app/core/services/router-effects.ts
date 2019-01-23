import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Observable } from 'rxjs';
import { pluck, take, tap } from 'rxjs/operators';
import { EventsFilters } from '../../event-base/model/events-filters';

import { AppSortInfo } from '../model/entity';
import { AppRootState } from '../store/index';
import { AppRouterState, getAppRouterState } from '../store/router/router';
import * as fromRouter from '../store/router/router-actions';
import { RouterActionType } from '../store/router/router-actions';
import { AppSectionUrls, makeEventsFiltersForRouter, makeParamsForRouter, makeSortInfoForRouter } from '../url-utils';

@Injectable({
  providedIn: 'root',
})
export class RouterEffects {
  @Effect({ dispatch: false })
  public navigate$: Observable<any> = this.actions$.pipe(
    ofType<fromRouter.GoAction>(RouterActionType.GO),
    tap((action: fromRouter.GoAction) => {
      this.router.navigate(action.path, action.extras);
    }),
  );

  @Effect({ dispatch: false })
  public navigateBack$: Observable<Action> = this.actions$.pipe(
    ofType(RouterActionType.BACK),
    tap(() => this.location.back()),
  );

  @Effect({ dispatch: false })
  public navigateForward$: Observable<Action> = this.actions$.pipe(
    ofType(RouterActionType.FORWARD),
    tap(() => this.location.forward()),
  );

  protected state!: AppRouterState;

  public constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<AppRootState>,
    private location: Location,
  ) {
    this.store.select(getAppRouterState).subscribe((state) => {
      this.state = state;
    });
  }

  /**
   * Navigate the same way as standard Route.navigate(), but via RouterEffects,
   * by dispatching action to the Store.
   *
   * Optionally, you can subscribe to returned Observable, which will emit after navigation completed
   * and information about the new url is already there.
   */
  public navigate(path: any[], extras?: NavigationExtras): Observable<AppRouterState> {
    this.store.dispatch(new fromRouter.GoAction(path, extras));
    return this.afterRouterNavigationCompletes();
  }

  /**
   * Navigate with provided sorting info (when uses changes sort on the table)
   *
   * Optionally, you can subscribe to returned Observable, which will emit after navigation completed
   * and information about the sorting is already in router state.
   */
  public navigateWithEventsFilters(filters?: EventsFilters): Observable<AppRouterState> {
    const params = makeParamsForRouter(this.state.params, makeEventsFiltersForRouter(filters));
    this.store.dispatch(new fromRouter.GoAction([AppSectionUrls.EventsList, params]));
    return this.afterRouterNavigationCompletes();
  }

  /**
   * Navigate with provided sorting info (when uses changes sort on the table)
   *
   * Optionally, you can subscribe to returned Observable, which will emit after navigation completed
   * and information about the sorting is already in router state.
   */
  public navigateWithSortInfo(sort?: AppSortInfo): Observable<AppRouterState> {
    const params = makeParamsForRouter(this.state.params, makeSortInfoForRouter(sort));
    this.store.dispatch(new fromRouter.GoAction([AppSectionUrls.EventsList, params]));
    return this.afterRouterNavigationCompletes();
  }

  private afterRouterNavigationCompletes(): Observable<AppRouterState> {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      take(1),
      pluck('payload'),
      pluck('routerState'),
    );
  }
}
