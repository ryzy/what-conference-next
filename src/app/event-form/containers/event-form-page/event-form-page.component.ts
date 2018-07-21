import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { mockNewEventFormData } from '../../../../testing/fixtures/event-form';
import {
  ConferenceEvent,
  ConferenceEventFormData,
  createEventFromFormValues,
} from '../../../event-base/model/conference-event';
import { EventTopic } from '../../../event-base/model/event-topic';

import { EventService } from '../../../event-base/services/event.service';

const matSnackBarConfig: MatSnackBarConfig = { duration: 50000, verticalPosition: 'bottom' };

@Component({
  selector: 'app-event-page',
  templateUrl: './event-form-page.component.html',
  styleUrls: ['./event-form-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormPageComponent implements OnInit, OnDestroy {
  private topics: EventTopic[] | undefined;

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter();

  public constructor(private service: EventService, private router: Router, private snackBar: MatSnackBar) {}

  public ngOnInit(): void {
    this.service
      .getTopics()
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((t) => (this.topics = t));
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next(true);
  }

  public onSubmit(formData: ConferenceEventFormData): void {
    let ev = createEventFromFormValues(formData, this.topics);

    // TODO: remove. For now, when empty for got submitted, use mock data instead...
    if (Object.values(formData).filter((v) => !!v).length < 5) {
      ev = createEventFromFormValues(mockNewEventFormData, this.topics);
    }

    this.service
      .newEvent(ev)
      .subscribe((savedEvent) => this.onEventSaved(savedEvent), (err) => this.onEventSaved(undefined, err));
  }

  public onEventSaved(ev?: ConferenceEvent, err?: any): void {
    if (err) {
      console.warn('Event save error', ev, err);
      this.snackBar.open(`ERROR while saving new event. Try again.`, undefined, matSnackBarConfig);
    } else if (ev) {
      console.log('Event saved', ev, err);
      this.snackBar.open(`New event *${ev.name}* [${ev.id}] successfully saved.`, 'OK', matSnackBarConfig);

      this.router.navigate(['ev', ev.id]);
    }
  }
}
