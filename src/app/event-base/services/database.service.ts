import { Injectable } from '@angular/core';
import { Observable, from, defer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RemoteInsertOneResult, RemoteUpdateResult } from 'mongodb-stitch-browser-sdk';

import { StitchService } from '../../core/stitch/stitch.service';
import { ConferenceEvent, ConferenceEventRef } from '../model/conference-event';
import { EventTopic } from '../model/event-topic';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  protected topicsCache: EventTopic[] = [];

  public constructor(private stitch: StitchService) {}

  public getTopics(): Observable<EventTopic[]> {
    // console.log('DatabaseService#getTopics');
    return defer(() =>
      from(
        this.stitch.db
          .collection<EventTopic>('topics')
          .find()
          .asArray(),
      ),
    ).pipe(
      // tap((v) => console.log('stitch.db.collection(topics)', v)),
      tap((v) => (this.topicsCache = v)),
    );
  }

  public getEvent(eventId: string): Observable<ConferenceEventRef | undefined> {
    // console.log('DatabaseService#getEvent loading...', eventId);
    return defer(() =>
      from(
        this.stitch.db
          .collection<ConferenceEvent>('events')
          .find({ id: eventId })
          .first(),
      ),
    ).pipe(
      map((ev?: ConferenceEvent) => ev && this.eventToEventRef(ev)),
      // tap((ev: ConferenceEventRef) => console.log('DatabaseService#getEvent loaded', ev)),
    );
  }

  public getEvents(): Observable<ConferenceEventRef[]> {
    // console.log('DatabaseService#getEvents');
    return defer(() =>
      from(
        this.stitch.db
          .collection<ConferenceEvent>('events')
          .find({})
          .asArray(),
      ),
    ).pipe(
      map((res: ConferenceEvent[]) => res.map(this.eventToEventRef.bind(this))),
      // tap((res: ConferenceEventRef[]) => console.log('DatabaseService#getEvents loaded', res)),
    );
  }

  public newEvent(ev: ConferenceEvent): Observable<RemoteInsertOneResult> {
    // console.log('DatabaseService#newEvent', ev);
    // Note: Stitch mutates the obj passed to insertOne() by adding there _id prop
    // Just in case make a shallow clone, since we prefer to stick to immutability.
    ev = { ...ev };
    return defer(() => from(this.stitch.db.collection<ConferenceEvent>('events').insertOne(ev)));
  }

  public updateEvent(ev: ConferenceEvent): Observable<RemoteUpdateResult> {
    // console.log('DatabaseService#updateEvent', ev);
    return defer(() => from(this.stitch.db.collection('events').updateOne({ _id: ev._id }, ev)));
  }

  public deleteEvent(ev: ConferenceEvent): Observable<boolean> {
    return defer(() => from(this.stitch.db.collection('events').deleteOne({ _id: ev._id }))).pipe(
      map((v) => !!v.deletedCount),
    );
  }

  /**
   * Map ConferenceEvent to ConferenceEventRef
   */
  private eventToEventRef(ev: ConferenceEvent): ConferenceEventRef {
    return new ConferenceEventRef(ev.id, ev, { topics: this.topicsCache });
  }
}
