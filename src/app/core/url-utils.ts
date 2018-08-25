import { Params } from '@angular/router';
import { ConferenceEvent, ConferenceEventRef } from '../event-base/model/conference-event';
import { EventTag } from '../event-base/model/event-tag';

import { EventsFilters } from '../event-base/model/events-filters';
import { AppSortInfo } from './model/entity';
import { AppRouterParams, AppRouterState } from './store/router/router';

export enum AppSectionUrls {
  Home = '/',
  EventsList = '/q',
  Event = '/ev',
}

/**
 * Make/clean params for router
 * We unset all empty variables, since we want nice/clean URLs
 */
export function makeParamsForRouter(params: Params, overrides: Params): Params {
  const newParams = { ...params, ...overrides };

  Object.keys(newParams).forEach((k) => {
    // make `true` shorter version of `1`
    if (true === newParams[k]) {
      newParams[k] = '1';
    }
    // remove all undefined's
    if (!newParams[k]) {
      delete newParams[k];
    }
  });

  return newParams;
}

export function makeEventsFiltersForRouter(filters: EventsFilters = {}): AppRouterParams {
  return <AppRouterParams>{
    where: filters.where || undefined,
    ws: filters.workshops ? '1' : undefined,
    fws: filters.freeWorkshops ? '1' : undefined,
    tags: filters.tags && filters.tags.length ? filters.tags.join(',') : undefined,
  };
}

export function getEventsFiltersFromRouter(state: AppRouterState): EventsFilters {
  return (
    state && {
      where: state.params.where || '',
      workshops: !!state.params.ws,
      freeWorkshops: !!state.params.fws,
      tags: state.params.tags ? state.params.tags.split(',') : undefined,
    }
  );
}

export const defaultSortInfo: AppSortInfo = {
  active: 'date',
  direction: 'asc',
};
export function makeSortInfoForRouter(sort?: AppSortInfo): Params {
  const params: Params = {
    s: undefined,
    sd: undefined,
  };

  if (sort && sort.active) {
    if (sort.active === defaultSortInfo.active && sort.direction === defaultSortInfo.direction) {
      // default sort info? return empty {}
      return params;
    } else if ('' === sort.direction) {
      // empty direction means: please remove this sorting, so we return immediately empty obj
      return params;
    } else if (sort.direction !== defaultSortInfo.direction) {
      // only generate direction for non-default direction
      params.sd = sort.direction;
    }

    params.s = sort.active;
  }

  return params;
}

/**
 * @see makeSortInfoForRouter
 */
export function getEventsSortInfoFromRouter(state: AppRouterState): AppSortInfo | undefined {
  return state && state.params.s
    ? <AppSortInfo>{
        active: state.params.s,
        direction: state.params.sd || defaultSortInfo.direction,
      }
    : undefined;
}

/**
 * Helper function to filter for events listing URLs
 */
export function filterEventsListingUrls(state: AppRouterState): boolean {
  return AppSectionUrls.Home === state.url || AppSectionUrls.EventsList === state.url;
}

/**
 * Get router link to an event
 */
export function getEventLink(
  ev: string | ConferenceEvent | ConferenceEventRef,
  baseUrl: AppSectionUrls = AppSectionUrls.Event,
): any[] {
  return [baseUrl, 'string' === typeof ev ? ev : ev.id];
}

/**
 * Get router link to tag(s)
 */
export function getTagLink(
  tag: string | string[] | EventTag | EventTag[],
  baseUrl: AppSectionUrls = AppSectionUrls.EventsList,
): any[] {
  let tags: string = '';
  if (Array.isArray(tag)) {
    tags = (tag as Array<string | EventTag>)
      .map((t: string | EventTag) => ('string' === typeof t ? t : t.id))
      .join(',');
  } else {
    tags = 'string' === typeof tag ? tag : tag.id;
  }

  return [baseUrl, { tags }];
}
