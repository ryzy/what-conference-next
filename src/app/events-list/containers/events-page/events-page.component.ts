import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { conferencesMockData } from '../../../../testing/fixtures/events-db';
import { ConferenceEvent } from '../../model/conference-event';
import { EventsDataSource } from '../../services/events-data-source';
import { EventsDatabase } from '../../services/events-database';
import { EventsListService } from '../../services/events-list.service';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageComponent implements OnInit {
  public eventsDataSource: EventsDataSource<ConferenceEvent>;

  public constructor(private service: EventsListService) {
  }

  public ngOnInit(): void {
    this.eventsDataSource = this.service.getEventsDataSource();
  }
}
