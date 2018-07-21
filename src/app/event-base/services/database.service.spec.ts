import { TestBed } from '@angular/core/testing';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-with-database.module';
import { mockNewEventFormData } from '../../../testing/fixtures/event-form';
import { mockTopics } from '../../../testing/fixtures/topics';
import { ConferenceEvent, createEventFromFormValues } from '../model/conference-event';
import { EventTopic } from '../model/event-topic';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let fdbService: DatabaseService;
  let afs: AngularFirestore;
  let mockCollection: AngularFirestoreCollection<EventTopic>;
  let mockDocument: AngularFirestoreDocument<EventTopic>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule.withRealDatabaseService()],
    });

    fdbService = TestBed.get(DatabaseService);

    afs = TestBed.get(AngularFirestore);
    mockCollection = afs.collection('test');
    mockDocument = mockCollection.doc('test-' + afs.createId());
    spyOn(afs, 'collection').and.returnValue(mockCollection);
    spyOn(afs, 'doc').and.returnValue(mockDocument);
  });

  it('#getTopics', (done: Function) => {
    mockTopics.forEach((v) => mockCollection.add(v));
    fdbService.getTopics().subscribe((v) => {
      expect(v).toEqual(jasmine.arrayContaining(mockTopics));
      done();
    });
  });

  it('#getEvent', async (done: Function) => {
    const evData = createEventFromFormValues(mockNewEventFormData);
    const storedDocRef = await mockCollection.add(evData);

    fdbService.getEvent(storedDocRef.id).subscribe((ev: ConferenceEvent) => {
      expect(ev.id).toBeTruthy();
      expect(ev.name).toBe(evData.name);
      expect(ev.topicTags).toEqual(evData.topicTags);
      done();
    });
  });

  it('#getEvent non-existing event', (done: Function) => {
    fdbService.getEvent('some-non-existing-id-adsfq3uh4r').subscribe(undefined, (e: Error) => {
      expect(e.message).toContain(`doesn't exist`);
      done();
    });
  });

  it('#newEvent', (done: Function) => {
    const evData = createEventFromFormValues(mockNewEventFormData);

    fdbService.newEvent(evData).subscribe((ev: ConferenceEvent) => {
      expect(ev.id).toBeTruthy();
      expect(ev.name).toBe(evData.name);
      expect(ev.topicTags).toEqual(evData.topicTags);
      done();
    });
  });
});
