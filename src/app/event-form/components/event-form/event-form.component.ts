import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  EventEmitter,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  Output,
  Input,
  OnChanges,
} from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, startWith, takeUntil, tap, debounceTime } from 'rxjs/operators';

import { builtinSizeBands, EventSizeBand } from '../../../event-base/data/size-bands';
import { ConferenceEventFormData, createEventFromFormData } from '../../../event-base/model/conference-event';
import { Country } from '../../../event-base/model/country';
import { EventTopic } from '../../../event-base/model/event-topic';
import { EventService } from '../../../event-base/services/event.service';
import { findCountries } from '../../../event-base/utils/event-utils';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Flag indicating submit is in progress
   */
  @Input()
  public submitting: boolean = false;

  @Input()
  public editingEventFormData: Partial<ConferenceEventFormData> = {};

  /**
   * Emits on form submit with all form raw data
   */
  @Output()
  public formSubmit: EventEmitter<ConferenceEventFormData> = new EventEmitter();

  /**
   * Emits when user clicks on [delete] btn
   */
  @Output()
  public formDelete: EventEmitter<ConferenceEventFormData> = new EventEmitter();

  /**
   * Emits when user clicks on [cancel] btn
   */
  @Output()
  public formCancel: EventEmitter<Partial<ConferenceEventFormData>> = new EventEmitter();

  public eventForm!: FormGroup;

  public topics: EventTopic[] = [];

  public sizeBands: EventSizeBand[] = builtinSizeBands;

  public countries$!: Observable<Country[]>;

  @ViewChildren(MatInput)
  private formFields!: QueryList<MatInput>;

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter();

  public constructor(private service: EventService, private cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    // Focus on the 1st field. Call it on the next event loop, otherwise it doesn't work sometimes.
    setTimeout(() => this.formFields.first.focus());

    this.eventForm = new FormGroup({
      name: new FormControl('', [Validators.minLength(3), Validators.maxLength(255)]),
      topicTags: new FormArray([], [Validators.required]),
      country: new FormControl(),
      city: new FormControl(),
      address: new FormControl(),
      date: new FormControl(),
      eventDuration: new FormControl(1),
      workshopDays: new FormControl(0),
      website: new FormControl(),
      twitterHandle: new FormControl(),
      description: new FormControl(),
      price: new FormControl(),
      sizeBand: new FormControl(),
    });
    this.handleTopicsTags();
    this.handleCountryAndCity();

    /**
    combineLatest(this.eventForm.valueChanges, this.eventForm.statusChanges)
      .pipe(debounceTime(1000))
      .subscribe(([formValues, formStatus]: [any, 'VALID' | 'INVALID']) => {
        console.log(
          '[EVENT FORM] ConferenceEvent#fromFormValues',
          formStatus,
          createEventFromFormData(formValues, this.topics),
        );
      }); /**/
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.editingEventFormData && this.eventForm) {
      this.eventForm.patchValue(changes.editingEventFormData.currentValue);
    }
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.emit(true);
  }

  public onSubmit(): void {
    this.formSubmit.next(this.eventForm.getRawValue() as ConferenceEventFormData);
  }
  public onCancel(): void {
    this.formCancel.next(this.eventForm.getRawValue());
  }
  public onDelete(): void {
    this.formDelete.next(this.eventForm.getRawValue());
  }

  public displayCountryFn(country?: Country): string | undefined {
    return country && country.name;
  }

  /**
   * Set/Update topics form controls, so it's in sync with current list of topics
   */
  private handleTopicsTags(): void {
    this.service
      .getTopics()
      .pipe(
        takeUntil(this.ngOnDestroy$),
        filter((topics) => !!topics.length),
      )
      .subscribe((topics: EventTopic[]) => {
        this.topics = topics;

        // Update form controls, one checkbox for each topic tag:
        const topicsTagsControls: FormControl[] = topics.map(() => new FormControl(false));
        this.eventForm.setControl('topicTags', new FormArray(topicsTagsControls, [Validators.required]));

        this.cdRef.markForCheck();
      });
  }

  private handleCountryAndCity(): void {
    // Countries: filter the values
    const countryField: FormControl = this.eventForm.get('country') as FormControl;
    this.countries$ = countryField.valueChanges.pipe(
      takeUntil(this.ngOnDestroy$),
      startWith(''),
      filter<string>((q: string | Country) => typeof q === 'string'),
      map(findCountries),
    );

    // Nice to have: on change, set the city value to selected Country.capital
    countryField.valueChanges
      .pipe(
        takeUntil(this.ngOnDestroy$),
        filter<Country>((c: string | Country) => 'object' === typeof c && 'isoCode' in c),
      )
      .subscribe((c: Country) => {
        this.eventForm.patchValue({ city: c.capital });
      });
  }
}
