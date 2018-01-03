import * as fromRouter from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../../environments/environment';
import { AppRouterState } from './router';

export interface AppState {
  router: fromRouter.RouterReducerState<AppRouterState>;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
};

/* istanbul ignore next */
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
