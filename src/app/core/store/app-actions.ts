import { Action } from '@ngrx/store';
import { User } from '../model/user';

export enum AppActionType {
  SET_USER = '[App] Set user', // login / logout
}

/**
 * Dispatched when user logged in or out.
 */
export class SetUserAction implements Action {
  public readonly type: AppActionType.SET_USER = AppActionType.SET_USER;

  public constructor(public user?: User) {}
}

export type AppActions = SetUserAction;
