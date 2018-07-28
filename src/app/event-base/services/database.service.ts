import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, Action, DocumentSnapshot } from 'angularfire2/firestore';
import { deburr, kebabCase } from 'lodash-es';
import { Observable, from, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { ConferenceEvent, ConferenceEventRef } from '../model/conference-event';
import { EventTopic } from '../model/event-topic';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  protected topicsCache: EventTopic[] = [];

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
        tap(v => this.topicsCache = v),
      );
  }

  public getEvents(): Observable<ConferenceEventRef[]> {
    return this.afs
      .collection<ConferenceEvent>('events')
      .snapshotChanges()
      .pipe(
        map((actions: DocumentChangeAction<ConferenceEvent>[]) => {
          return actions.map((action: DocumentChangeAction<ConferenceEvent>) => {
            return new ConferenceEventRef(action.payload.doc.id, action.payload.doc.data(), { topics: this.topicsCache });
          });
        }),
      );
  }

  public getEvent(eventId: string): Observable<ConferenceEventRef> {
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
        map((action: Action<DocumentSnapshot<any>>) => {
          return new ConferenceEventRef(action.payload.id, action.payload.data(), { topics: this.topicsCache });
        }),
        tap((ev: ConferenceEvent) => console.log('DatabaseService#getEvent loaded', ev)),
      );
  }

  public newEvent(ev: ConferenceEvent): Observable<ConferenceEventRef> {
    const id = kebabCase(deburr(ev.name)) + '-' + this.afs.createId().substr(0, 8);

    console.log('DatabaseService#newEvent() ready to store', { id, ev });
    return from(
      this.afs
        .collection('events')
        .doc(id)
        .set(ev),
    ).pipe(switchMap(() => this.getEvent(id)));
  }
}
