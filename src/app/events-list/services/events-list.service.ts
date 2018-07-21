import { Injectable } from '@angular/core';

import { mockEvents } from '../../../testing/fixtures/events-db';
import { EventsDataSource } from './events-data-source';
import { EventsDatabase } from './events-database';

@Injectable({
  providedIn: 'root',
})
export class EventsListService {
  /**
   * Get DataSource collection (compatible with mat-table) with the events to display
   */
  public getEventsDataSource<T>(): EventsDataSource<T> {
    const db = new EventsDatabase<T>(mockEvents as any);
    return new EventsDataSource(db);
  }
}
