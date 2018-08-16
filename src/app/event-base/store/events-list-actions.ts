import { Action } from '@ngrx/store';
import { ConferenceEventRef } from '../model/conference-event';
import { AppSortInfo } from '../../core/model/entity';
import { EventsFilters } from '../model/events-filters';

export enum EventsListActionType {
  FETCH_EVENTS = '[App] Fetch events...',
  SET_EVENTS = '[App] Events loaded',
  SET_EVENTS_FILTERS = '[App] Events filters set...',
  SET_EVENTS_SORTING = '[App] Events sorting set...',
}

export class FetchEventsAction implements Action {
  public readonly type: EventsListActionType.FETCH_EVENTS = EventsListActionType.FETCH_EVENTS;
}

export class SetEventsAction implements Action {
  public readonly type: EventsListActionType.SET_EVENTS = EventsListActionType.SET_EVENTS;

  public constructor(public events: ConferenceEventRef[]) {}
}

export class SetEventsFiltersAction implements Action {
  public readonly type: EventsListActionType.SET_EVENTS_FILTERS = EventsListActionType.SET_EVENTS_FILTERS;

  public constructor(public filters: EventsFilters) {}
}

export class SetEventsSortingAction implements Action {
  public readonly type: EventsListActionType.SET_EVENTS_SORTING = EventsListActionType.SET_EVENTS_SORTING;

  public constructor(public sort: AppSortInfo) {}
}

export type EventsListActions = FetchEventsAction | SetEventsAction | SetEventsFiltersAction | SetEventsSortingAction;
