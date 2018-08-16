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
import { EventsFilters } from '../../../event-base/model/events-filters';
import { findCountries, getRegionList } from '../../../event-base/utils/event-utils';

@Component({
  selector: 'app-events-filter',
  templateUrl: './events-filter.component.html',
  styleUrls: ['./events-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsFilterComponent implements OnInit, OnDestroy {
  @Input()
  public set filters(filters: EventsFilters) {
    this._filters = filters;
    if (this.filterForm) {
      this.filterForm.patchValue(filters, { onlySelf: true, emitEvent: false });
      this.cdRef.markForCheck();
    }
  }

  @Output()
  public filtersChanged: EventEmitter<EventsFilters> = new EventEmitter<EventsFilters>();

  public filterForm!: FormGroup;
  public countriesList: Country[] = findCountries();
  public regionsList: Entity[] = getRegionList();

  /**
   * List of current filters. Set from @Input() to set the initial values of the form.
   */
  private _filters: EventsFilters = {};

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.filterForm = new FormGroup({
      where: new FormControl(this._filters.where),
      workshops: new FormControl(this._filters.workshops),
      freeWorkshops: new FormControl(this._filters.freeWorkshops),
    });

    this.filterForm.statusChanges.pipe(takeUntil(this.ngOnDestroy$)).subscribe(() => {
      this.filtersChanged.emit(this.filterForm.getRawValue() as EventsFilters);
    });
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next(true);
  }
}
