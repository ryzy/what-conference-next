import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { map, switchMap } from 'rxjs/operators';

import { FirestoreDbService } from '../../core/services/firestore-db.service';
import { EventTopic } from '../model/event-topic';
import { LoadTopicsAction, TopicsActionType, SetTopicsAction } from '../store/topics-actions';
import { EventsRootState } from '../store/index';

@Injectable()
export class EventEffects {

  @Effect()
  public setTopics$: Observable<SetTopicsAction> = this.actions$.pipe(
    ofType(TopicsActionType.LOAD_TOPICS),
    switchMap(() => this.fdb.getTopics()),
    map((topics: EventTopic[]) => new SetTopicsAction(topics)),
  );

  @Effect()
  public loadTopics$: Observable<LoadTopicsAction> = defer(() => {
    return of(new LoadTopicsAction());
  });

  public constructor(
    private actions$: Actions,
    private store: Store<EventsRootState>,
    private fdb: FirestoreDbService,
  ) {
  }
}
