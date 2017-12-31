import { Injectable } from '@angular/core';

import { conferencesMockData } from '../../../testing/fixtures/events-db';
import { EventsDataSource } from './events-data-source';
import { EventsDatabase } from './events-database';

@Injectable()
export class EventsListService {

  /**
   * Get DataSource collection (compatible with mat-table) with the events to display
   */
  public getEventsDataSource<T>(): EventsDataSource<T> {
    const db = new EventsDatabase<T>(conferencesMockData as any);
    return new EventsDataSource(db);
  }
}