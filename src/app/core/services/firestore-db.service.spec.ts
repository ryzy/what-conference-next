import { TestBed } from '@angular/core/testing';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { AppTestingWithFirestoreModule } from '../../../testing/app-testing-with-firestore.module';
import { mockTopics } from '../../../testing/fixtures/topics';
import { EventTopic } from '../../event-base/model/event-topic';
import { FirestoreDbService } from './firestore-db.service';

describe('FirestoreDbService', () => {
  let fdbService: FirestoreDbService;
  let afs: AngularFirestore;
  let mockCollection: AngularFirestoreCollection<EventTopic>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingWithFirestoreModule],
      providers: [FirestoreDbService],
    });

    fdbService = TestBed.get(FirestoreDbService);

    afs = TestBed.get(AngularFirestore);
    mockCollection = afs.collection('topics');
    spyOn(afs, 'collection').and.returnValue(mockCollection);
  });

  afterEach(async (done: Function) => {
    await afs.app.delete();
    done();
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
