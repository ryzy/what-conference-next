import { createSelector, MemoizedSelector } from '@ngrx/store';

import { User, UserData } from '../../model/user';
import { appInitialState, AppState, defaultUserData } from './app-reducer';
import { AppRootState } from '../index';
import { selectTagsState } from '../../../event-base/store/index';
import { TagsState } from '../../../event-base/store/tags-reducer';

export const getAppState: (state: AppRootState) => AppState = (state: AppRootState) => state.app || appInitialState;

/**
 * Get current user
 */
export const selectUser: MemoizedSelector<AppRootState, User | undefined> = createSelector(
  getAppState,
  (state: AppState) => state.user,
);
export const selectUserData: MemoizedSelector<AppRootState, UserData> = createSelector(
  getAppState,
  (state: AppState) => state.userData || defaultUserData,
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
  selectTagsState as any,
  (app: AppState, tagsState: TagsState) => (app.dbReady && tagsState.loaded) || false,
);
