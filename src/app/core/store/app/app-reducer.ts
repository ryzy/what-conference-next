import { User } from '../../model/user';
import { AppActions, AppActionType } from './app-actions';

/**
 * State for App
 */
export interface AppState {
  user?: User;
}

export const appInitialState: AppState = {
};

export function appReducer(state: AppState = appInitialState, action: AppActions): AppState {
  switch (action.type) {
    case AppActionType.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
}
