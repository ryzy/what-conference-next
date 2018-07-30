import { User } from '../../model/user';
import { AppActions, AppActionType } from './app-actions';

/**
 * State for `app` part of the store
 */
export interface AppState {
  dbReady?: boolean;
  user?: User;
}

export const appInitialState: AppState = {};

export function appReducer(state: AppState = appInitialState, action: AppActions): AppState {
  switch (action.type) {
    case AppActionType.DB_READY:
      return {
        ...state,
        dbReady: true,
      };

    case AppActionType.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
}
