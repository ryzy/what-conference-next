import { Injectable } from '@angular/core';
import { RemoteInsertOneResult, RemoteUpdateResult } from 'mongodb-stitch-browser-sdk';
import { Observable, of } from 'rxjs';

import { ConferenceEvent, ConferenceEventRef } from '../app/event-base/model/conference-event';
import { DatabaseService } from '../app/event-base/services/database.service';
import { EventTopic } from '../app/event-base/model/event-topic';
import { mockEvent, mockEvents } from './fixtures/events-db';
import { mockStitchInsertOneResponse, mockStitchUpdateResponse } from './fixtures/stitch';
import { mockTopics } from './fixtures/topics';

@Injectable()
export class MockDatabaseService extends DatabaseService {
  public getTopics(): Observable<EventTopic[]> {
    return of(mockTopics);
  }

  public getEvent(eventId: string): Observable<ConferenceEventRef> {
    const ev = mockEvent;
    return of(new ConferenceEventRef(ev.id, ev, { topics: mockTopics }));
  }

  public getEvents(): Observable<ConferenceEventRef[]> {
    return of(mockEvents.map((ev) => new ConferenceEventRef(ev.id, ev, { topics: mockTopics })));
  }

  public newEvent(ev: ConferenceEvent): Observable<RemoteInsertOneResult> {
    return of(mockStitchInsertOneResponse);
  }

  public updateEvent(ev: ConferenceEvent): Observable<RemoteUpdateResult> {
    return of(mockStitchUpdateResponse);
  }

  public deleteEvent(ev: ConferenceEvent): Observable<boolean> {
    return of(true);
  }
}
