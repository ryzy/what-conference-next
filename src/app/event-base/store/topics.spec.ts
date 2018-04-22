import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { mockTopics } from '../../../testing/fixtures/topics';
import { EventTopic } from '../model/event-topic';

import {
  EventsFeatureStoreName,
  eventsInitialState,
  eventsReducers,
  EventsRootState,
  selectAllTopics,
  selectTopicsLoadedFlag,
  selectTopicsState,
  selectTopicsTotal,
} from './index';
import { TopicsActions, TopicsActionType, LoadTopicsAction, SetTopicsAction } from './topics-actions';
import { topicsInitialState, topicsReducer, TopicsState } from './topics-reducer';

describe('Topics State', () => {
  let store: Store<EventsRootState>;
  let state: TopicsState;

  describe('topicsReducer:', () => {
    it('should return state', () => {
      expect(topicsReducer(topicsInitialState, {} as TopicsActions)).toBe(topicsInitialState);
    });

    it(`should generate state for *${TopicsActionType.LOAD_TOPICS}*`, () => {
      state = topicsReducer(topicsInitialState, new LoadTopicsAction());
      expect(state.loaded).toBe(false);
      expect(state.ids).toEqual([]);
      expect(state.entities).toEqual({});

      state = topicsReducer(state, new SetTopicsAction(mockTopics));
      expect(state.loaded).toBe(true);
      expect(state.ids.length).toBeGreaterThan(0);

      state = topicsReducer(state, new LoadTopicsAction());
      expect(state.loaded).toBe(false);
      expect(state.ids).toEqual([]);
      expect(state.entities).toEqual({});
    });

    it(`should generate state for *${TopicsActionType.SET_TOPICS}*`, () => {
      state = topicsReducer(topicsInitialState, new SetTopicsAction(mockTopics));
      expect(state.loaded).toBe(true);
      expect(state.ids.length).toBeGreaterThan(0);
    });
  });

  describe('selectors:', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          StoreModule.forFeature(EventsFeatureStoreName, eventsReducers, { initialState: eventsInitialState }),
        ],
      });

      store = TestBed.get(Store);
    });

    it('#selectTopicsState', () => {
      let res: TopicsState | undefined;
      store.select(selectTopicsState).subscribe((v) => (res = v));
      expect(res).toEqual(topicsInitialState);
    });

    it('#selectAllTopics, #selectTopicsTotal', () => {
      let res: EventTopic[] | undefined;
      let total: number | undefined;
      store.select(selectAllTopics).subscribe((v) => (res = v));
      store.select(selectTopicsTotal).subscribe((v) => (total = v));
      expect(res).toEqual([]);
      expect(total).toBe(0);

      store.dispatch(new SetTopicsAction(mockTopics));
      expect(res).toEqual(mockTopics);
      expect(total).toBe(mockTopics.length);
    });

    it('#selectTopicsLoadedFlag', () => {
      let res: boolean | undefined;
      store.select(selectTopicsLoadedFlag).subscribe((v) => (res = v));
      expect(res).toBe(false);

      store.dispatch(new SetTopicsAction(mockTopics));
      expect(res).toBe(true);
    });
  });
});
