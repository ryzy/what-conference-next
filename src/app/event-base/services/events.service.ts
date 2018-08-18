import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppSortInfo } from '../../core/model/entity';

import { AuthService } from '../../core/services/auth.service';
import { AppRouterState, getAppRouterState } from '../../core/store/router/router';
import { ConferenceEvent, ConferenceEventRef } from '../model/conference-event';
import { EventTag } from '../model/event-tag';
import { EventsFilters } from '../model/events-filters';
import * as fromEventsList from '../store/events-list-actions';
import { EventsRootState, selectAllEvents, selectAllTags, selectAllTagsSorted } from '../store/index';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  public constructor(private store: Store<EventsRootState>, private db: DatabaseService, private auth: AuthService) {}

  public getRouterState(): Observable<AppRouterState> {
    return this.store.select(getAppRouterState);
  }

  public getEventTags(): Observable<EventTag[]> {
    return this.store.select(selectAllTagsSorted);
  }

  public getEventTagsSnapshot(): EventTag[] {
    let tags: EventTag[] = [];
    this.getEventTags()
      .pipe(take(1))
      .subscribe((v) => (tags = v));
    return tags;
  }

  public getEvent(eventId: string): Observable<ConferenceEventRef> {
    return this.db.getEvent(eventId);
  }

  public addOrUpdateEvent(ev: ConferenceEvent): Observable<boolean> {
    ev = this.appendEventOriginData(ev);
    // console.log(`EventsService#addOrUpdateEvent (with 'origin' data)`, ev);

    if (ev._id) {
      return this.db.updateEvent(ev).pipe(map((v) => !!v.matchedCount));
    } else {
      return this.db.newEvent(ev).pipe(map((v) => !!v.insertedId));
    }
  }

  public deleteEvent(ev: ConferenceEvent): Observable<boolean> {
    return this.db.deleteEvent(ev);
  }

  /**
   * Set origin date/author
   * (but only if it's not set yet, otherwise we'd loose info about original authoring)
   */
  public appendEventOriginData(ev: ConferenceEvent): ConferenceEvent {
    const origin = { ...ev.origin };

    // DB rules will prevent saving the event without valid user id...
    const currentUser = this.auth.getUserSnapshot();
    if (!origin.authorId && currentUser) {
      origin.authorId = currentUser.id;
    }

    return { ...ev, origin };
  }

  /**
   * Get events currently in the store
   */
  public getEvents(): Observable<ConferenceEventRef[]> {
    return this.store.select(selectAllEvents);
  }

  public dispatchFetchEvents(): void {
    this.store.dispatch(new fromEventsList.FetchEventsAction());
  }

  public dispatchNewEventsSorting(sort: AppSortInfo): void {
    this.store.dispatch(new fromEventsList.SetEventsSortingAction(sort));
  }

  public dispatchNewEventsFilters(filters: EventsFilters): void {
    this.store.dispatch(new fromEventsList.SetEventsFiltersAction(filters));
  }
}
