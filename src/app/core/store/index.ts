import { Action, ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { appReducer, AppState } from './app/app-reducer';
import { AppRouterState } from './router/router';

/**
 * Store shape, for the root/core module
 * Feature stores are provided separately
 */
export interface AppRootState {
  app: AppState;
  router: fromRouter.RouterReducerState<AppRouterState>;
}

export const reducers: ActionReducerMap<AppRootState> = {
  app: appReducer as ActionReducer<AppState>,
  router: fromRouter.routerReducer as ActionReducer<fromRouter.RouterReducerState<AppRouterState>>,
};

/**
 * Log all Store actions to console.
 * To use, uncomment it in `metaReducers` below
 */
/* istanbul ignore next */
export function logger(reducer: ActionReducer<AppRootState>): ActionReducer<AppRootState> {
  return function(state: AppRootState, action: Action): AppRootState {
    console.log('%cACTION ' + action.type, 'color: blue; font-weight: bold', { action, stateBefore: state });
    return reducer(state, action);
  } as ActionReducer<AppRootState>;
}

/* istanbul ignore next */
export const metaReducers: MetaReducer<AppRootState>[] = [
  // logger
];
