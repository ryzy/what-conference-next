import { AppRouterState } from '../../core/store/router/router';
import { defaultSortInfo, getEventsSortInfoFromRouter } from '../../core/url-utils';

export function getEventsListingQueryFromRouterState(state: AppRouterState): object {
  return {};
}

export function getEventsListingQuerySortFromRouterState(state: AppRouterState): object {
  const sortInfo = getEventsSortInfoFromRouter(state) || defaultSortInfo;
  return { [sortInfo.active]: sortInfo.direction === 'desc' ? -1 : 1 };
}
