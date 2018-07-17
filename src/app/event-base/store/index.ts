import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { EventTopic } from '../model/event-topic';

import { TopicsActions } from './topics-actions';
import * as fromTopics from './topics-reducer';

export interface EventsState {
  topics: fromTopics.TopicsState;
}

export const EventsFeatureStoreName = 'events';

export interface EventsRootState {
  [EventsFeatureStoreName]: EventsState;
}

export const eventsInitialState: EventsState = {
  topics: fromTopics.topicsInitialState,
};

export const eventsReducers: ActionReducerMap<EventsState, TopicsActions> = {
  topics: fromTopics.topicsReducer as ActionReducer<fromTopics.TopicsState, TopicsActions>,
};

export const getEventsState: MemoizedSelector<object, EventsState> = createFeatureSelector(EventsFeatureStoreName);

export const selectTopicsState: MemoizedSelector<EventsRootState, fromTopics.TopicsState> = createSelector(
  getEventsState,
  /* istanbul ignore next */
  (state = eventsInitialState) => state.topics,
);
export const selectAllTopics: MemoizedSelector<EventsRootState, EventTopic[]> = createSelector(
  selectTopicsState,
  fromTopics.selectAll,
);
export const selectTopicsTotal: MemoizedSelector<EventsRootState, number> = createSelector(
  selectTopicsState,
  fromTopics.selectTotal,
);
export const selectTopicsLoadedFlag: MemoizedSelector<EventsRootState, boolean> = createSelector(
  selectTopicsState,
  (topicsState) => topicsState.loaded,
);
