import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, Action, DocumentSnapshot } from 'angularfire2/firestore';
import { deburr, kebabCase } from 'lodash-es';
import { Observable, from, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { ConferenceEvent } from '../model/conference-event';
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

  public getEvent(eventId: string): Observable<ConferenceEvent> {
    console.log('DatabaseService#getEvent loading...', eventId);
    return this.afs
      .collection('events')
      .doc(eventId)
      .snapshotChanges()
      .pipe(
        tap((action: Action<DocumentSnapshot<any>>) => {
          if (!action.payload.exists) {
            throw new Error(`Event *${eventId}* doesn't exist.`);
          }
        }),
        map(
          (action: Action<DocumentSnapshot<any>>) =>
            <ConferenceEvent>{
              id: action.payload.id,
              ...action.payload.data(),
            },
        ),
        tap((ev: ConferenceEvent) => console.log('DatabaseService#getEvent loaded', ev)),
      );
  }

  public newEvent(ev: ConferenceEvent): Observable<ConferenceEvent> {
    const evToStore: ConferenceEvent = Object.assign({}, ev);

    // to avoid any confusion, don't store ID property explicitly
    // ID should be always from metadata instead.
    delete evToStore.id;

    const id = ev.id || kebabCase(deburr(ev.name)) + '-' + this.afs.createId().substr(0, 8);

    console.log('DatabaseService#newEvent() ready to store', { evToStore, id, sourceEv: ev });
    return from(
      this.afs
        .collection('events')
        .doc(id)
        .set(evToStore),
    ).pipe(switchMap(() => this.getEvent(id)));
  }
}
