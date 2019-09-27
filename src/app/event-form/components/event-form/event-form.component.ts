import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  EventEmitter,
  ViewChildren,
  QueryList,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, startWith, takeUntil, tap } from 'rxjs/operators';

import { builtinSizeBands, EventSizeBand } from '../../../event-base/data/size-bands';
import { ConferenceEventFormData } from '../../../event-base/model/conference-event';
import { Country } from '../../../core/model/country';
import { EventTag } from '../../../event-base/model/event-tag';
import { EventsService } from '../../../event-base/services/events.service';
import { createEventFromFormData } from '../../../event-base/model/conference-event';
import { findCountries, compareWithFn } from '../../../event-base/utils/event-utils';

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

  public tags!: EventTag[];

  public sizeBands: EventSizeBand[] = builtinSizeBands;
  public compareWithFn: Function = compareWithFn;

  public countries$!: Observable<Country[]>;

  @ViewChildren(MatInput)
  private formFields!: QueryList<MatInput>;

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter();

  public constructor(private service: EventsService) {}

  public ngOnInit(): void {
    this.tags = this.service.getEventTagsSnapshot();

    // Focus on the 1st field. Call it on the next event loop, otherwise it doesn't work sometimes.
    setTimeout(() => this.formFields.first.focus());

    this.eventForm = new FormGroup({
      name: new FormControl('', [Validators.minLength(3), Validators.maxLength(255)]),
      tags: new FormControl([], [Validators.minLength(1)]),
      date: new FormControl(),
      eventDuration: new FormControl(),
      workshops: new FormControl(false),
      freeWorkshops: new FormControl(false),
      country: new FormControl(),
      city: new FormControl(),
      address: new FormControl(),
      website: new FormControl(),
      description: new FormControl(),
      twitterHandle: new FormControl(),
      hashTags: new FormControl(),
      price: new FormControl(),
      sizeBand: new FormControl(),
    });
    this.handleCountryAndCity();

    /**
    combineLatest(this.eventForm.valueChanges, this.eventForm.statusChanges).subscribe(
      ([formValues, formStatus]: [any, 'VALID' | 'INVALID']) => {
        console.log(
          '[EVENT FORM] ConferenceEvent#fromFormValues',
          formValues,
          createEventFromFormData(formValues, { tags: this.tags }),
        );
      },
    ); /**/
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.editingEventFormData && this.eventForm) {
      // console.log('EventFormComponent#ngOnChanges', changes.editingEventFormData.currentValue);
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
