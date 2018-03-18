import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { FirestoreDbService } from '../app/core/services/firestore-db.service';
import { EventTopic } from '../app/event/model/event-topic';
import { mockTopics } from './fixtures/topics';

@Injectable()
export class FirestoreDbTestingService extends FirestoreDbService {

  public getTopics(): Observable<EventTopic[]> {
    return of(mockTopics);
  }

}
