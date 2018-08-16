import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, defer, of } from 'rxjs';
import { filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

import { CoreService } from '../../core/services/core.service';
import { RouterEffects } from '../../core/services/router-effects';
import { AppRouterState, getAppRouterState } from '../../core/store/router/router';
import { defaultSortInfo } from '../../core/url-utils';
import { ConferenceEventRef } from '../model/conference-event';
import {
  EventsListActionType,
  FetchEventsAction,
  SetEventsAction,
  SetEventsFiltersAction,
  SetEventsSortingAction,
} from '../store/events-list-actions';
import { getEventsListingQueryFromRouterState, getEventsListingQuerySortFromRouterState } from '../utils/db-utils';

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
    switchMap(() => this.db.getEventTags()),
    map((tags: EventTag[]) => new SetTagsAction(tags)),
  );

  @Effect()
  public fetchAndSetEvents$: Observable<SetEventsAction> = this.actions$.pipe(
    ofType(EventsListActionType.FETCH_EVENTS),
    switchMap(() => this.store.select(getAppRouterState).pipe(take(1))),
    switchMap((routerState: AppRouterState) => {
      const query = getEventsListingQueryFromRouterState(routerState);
      const sort = getEventsListingQuerySortFromRouterState(routerState) || defaultSortInfo;
      return this.db.getEvents(query, sort);
    }),
    map((events: ConferenceEventRef[]) => new SetEventsAction(events)),
  );

  @Effect()
  public eventsFiltersToRouter$: Observable<FetchEventsAction> = this.actions$.pipe(
    ofType(EventsListActionType.SET_EVENTS_FILTERS),
    // tslint:disable-next-line:rxjs-no-unsafe-switchmap <-- WTF, tslint?
    switchMap((action: SetEventsFiltersAction) => this.routerEffects.navigateWithEventsFilters(action.filters)),
    map(() => new FetchEventsAction()),
  );

  @Effect()
  public eventsSortingToRouter$: Observable<FetchEventsAction> = this.actions$.pipe(
    ofType(EventsListActionType.SET_EVENTS_SORTING),
    // tslint:disable-next-line:rxjs-no-unsafe-switchmap <-- WTF, tslint?
    switchMap((action: SetEventsSortingAction) => this.routerEffects.navigateWithSortInfo(action.sort)),
    map(() => new FetchEventsAction()),
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
  ) {}
}
