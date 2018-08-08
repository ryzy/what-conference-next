import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ConferenceEventRef } from '../../event-base/model/conference-event';

import { EventService } from '../../event-base/services/event.service';

@Component({
  selector: 'app-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsPageComponent implements OnInit, OnDestroy {
  public ev: ConferenceEventRef | undefined;
  public notFound: boolean = false;
  public loading: boolean = true;

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter();

  public constructor(private service: EventService, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.ngOnDestroy$),
        map((params: ParamMap) => params.get('eventId') || 'url-missing-event-id'),
        tap((v) => (this.loading = !!v)),
        switchMap((eventId: string) => this.service.getEvent(eventId)),
        takeUntil(this.ngOnDestroy$),
      )
      .subscribe(
        (ev: ConferenceEventRef) => {
          // console.log('EventDetailsPageComponent loaded ev', ev);
          this.loading = false;
          this.ev = ev;
          this.cdRef.markForCheck();
        },
        (err) => {
          // console.warn('EventDetailsPageComponent error while loading ev', err);
          this.loading = false;
          this.notFound = true;
          this.cdRef.markForCheck();
        },
      );
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next(true);
  }
}
