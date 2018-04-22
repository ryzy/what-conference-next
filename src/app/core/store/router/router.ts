import { Params } from '@angular/router';
import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';

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
  params: Params;

  /**
   * URL ?query=params
   */
  queryParams: Params;
}

export const getRouterState: MemoizedSelector<object, RouterReducerState<AppRouterState>> = createFeatureSelector(
  'router',
);
