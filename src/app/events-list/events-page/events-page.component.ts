import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { EventService } from '../../event-base/services/event.service';
import { EventsDataSource } from '../../event-base/services/events-data-source';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageComponent implements OnInit {
  public eventsDataSource: EventsDataSource;

  public constructor(private service: EventService) {
    this.eventsDataSource = this.service.getEventsDS();
  }

  public ngOnInit(): void {}
}
