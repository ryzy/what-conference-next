import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ConferenceEvent, ConferenceEventRef } from '../app/event-base/model/conference-event';
import { DatabaseService } from '../app/event-base/services/database.service';
import { EventTopic } from '../app/event-base/model/event-topic';
import { mockEvents } from './fixtures/events-db';
import { mockTopics } from './fixtures/topics';

@Injectable()
export class MockDatabaseService extends DatabaseService {
  public getTopics(): Observable<EventTopic[]> {
    return of(mockTopics);
  }

  public getEvents(): Observable<ConferenceEventRef[]> {
    return of(mockEvents.map(ev => new ConferenceEventRef('mock-get-events-id', ev, { topics: mockTopics })));
  }

  public getEvent(eventId: string): Observable<ConferenceEventRef> {
    return of(new ConferenceEventRef('mock-get-event-id', mockEvents[0], { topics: mockTopics }));
  }

  public newEvent(ev: ConferenceEvent): Observable<ConferenceEventRef> {
    return of(new ConferenceEventRef('mock-new-event-id', mockEvents[0]));
  }
}
