import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FirestoreDbService } from '../../../core/services/firestore-db.service';
import { EventTopic } from '../../../event/model/event-topic';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormComponent implements OnInit, OnDestroy {

  public eventForm!: FormGroup;

  public topics: EventTopic[] = [];

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter();

  public constructor(
    private fdb: FirestoreDbService,
    private cdRef: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    this.eventForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      topicTags: new FormArray([]),
      country: new FormControl(),
      city: new FormControl(),
      address: new FormControl(),
      date: new FormControl(new Date()),
      eventDuration: new FormControl(1),
      workshopDays: new FormControl(0),
      website: new FormControl(),
      twitterHandle: new FormControl(),
      description: new FormControl(),
      price: new FormControl(),
      sizeBand: new FormControl(),
    });
    this.setFormTopicsTagsControl();

    this.eventForm.valueChanges.pipe(
      takeUntil(this.ngOnDestroy$),
      debounceTime(300),
    ).subscribe(v => {
      // console.log('eventForm.valueChanges', v);
    });

    this.fdb.getTopics().pipe(
      takeUntil(this.ngOnDestroy$),
    ).subscribe((topics: EventTopic[]) => {
      this.topics = topics;
      this.setFormTopicsTagsControl();

      this.cdRef.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.emit(true);
  }

  /**
   * Set/Update topics form controls, so it's in sync with current list of topics
   */
  private setFormTopicsTagsControl(): void {
    const topicsTagsControls: FormControl[] = this.topics.map(() => new FormControl(false));
    this.eventForm.setControl('topicTags', new FormArray(topicsTagsControls));
  }
}
