import * as fromRouter from '@ngrx/router-store';
import { RouterReducerState } from '@ngrx/router-store';
import { Action, ActionReducer, ActionReducerMap, MetaReducer, RootStoreConfig } from '@ngrx/store';

import { appReducer, AppState } from './app/app-reducer';
import { AppRouterState } from './router/router';

/**
 * Store shape, for the root/core module
 * Feature stores are provided separately
 */
export interface AppRootState {
  app: AppState;
  router: RouterReducerState<AppRouterState>;
}

export const reducers: ActionReducerMap<AppRootState> = {
  app: appReducer as ActionReducer<AppState>,
  router: fromRouter.routerReducer as ActionReducer<RouterReducerState<AppRouterState>>,
};

export const rootStoreConfig: RootStoreConfig<AppRootState> = {
  metaReducers: [
    // logger,
  ],
  runtimeChecks: {
    // Cannot set these to true due to un-serializable ObjectID's from MongoDB...
    // strictActionImmutability: false,
    // strictStateImmutability: false,
  },
};

/**
 * Log all Store actions to console.
 * To use, uncomment it in `metaReducers` below
 */
/* istanbul ignore next */
export function logger(reducer: ActionReducer<AppRootState>): ActionReducer<AppRootState> {
  return function(state: AppRootState, action: Action): AppRootState {
    console.log('%cACTION ' + action.type, 'color: bisque; font-weight: bold', { action, stateBefore: state });
    return reducer(state, action);
  } as ActionReducer<AppRootState>;
}
