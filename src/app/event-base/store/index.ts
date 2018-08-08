import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { EventTag } from '../model/event-tag';

import { TagsActions } from './tags-actions';
import * as fromTags from './tags-reducer';

export interface EventsState {
  tags: fromTags.TagsState;
}

export const EventsFeatureStoreName = 'events';

export interface EventsRootState {
  [EventsFeatureStoreName]: EventsState;
}

export const eventsInitialState: EventsState = {
  tags: fromTags.tagsInitialState,
};

export const eventsReducers: ActionReducerMap<EventsState, TagsActions> = {
  tags: fromTags.tagsReducer as ActionReducer<fromTags.TagsState, TagsActions>,
};

export const getEventsState: MemoizedSelector<object, EventsState> = createFeatureSelector(EventsFeatureStoreName);

export const selectTagsState: MemoizedSelector<EventsRootState, fromTags.TagsState> = createSelector(
  getEventsState,
  /* istanbul ignore next */
  (state = eventsInitialState) => state.tags,
);
export const selectAllTags: MemoizedSelector<EventsRootState, EventTag[]> = createSelector(
  selectTagsState,
  fromTags.selectAll,
);
export const selectTagsCount: MemoizedSelector<EventsRootState, number> = createSelector(
  selectTagsState,
  fromTags.selectTotal,
);
export const selectTagsIsLoaded: MemoizedSelector<EventsRootState, boolean> = createSelector(
  selectTagsState,
  (tagsState) => tagsState.loaded,
);
