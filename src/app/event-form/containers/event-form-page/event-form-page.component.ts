import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { FirestoreDbService } from '../../../core/services/firestore-db.service';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-form-page.component.html',
  styleUrls: ['./event-form-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormPageComponent implements OnInit {
  public constructor(private fdb: FirestoreDbService) {}

  public ngOnInit(): void {}
}
