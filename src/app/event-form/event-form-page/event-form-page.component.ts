import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { map, switchMap, takeUntil, take, withLatestFrom, tap, filter } from 'rxjs/operators';

import {
  ConferenceEvent,
  ConferenceEventFormData,
  ConferenceEventRef,
  createEventFromFormData,
  createFormDataFromEvent,
} from '../../event-base/model/conference-event';
import { EventTopic } from '../../event-base/model/event-topic';
import { EventService } from '../../event-base/services/event.service';
import { ConfirmationComponent } from '../../shared/components/confirmation/confirmation.component';
import { mockNewEventFormData } from '../../../testing/fixtures/event-form';

/**
 * Default options for SnackBar
 */
const matSnackBarConfig: MatSnackBarConfig = { duration: 5000, verticalPosition: 'bottom' };
/**
 * Default options for confirmation Dialog modal
 */
const matDialogConfig: MatDialogConfig = {};

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

  /**
   * Event which is being edited (if any)
   */
  public editingEvent: ConferenceEventRef | undefined;
  /**
   * Flat set to true when eventId present in the route params and event is being fetched
   */
  public editingEventLoading: boolean = false;
  /**
   * Loaded event to edit, converted to form data
   */
  public editingEventFormData: ConferenceEventFormData | undefined;

  /**
   * Topics dictionary, fetched from the store
   */
  private topics: EventTopic[] | undefined;

  /**
   * Dialog ref, if opened before
   */
  private dialogRef: MatDialogRef<ConfirmationComponent> | undefined;

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter();

  public constructor(
    private service: EventService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.service
      .getRouterState()
      .pipe(
        takeUntil(this.ngOnDestroy$),
        filter((state) => state.params && state.params.eventId),
        tap((v) => (this.editingEventLoading = !!v)),
        switchMap((state) => this.service.getEvent(state.params.eventId).pipe(take(1))),
        withLatestFrom(this.service.getTopics()),
      )
      .subscribe(
        ([ev, topics]: [ConferenceEventRef | undefined, EventTopic[]]) => {
          this.editingEvent = ev;
          this.editingEventLoading = false;
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

    // If there's some remaining dialog open, close it...
    if (this.dialogRef) {
      this.dialogRef.close();
    }
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

  public onDelete(): void {
    // at this stage we're sure we have editingEvent (since we're deleting it...)
    const ev = (this.editingEvent as ConferenceEventRef).ref;

    const data = `You're going to delete event <b>${ev.name}</b>.`;

    this.dialogRef = this.dialog.open(ConfirmationComponent, { ...matDialogConfig, data });
    this.dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.service.deleteEvent(ev).subscribe(() => {
            this.snackBar.open(`Event *${ev.name}* successfully deleted`, 'OK', matSnackBarConfig);
            this.navigateToEvent();
          });
        }
      });
  }

  public onCancel(): void {
    this.navigateToEvent(this.editingEvent && this.editingEvent.id);
  }

  public onEventSaved(ev?: ConferenceEvent, err?: any): void {
    this.submitting = false;

    if (ev) {
      const msg = `Event *${ev.name}* [${ev.id}] successfully ${this.editingEvent ? 'updated' : 'created'}.`;
      this.snackBar.open(msg, 'OK', matSnackBarConfig);
      this.navigateToEvent(ev.id);
    } else {
      // console.warn('Event save error', ev, err);
      this.snackBar.open(
        `ERROR while ${this.editingEvent ? 'updating the' : 'creating new'} event. Try again.`,
        undefined,
        matSnackBarConfig,
      );
    }
  }

  protected navigateToEvent(eventId?: string): void {
    this.router.navigate(eventId ? ['/', 'ev', eventId] : ['/']);
  }
}
