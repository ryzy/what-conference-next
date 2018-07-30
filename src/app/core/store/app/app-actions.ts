import { Action } from '@ngrx/store';

import { User } from '../../model/user';

export enum AppActionType {
  DB_READY = '[App] Database ready',
  SET_USER = '[App] Set user',
}

/**
 * Fired when MongoDB Stitch is connected and we can start doing db queries
 */
export class DbReadyAction implements Action {
  public readonly type: AppActionType.DB_READY = AppActionType.DB_READY;
}

/**
 * Fired when user has logged in (or out)
 */
export class SetUserAction implements Action {
  public readonly type: AppActionType.SET_USER = AppActionType.SET_USER;

  public constructor(public user?: User) {}
}

export type AppActions = SetUserAction | DbReadyAction;
