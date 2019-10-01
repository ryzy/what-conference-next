import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ConferenceEventRef } from '../model/conference-event';
import { EventsListActions, EventsListActionType } from './events-list-actions';

export const adapter: EntityAdapter<ConferenceEventRef> = createEntityAdapter<ConferenceEventRef>();

export interface EventsListState extends EntityState<ConferenceEventRef> {
  loaded: boolean;
}
export const eventsListInitialState: EventsListState = {
  ids: [],
  entities: {},
  loaded: false,
};

export function eventsListReducer(
  state: EventsListState = eventsListInitialState,
  action: EventsListActions,
): EventsListState {
  switch (action.type) {
    case EventsListActionType.FETCH_EVENTS:
      return adapter.removeAll(<EventsListState>{
        ...state,
        loaded: false,
      });

    case EventsListActionType.SET_EVENTS:
      return adapter.addAll(action.events, <EventsListState>{
        ...state,
        loaded: true,
      });

    default:
      return state;
  }
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
