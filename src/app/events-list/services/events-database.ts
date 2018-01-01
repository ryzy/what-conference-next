import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

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
