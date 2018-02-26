import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventPageComponent implements OnInit {

  public constructor() {
  }

  public ngOnInit(): void {
  }
}
