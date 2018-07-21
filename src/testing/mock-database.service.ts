import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ConferenceEvent } from '../app/event-base/model/conference-event';
import { DatabaseService } from '../app/event-base/services/database.service';
import { EventTopic } from '../app/event-base/model/event-topic';
import { mockEvents } from './fixtures/events-db';
import { mockTopics } from './fixtures/topics';

@Injectable()
export class MockDatabaseService extends DatabaseService {
  public getTopics(): Observable<EventTopic[]> {
    return of(mockTopics);
  }

  public getEvent(eventId: string): Observable<ConferenceEvent> {
    return of(mockEvents[0]);
  }

  public newEvent(ev: ConferenceEvent): Observable<ConferenceEvent> {
    return of(mockEvents[0]);
  }
}
