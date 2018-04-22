import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DatabaseService } from '../app/core/services/database.service';
import { EventTopic } from '../app/event-base/model/event-topic';
import { mockTopics } from './fixtures/topics';

@Injectable()
export class MockDatabaseService extends DatabaseService {
  public getTopics(): Observable<EventTopic[]> {
    return of(mockTopics);
  }
}
