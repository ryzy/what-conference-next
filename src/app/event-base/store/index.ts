import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { ConferenceEventRef } from '../model/conference-event';
import { EventTag } from '../model/event-tag';

import { EventsListActions } from './events-list-actions';
import * as fromEventsList from './events-list-reducer';
import { TagsActions } from './tags-actions';
import * as fromTags from './tags-reducer';

export interface EventsState {
  list: fromEventsList.EventsListState;
  tags: fromTags.TagsState;
}

export const EventsFeatureStoreName = 'events';

/**
 * Root state of this feature module. Not really used here...
 * might be useful to someone else when testing/composing store
 */
export interface EventsRootState {
  [EventsFeatureStoreName]: EventsState;
}

export const eventsInitialState: EventsState = {
  list: fromEventsList.eventsListInitialState,
  tags: fromTags.tagsInitialState,
};

export const eventsReducers: ActionReducerMap<EventsState, TagsActions & EventsListActions> = {
  list: fromEventsList.eventsListReducer as ActionReducer<fromEventsList.EventsListState, EventsListActions>,
  tags: fromTags.tagsReducer as ActionReducer<fromTags.TagsState, TagsActions>,
};

//
// Main selector to get the feature store state
//
export const getEventsState: MemoizedSelector<object, EventsState> = createSelector(
  createFeatureSelector<EventsState>(EventsFeatureStoreName),
  (state: EventsState) => state || eventsInitialState,
);

//
// events selectors
//
export const selectEventsListState: MemoizedSelector<EventsRootState, fromEventsList.EventsListState> = createSelector(
  getEventsState,
  (state) => state.list,
);
export const selectAllEvents: MemoizedSelector<EventsRootState, ConferenceEventRef[]> = createSelector(
  selectEventsListState,
  fromEventsList.selectAll,
);
export const selectEventsCount: MemoizedSelector<EventsRootState, number> = createSelector(
  selectEventsListState,
  fromEventsList.selectTotal,
);
export const selectEventsIsLoaded: MemoizedSelector<EventsRootState, boolean> = createSelector(
  selectEventsListState,
  (eventsState) => eventsState.loaded,
);

//
// tags selectors
//
export const selectTagsState: MemoizedSelector<EventsRootState, fromTags.TagsState> = createSelector(
  getEventsState,
  (state) => state.tags,
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
export const selectAllTagsSorted: MemoizedSelector<EventsRootState, EventTag[]> = createSelector(
  selectAllTags,
  (tags: EventTag[]) => {
    const tree: EventTag[] = [];
    // filter for primary (w/o parent) tags
    // then inject sub-tags
    const sortFn = (t1: EventTag, t2: EventTag) => t1.name.localeCompare(t2.name);
    const primaryTags = tags.filter(t => !t.parent).sort(sortFn);
    primaryTags.forEach((tag: EventTag, idx: number) => {
      tree.push(tag);
      const sub = tags.filter(t => t.parent === tag.id).sort(sortFn);
      tree.push(...sub);
    });

    return tree;
  },
);
