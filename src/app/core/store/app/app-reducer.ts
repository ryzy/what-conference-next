import { User, UserData } from '../../model/user';
import { AppActions, AppActionType } from './app-actions';

/**
 * State for `app` part of the store
 */
export interface AppState {
  dbReady?: boolean;
  user?: User;
  userData?: UserData;
}

export const defaultUserData: UserData = {
  roles: {
    admin: false,
    editor: false,
  },
};
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

    case AppActionType.SET_USER_DATA:
      return {
        ...state,
        userData: action.userData,
      };

    default:
      return state;
  }
}
