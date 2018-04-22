import * as fromRouter from '@ngrx/router-store';
import { RouterReducerState } from '@ngrx/router-store/src/router_store_module';
import { Action, ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../../environments/environment';
import { appReducer, AppState } from './app/app-reducer';
import { AppRouterState } from './router/router';

export interface AppRootState {
  app: AppState;
  router: RouterReducerState<AppRouterState>;
}

export const reducers: ActionReducerMap<AppRootState> = {
  app: appReducer as ActionReducer<AppState>,
  router: fromRouter.routerReducer as ActionReducer<RouterReducerState<AppRouterState>>,
};

// console.log all actions
/* istanbul ignore next */
export function logger(reducer: ActionReducer<AppRootState>): ActionReducer<AppRootState> {
  return function(state: AppRootState, action: Action): AppRootState {
    console.log('%cACTION ' + action.type, 'color: blue; font-weight: bold', { action, stateBefore: state });
    return reducer(state, action);
  } as ActionReducer<AppRootState>;
}

/* istanbul ignore next */
export const metaReducers: MetaReducer<AppRootState>[] = environment.production
  ? []
  : [
      storeFreeze,
      // logger,
    ];
