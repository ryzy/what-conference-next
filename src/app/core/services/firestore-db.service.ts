import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { EventTopic } from '../../event/model/event-topic';

@Injectable()
export class FirestoreDbService {
  public constructor(
    private afs: AngularFirestore,
  ) {
  }

  public getTopics(): Observable<EventTopic[]> {
    return this.afs.collection('topics').snapshotChanges().pipe(
      map((actions: DocumentChangeAction[]) => {
        return actions.map((action: DocumentChangeAction) => {
          return {
            id: action.payload.doc.id,
            ...action.payload.doc.data(),
          } as EventTopic;
        });
      }),
    );
  }
}
