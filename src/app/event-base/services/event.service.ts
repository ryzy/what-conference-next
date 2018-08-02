import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { pluck, switchMap, map } from 'rxjs/operators';
import { AppRouterState, getRouterState } from '../../core/store/router/router';

import { EventsDataSource } from './events-data-source';
import { ConferenceEvent, ConferenceEventRef } from '../model/conference-event';
import { DatabaseService } from './database.service';
import { EventTopic } from '../model/event-topic';
import { EventsRootState, selectAllTopics } from '../store/index';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public constructor(private store: Store<EventsRootState>, private db: DatabaseService) {}

  public getRouterState(): Observable<AppRouterState> {
    return this.store.select(getRouterState).pipe(pluck('state'));
  }

  public getTopics(): Observable<EventTopic[]> {
    return this.store.select(selectAllTopics);
  }

  public getEventsDS(): EventsDataSource {
    return new EventsDataSource(this.db);
  }

  public getEvent(eventId: string): Observable<ConferenceEventRef | undefined> {
    return this.db.getEvent(eventId);
  }

  public addOrUpdateEvent(ev: ConferenceEvent): Observable<boolean> {
    if (ev._id) {
      return this.db.updateEvent(ev).pipe(map((v) => !!v.matchedCount));
    } else {
      return this.db.newEvent(ev).pipe(map((v) => !!v.insertedId));
    }
  }
}
