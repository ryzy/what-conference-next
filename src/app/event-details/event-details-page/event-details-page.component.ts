import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { ConferenceEvent, ConferenceEventRef } from '../../event-base/model/conference-event';

import { EventService } from '../../event-base/services/event.service';

@Component({
  selector: 'app-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsPageComponent implements OnInit, OnDestroy {
  public ev: ConferenceEventRef | undefined;

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter();

  public constructor(private service: EventService, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.ngOnDestroy$),
        map((params: ParamMap) => params.get('eventId') || 'invalid-event-id'),
        switchMap((eventId: string) => this.service.getEvent(eventId)),
        takeUntil(this.ngOnDestroy$),
      )
      .subscribe((ev) => {
        console.log('EventDetailsPageComponent loaded ev', ev);
        this.ev = ev;
        this.cdRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next(true);
  }
}
