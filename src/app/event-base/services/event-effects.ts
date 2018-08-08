import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, defer, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { CoreService } from '../../core/services/core.service';

import { DatabaseService } from './database.service';
import { EventTag } from '../model/event-tag';
import { LoadTagsAction, TagsActionType, SetTagsAction } from '../store/tags-actions';
import { EventsRootState } from '../store/index';

/**
 * All event-related events
 */
@Injectable({
  providedIn: 'root',
})
export class EventEffects {
  @Effect()
  public setTags$: Observable<SetTagsAction> = this.actions$.pipe(
    ofType(TagsActionType.LOAD_TAGS),
    switchMap(() => this.db.getEventTags()),
    map((tags: EventTag[]) => new SetTagsAction(tags)),
  );

  /**
   * All actions to fire when app loads/initializes
   */
  @Effect({ dispatch: false })
  public whenDbReady$: Observable<boolean> = this.core.whenAuthAndDbReady().pipe(
    tap((v) => {
      this.store.dispatch(new LoadTagsAction());
    }),
  );

  public constructor(
    private core: CoreService,
    private actions$: Actions,
    private store: Store<EventsRootState>,
    private db: DatabaseService,
  ) {}
}
