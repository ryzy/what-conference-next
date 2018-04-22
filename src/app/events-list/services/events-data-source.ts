import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';

import { EventsDatabase } from './events-database';

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, Database. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class EventsDataSource<T> extends DataSource<T> {
  constructor(private database: EventsDatabase<T>) {
    super();
  }

  public connect(): Observable<T[]> {
    return this.database.events$;
  }

  public disconnect(): void {}
}
