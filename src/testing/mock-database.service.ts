import { Injectable } from '@angular/core';
import { RemoteInsertOneResult, RemoteUpdateResult } from 'mongodb-stitch-browser-sdk';
import { Observable, of } from 'rxjs';

import { UserData } from '../app/core/model/user';
import { ConferenceEvent, ConferenceEventRef } from '../app/event-base/model/conference-event';
import { DatabaseService } from '../app/event-base/services/database.service';
import { EventTag } from '../app/event-base/model/event-tag';
import { mockEvent, mockEvents } from './fixtures/events';
import { mockStitchInsertOneResponse, mockStitchUpdateResponse } from './fixtures/stitch';
import { mockTags } from './fixtures/event-tags';

@Injectable()
export class MockDatabaseService extends DatabaseService {
  public getUserData(): Observable<UserData | undefined> {
    return of(<UserData>{ roles: { editor: true } });
  }

  public getEventTags(): Observable<EventTag[]> {
    return of(mockTags);
  }

  public getEvent(eventId: string): Observable<ConferenceEventRef> {
    return of(new ConferenceEventRef(mockEvent, { tags: mockTags }));
  }

  public getEvents(): Observable<ConferenceEventRef[]> {
    return of(mockEvents.map((ev) => new ConferenceEventRef(ev, { tags: mockTags })));
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
