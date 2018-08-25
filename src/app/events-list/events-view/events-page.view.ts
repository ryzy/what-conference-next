import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { take, takeUntil } from 'rxjs/operators';

import { AppSortInfo } from '../../core/model/entity';
import { AppRouterState } from '../../core/store/router/router';
import {
  defaultSortInfo,
  getEventsSortInfoFromRouter,
  getEventsFiltersFromRouter,
  getTagLink,
} from '../../core/url-utils';
import { ConferenceEventRef } from '../../event-base/model/conference-event';
import { EventTag } from '../../event-base/model/event-tag';
import { EventsFilters } from '../../event-base/model/events-filters';
import { EventsService } from '../../event-base/services/events.service';

@Component({
  selector: 'app-events-view',
  templateUrl: './events-page.view.html',
  styleUrls: ['./events-page.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageView implements OnInit, OnDestroy {
  /**
   * Columns to display in the table
   */
  public displayColumns: string[] = ['name', 'date', 'price', 'tags'];

  public eventsDataSource: MatTableDataSource<ConferenceEventRef>;

  /**
   * Current filters state (made from router state)
   */
  public filters: EventsFilters = {};
  public tagsList: EventTag[] = [];
  public sortInfo: AppSortInfo = defaultSortInfo;

  public getTagLink: Function = getTagLink;

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter<boolean>();

  public constructor(private service: EventsService, private cdRef: ChangeDetectorRef) {
    this.eventsDataSource = new MatTableDataSource<ConferenceEventRef>([]);
  }

  public ngOnInit(): void {
    // Fired once when cmp is instantiated and then when router changes.
    // Keep the filters and sort info up-to-date, based on router state.
    // Also, re-fetch events, according to the current filters in the router.
    this.service
      .getRouterState()
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((routerState: AppRouterState) => {
        // console.log('EventsPageView#ngOnInit routerState', routerState);
        this.service.dispatchFetchEvents();
        this.filters = getEventsFiltersFromRouter(routerState);
        this.sortInfo = getEventsSortInfoFromRouter(routerState) || defaultSortInfo;
        this.cdRef.markForCheck();
      });

    // Pull events from the Store and push them into listing table's DataSource
    // Any change in filters is done via dispatching action to the Store,
    // then updating the route, then re-fetching the events into the Store.
    // Thus we'll always have emission here when new events has arrived.
    this.service
      .getEvents()
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((events: ConferenceEventRef[]) => {
        // console.log('EventsPageView#ngOnInit', { events, sortInfo: this.sortInfo, filters: this.filters });
        this.eventsDataSource.data = events;
        this.cdRef.markForCheck();
      });

    this.tagsList = this.service.getEventTagsSnapshot();
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next(true);
  }

  /**
   * Emit to the store info about change in sorting
   * after which url will be updated and events re-fetched with new params
   */
  public onSortChange(sort: AppSortInfo): void {
    this.service.dispatchNewEventsSorting(sort);
  }

  public onFiltersChange(filters: EventsFilters): void {
    this.service.dispatchNewEventsFilters(filters);
  }

  public tableTrackByFn(ev: ConferenceEventRef): string {
    return ev && ev.id;
  }
}
