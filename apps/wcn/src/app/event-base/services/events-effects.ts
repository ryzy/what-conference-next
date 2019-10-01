import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

import { CoreService } from '../../core/services/core.service';
import { RouterEffects } from '../../core/services/router-effects';
import { AppRouterState, getAppRouterState } from '../../core/store/router/router';
import { defaultSortInfo } from '../../core/url-utils';
import { matSnackBarConfig } from '../../shared/configs';
import { ConferenceEventRef } from '../model/conference-event';
import {
  EventsListActionType,
  SetEventsAction,
  SetEventsFiltersAction,
  SetEventsSortingAction,
} from '../store/events-list-actions';
import { getEventsQueryFromRouterState, getEventsQuerySortFromRouterState } from '../utils/db-utils';

import { DatabaseService } from './database.service';
import { EventTag } from '../model/event-tag';
import { FetchTagsAction, TagsActionType, SetTagsAction } from '../store/tags-actions';
import { EventsRootState } from '../store/index';

/**
 * All event-related events
 */
@Injectable({
  providedIn: 'root',
})
export class EventsEffects {
  @Effect()
  public fetchAndSetTags$: Observable<SetTagsAction> = this.actions$.pipe(
    ofType(TagsActionType.FETCH_TAGS),
    switchMap(() => this.db.getEventTags().pipe(catchError(() => of([])))),
    map((tags: EventTag[]) => new SetTagsAction(tags)),
  );

  @Effect()
  public fetchAndSetEvents$: Observable<SetEventsAction> = this.actions$.pipe(
    ofType(EventsListActionType.FETCH_EVENTS),
    switchMap(() => this.store.select(getAppRouterState).pipe(take(1))),
    switchMap((routerState: AppRouterState) => {
      const query = getEventsQueryFromRouterState(routerState);
      const sort = getEventsQuerySortFromRouterState(routerState) || defaultSortInfo;
      return this.db.getEvents(query, sort);
    }),
    catchError((err: Error) => {
      this.snackBar.open(`Error while loading events: ${err.name} ${err.message}`, 'OK', matSnackBarConfig);
      return [];
    }),
    map((events: ConferenceEventRef[]) => new SetEventsAction(events)),
  );

  /**
   * Put events filters in the route url
   *
   * Note: for now we don't dispatch anything from here,
   * once the params are in URL, we get new router state on events page
   * and we fetch the events imperatively from there.
   */
  @Effect({ dispatch: false })
  public eventsFiltersToRouter$: Observable<AppRouterState> = this.actions$.pipe(
    ofType(EventsListActionType.SET_EVENTS_FILTERS),
    // tslint:disable-next-line:rxjs-no-unsafe-switchmap <-- WTF, tslint?
    switchMap((action: SetEventsFiltersAction) => this.routerEffects.navigateWithEventsFilters(action.filters)),
  );

  /**
   * Put events sorting info in the route url
   *
   * Note: for now we don't dispatch anything from here,
   * once the params are in URL, we get new router state on events page
   * and we fetch the events imperatively from there.
   */
  @Effect({ dispatch: false })
  public eventsSortingToRouter$: Observable<AppRouterState> = this.actions$.pipe(
    ofType(EventsListActionType.SET_EVENTS_SORTING),
    // tslint:disable-next-line:rxjs-no-unsafe-switchmap <-- WTF, tslint?
    switchMap((action: SetEventsSortingAction) => this.routerEffects.navigateWithSortInfo(action.sort)),
  );

  /**
   * All actions to fire when app loads/initializes
   */
  @Effect({ dispatch: false })
  public whenDbReady$: Observable<boolean> = this.core.whenAuthAndDbReady().pipe(
    tap((v) => {
      // Dispatch all actions to fetch all required app data...
      // Note: no point to load here events, since router might not have finished
      // the navigation yet and thus the filters would not be applied.
      // We trigger that initial load from the EventsPageView component.
      this.store.dispatch(new FetchTagsAction());
    }),
  );

  public constructor(
    private core: CoreService,
    private actions$: Actions,
    private store: Store<EventsRootState>,
    private routerEffects: RouterEffects,
    private db: DatabaseService,
    private snackBar: MatSnackBar,
  ) {}
}
