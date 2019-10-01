import { Action } from '@ngrx/store';

import { EventTag } from '../model/event-tag';

export enum TagsActionType {
  FETCH_TAGS = '[App] Fetch tags list...',
  SET_TAGS = '[App] Tags loaded',
}

/**
 * Dispatched when tags lists needs to be loaded...
 */
export class FetchTagsAction implements Action {
  public readonly type: TagsActionType.FETCH_TAGS = TagsActionType.FETCH_TAGS;
}

export class SetTagsAction implements Action {
  public readonly type: TagsActionType.SET_TAGS = TagsActionType.SET_TAGS;

  public constructor(public payload: EventTag[]) {}
}

export type TagsActions = FetchTagsAction | SetTagsAction;
