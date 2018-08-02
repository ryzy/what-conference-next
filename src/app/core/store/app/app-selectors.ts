import { createSelector, MemoizedSelector } from '@ngrx/store';

import { User } from '../../model/user';
import { appInitialState, AppState } from './app-reducer';
import { AppRootState } from '../index';
import { selectTopicsState } from '../../../event-base/store/index';
import { TopicsState } from '../../../event-base/store/topics-reducer';

export const getAppState: (state: AppRootState) => AppState = (state: AppRootState) => state.app || appInitialState;

/**
 * Get current user
 */
export const selectUser: MemoizedSelector<AppRootState, User | undefined> = createSelector(
  getAppState,
  (state: AppState) => state.user,
);

/**
 * Selects from store if Stitch db is ready
 */
export const selectIsDbReady: MemoizedSelector<AppRootState, boolean> = createSelector(
  getAppState,
  (state: AppState) => state.dbReady || false,
);

/**
 * Selects from store if Stitch db is ready
 */
export const selectInitDataFetched: MemoizedSelector<AppRootState, boolean> = createSelector(
  getAppState,
  selectTopicsState as any,
  (app: AppState, topics: TopicsState) => (app.dbReady && topics.loaded) || false,
);
