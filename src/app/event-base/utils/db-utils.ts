import { startCase } from 'lodash-es';

import { AppRouterState } from '../../core/store/router/router';
import { defaultSortInfo, getEventsFiltersFromRouter, getEventsSortInfoFromRouter } from '../../core/url-utils';
import { ConferenceEvent, EventStatus } from '../model/conference-event';

/**
 * Build MongoDB query from provided state
 *
 * @see DatabaseService.getEvents
 * @see EventsEffects.fetchAndSetEvents$
 */
export function getEventsQueryFromRouterState(state: AppRouterState): { [k in keyof ConferenceEvent | '$or']?: any } {
  // default/fixed stuff for getEvents() query
  const q: { [k in keyof ConferenceEvent | '$or']?: any } = {
    status: EventStatus.Published,
    date: { $gte: new Date() }, // only newer than today...
  };

  const filters = getEventsFiltersFromRouter(state);

  if (filters.where) {
    const [location, subRegion] = filters.where.split(',');
    if (2 === location.length) {
      q.countryCode = location;
    } else {
      q.region = startCase(location);
    }

    if (subRegion) {
      q.subRegion = startCase(subRegion);
    }
  }

  if (filters.workshops) {
    q.workshops = true;
  }
  if (filters.freeWorkshops) {
    q.freeWorkshops = true;
  }

  if (filters.tags) {
    q.tags = { $in: filters.tags };
  }

  return q;
}

export function getEventsQuerySortFromRouterState(state: AppRouterState): object {
  const sortInfo = getEventsSortInfoFromRouter(state) || defaultSortInfo;
  return { [sortInfo.active]: sortInfo.direction === 'desc' ? -1 : 1 };
}
