import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { DatabaseService } from '../../../core/services/database.service';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-form-page.component.html',
  styleUrls: ['./event-form-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormPageComponent implements OnInit {
  public constructor(private fdb: DatabaseService) {}

  public ngOnInit(): void {}
}
