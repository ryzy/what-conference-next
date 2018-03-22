import { Action } from '@ngrx/store';

import { EventTopic } from '../model/event-topic';

export enum TopicsActionType {
  LOAD_TOPICS = '[App] Load topics list',
  SET_TOPICS = '[App] Topics list set',
}

export class LoadTopicsAction implements Action {
  public readonly type: TopicsActionType.LOAD_TOPICS = TopicsActionType.LOAD_TOPICS;
}

export class SetTopicsAction implements Action {
  public readonly type: TopicsActionType.SET_TOPICS = TopicsActionType.SET_TOPICS;

  public constructor(public payload: EventTopic[]) {}
}

export type TopicsActions = LoadTopicsAction | SetTopicsAction;
