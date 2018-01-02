import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export enum RouterActionType {
  GO = '[Router] Go',
  BACK = '[Router] Back',
  FORWARD = '[Router] Forward',
}

export class GoAction implements Action {
  public readonly type: RouterActionType.GO = RouterActionType.GO;

  public constructor(public path: any[], public extras: NavigationExtras = {}) {}
}

export class BackAction implements Action {
  public readonly type: RouterActionType.BACK = RouterActionType.BACK;
}

export class ForwardAction implements Action {
  public readonly type: RouterActionType.FORWARD = RouterActionType.FORWARD;
}

export type RouterActions = GoAction|BackAction|ForwardAction;
