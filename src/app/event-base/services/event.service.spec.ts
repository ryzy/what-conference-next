import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { mockEvent } from '../../../testing/fixtures/events';
import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-auth-db.module';
import { mockTags } from '../../../testing/fixtures/event-tags';
import { mockUser } from '../../../testing/fixtures/user';
import { MockDatabaseService } from '../../../testing/mock-database.service';
import { AuthService } from '../../core/services/auth.service';
import { AppRootState } from '../../core/store/index';
import { EventBaseModule } from '../event-base.module';
import { ConferenceEvent, ConferenceEventRef } from '../model/conference-event';
import { EventTag } from '../model/event-tag';
import { DatabaseService } from './database.service';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let eventService: EventsService;
  let authService: AuthService;
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

    eventService = TestBed.get(EventsService);
    authService = TestBed.get(AuthService);
    db = TestBed.get(DatabaseService);
    store = TestBed.get(Store);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('#getEventTags', () => {
    let tags: EventTag[] | undefined;
    eventService.getEventTags().subscribe((v) => (tags = v));

    // We have full EventBaseModule and its effects, it tries to load the tags on the start
    // Since we work with mocked DatabaseService (from AppTestingAuthAndDbModule), we expect
    // tags already loaded...
    expect(tags).toEqual(mockTags);
    expect(tags[0].id).toEqual(mockTags[0].id);
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

  it('#appendEventOriginData should add origin data only if not set', () => {
    spyOn(authService, 'getUserSnapshot').and.returnValue(mockUser);

    let ev: ConferenceEvent | undefined;

    // emulate new/fresh/uninitialised event
    ev = eventService.appendEventOriginData({} as ConferenceEvent);
    expect(ev.origin.authorId).toBe(mockUser.id);

    // emulate event with already set origin
    // origin info should NOT be touched (otherwise we loose the info about the original author/date)
    ev = eventService.appendEventOriginData(mockEvent);
    expect(ev.origin.authorId).toBe(mockEvent.origin.authorId);
  });

  it('#appendEventOriginData should work w/o user logged in', () => {
    let ev: ConferenceEvent | undefined;

    // emulate new/fresh/uninitialised event
    ev = eventService.appendEventOriginData({} as ConferenceEvent);
    expect(ev.origin.authorId).toBe(undefined);

    // emulate event with already set origin
    // expect original values, current user is not available in AuthService, so it shouldn't be touched
    ev = eventService.appendEventOriginData({ ...mockEvent, origin: { ...mockEvent.origin, authorId: '' } });
    expect(ev.origin.authorId).toBe('');
  });
});
