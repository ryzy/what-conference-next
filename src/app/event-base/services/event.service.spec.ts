import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { mockEvent } from '../../../testing/fixtures/events-db';
import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-auth-db.module';
import { mockTopics } from '../../../testing/fixtures/topics';
import { MockDatabaseService } from '../../../testing/mock-database.service';
import { AppRootState } from '../../core/store/index';
import { EventBaseModule } from '../event-base.module';
import { ConferenceEventRef } from '../model/conference-event';
import { EventTopic } from '../model/event-topic';
import { DatabaseService } from './database.service';
import { EventService } from './event.service';

describe('EventService', () => {
  let eventService: EventService;
  let db: MockDatabaseService;
  let store: Store<AppRootState>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppTestingAuthAndDbModule.withAuthAndDbReady(), // with mocked DatabaseService
        EventBaseModule,
      ],
    });

    eventService = TestBed.get(EventService);
    db = TestBed.get(DatabaseService);
    store = TestBed.get(Store);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('#getTopics', () => {
    let topics: EventTopic[] | undefined;
    eventService.getTopics().subscribe((v) => (topics = v));

    // We have full EventBaseModule and its effects, it tries to load the topics on the start
    // Since we work with mocked DatabaseService (from AppTestingAuthAndDbModule), we expect
    // topics already loaded...
    expect(topics).toEqual(mockTopics);
    expect(topics[0].id).toEqual(mockTopics[0].id);
  });

  it('#getEvent', () => {
    let ev: ConferenceEventRef | undefined;
    eventService.getEvent(mockEvent.id).subscribe((v) => (ev = v));

    // expect event from mocked DatabaseService
    expect(ev).toBeTruthy();
    expect(ev.id).toBe(mockEvent.id);
    expect(ev.ref).toBeTruthy();
  });

  it('#addOrUpdateEvent new event', () => {
    const newEventSpy = spyOn(db, 'newEvent').and.callThrough();
    const updateEventSpy = spyOn(db, 'updateEvent').and.callThrough();

    eventService.addOrUpdateEvent(mockEvent);
    expect(newEventSpy).toHaveBeenCalled();
    expect(updateEventSpy).not.toHaveBeenCalled();
  });

  it('#addOrUpdateEvent update event', () => {
    const newEventSpy = spyOn(db, 'newEvent').and.callThrough();
    const updateEventSpy = spyOn(db, 'updateEvent').and.callThrough();

    eventService.addOrUpdateEvent({ _id: '5b5e48101c9d443b15217e3e', ...mockEvent });
    expect(newEventSpy).not.toHaveBeenCalled();
    expect(updateEventSpy).toHaveBeenCalled();
  });

  it('#deleteEvent', () => {
    let res: boolean | undefined;
    eventService.deleteEvent(mockEvent).subscribe((v) => (res = v));
    expect(res).toBe(true);
  });
});
