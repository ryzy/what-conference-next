import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { pluck, switchMap, map, take } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AppRouterState, getRouterState } from '../../core/store/router/router';

import { EventsDataSource } from './events-data-source';
import { ConferenceEvent, ConferenceEventRef } from '../model/conference-event';
import { DatabaseService } from './database.service';
import { EventTag } from '../model/event-tag';
import { EventsRootState, selectAllTags } from '../store/index';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public constructor(private store: Store<EventsRootState>, private db: DatabaseService, private auth: AuthService) {}

  public getRouterState(): Observable<AppRouterState> {
    return this.store.select(getRouterState).pipe(pluck('state'));
  }

  public getEventTags(): Observable<EventTag[]> {
    return this.store.select(selectAllTags);
  }

  public getEventTagsSnapshot(): EventTag[] {
    let tags: EventTag[] = [];
    this.getEventTags()
      .pipe(take(1))
      .subscribe((v) => (tags = v));
    return tags;
  }

  public getEventsDS(): EventsDataSource {
    return new EventsDataSource(this.db);
  }

  public getEvent(eventId: string): Observable<ConferenceEventRef> {
    return this.db.getEvent(eventId);
  }

  public addOrUpdateEvent(ev: ConferenceEvent): Observable<boolean> {
    ev = this.appendEventOriginData(ev);
    // console.log(`EventService#addOrUpdateEvent (with 'origin' data)`, ev);

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
    origin.date = origin.date || new Date();

    // DB rules will prevent saving the event without valid user id...
    const currentUser = this.auth.getUserSnapshot();
    if (!origin.authorId && currentUser) {
      origin.authorId = currentUser && currentUser.id;
    }

    return { ...ev, origin };
  }
}
