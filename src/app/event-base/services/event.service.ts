import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
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
  public constructor(private store: Store<EventsRootState>, private fdb: DatabaseService) {}

  public getRouterState(): Observable<AppRouterState> {
    return this.store.select(getRouterState).pipe(pluck('state'));
  }

  public getTopics(): Observable<EventTopic[]> {
    return this.store.select(selectAllTopics);
  }

  public getEventsDS(): EventsDataSource {
    return new EventsDataSource(this.fdb);
  }

  public getEvent(eventId: string): Observable<ConferenceEventRef> {
    return this.fdb.getEvent(eventId);
  }

  public newEvent(ev: ConferenceEvent): Observable<ConferenceEventRef> {
    return this.fdb.newEvent(ev);
  }
}
