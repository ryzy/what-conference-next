import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { EventTag } from '../model/event-tag';
import { TagsActions, TagsActionType } from './tags-actions';

export const adapter: EntityAdapter<EventTag> = createEntityAdapter<EventTag>();

export interface TagsState extends EntityState<EventTag> {
  loaded: boolean;
}
export const tagsInitialState: TagsState = {
  ids: [],
  entities: {},
  loaded: false,
};

export function tagsReducer(state: TagsState = tagsInitialState, action: TagsActions): TagsState {
  switch (action.type) {
    case TagsActionType.FETCH_TAGS:
      return adapter.removeAll(<TagsState>{
        ...state,
        loaded: false,
      });

    case TagsActionType.SET_TAGS:
      return adapter.addAll(action.payload, <TagsState>{
        ...state,
        loaded: true,
      });

    default:
      return state;
  }
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
