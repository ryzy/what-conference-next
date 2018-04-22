import { Observable, of } from 'rxjs';

/**
 * Events DB
 *
 * TODO: source the data from real database
 */
export class EventsDatabase<T> {
  public events$: Observable<T[]>;

  constructor(eventsData: T[]) {
    this.events$ = of(eventsData);
  }
}
