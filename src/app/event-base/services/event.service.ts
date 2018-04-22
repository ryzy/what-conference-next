import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { FirestoreDbService } from '../../core/services/firestore-db.service';
import { EventsRootState } from '../store/index';

@Injectable()
export class EventService {
  public constructor(private store: Store<EventsRootState>, private fdb: FirestoreDbService) {}
}
