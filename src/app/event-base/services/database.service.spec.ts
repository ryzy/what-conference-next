import { TestBed } from '@angular/core/testing';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-with-database.module';
import { mockTopics } from '../../../testing/fixtures/topics';
import { EventTopic } from '../model/event-topic';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let fdbService: DatabaseService;
  let afs: AngularFirestore;
  let mockCollection: AngularFirestoreCollection<EventTopic>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule.withRealDatabaseService()],
    });

    fdbService = TestBed.get(DatabaseService);

    afs = TestBed.get(AngularFirestore);
    mockCollection = afs.collection('topics');
    spyOn(afs, 'collection').and.returnValue(mockCollection);
  });

  it('#getTopics', (done: Function) => {
    mockTopics.forEach((v) => mockCollection.add(v));
    fdbService.getTopics().subscribe((v) => {
      expect(v).toEqual(jasmine.arrayContaining(mockTopics));
      done();
    });
  });
});
