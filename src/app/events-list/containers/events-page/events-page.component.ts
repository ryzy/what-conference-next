import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { ConferenceEvent } from '../../../event-base/model/conference-event';
import { EventsDataSource } from '../../services/events-data-source';
import { EventsListService } from '../../services/events-list.service';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageComponent implements OnInit {
  public eventsDataSource!: EventsDataSource<ConferenceEvent>;

  public constructor(private service: EventsListService) {
  }

  public ngOnInit(): void {
    this.eventsDataSource = this.service.getEventsDataSource();
  }
}
