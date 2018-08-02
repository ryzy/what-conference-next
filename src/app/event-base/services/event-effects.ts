import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, defer, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { CoreService } from '../../core/services/core.service';

import { DatabaseService } from './database.service';
import { EventTopic } from '../model/event-topic';
import { LoadTopicsAction, TopicsActionType, SetTopicsAction } from '../store/topics-actions';
import { EventsRootState } from '../store/index';

/**
 * All event-related events
 */
@Injectable({
  providedIn: 'root',
})
export class EventEffects {
  @Effect()
  public setTopics$: Observable<SetTopicsAction> = this.actions$.pipe(
    ofType(TopicsActionType.LOAD_TOPICS),
    switchMap(() => this.db.getTopics()),
    map((topics: EventTopic[]) => new SetTopicsAction(topics)),
  );

  /**
   * All actions to fire when app loads/initializes
   */
  @Effect({ dispatch: false })
  public whenDbReady$: Observable<boolean> = this.core.whenAuthAndDbReady().pipe(
    tap((v) => {
      this.store.dispatch(new LoadTopicsAction());
    }),
  );

  public constructor(
    private core: CoreService,
    private actions$: Actions,
    private store: Store<EventsRootState>,
    private db: DatabaseService,
  ) {}
}
