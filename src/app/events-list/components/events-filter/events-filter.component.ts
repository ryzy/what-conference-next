import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  EventEmitter,
  ChangeDetectorRef,
  Input,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { Country } from '../../../core/model/country';
import { Entity } from '../../../core/model/entity';
import { EventTag } from '../../../event-base/model/event-tag';
import { EventsFilters } from '../../../event-base/model/events-filters';
import { findCountries, getRegionList } from '../../../event-base/utils/event-utils';

@Component({
  selector: 'app-events-filter',
  templateUrl: './events-filter.component.html',
  styleUrls: ['./events-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsFilterComponent implements OnInit, OnDestroy {
  /**
   * Set current filters (as they arrive from router)
   * If form is already available, patch the value there.
   */
  @Input()
  public set filters(filters: EventsFilters) {
    this._filters = filters;
    if (this.form) {
      this.form.patchValue(filters, { onlySelf: true, emitEvent: false });
      this.cdRef.markForCheck();
    }
  }

  /**
   * List of all available tags in Store
   */
  @Input()
  public tagsList: EventTag[] = [];

  /**
   * Emits clean list of selected tags (e.g. w/o parents, if child tags are present)
   */
  @Output()
  public filtersChanged: EventEmitter<EventsFilters> = new EventEmitter<EventsFilters>();

  public form!: FormGroup;
  public countriesList: Country[] = findCountries();
  public regionsList: Entity[] = getRegionList();

  /**
   * List of current filters. Set from @Input() to set the initial values of the form.
   */
  private _filters: EventsFilters = {};

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.form = new FormGroup({
      where: new FormControl(this._filters.where),
      workshops: new FormControl(this._filters.workshops),
      freeWorkshops: new FormControl(this._filters.freeWorkshops),
      tags: new FormControl(this._filters.tags),
    });

    this.form.statusChanges.pipe(takeUntil(this.ngOnDestroy$)).subscribe((status) => {
      // console.log('EventsFilterComponent', this.form.getRawValue());
      this.filtersChanged.emit(this.form.getRawValue() as EventsFilters);
    });
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next(true);
  }
}
