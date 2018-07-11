import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  EventEmitter,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, startWith, takeUntil, tap, take } from 'rxjs/operators';

import { DatabaseService } from '../../../core/services/database.service';
import { countriesData } from '../../../event-base/data/countries';
import { builtinSizeBands, EventSizeBand } from '../../../event-base/data/size-bands';
import { Country } from '../../../event-base/model/country';
import { EventTopic } from '../../../event-base/model/event-topic';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormComponent implements OnInit, OnDestroy {
  public eventForm!: FormGroup;

  public topics: EventTopic[] = [];

  public sizeBands: EventSizeBand[] = builtinSizeBands;

  public countries$!: Observable<Country[]>;

  /**
   * Flag indicating that the entire form is valid or not
   */
  public isFormValid: boolean = false;

  @ViewChildren(MatInput) private formFields!: QueryList<MatInput>;

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter();

  public constructor(private fdb: DatabaseService, private cdRef: ChangeDetectorRef) {}

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
    this.setFormTopicsTags();

    // Countries: filter the values
    const countryField: FormControl = this.eventForm.get('country') as FormControl;
    this.countries$ = countryField.valueChanges.pipe(
      takeUntil(this.ngOnDestroy$),
      startWith(''),
      filter<string>((q: string | Country) => typeof q === 'string'),
      map((q) => q.trim().toLowerCase()),
      map(
        (q: string): Country[] => {
          return countriesData.filter((country) => {
            return country.name.toLowerCase().includes(q) || country.isoCode.toLowerCase().includes(q);
          });
        },
      ),
    );
    // Countries: on change, set the city value to selected Country.capital
    countryField.valueChanges
      .pipe(
        takeUntil(this.ngOnDestroy$),
        filter<Country>((c: string | Country) => typeof c === 'object' && 'isoCode' in c),
      )
      .subscribe((c) => {
        this.eventForm.patchValue({ city: c.capital });
      });

    this.eventForm.valueChanges
      .pipe(
        takeUntil(this.ngOnDestroy$),
        debounceTime(300),
      )
      .subscribe((v) => {
        console.log('[EVENT FORM] values', v);
      });
    this.eventForm.statusChanges.pipe(takeUntil(this.ngOnDestroy$)).subscribe((v) => {
      console.log('[EVENT FORM] status', v);
      this.isFormValid = v === 'VALID';
    });
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.emit(true);
  }

  public displayCountryFn(country?: Country): string | undefined {
    return country && country.name;
  }

  /**
   * Set/Update topics form controls, so it's in sync with current list of topics
   */
  private setFormTopicsTags(): void {
    this.fdb
      .getTopics()
      .pipe(take(1))
      .subscribe((topics: EventTopic[]) => {
        this.topics = topics;

        // Update form controls, one checkbox for each topic tag:
        const topicsTagsControls: FormControl[] = topics.map(() => new FormControl(false));
        this.eventForm.setControl('topicTags', new FormArray(topicsTagsControls, [Validators.required]));

        this.cdRef.markForCheck();
      });
  }
}
