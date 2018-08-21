import { Injectable } from '@angular/core';
import { Observable, from, defer, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { RemoteInsertOneResult, RemoteUpdateResult } from 'mongodb-stitch-browser-sdk';

import { StitchService } from '../../core/stitch/stitch.service';
import { ConferenceEvent, ConferenceEventRef, EventStatus } from '../model/conference-event';
import { EventTag } from '../model/event-tag';

export const DEFAULT_LIST_SIZE_LIMIT = 10;

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  protected tagsCache: EventTag[] = [];

  public constructor(private stitch: StitchService) {}

  public getEventTags(): Observable<EventTag[]> {
    // console.log('DatabaseService#getEventTags');
    return defer(() =>
      from(
        this.stitch.db
          .collection<EventTag>('tags')
          .find()
          .asArray(),
      ),
    ).pipe(tap((v) => (this.tagsCache = v)));
  }

  /**
   * Load event. Emits error when event not found.
   */
  public getEvent(eventId: string): Observable<ConferenceEventRef> {
    // console.log('DatabaseService#getEvent loading...', eventId);
    return defer(() =>
      from(
        this.stitch.db
          .collection<ConferenceEvent>('events')
          .find({ id: eventId })
          .first(), // expect one event
      ),
    ).pipe(
      switchMap((ev?: ConferenceEvent) => {
        if (ev) {
          return of(this.eventToEventRef(ev));
        }
        return throwError(new Error(`Event with ID '${eventId}' not found.`));
      }),
    );
  }

  /**
   * Fetch events from db, with provided queries
   */
  public getEvents(
    query: object = {},
    sort: { [k in keyof ConferenceEvent]?: number } = { date: 1 },
  ): Observable<ConferenceEventRef[]> {
    // console.log('DatabaseService#getEvents', { query, sort });
    return defer(() =>
      from(
        this.stitch.db
          .collection<ConferenceEvent>('events')
          .aggregate([
            {
              $match: query,
            },
            {
              $sort: sort,
            },
            // { $limit: 2 },
            // { $skip: 1 },
          ])
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
    return new ConferenceEventRef(ev, { tags: this.tagsCache });
  }
}
