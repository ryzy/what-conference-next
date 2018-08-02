import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap, takeUntil, take, withLatestFrom, tap, filter } from 'rxjs/operators';
import { mockNewEventFormData } from '../../../testing/fixtures/event-form';
import {
  ConferenceEvent,
  ConferenceEventFormData,
  ConferenceEventRef,
  createEventFromFormData,
  createFormDataFromEvent,
} from '../../event-base/model/conference-event';
import { EventTopic } from '../../event-base/model/event-topic';

import { EventService } from '../../event-base/services/event.service';

const matSnackBarConfig: MatSnackBarConfig = { duration: 50000, verticalPosition: 'bottom' };

@Component({
  selector: 'app-event-page',
  templateUrl: './event-form-page.component.html',
  styleUrls: ['./event-form-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormPageComponent implements OnInit, OnDestroy {
  /**
   * Flag indicating submit is in progress
   */
  public submitting: boolean = false;

  public editingEvent: ConferenceEventRef | undefined;
  public editingEventFormData: ConferenceEventFormData | undefined;

  private topics: EventTopic[] | undefined;

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter();

  public constructor(
    private service: EventService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.service
      .getRouterState()
      .pipe(
        takeUntil(this.ngOnDestroy$),
        filter((state) => state.params && state.params.eventId),
        switchMap((state) => this.service.getEvent(state.params.eventId).pipe(take(1))),
        withLatestFrom(this.service.getTopics()),
      )
      .subscribe(
        ([ev, topics]: [ConferenceEventRef | undefined, EventTopic[]]) => {
          this.editingEvent = ev;
          this.editingEventFormData = ev && createFormDataFromEvent(ev.ref, topics);
          // console.log('EventFormPageComponent#ngOnInit, editing event', ev, this.editingEventFormData);
          this.cdRef.markForCheck();
        },
        (err: Error) => {
          this.snackBar.open('ERROR: could not load event for editing. ' + err.message);
        },
      );

    this.service
      .getTopics()
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((t) => (this.topics = t));
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next(true);
  }

  public onSubmit(formData: ConferenceEventFormData): void {
    this.submitting = true;

    let ev = createEventFromFormData(formData, this.topics);
    // TODO: remove. For now, when empty for got submitted, use mock data instead...
    if (Object.values(formData).filter((v) => !!v).length < 5) {
      ev = createEventFromFormData(mockNewEventFormData, this.topics);
    }

    // Bring existing DB _id, so down the line services know if it's a new or update record
    if (this.editingEvent) {
      ev._id = this.editingEvent.ref._id;
    }

    this.service.addOrUpdateEvent(ev).subscribe({
      next: (res) => this.onEventSaved((res && ev) || undefined),
      error: (err) => this.onEventSaved(undefined, err),
    });
  }

  public onEventSaved(ev?: ConferenceEvent, err?: any): void {
    this.submitting = false;

    if (ev) {
      const msg = `Event *${ev.name}* [${ev.id}] successfully ${this.editingEvent ? 'updated' : 'created'}.`;
      // console.log(msg, ev);
      this.snackBar.open(msg, 'OK', matSnackBarConfig);
      this.router.navigate(['ev', ev.id]);
    } else {
      // console.warn('Event save error', ev, err);
      this.snackBar.open(
        `ERROR while ${this.editingEvent ? 'updating the' : 'creating new'} event. Try again.`,
        undefined,
        matSnackBarConfig,
      );
    }
  }
}
