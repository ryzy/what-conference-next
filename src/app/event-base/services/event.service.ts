import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConferenceEvent } from '../model/conference-event';

import { DatabaseService } from './database.service';
import { EventTopic } from '../model/event-topic';
import { EventsRootState, selectAllTopics } from '../store/index';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public constructor(private store: Store<EventsRootState>, private fdb: DatabaseService) {}

  public getTopics(): Observable<EventTopic[]> {
    return this.store.select(selectAllTopics);
  }

  public getEvent(eventId: string): Observable<ConferenceEvent> {
    return this.fdb.getEvent(eventId);
  }

  public newEvent(ev: ConferenceEvent): Observable<ConferenceEvent> {
    return this.fdb.newEvent(ev);
  }
}
