import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EventTopic } from '../model/event-topic';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public constructor(private afs: AngularFirestore) {}

  public getTopics(): Observable<EventTopic[]> {
    return this.afs
      .collection<EventTopic>('topics')
      .snapshotChanges()
      .pipe(
        map((actions: DocumentChangeAction<EventTopic>[]) => {
          return actions.map((action: DocumentChangeAction<EventTopic>) => {
            return {
              id: action.payload.doc.id,
              ...action.payload.doc.data(),
            };
          });
        }),
      );
  }
}
