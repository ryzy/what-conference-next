import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { EventTopic } from '../model/event-topic';
import { TopicsActions, TopicsActionType } from './topics-actions';

export const adapter: EntityAdapter<EventTopic> = createEntityAdapter<EventTopic>();

export interface TopicsState extends EntityState<EventTopic> {
  loaded: boolean;
}
export const topicsInitialState: TopicsState = adapter.getInitialState({
  loaded: false,
});

export function topicsReducer(state: TopicsState = topicsInitialState, action: TopicsActions): TopicsState {
  switch (action.type) {
    case TopicsActionType.LOAD_TOPICS:
      return adapter.removeAll(<TopicsState>{
        ...state,
        loaded: false,
      });

    case TopicsActionType.SET_TOPICS:
      return adapter.addAll(action.payload, <TopicsState>{
        ...state,
        loaded: true,
      });

    default:
      return state;
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
