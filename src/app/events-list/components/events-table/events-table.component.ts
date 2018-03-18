import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ConferenceEvent } from '../../../event/model/conference-event';
import { EventsDataSource } from '../../services/events-data-source';

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsTableComponent implements OnInit {
  /**
   * Data source for mat-table
   */
  @Input() public dataSource!: EventsDataSource<ConferenceEvent>;

  /**
   * Columns to display in the table
   */
  public displayColumns: string[] = ['name', 'date', 'price', 'focus', 'actions'];

  public ngOnInit(): void {
    // this.dataSource.connect().subscribe(events => console.log('[EventsTableComponent] events', events));
  }
}
