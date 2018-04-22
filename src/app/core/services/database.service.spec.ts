import { TestBed } from '@angular/core/testing';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { AppTestingWithDatabaseModule } from '../../../testing/app-testing-with-database.module';
import { mockTopics } from '../../../testing/fixtures/topics';
import { EventTopic } from '../../event-base/model/event-topic';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let fdbService: DatabaseService;
  let afs: AngularFirestore;
  let mockCollection: AngularFirestoreCollection<EventTopic>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingWithDatabaseModule.withRealDatabaseService()],
      providers: [DatabaseService],
    });

    fdbService = TestBed.get(DatabaseService);

    afs = TestBed.get(AngularFirestore);
    mockCollection = afs.collection('topics');
    spyOn(afs, 'collection').and.returnValue(mockCollection);
  });

  it('#getTopics', (done: Function) => {
    mockCollection.add(mockTopics[0]);
    mockCollection.add(mockTopics[1]);

    fdbService.getTopics().subscribe((v) => {
      expect(v).toEqual(jasmine.arrayContaining(mockTopics));
      done();
    });
  });
});
