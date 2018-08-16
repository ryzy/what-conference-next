import { Params } from '@angular/router';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';

/**
 * Possible URL params used in the app
 */
export interface AppRouterParams extends Params {
  eventId?: string;

  apiKey?: string; // on /user pages

  // events filters
  where?: string;
  ws?: string; // workshops
  fws?: string; // free workshops

  // sort info
  s?: string; // sort by info
  sd?: 'desc'; // sort direction. only `desc` since `asc` is by default, so it shouldn't appear in url
}

/**
 * App custom router state
 */
export interface AppRouterState {
  /**
   * Full URL
   */
  url: string;

  /**
   * Any `data` added to Route config
   */
  data: { [name: string]: any };

  /**
   * Current #fragment (or empty string)
   */
  fragment: string;

  /**
   * URL :params
   */
  params: AppRouterParams;

  /**
   * URL ?query=params
   */
  queryParams: Params;
}

export const defaultAppRouterState: AppRouterState = {
  url: '/',
  data: {},
  fragment: '',
  params: {},
  queryParams: {},
};

export const getAppRouterState: MemoizedSelector<object, AppRouterState> = createSelector(
  createFeatureSelector<RouterReducerState<AppRouterState>>('router'),
  (state: RouterReducerState<AppRouterState>) => (state && state.state) || defaultAppRouterState,
);
