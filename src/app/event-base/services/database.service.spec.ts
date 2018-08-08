import { HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RemoteInsertOneResult, RemoteUpdateResult } from 'mongodb-stitch-browser-sdk';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-auth-db.module';
import { mockEvent, mockEvents } from '../../../testing/fixtures/events';
import { mockTags } from '../../../testing/fixtures/event-tags';
import { MockStitchService } from '../../../testing/mock-stitch.service';
import { StitchService } from '../../core/stitch/stitch.service';
import { ConferenceEventRef } from '../model/conference-event';
import { EventTag } from '../model/event-tag';
import { uuid } from '../../core/core-utils';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let db: DatabaseService;
  let stitch: MockStitchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule.withRealDatabaseService()],
    });

    httpMock = TestBed.get(HttpTestingController);
    db = TestBed.get(DatabaseService);
    stitch = TestBed.get(StitchService);
  });

  afterEach(() => {
    // console.log('httpMock after', httpMock);
    httpMock.verify();
  });

  it(
    '#getEventTags',
    fakeAsync(() => {
      stitch.mockLogin();

      let res: EventTag[] | undefined;
      db.getEventTags().subscribe((v) => (res = v));

      stitch.mockCollectionFindResponse(mockTags);

      expect(res.length).toEqual(mockTags.length);
      expect(res[0].id).toEqual(mockTags[0].id);
    }),
  );

  it(
    '#getEvent',
    fakeAsync(() => {
      stitch.mockLogin();

      let ev: ConferenceEventRef | undefined;
      db.getEvent(uuid()).subscribe((v) => (ev = v));

      stitch.mockCollectionFindResponse(mockEvents.slice(0, 1));

      expect(ev instanceof ConferenceEventRef).toBe(true);
      expect(ev.ref.name).toBe(mockEvents[0].name);
      expect(ev.ref.tags).toEqual(mockEvents[0].tags);
    }),
  );

  it(
    '#getEvent should emit error for non-existing event',
    fakeAsync(() => {
      stitch.mockLogin();

      let ev: ConferenceEventRef | undefined;
      let err: any;
      db.getEvent(uuid()).subscribe((v) => (ev = v), (e) => (err = e));

      stitch.mockCollectionFindResponse([]);

      expect(ev).toBeFalsy();
      expect(err).toBeTruthy();
      expect(err && (err as Error).message).toContain('not found');
    }),
  );

  it(
    '#getEvents',
    fakeAsync(() => {
      stitch.mockLogin();

      let ev: ConferenceEventRef[] | undefined;
      db.getEvents().subscribe((v) => (ev = v));

      stitch.mockCollectionFindResponse(mockEvents);

      expect(ev).toBeTruthy();
      expect(ev.length).toBe(mockEvents.length);
    }),
  );

  it(
    '#newEvent',
    fakeAsync(() => {
      stitch.mockLogin();

      let res: RemoteInsertOneResult | undefined;
      db.newEvent(mockEvent).subscribe((v) => (res = v));

      stitch.mockInsertOneResponse(); // insert the event into db

      expect(res.insertedId).toBeTruthy();
    }),
  );

  it(
    '#updateEvent',
    fakeAsync(() => {
      stitch.mockLogin();

      let res: RemoteUpdateResult | undefined;
      db.updateEvent(mockEvent).subscribe((v) => (res = v));

      stitch.mockUpdateResponse();

      expect(res.matchedCount).toEqual(1);
    }),
  );

  it(
    '#deleteEvent',
    fakeAsync(() => {
      stitch.mockLogin();

      let res: boolean | undefined;
      db.deleteEvent(mockEvent).subscribe((v) => (res = v));
      stitch.mockDeleteResponse();
      expect(res).toBe(true);

      db.deleteEvent(mockEvent).subscribe((v) => (res = v));
      stitch.mockDeleteResponse({ deletedCount: 0 });
      expect(res).toBe(false);
    }),
  );
});
