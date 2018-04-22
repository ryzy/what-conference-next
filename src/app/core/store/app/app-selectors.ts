import { createSelector, MemoizedSelector } from '@ngrx/store';

import { User } from '../../model/user';
import { AppState } from './app-reducer';
import { AppRootState } from '../index';

export const getAppState: (state: AppRootState) => AppState = (state: AppRootState) => state.app;

/**
 * Get current user
 */
export const getUser: MemoizedSelector<AppRootState, User | undefined> = createSelector(
  getAppState,
  (state: AppState) => state.user,
);
