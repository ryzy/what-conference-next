import { Action } from '@ngrx/store';

import { EventTag } from '../model/event-tag';

export enum TagsActionType {
  LOAD_TAGS = '[App] Load tags list',
  SET_TAGS = '[App] Tags loaded',
}

export class LoadTagsAction implements Action {
  public readonly type: TagsActionType.LOAD_TAGS = TagsActionType.LOAD_TAGS;
}

export class SetTagsAction implements Action {
  public readonly type: TagsActionType.SET_TAGS = TagsActionType.SET_TAGS;

  public constructor(public payload: EventTag[]) {}
}

export type TagsActions = LoadTagsAction | SetTagsAction;
